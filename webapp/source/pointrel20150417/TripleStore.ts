// A semantic (sub)web implementation a triple store
import PointrelClient = require("./PointrelClient");
import topic = require("./topic");
import generateRandomUuid = require("./generateRandomUuid");

"use strict";

function makeTopicKey(object) {
    // TODO: Should really canonicalize the a,b,c values
    return object;
}

function defensiveCopy(value) {
    if (value === undefined) return value;
    if (value === null) return value;
    if (typeof value === "number") return value;
    if (typeof value === "string") return value;
    if (typeof value === "boolean") return value;
    // Value might be mutable, so return a copy of it
    return JSON.parse(JSON.stringify(value));
}

class TripleStore {
    pointrelClient: PointrelClient = null;
    topicIdentifier = null;
    tripleMessages = [];
    tripleMessagesBySHA256AndLength = {};
    indexABC = {};
    subscriptions = [];

    constructor(pointrelClient: PointrelClient, topicIdentifier) {
        this.pointrelClient = pointrelClient;
        this.topicIdentifier = topicIdentifier;
        
        this.subscriptions.push(topic.subscribe("messageReceived", this.messageReceivedFromPointrelClient.bind(this)));
    }

    remove() {
        // console.log("TripleStore remove called");
        this.subscriptions.forEach(function (subscription) {
            subscription.remove();
        });
        this.subscriptions = [];
    }
    
    makeAddTripleMessage(a, b, c) {
        if (a === undefined || b === undefined || c === undefined) {
            throw new Error("Triple should not have undefined fields");
        }
        
        var triple = {
            a: a,
            b: b,
            c: c
        };
        
        var change = {
            action: "addTriple",
            triple: triple
        };
        
        var timestamp = this.pointrelClient.getCurrentUniqueTimestamp();
        var message = {
            _topicIdentifier: this.topicIdentifier,
            _topicTimestamp: timestamp,
            change: change,
            messageType: "tripleStore",
            userIdentifier: this.pointrelClient.userIdentifier
        };
        
        return message;
    }
    
    addTriple(a, b, c, callback = undefined) {
        // console.log("TripleStore addTriple", a, b, c);

        var message = this.makeAddTripleMessage(a, b, c);

        this.pointrelClient.sendMessage(message, callback);
        
        // Process locally to have current value
        this.processTripleStoreMessage(message);
    }
    
    private processTripleStoreMessage(message) {
        // TODO: Keep the list sorted by time
        this.tripleMessages.push(message);
        
        this.addMessageToIndexes(message);
    }
    
    private addMessageToIndexes(message) {
        this.tripleMessagesBySHA256AndLength[message.__pointrel_sha256AndLength] = message;
        
        if (message.change.action === "addTriple") {
            var triple = message.change.triple;
            var aKey = JSON.stringify(triple.a);
            var aIndex = this.indexABC[aKey];
            if (!aIndex) {
                aIndex = {};
                this.indexABC[aKey] = aIndex;
            }
            var bKey = JSON.stringify(triple.b);
            var bIndex = aIndex[bKey];
            if (!bIndex) {
                bIndex = {};
                aIndex[bKey] = bIndex;
            }
            var versions = bIndex.versions;
            if (!versions) {
                versions = [];
                bIndex.versions = versions;
            }
            versions.push(message);
            if (!bIndex.latestCTimestamp || bIndex.latestCTimestamp <= message._topicTimestamp) {
                bIndex.latestCTimestamp = message._topicTimestamp;
                bIndex.latestC = triple.c;
            }
        }
    }
    
    private getIndexEntries(a, b = undefined) {
        if (a === undefined) throw ("a should not be undefined");
        var aKey = JSON.stringify(a);
        var aIndex = this.indexABC[aKey];
        if (!aIndex) return null;
        if (b === undefined) return aIndex;
        var bKey = JSON.stringify(b);
        var bIndex = aIndex[bKey];
        if (!bIndex) return null;
        return bIndex;
    }
    
    private messageReceivedFromPointrelClient(message) {
        // console.log("TripleStore.messageReceivedFromPointrelClient", message);
        if (message.messageType !== "tripleStore") return;
        if (message._topicIdentifier !== this.topicIdentifier) return;
        
        if (message.change.action === "addTriple") {                        
            // Ignore the message if it was previously received (probably because this client sent it)
            // TODO: track sent and bump and report conflicts
            if (this.tripleMessagesBySHA256AndLength[message.__pointrel_sha256AndLength]) {
                // MAYBE: Could check JSON of stored and received to confirm they are identical
                // console.log("compare previous/new", previouslyReceivedMessage, message);
                // console.log("TripleStore message previously received, so ignoring", message);
                return;
            }
            
            this.processTripleStoreMessage(message);
            
            var triple = message.change.triple;
            
            // console.log("TripleStore: About to publish changes...");
            
            topic.publish(makeTopicKey({type: "TripleStore.addTriple"}), triple, message);
            
            // TODO: Improve this dispatching so don't have to do JSON string conversion
            // Some other common events. Other variations would need to be listened for using the more general event above
            // TODO: Maybe want to distinguish when a later C value is put in that superceeds an old C value
            // console.log("publish", makeTopicKey({type: "TripleStore.addForAB", a: triple.a, b: triple.b}));
            topic.publish(makeTopicKey({type: "TripleStore.addForA", a: triple.a}), triple, message);
            topic.publish(makeTopicKey({type: "TripleStore.addForAB", a: triple.a, b: triple.b}), triple, message);
            topic.publish(makeTopicKey({type: "TripleStore.addForBC", b: triple.b, c: triple.c}), triple, message);
        } else {
            console.log("messageReceivedFromPointrelClient: Unsupported action", message);
        }
    }
    
    subscribe(a, b, c, callback) {
        // console.log("TripleStore.subscribe", a, b, c, callback);
        // TODO: Should these subscriptions be stored in this object or be caller responsibility?
        
        if (a === undefined && b === undefined && c === undefined) {
            return topic.subscribe(makeTopicKey({type: "TripleStore.addTriple"}), callback);
        }
        
        if (a !== undefined) {
            if (b !== undefined) {
                // console.log("subscribe", makeTopicKey({type: "TripleStore.addForAB", a: a, b: b}));
                return topic.subscribe(makeTopicKey({type: "TripleStore.addForAB", a: a, b: b}), callback);
            }
            return topic.subscribe(makeTopicKey({type: "TripleStore.addForA", a: a}), callback);
        }
        
        if (b !== undefined) {
            if (c !== undefined) {
                return topic.subscribe(makeTopicKey({type: "TripleStore.addForBC", b: b, c: c}), callback);
            }
        }
        
        // TODO: Need to subscribe to addTriple and do filter
        console.log("Unsupported subscription", a, b, c);
        throw new Error("TripleStore.subscribe: Unfinished -- subscription type not yet supported");
    }
    
    /*
    // TODO: Optimize with indexes
    // TODO: Ignoring actual timestamps, so only "latest" by receipt is considered, but that is not correct
    // TODO: need to use actual timestamp in sorted comparison to deal with collissions
    queryLatest(a, b, c) {
        // console.log("queryLatest", a, b, c);
        for (var i = this.tripleMessages.length - 1; i >= 0; i--) {
            var tripleMessage = this.tripleMessages[i];
            // console.log("queryLatest loop", i, tripleMessage);
            if ((a === undefined || tripleMessage.change.triple.a === a) &&
                (b === undefined || tripleMessage.change.triple.b === b) &&
                (c === undefined || tripleMessage.change.triple.c === c)) {
                // console.log("match", tripleMessage.change.triple);
                return tripleMessage.change.triple;
            }         
        }
        
        // TODO: Maybe should return empty triple instead?
        return null;
    }
    */
    
    queryLatestC(a, b) {
        // console.log("queryLatestC", a, b);
        if (a === undefined) {
            throw new Error("a should not be undefined; b: " + b);
        }
        if (b === undefined) {
            throw new Error("b should not be undefined; a: " + a);
        }    
        var bIndex = this.getIndexEntries(a, b);
        if (!bIndex) return undefined;
        // console.log("queryLatestC result", a, b, bIndex.latestC);
        return defensiveCopy(bIndex.latestC);
    }
    
    // The b keys returned here are stringified objects (could be strings, or other) and should be parsed by called code if needed
    queryAllLatestBCForA(a) {
        if (a === undefined) {
            throw new Error("a should not be undefined");
        }
        var result = {};
        
        var aIndex = this.getIndexEntries(a);
        if (!aIndex) return result;
        
        for (var bKey in aIndex) {
            var bIndex = aIndex[bKey];
            if (bIndex && bIndex.latestC !== undefined) {
                result[bKey] = defensiveCopy(bIndex.latestC);
            }
        }
        
        return result;
    }
    
    // Utility methods
    
    // Make a function that either returns the latest value with no arguments or sets it with one argument
    makeStorageFunction(a, b): Function {
        return (c: any = undefined) => {
            if (c === undefined) {
                return this.queryLatestC(a, b);
            } else {
                this.addTriple(a, b, c);
            }
        };
    }
    
    // Make a function that either returns the latest value for a model field with one argument (fieldName) or sets it with two arguments (fieldName, value)
    makeModelFunction(a): Function {
        if (a === undefined) {
            throw new Error("expected a to be defined");
        }
        return (b, c: any = undefined) => {
            if (c === undefined) {
                return this.queryLatestC(a, b);
            } else {
                this.addTriple(a, b, c);
            }
        };
    }
    
   makeObject(a, isKeyJSON = true): any {
        if (a === undefined) {
            throw new Error("expected a to be defined");
        }
        var result = {};
       
        var latestBC = this.queryAllLatestBCForA(a);
        for (var bKey in latestBC) {
            var b = bKey;
            if (isKeyJSON) {
                b = JSON.parse(bKey);
            }
            var c = latestBC[bKey];
            if (typeof b === "string") {
                if (c !== undefined) {
                    result[b] = defensiveCopy(c);
                }                
            } else {
                console.log("Expected b to be a string", a, b);
                // throw new Error("Expected b to be a string");
            }
        }

        return result;
    }
    
    // Sets
    // TODO: Id does not have to be restricted to a string, but doing it for now to catch errors

    newIdForSet(setClassName: string): string {
        // var setIdentifier = {"type": "set", "id":  generateRandomUuid(setClassName)};
        var setIdentifier = generateRandomUuid(setClassName);
        return setIdentifier;
    }
    
    private newIdForSetItem(itemClassName: string): string {
        // return new Date().toISOString();
        return generateRandomUuid(itemClassName);
    }
    
    makeNewSetItem(setIdentifier: string, itemClassName: string, template = undefined, idProperty = "id"): string { 
        if (setIdentifier === undefined) {
            throw new Error("expected setIdentifier to be defined");
        }
        
        var newId;
        
        if (template) {
            newId = template[idProperty];
            if (!newId) {
                newId = this.newIdForSetItem(itemClassName);
                template[idProperty] = newId;
            }
        } else {
            newId = this.newIdForSetItem(itemClassName);
        }
        
       if (template) {
            for (var key in template) {
                this.addTriple(newId, key, template[key]);
            }
        }
        
        // TODO: Should there be another layer of indirection with a UUID for the "item" different from idPropery?
        // this.tripleStore.addTriple(newId????, this.idProperty, newId);
        this.addTriple(setIdentifier, {setItem: newId}, newId);
        
        return newId;
    }
    
    makeCopyOfSetItemWithNewId(setIdentifier: string, existingItemId: string, itemClassName: string): string {
        if (setIdentifier === undefined) {
            throw new Error("expected setIdentifier to be defined");
        }
        if (existingItemId === undefined) {
            throw new Error("expected existingItemId to be defined");
        }
        
        var newId = this.newIdForSetItem(itemClassName);
        
        this.addTriple(setIdentifier, {setItem: newId}, newId);
        
        var latestBC = this.queryAllLatestBCForA(existingItemId);
        for (var bKey in latestBC) {
            // For every field, copy it...
            var b = JSON.parse(bKey);
            var c = latestBC[bKey];
            if (c !== undefined) {
                this.addTriple(newId, b, c);
            } else {
                console.log("Unexpected undefined value when copying list item", setIdentifier, existingItemId);
            }
        }

        return newId;
    }
    
    deleteSetItem(setIdentifier: string, itemIdentifier: string): void {
        if (setIdentifier === undefined) {
            throw new Error("expected setIdentifier to be defined");
        }
        if (itemIdentifier === undefined) {
            throw new Error("expected itemIdentifier to be defined");
        }
        // TODO: Should the C be undefined instead of null?
        this.addTriple(setIdentifier, {setItem: itemIdentifier}, null);
    }

    getListForSetIdentifier(setIdentifier): Array<string> {
        var result = [];
 
        if (!setIdentifier) return result;
        
        var aIndex = this.getIndexEntries(setIdentifier);
        if (!aIndex) return result;
        
        for (var bKey in aIndex) {
            var b = JSON.parse(bKey);
            // Set items should have a "setItem" field in b key as a "standard"; possible collision with other usages though
            if (b.setItem) {
                var bIndex = aIndex[bKey];
                if (bIndex) {
                    var c = bIndex.latestC;
                    if (c !== undefined && c !== null) {
                        result.push(defensiveCopy(c));
                    }
                }
            }
        }

        return result;
    }
}
   
export = TripleStore;

