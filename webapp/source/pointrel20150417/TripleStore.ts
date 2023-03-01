// A semantic (sub)web implementation a triple store
import PointrelClient = require("./PointrelClient");
import topic = require("./topic");
import generateRandomUuid = require("./generateRandomUuid");

"use strict";

function stringUpTo(aString: string, separator: string) {
    if (separator !== "") {
        const pieces = aString.split(separator);
        if (pieces.length > 1) {
            return pieces[0];
        } else {
            return aString;
        }
    } else {
        return aString;
    }
}

function replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function isUUIDWithDefinedPrefix(text: string, prefixes) {
    if (!text) return false;
    if (typeof text !== "string") return false;
    const parts = text.split("_");
    if (parts.length !== 2) {
        return false;
    } 
    const [possiblePrefix, possibleUUID] = parts;
    if (possibleUUID.length !== 36) return false;
    if (!prefixes[possiblePrefix]) return false;
    return true;
}

function mightBeUUID(text: string) {
    if (!text) return false;
    if (typeof text !== "string") return false;
    const parts = text.split("_");
    if (parts.length !== 2) {
        return false;
    } 
    const [possiblePrefix, possibleUUID] = parts;
    if (possibleUUID.length !== 36) return false;
    return true;
}

function repeatStringNumTimes(string, times) {
    var repeatedString = "";
    while (times > 0) {
      repeatedString += string;
      times--;
    }
    return repeatedString;
  }

function isObject(a) {
    return Object.prototype.toString.call(a) === '[object Object]';
}

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
        
        const triple = {
            a: a,
            b: b,
            c: c
        };
        
        const change = {
            action: "addTriple",
            triple: triple
        };
        
        const timestamp = this.pointrelClient.getCurrentUniqueTimestamp();
        const message = {
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

        const message = this.makeAddTripleMessage(a, b, c);

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
            const triple = message.change.triple;
            const aKey = JSON.stringify(triple.a);
            let aIndex = this.indexABC[aKey];
            if (!aIndex) {
                aIndex = {};
                this.indexABC[aKey] = aIndex;
            }
            const bKey = JSON.stringify(triple.b);
            let bIndex = aIndex[bKey];
            if (!bIndex) {
                bIndex = {};
                aIndex[bKey] = bIndex;
            }
            let versions = bIndex.versions;
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
        const aKey = JSON.stringify(a);
        const aIndex = this.indexABC[aKey];
        if (!aIndex) return null;
        if (b === undefined) return aIndex;
        const bKey = JSON.stringify(b);
        const bIndex = aIndex[bKey];
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
            
            const triple = message.change.triple;
            
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
        for (let i = this.tripleMessages.length - 1; i >= 0; i--) {
            const tripleMessage = this.tripleMessages[i];
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
        const bIndex = this.getIndexEntries(a, b);
        if (!bIndex) return undefined;
        // console.log("queryLatestC result", a, b, bIndex.latestC);
        return defensiveCopy(bIndex.latestC);
    }

    queryAllC(a, b) {
        if (a === undefined) {
            throw new Error("a should not be undefined; b: " + b);
        }
        if (b === undefined) {
            throw new Error("b should not be undefined; a: " + a);
        }    
        const bIndex = this.getIndexEntries(a, b);
        if (!bIndex) return [];
        return defensiveCopy(bIndex.versions);
    }
    
    // The b keys returned here are stringified objects (could be strings, or other) and should be parsed by called code if needed
    queryAllLatestBCForA(a) {
        if (a === undefined) {
            throw new Error("a should not be undefined");
        }
        const result = {};
        
        const aIndex = this.getIndexEntries(a);
        if (!aIndex) return result;
        
        for (let bKey in aIndex) {
            const bIndex = aIndex[bKey];
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
        const result = {};
       
        const latestBC = this.queryAllLatestBCForA(a);
        for (let bKey in latestBC) {
            let b = bKey;
            if (isKeyJSON) {
                b = JSON.parse(bKey);
            }
            const c = latestBC[bKey];
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
        // const setIdentifier = {"type": "set", "id":  generateRandomUuid(setClassName)};
        const setIdentifier = generateRandomUuid(setClassName);
        return setIdentifier;
    }

    newIdForItemClass(stringToStartWith: string): string {
        const newId = generateRandomUuid(stringToStartWith);
        return newId;
    }
    
    private newIdForSetItem(itemClassName: string): string {
        // return new Date().toISOString();
        return generateRandomUuid(itemClassName);
    }
    
    makeNewSetItem(setIdentifier: string, itemClassName: string, template = undefined, idProperty = "id"): string { 
        if (setIdentifier === undefined) {
            throw new Error("expected setIdentifier to be defined");
        }
        
        let newId;
        
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
            for (let key in template) {
                this.addTriple(newId, key, template[key]);
            }
        }
        
        // TODO: Should there be another layer of indirection with a UUID for the "item" different from idPropery?
        // this.tripleStore.addTriple(newId????, this.idProperty, newId);
        this.addTriple(setIdentifier, {setItem: newId}, newId);
        
        return newId;
    }

    makeCopyOfItemOrSetWithNewId(level: number, existingItemId: string, itemOrSetClassName: string, setClassNames, itemClassNames, oldAndNewIDs): string {
        if (existingItemId === undefined) throw new Error("expected existingItemId to be defined");
        const doCopy = true;
        const doReport = true;
        const baseIndent = repeatStringNumTimes("    ", level);
        const moreIndent = repeatStringNumTimes("    ", level+1);
        const evenMoreIndent = repeatStringNumTimes("    ", level+2);

        const newID = doCopy ? generateRandomUuid(itemOrSetClassName) : null;
        if (doReport) console.log(baseIndent + "COPYING [", itemOrSetClassName, "] with id [", existingItemId, "] to [", newID, "]");
        
        const latestBC = this.queryAllLatestBCForA(existingItemId);
        for (let bKey in latestBC) {
            const b = JSON.parse(bKey);
            const c = latestBC[bKey];
            const reportC = (typeof c === "string") ? replaceAll(c, "\n", " / ") : c;
            if (c !== undefined && c !== null && c !== "") { 
                if (doReport) console.log(moreIndent, b, '=', reportC);
                const isSet = isUUIDWithDefinedPrefix(c, setClassNames);
                const isItem = isUUIDWithDefinedPrefix(c, itemClassNames) && b !== "id";
                if (isSet || isItem) {
                    const classNameInC = stringUpTo(c, "_"); 
                    const copyOfC = this.makeCopyOfItemOrSetWithNewId(level+1, c, classNameInC, setClassNames, itemClassNames, oldAndNewIDs);
                    oldAndNewIDs[c] = copyOfC;
                    if (b && b.setItem && b.setItem === c) {
                        if (doCopy) this.addTriple(newID, {setItem: copyOfC}, copyOfC);
                        if (doReport) console.log(moreIndent + "Copied", isSet ? "set" : "item", copyOfC, 'as set element:', copyOfC, 'of set', newID);
                    } else {
                        // the ObservationSet and Observation class names save connections differently 
                        if (doCopy) this.addTriple(newID, b, copyOfC);
                        console.log(moreIndent + "Copied", isSet ? "set" : "item", copyOfC, 'as field value:', b, copyOfC, 'of item', newID);
                    }
                } else { 
                    const isNameOfTopLevelItem = (b.indexOf("_shortName") >= 0 || b.indexOf("_name") >= 0) && level === 0;
                    const isIDOfItem = b === "id";
                    if (isNameOfTopLevelItem) {
                        if (doCopy) this.addTriple(newID, b, "Copy of " + c);
                        if (doReport) console.log(evenMoreIndent + "Copied name to:", "Copy of " + c);
                    } else if (isIDOfItem) {
                        if (doCopy) this.addTriple(newID, b, newID);
                        if (doReport) console.log(evenMoreIndent + "Updated ID field to:", newID);
                    } else { 
                        if (doCopy) this.addTriple(newID, b, c);
                        if (doReport) console.log(evenMoreIndent + "Copied non-item data:", reportC);
                    }
                }
            } else {
                if (doReport) console.log("Not copying:", existingItemId, c);
            }
        }

        oldAndNewIDs[existingItemId] = newID;
        if (doReport && level === 0) console.log("Old and new ids:", oldAndNewIDs);
        return newID;
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
        const result = [];
 
        if (!setIdentifier) return result;
        
        const aIndex = this.getIndexEntries(setIdentifier);
        if (!aIndex) return result;
        
        for (let bKey in aIndex) {
            const b = JSON.parse(bKey);
            // Set items should have a "setItem" field in b key as a "standard"; possible collision with other usages though
            if (b.setItem) {
                const bIndex = aIndex[bKey];
                if (bIndex) {
                    const c = bIndex.latestC;
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

