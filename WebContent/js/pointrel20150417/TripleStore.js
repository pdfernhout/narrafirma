// A semantic (sub)web implementation a triple store
define(["require", "exports", "./topic"], function (require, exports, topic) {
    "use strict";
    var TripleStore = function (pointrelClient, topicIdentifier) {
        this.pointrelClient = pointrelClient;
        this.topicIdentifier = topicIdentifier;
        this.tripleMessages = [];
        this.indexes = {};
        this.subscriptions = [];
        this.subscriptions.push(topic.subscribe("messageReceived", this.processMessage.bind(this)));
    };
    TripleStore.prototype.remove = function () {
        // console.log("TripleStore remove called");
        this.subscriptions.forEach(function (subscription) {
            subscription.remove();
        });
        this.subscriptions = [];
    };
    TripleStore.prototype.add = function (a, b, c, callback) {
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
            userIdentifier: this.pointrelClient.userIdentifier,
        };
        // TODO: Process locally first and track sent and bump and report conflicts
        this.pointrelClient.sendMessage(message, callback);
    };
    function makeTopicKey(object) {
        // Unfortunately, Dojo topic/Eventd/on will take a comma in a  string to mean split it into multiple subscriptions
        // TODO: Should really canonicalize the a,b,c values
        // TODO: encodeURIComponent does more than encode commas,
        // TODO: Can't just pass in array as Dojo's on.parse seems to parse recursively, splitting on commas
        // TODO: pdfernhout post on that to the Dojo interest list is here: http://mail.dojotoolkit.org/pipermail/dojo-interest/2015-May/084318.html
        return encodeURIComponent(JSON.stringify(object));
    }
    TripleStore.prototype.processMessage = function (message) {
        // console.log("TripleStore.processMessage", message);
        if (message.messageType !== "tripleStore")
            return;
        if (message._topicIdentifier !== this.topicIdentifier)
            return;
        if (message.change.action === "addTriple") {
            // TODO: Keep the list sorted by time
            this.tripleMessages.push(message);
            var triple = message.change.triple;
            // console.log("TripleStore: About to publish changes...");
            topic.publish(makeTopicKey({ type: "TripleStore.addTriple" }), triple, message);
            // TODO: Improve this dispatching so don't have to do JSON string conversion
            // Some other common events. Other variations would need to be listened for using the more general event above
            // TODO: Maybe want to distinguish when a later C value is put in that superceeds an old C value
            // console.log("publish", makeTopicKey({type: "TripleStore.addForAB", a: triple.a, b: triple.b}));
            topic.publish(makeTopicKey({ type: "TripleStore.addForA", a: triple.a }), triple, message);
            topic.publish(makeTopicKey({ type: "TripleStore.addForAB", a: triple.a, b: triple.b }), triple, message);
            topic.publish(makeTopicKey({ type: "TripleStore.addForBC", b: triple.b, c: triple.c }), triple, message);
        }
        else {
            console.log("processMessage: Unsupported action", message);
        }
    };
    TripleStore.prototype.subscribe = function (a, b, c, callback) {
        // console.log("TripleStore.subscribe", a, b, c, callback);
        // TODO: Should these subscriptions be stored in this object or be caller responsibility?
        if (a === undefined && b === undefined && c === undefined) {
            return topic.subscribe(makeTopicKey({ type: "TripleStore.addTriple" }), callback);
        }
        if (a !== undefined) {
            if (b !== undefined) {
                // console.log("subscribe", makeTopicKey({type: "TripleStore.addForAB", a: a, b: b}));
                return topic.subscribe(makeTopicKey({ type: "TripleStore.addForAB", a: a, b: b }), callback);
            }
            return topic.subscribe(makeTopicKey({ type: "TripleStore.addForA", a: a }), callback);
        }
        if (b !== undefined) {
            if (c !== undefined) {
                return topic.subscribe(makeTopicKey({ type: "TripleStore.addForBC", b: b, c: c }), callback);
            }
        }
        // TODO: Need to subscribe to addTriple and do filter
        console.log("Unsupported subscription", a, b, c);
        throw new Error("TripleStore.subscribe: Unfinished -- subscription type not yet supported");
    };
    // TODO: Optimize with indexes
    // TODO: Ignoring actual timestamps, so only "latest" by receipt is considered, but that is not correct
    // TODO: need to use actual timestamp in sorted comparison to deal with collissions
    TripleStore.prototype.queryLatest = function (a, b, c) {
        for (var i = this.tripleMessages.length - 1; i >= 0; i--) {
            var tripleMessage = this.tripleMessages[i];
            // console.log("queryLatest loop", i, tripleMessage);
            if ((a === undefined || tripleMessage.change.triple.a === a) && (b === undefined || tripleMessage.change.triple.b === b) && (c === undefined || tripleMessage.change.triple.c === c)) {
                // console.log("match", tripleMessage.change.triple);
                return tripleMessage.change.triple;
            }
        }
        // TODO: Maybe should return empty triple instead?
        return null;
    };
    return TripleStore;
});
