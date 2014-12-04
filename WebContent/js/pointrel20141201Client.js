"use strict";
    
define([
    "dojo/promise/all",
    "dojo/Deferred",
    "dojo/request/xhr",
    'dojox/encoding/digests/_base',
    "dojox/encoding/digests/SHA256"
], function(
    all,
    Deferred,
    xhr,
    digests,
    SHA256
) {
    var apiPath = "/api/pointrel20141201/";
    var resourcesPath = apiPath + "resources/";
    var idIndexPath = apiPath + "indexes/id/";
    var tagIndexPath = apiPath + "indexes/tag/";
    
    // var metadata = {id: null, tags: [], contentType: null, author: null, committer: null, timestamp: true};
    // "true" for timestamp means use the current time
    function pointrel_storeInNewEnvelope(item, metadata, callback) {
        console.log("pointrel_storeInNewEnvelope", metadata, item);
        
        var envelope = {
            __type: "org.pointrel.pointrel20141201.PointrelContentEnvelope",
        };
        
        // TODO: More validation to ensure strings for tags and that it is an array
        if (metadata.id) envelope.id = "" + metadata.id;
        if (metadata.tags && metadata.tags.length > 0) envelope.tags = metadata.tags;
        if (metadata.contentType) envelope.contentType = "" + metadata.contentType;
        
        if (metadata.author) envelope.author = "" + metadata.author;
        if (metadata.committer) envelope.committer = "" + metadata.committer;
        if (metadata.timestamp) {
            if (metadata.timestamp === true) {
                envelope.timestamp = "" + new Date().toISOString();
            } else {
                envelope.timestamp = "" + metadata.timestamp;
            }
        }
        
        // TODO: check if any unsupported fields? Or just copy them in?
        
        envelope.content = item;
        
        var content = JSON.stringify(envelope, null, 2);
        var itemReference = SHA256(content,digests.outputTypes.Hex) + "_" + content.length;
        
        console.log("will be posting '%s'", content);
        
        xhr.post(resourcesPath + itemReference, {
            handleAs: "text",
            data: content,
            headers: {'Content-Type': 'application/json; charset=UTF-8'}
        }).then(function(data) {
            // OK
            callback(null, JSON.parse(data));
        }, function(error) {
            // Error
            if (error.response.status === 409) {
                console.log("pointrel_storeInNewEnvelope already exists", error);
                console.log("pointrel_storeInNewEnvelope message: '%s'", error.response.data);
                // Assuming it's OK if the resource already exists -- we can assume it is identical and was added by someone else
                callback(null, JSON.parse(error.response.data));
            } else {
                console.log("pointrel_storeInNewEnvelope error", error);
                callback(error.response.data, null);
            }
        }, function(event) {
            // Handle a progress event from the request if the browser supports XHR2
        });
        
        return itemReference;
    }
    
    function pointrel_fetchEnvelope(itemReference, callback) {
        console.log("pointrel_fetchEnvelope", itemReference);
        
        xhr.get(resourcesPath + itemReference, {
            handleAs: "text"
        }).then(function(data) {
            // OK
            callback(null, JSON.parse(data));
        }, function(error) {
            // Error
            console.log("pointrel_fetchEnvelope error", error);
            callback(error, null);
        }, function(event) {
            // Handle a progress event from the request if the browser supports XHR2
        });
    }
    
    function pointrel_queryByID(id, callback) {
        console.log("pointrel_queryByID", id);
        
        xhr.get(idIndexPath + id, {
            handleAs: "text"
        }).then(function(data) {
            // OK
            callback(null, JSON.parse(data));
        }, function(error) {
            // Error
            callback(error, null);
        }, function(event) {
            // Handle a progress event from the request if the browser supports XHR2
        });
    }
    
    function pointrel_queryByTag(tag, callback) {
        console.log("pointrel_queryByTag", tag);
        
        xhr.get(tagIndexPath + tag, {
            handleAs: "text"
        }).then(function(data) {
            // OK
            callback(null, JSON.parse(data));
        }, function(error) {
            // Error
            callback(error, null);
        }, function(event) {
            // Handle a progress event from the request if the browser supports XHR2
        });
    }
    
    /* Convenience */
    
    function fetchItem(referenceToEnvelopeMap, sha256AndLength) {
        console.log("fetchItem", sha256AndLength);
        var deferred = new Deferred();
        pointrel_fetchEnvelope(sha256AndLength, function(error, envelope) {
            if (error) {
                console.log("error", error);
                // TODO: Could "reject" here to generate an error, but then anyone failure could stop loading others
                // TODO: Could return the sha256AndLength of the failed item instead? Then would need to check map to see if it is there
                deferred.resolve(sha256AndLength);
                return;
            }
            console.log("Got item", envelope.content);
            referenceToEnvelopeMap[sha256AndLength] = envelope;
            deferred.resolve(sha256AndLength);
        });
        return deferred.promise;
    }
    
    function loadEnvelopesForTag(referenceToEnvelopeMap, tag, callback) {
        console.log("loadEnvelopesForTag", tag);
        pointrel_queryByTag(tag, function(error, queryResult) {
            if (error) { console.log("loadEnvelopesForTag error", error); return callback(error);}
            console.log("Got queryResult for tag", tag, queryResult);
            
            var indexEntries = queryResult.indexEntries;
            
            var promises = [];
            for (var index in indexEntries) {
                var indexEntry = indexEntries[index];
                if (!referenceToEnvelopeMap[indexEntry.sha256AndLength]) {
                    promises.push(fetchItem(referenceToEnvelopeMap, indexEntry.sha256AndLength));
                }
            }
            
            all(promises).then(function(newItems) {
                callback(null, referenceToEnvelopeMap, newItems);
            });            
        });
    }
    
    function loadLatestEnvelopeForTag(tag, callback) {
        console.log("loadLatestEnvelopeForTag", tag);
        pointrel_queryByTag(tag, function(error, queryResult) {
            if (error) { console.log("loadLatestEnvelopeForTag error", error); return callback(error);}
            console.log("Got queryResult for tag", tag, queryResult);
            
            var indexEntries = queryResult.indexEntries;
            
            var latestEntry = null;
            for (var index in indexEntries) {
                var indexEntry = indexEntries[index];
                if (!latestEntry || latestEntry.timestamp <= indexEntry.timestamp) {
                    latestEntry = indexEntry;
                }
            }
            
            if (latestEntry) {
                pointrel_fetchEnvelope(latestEntry.sha256AndLength, function(error, envelope) {
                    if (error) {
                        console.log("error", error);
                        callback(error);
                        return;
                    }
                    callback(null, envelope);
                });
            } else {
                callback("No items found for tag");
            }
        });
    }
    
    // Optional initialization
    function initialize(configuration) {
        if (configuration) {
            if (configuration.apiPath) apiPath = configuration.apiPath;
        }
    }
    
    console.log("loaded Pointrel client", apiPath);
    
    return {
        initialize: initialize,
        storeInNewEnvelope: pointrel_storeInNewEnvelope,
        fetchEnvelope: pointrel_fetchEnvelope,
        queryByID: pointrel_queryByID,
        queryByTag: pointrel_queryByTag,
        loadEnvelopesForTag: loadEnvelopesForTag,
        loadLatestEnvelopeForTag: loadLatestEnvelopeForTag
    };
});
