// A semantic (sub)web implementation a triple store
import PointrelClient = require("./PointrelClient");
import topic = require("./topic");
import generateRandomUuid = require("./generateRandomUuid");

"use strict";

function makeTopicKey(object) {
    // TODO: Should really canonicalize the a,b,c values
    return object;
}

class TripleStore {
    pointrelClient: PointrelClient = null;
    topicIdentifier = null;
    tripleMessages = [];
    indexes = {};
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
    
    addTriple(a, b, c, callback = undefined) {
        console.log("TripleStore addTriple", a, b, c);
        
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
        
        this.pointrelClient.sendMessage(message, callback);
        
        // Process locally to have current value
        this.processTripleStoreMessage(message);
    }
    
    processTripleStoreMessage(message) {
        // TODO: Keep the list sorted by time
        this.tripleMessages.push(message);
    }
    
    messageReceivedFromPointrelClient(message) {
        // console.log("TripleStore.messageReceivedFromPointrelClient", message);
        if (message.messageType !== "tripleStore") return;
        if (message._topicIdentifier !== this.topicIdentifier) return;
        
        if (message.change.action === "addTriple") {                        
            // Ignore the message if it was previously received (probably because this client sent it)
            // TODO: Improve this so it is not a loop
            // TODO: track sent and bump and report conflicts
            for (var i = this.tripleMessages.length - 1; i >= 0; i--) {
                var previouslyReceivedMessage = this.tripleMessages[i];
                if (previouslyReceivedMessage.__pointrel_sha256AndLength === message.__pointrel_sha256AndLength) {
                    // console.log("compare previous/new", previouslyReceivedMessage, message);
                    console.log("TripleStore message previously received, so ignoring", message);
                    return;
                }
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
    
    queryLatestC(a, b) {
        var triple = this.queryLatest(a, b, undefined);
        if (!triple) return undefined;
        return triple.c;
    }
    
    // TODO: Optimize with indexes
    // TODO: Ignoring actual timestamps, so only "latest" by receipt is considered, but that is not correct
    // TODO: need to use actual timestamp in sorted comparison to deal with collissions
    queryAllLatestBCForA(a) {
        var result = {};
        
        for (var i = 0; i < this.tripleMessages.length; i++) {
            var tripleMessage = this.tripleMessages[i];
            // console.log("queryLatest loop", i, tripleMessage);
            if (tripleMessage.change.triple.a === a) {
                var b = tripleMessage.change.triple.b;
                var c = tripleMessage.change.triple.c;
                result[JSON.stringify(b)] = tripleMessage.change.triple;
            }         
        }
        
        return result;
    }
    
    // Utility methods
    
    // Make a function that either returns the latest value with no arguments or sets it with one argument
    makeStorageFunction(a, b): Function {
        return (value: any = undefined) => {
            if (value === undefined) {
                return this.queryLatestC(a, b);
            } else {
                this.addTriple(a, b, value);
            }
        };
    }
    
    // Make a function that either returns the latest value for a model field with one argument (fieldName) or sets it with two arguments (fieldName, value)
    makeModelFunction(a): Function {
        return (b, value: any = undefined) => {
            if (value === undefined) {
                return this.queryLatestC(a, b);
            } else {
                this.addTriple(a, b, value);
            }
        };
    }
    
   makeObject(a): any {
        var result = {};
        
        for (var i = 0; i < this.tripleMessages.length; i++) {
            var tripleMessage = this.tripleMessages[i];
            // console.log("queryLatest loop", i, tripleMessage);
            if (tripleMessage.change.triple.a === a) {
                var b = tripleMessage.change.triple.b;
                var c = tripleMessage.change.triple.c;
                result[b] = tripleMessage.change.triple.c;
            }         
        }
        
        return result;
    }
    
    // Sets
    // TODO: Id does not have to be restricted to a string, but doing it for now to catch errors

    newIdForSet(): string {
        // var setIdentifier = {"type": "set", "id":  generateRandomUuid()};
        var setIdentifier = "Set:" + generateRandomUuid();
        return setIdentifier;
    }
    
    private newIdForSetItem(): string {
        // return new Date().toISOString();
        return generateRandomUuid();
    }
    
    makeNewSetItem(setIdentifier: string, template = undefined, idProperty = "id"): string { 
        var newId;
        
        if (template) {
            newId = template[idProperty];
        } else {
            newId = this.newIdForSetItem();
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
    
    makeCopyOfSetItemWithNewId(setIdentifier: string, existingItemId: string): string {
        var newId = this.newIdForSetItem();
        
        this.addTriple(setIdentifier, {setItem: newId}, newId);
        
        // For every field, copy it...
        var triples = this.queryAllLatestBCForA(existingItemId);
        for (var key in triples) {
            var triple = triples[key];
            this.addTriple(newId, triple.b, triple.c);
        }

        return newId;
    }
    
    deleteSetItem(setIdentifier: string, itemIdentifier: string): void {
        // TODO: Should the C be undefined instead of null?
        this.addTriple(setIdentifier, {setItem: itemIdentifier}, null);
    }

    getListForSetIdentifier(setIdentifier): Array<string> {
        var result = [];
 
        if (!setIdentifier) return result;
        
        // Iterate over set and get every item from it
        var triples = this.queryAllLatestBCForA(setIdentifier);
        // console.log("TripleStore getListForField triples", triples);
        for (var key in triples) {
            var triple = triples[key];
            if (triple.b.setItem && (triple.c !== null && triple.c !== undefined)) {
                result.push(triple.c);
            }
        }
        
        return result;
    }
}
   
export = TripleStore;

