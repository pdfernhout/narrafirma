// Inspired by Dojo and also by: http://davidwalsh.name/pubsub-javascript
define(["require", "exports"], function (require, exports) {
    var topics = {};
    var subscriptionsCount = 0;
    function subscribe(topic, callback) {
        var topicKey = JSON.stringify(topic);
        if (!topic[topicKey])
            topics[topicKey] = {};
        var uniqueIndex = subscriptionsCount++;
        topics[topicKey][uniqueIndex] = callback;
        return {
            remove: function () {
                delete topics[topicKey][uniqueIndex];
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
        if (!topic[topicKey])
            return;
        topics[topicKey].forEach(function (callbackKey) {
            var callback = topics[topicKey][callbackKey];
            callback.apply(null, data);
        });
    }
    exports.publish = publish;
});
//# sourceMappingURL=topic.js.map