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
    /*
     * This version of the Pointrel saves and loads items as JSON "envelopes" that can wrap JSON data.
     * 
     * Callbacks should adhere to the convention of a first error argument and a second result argument.
     * 
     * Use "storeInNewEnvelope" to store new data. That function will callback with an error or a string consisting of a hash and a length as a
     * reference for the envelope. The stored envelope and its contents can be used to retrieve the data again later using "fetchEnvelope" with that
     * reference.
     * 
     * Generally, the envelope should have an "id" that specifies what document this data is a version of. Most documents might only have one version,
     * but some might have several. Envelopes all have a timestamp of when they were created, which is used to determine which one is the "latest" for
     * some ID or tag. They should also have a contentType which suggests how to interperet the JSON data (like a class name). Other information can
     * be defined as well including "tags". Tags are roughly equivalent to containers that document version is stored in. To search for data, you can
     * get envelope references back using either the id (with pointrel_queryByID) or the tags (using pointrel_queryByTag).
     * 
     * The convenience methods "loadLatestEnvelopeForID" and "loadLatestEnvelopeForTag" query for the latest envelope for the ID or tag and then
     * retrieve it.
     * 
     * The convenience methods "loadEnvelopesForID" and "loadEnvelopesForTag" with load all envelopes with the ID or tag. Those two methods take a
     * referenceToEnvelopeMap argument which intially should be an empty dictionary. This will be filled in with the envelopes retrieved from the
     * server. Previously retrieved items will not be retrieved again. They should not be changing, although in theory they could be deleted on the
     * server.
     * 
     * You can check if the server is currently running OK with "getServerStatus".
     * 
     * An example of calling storeInNewEnvelope is:
     * 
     * function storeProjectAnswersVersion(projectAnswers, previousReferenceOrNull, callbackWhenDone) {
     *   var metadata = {id: "Some-ID", previous: previousReferenceOrNull, tags: [], contentType: "Some-Content-Type", contentVersion: "1.0", author: null, committer: "SomeUserID", timestamp: true};        
     *   pointrel20141201Client.storeInNewEnvelope(projectAnswers, metadata, function(error, serverResponse) {
     *       if (error) {
     *           console.log("could not write new version:\n" + error);
     *           return callbackWhenDone(error);
     *       }
     *       var sha256HashAndLength = serverResponse.sha256AndLength;
     *       console.log("wrote sha256HashAndLength:", sha256HashAndLength);
     *       callbackWhenDone(null, sha256HashAndLength);
     *   });
     * }
     * 
     */
    
    // TODO: Should "timestamp" be a creation time or an added to archive (update) time?
    
    var apiPath = "/api/pointrel20141201/";
    var serverStatusPath = apiPath + "server/status";
    var resourcesPath = apiPath + "resources/";
    var idIndexPath = apiPath + "indexes/id/";
    var tagIndexPath = apiPath + "indexes/tag/";
    
    function pointrel_getServerStatus(callback) {
        console.log("pointrel_getServerStatus");
        
        xhr.get(serverStatusPath, {
            handleAs: "text"
        }).then(function(data) {
            // OK
            callback(null, JSON.parse(data));
        }, function(error) {
            // Error
            console.log("pointrel_getServerStatus error", error);
            callback(error, null);
        }, function(event) {
            // Handle a progress event from the request if the browser supports XHR2
        });
    }
    
    // var metadata = {id: null, previous: null, revision: null, tags: [], contentType: null, contentVersion: null, author: null, committer: null, timestamp: true};
    // "true" for timestamp means use the current time as calculated on the server
    function pointrel_storeInNewEnvelope(item, metadata, callback) {
        console.log("pointrel_storeInNewEnvelope", metadata, item);
        
        var envelope = {
            __type: "org.pointrel.pointrel20141201.PointrelContentEnvelope",
            // TODO: Maybe store a UUID?
        };
        
        if (metadata.id) envelope.id = "" + metadata.id;
        
        // Possibly previous could be either a string with sha256AndLength or an object: {uuid: "???", sha256AndLength: "???"}
        if (metadata.previous) envelope.previous = metadata.previous;
        
        /*
        if (metadata.revision) {
            envelope.revision = metadata.revision;
        } else {
            envelope.revision = uuid();
        }
        */

        // TODO: More validation to ensure strings for tags and that it is an array
        if (metadata.tags && metadata.tags.length > 0) envelope.tags = metadata.tags;
        
        if (metadata.contentType) envelope.contentType = "" + metadata.contentType;
        if (metadata.contentVersion) envelope.contentVersion = "" + metadata.contentVersion;
        
        if (metadata.author) envelope.author = "" + metadata.author;
        if (metadata.committer) envelope.committer = "" + metadata.committer;
        
        if (metadata.timestamp) {
            envelope.timestamp = metadata.timestamp;
//            if (metadata.timestamp === true) {
//                // TODO: Could request status from server to get its current timestamp in case of excessive client time drift
//                envelope.timestamp = "" + new Date().toISOString();
//            } else {
//                envelope.timestamp = "" + metadata.timestamp;
//            }
        }
        
        // TODO: check if any unsupported fields? Or just copy them in?
        
        envelope.content = item;
        
        var content = JSON.stringify(envelope, null, 2);
        // var itemReference = SHA256(content,digests.outputTypes.Hex) + "_" + content.length;
        
        console.log("will be posting '%s'", content);
        
        // xhr.post(resourcesPath + itemReference, {
        xhr.post(resourcesPath, {
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
        
        // return itemReference;
    }
    
    // Internal: Modify the returned object so it has a reference to its enclosing sha256AndLength
    function reconstructItem(itemReference, jsonText) {
        var item = JSON.parse(jsonText);
        // if (!item.revision) item.revision = itemReference;
        if (!item.__sha256HashAndLength) item.__sha256HashAndLength = itemReference;
        return item;
    }
    
    function pointrel_fetchEnvelope(itemReference, callback) {
        console.log("pointrel_fetchEnvelope", itemReference);
        
        xhr.get(resourcesPath + itemReference, {
            handleAs: "text"
        }).then(function(data) {
            // OK
            callback(null, reconstructItem(itemReference, data));
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
    
    // Internal: fetch one item and add it to the map
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
    
    function loadEnvelopesForID(referenceToEnvelopeMap, id, callback) {
        console.log("loadEnvelopesForID", id);
        pointrel_queryByID(id, function(error, queryResult) {
            if (error) { console.log("loadEnvelopesForID error", error); return callback(error);}
            console.log("Got queryResult for id", id, queryResult);
            
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
    
    // TODO: On "latest" functions, think about supporting a list of items with the same latest timestamp
    // TODO: Consider adding support for a sequence number of some sort in "latest" operations
    
    // TODO: User server-side call to optimize this this
    function loadLatestEnvelopeForID(id, callback) {
        console.log("loadLatestEnvelopeForID", id);
        pointrel_queryByID(id, function(error, queryResult) {
            if (error) { console.log("loadLatestEnvelopeForID error", error); return callback(error);}
            console.log("Got queryResult for id", id, queryResult);
            
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
                callback("No items found for id", id);
            }
        });
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
    
    // TODO: User server-side call to optimize this this
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
                callback("No items found for tag", tag);
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
        getServerStatus: pointrel_getServerStatus,
        storeInNewEnvelope: pointrel_storeInNewEnvelope,
        fetchEnvelope: pointrel_fetchEnvelope,
        queryByID: pointrel_queryByID,
        queryByTag: pointrel_queryByTag,
        loadEnvelopesForID: loadEnvelopesForID,
        loadLatestEnvelopeForID: loadLatestEnvelopeForID,
        loadEnvelopesForTag: loadEnvelopesForTag,
        loadLatestEnvelopeForTag: loadLatestEnvelopeForTag
    };
});
