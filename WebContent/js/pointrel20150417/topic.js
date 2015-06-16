// Inspired by Dojo and also by: http://davidwalsh.name/pubsub-javascript
define(["require", "exports"], function (require, exports) {
    var subscriptions = {};
    var subscriptionsCount = 0;
    function subscribe(topic, callback) {
        var topicKey = JSON.stringify(topic);
        if (!subscriptions[topicKey])
            subscriptions[topicKey] = {};
        var uniqueIndex = subscriptionsCount++;
        subscriptions[topicKey][uniqueIndex] = callback;
        return {
            remove: function () {
                delete subscriptions[topicKey][uniqueIndex];
            }
        };
    }
    exports.subscribe = subscribe;
    function publish(topic) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        var topicKey = JSON.stringify(topic);
        if (!subscriptions[topicKey])
            return;
        var callbacksForTopic = subscriptions[topicKey];
        for (var callbackKey in callbacksForTopic) {
            var callback = callbacksForTopic[callbackKey];
            callback.apply(null, data);
        }
    }
    exports.publish = publish;
});
//# sourceMappingURL=topic.js.map