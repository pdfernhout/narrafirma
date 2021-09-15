// Inspired by Dojo and also by: http://davidwalsh.name/pubsub-javascript
import kludgeForUseStrict = require("../kludgeForUseStrict");
"use strict";

let subscriptions: { [id: string]: { [id2: string]: Function } } = {};
let subscriptionsCount = 0;

export function subscribe(topic, callback) {
    const topicKey = JSON.stringify(topic);
    
    if (!subscriptions[topicKey]) subscriptions[topicKey] = {};

    const uniqueIndex = subscriptionsCount++;
    subscriptions[topicKey][uniqueIndex] = callback;

    // Return a handle with a remove function to remove this this subscription
    return {
        remove: function() {
            delete subscriptions[topicKey][uniqueIndex];
        }
    };
}

export function publish(topic, ...data: any[]) {
    const topicKey = JSON.stringify(topic);
    
    if (!subscriptions[topicKey]) return;

    const callbacksForTopic = subscriptions[topicKey];
    for (let callbackKey in callbacksForTopic) {
        const callback = callbacksForTopic[callbackKey];
        callback.apply(null, data);
    }
}
