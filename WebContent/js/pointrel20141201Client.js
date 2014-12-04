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
    
    function pointrel_storeInNewEnvelope(item, id, tags, contentType, callback) {
        console.log("pointrel_storeInNewEnvelope", id, tags, contentType, item);
        
        var envelope = {
            __type: "org.pointrel.pointrel20141201.ContentEnvelope",
        };
        
        // TODO: More validation to ensure strings for tags and that it is an array
        if (id) envelope.id = "" + id;
        if (tags) envelope.tags = tags;
        if (contentType) envelope.contentType = "" + contentType;
        
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
    
    function fetchItem(resourceToContentMap, sha256AndLength) {
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
            resourceToContentMap[sha256AndLength] = envelope.content;
            deferred.resolve(sha256AndLength);
        });
        return deferred.promise;
    }
    
    function loadResourcesForTag(resourceToContentMap, tag, callback) {
        console.log("loadAllResourcesForTag");
        pointrel_queryByTag(tag, function(error, queryResult) {
            if (error) { console.log("loadResourcesForTag error", error); return callback(error);}
            console.log("Got queryResult for tag", tag, queryResult);
            
            var items = queryResult.items;
            
            var promises = [];
            for (var index in items) {
                var sha256AndLength = items[index];
                if (!resourceToContentMap[sha256AndLength]) {
                    promises.push(fetchItem(resourceToContentMap, sha256AndLength));
                }
            }
            
            all(promises).then(function(newItems) {
                callback(null, resourceToContentMap, newItems);
            });            
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
        loadResourcesForTag: loadResourcesForTag
    };
});
