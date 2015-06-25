// A semantic (sub)web implementation a triple store
import PointrelClient = require("./PointrelClient");
import topic = require("./topic");

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
        
        this.subscriptions.push(topic.subscribe("messageReceived", this.processMessage.bind(this)));
    }

    remove() {
        // console.log("TripleStore remove called");
        this.subscriptions.forEach(function (subscription) {
            subscription.remove();
        });
        this.subscriptions = [];
    }
    
    add(a, b, c, callback = undefined) {
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
        
        // TODO: Process locally first and track sent and bump and report conflicts
        this.pointrelClient.sendMessage(message, callback);
    }
    
    processMessage(message) {
        // console.log("TripleStore.processMessage", message);
        if (message.messageType !== "tripleStore") return;
        if (message._topicIdentifier !== this.topicIdentifier) return;
        
        if (message.change.action === "addTriple") {
            // TODO: Keep the list sorted by time
            this.tripleMessages.push(message);
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
            console.log("processMessage: Unsupported action", message);
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
}
   
export = TripleStore;

