// Inspired by Dojo and also by: http://davidwalsh.name/pubsub-javascript

var topics = {};

var subscriptionsCount = 0;

export function subscribe(topic, callback) {
    var topicKey = JSON.stringify(topic);
    
    if (!topic[topicKey]) topics[topicKey] = {};

    var uniqueIndex = subscriptionsCount++;
    topics[topicKey][uniqueIndex] = callback;

    return {
        remove: function() {
            delete topics[topic][uniqueIndex];
        }
    };
}

export function publish(topic, ...data: any[]) {
    var topicKey = JSON.stringify(topic);
    
    if (!topic[topicKey]) return;

    topics[topicKey].forEach(function(callbackKey) {
        var callback = topics[topicKey][callbackKey];
        callback.apply(null, data);
    });
}
