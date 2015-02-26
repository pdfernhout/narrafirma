define([
    "dojo/promise/all",
    "dojo/Deferred",
    "dojox/uuid/generateRandomUuid",
    "dojo/request/xhr"
], function(
    all,
    Deferred,
    generateRandomUuid,
    xhr
) {
    "use strict";
    
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
     * some ID or tag. They should also have a contentType which suggests how to interpret the JSON data (like a class name).
     * Other information can be defined as well.
     * 
     * One special type of metadata are "triples" which each consist of three fields (a, b, c) stored in an array.
     * These three fields can be thought of initially as object, aspect, and value (similar to RDF).
     * Or, they can be seen as an A pointer and a C pointer joined by a B relationship.
     * The B relationship is a string that is generally of the form of a URL-like location (without a leading http://), then a ":", and then a term.
     * An example of a relationship used for tagging documents is: "{http://pointrel.org/pointrel20141201}document_tag"
     * Triples can define "tags" by associating the document ID in the "a" field with "{http://pointrel.org/pointrel20141201}document_tag" in the "b" field
     * and the tag string in the "c" field.
     * For example, a tag called "my tag" could be added for a document called "test" by using the metadata:
     *    { id: "test", triples: [{a: "test", b: "{http://pointrel.org/pointrel20141201}document_tag", c: "my tag"}] }
     * Tags are roughly equivalent to containers that a document is stored in.
     * As a convenience, you can list tag strings in metadata for "tags" and they will be added as new triples in addition to any triples you supply.
     * Example metadata that is equivalent to the above:  { id: "test", tags: ["my tag"] }
     * The triples can be used in a lot more ways though.
     * The triples are indexed in various ways and can be queried using an API.
     * A typical query is to find the most recent "c" value for an "a" and a "b" field.
     * Another typical query is to find all "c" values for an "a" and a "b" field.
     * Back links (as a type of "transclusion") are also possible.
     * So, you can search on all "a" values that have a "b" and a "c".
     * The triples are stored in memory in relation to the indexes.
     * So, while the fields are arbitrary length strings, ideally they should be short strings that specify UUIDs
     * or they should be semantically meaningful relationship names or tags.
     * Large amounts of content, such as a source code file should be stored in the content part of a document.
     * Storing content separately reduces the memory and CPU overhead of indexing.
     * Triples provide a general purpose way to index associated content in the document.
     * For example, a document could have every word or meaningful word-stem indexed using triples for quick lookup.
     * However, triples can also be used stand-alone without specifying any document content.
     * In that case, the document can be seen purely as a "transaction" adding triples to the system.
     * Only the latest version of triples are indexed for a document based on the document timestamp.
     * Previous indexed triples are removed when a later version of a document is encountered.
     * So, to delete a triple, you can add a new version of the document that defined it without that triple.
     * Triples maintain a reference to their defining document which should have a timestamp.
     * Triples can also have their own timestamp though, using an optional "timestamp" field.
     * As with document timestamps, documents may be rejected by the server if these timestamps are significantly in the future.
     * 
     * To search for data, you can get envelope references back using either the id (with queryByID)
     * or the tags (using queryByTag) or by the triple search API with queryByTriple.
     * To use the queryByTriple API, fill in two of the first three a, b, c arguments with strings and the other with null.
     * To get all the matches, use "all" as the fourth field. Otherwise use "latest".
     * You can omit the fourth parameter if it is "latest", and also then omit the third parameter if it is null.
     * However, you still need the callback parameter at the end in those cases with omitted parameters.
     * For example: queryByTriple("a", "b", callback) gets the latest "c" match.
     * As another example: queryByTriple(null, "b", "c", "all", callback) gets all the items which have a "b" value of "c".
     * These two queries are the most commonly used, along with getting all values for a "c" where that represents a set.
     * 
     * The convenience methods "loadLatestEnvelopeForID" and "loadLatestEnvelopeForTag" query for
     * the latest envelope for the ID or tag and then retrieve it.
     * 
     * The convenience methods "loadEnvelopesForID" and "loadEnvelopesForTag" with load all envelopes with the ID or tag.
     * Those two methods take a referenceToEnvelopeMap argument which initially should be an empty dictionary.
     * This will be filled in with the envelopes retrieved from the server.
     * Previously retrieved items (stored in the referenceToEnvelopeMap) will not be retrieved again.
     * They should not be changing, although in theory they could be manually deleted on the server.
     * 
     * You can list all the IDs in use with "fetchIDs". This makes the full list of documents "discoverable".
     * TODO: This method is experimental, because since it returns all the IDs, if there are a lot, this may be a problem.
     * Also, there are security advantages to only being able to retrieve documents the client knows about.
     * 
     * You can check if the server is currently running OK with "getServerStatus".
     * 
     * An example of calling storeInNewEnvelope is:
     * 
     * function storeProjectAnswersVersion(projectAnswers, previousReferenceOrNull, callbackWhenDone) {
     *   var metadata = {id: "Some-ID", previous: previousReferenceOrNull, triples: [], contentType: "Some-Content-Type", contentVersion: "1.0", author: null, committer: "SomeUserID", timestamp: true};        
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
    var tripleQueryIndexPath = apiPath + "indexes/triples";
    var standardDocumentTagRelationship = "{http://pointrel.org/pointrel20141201}document_tag";
    
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
    
    // var metadata = {id: null, previous: null, revision: null, triples: [], contentType: null, contentVersion: null, author: null, committer: null, timestamp: true};
    // "true" for timestamp means use the current time as calculated on the server
    function pointrel_storeInNewEnvelope(item, metadata, callback) {
        console.log("pointrel_storeInNewEnvelope", metadata, item);
        
        var envelope = {
            __type: "org.pointrel.pointrel20141201.PointrelContentEnvelope",
            // Envelope version will be filled in by the server, but could in theory be specified if the server understands it
            __envelopeVersion: true
            // TODO: Maybe store a UUID?
        };
        
        if (metadata.id) {
            envelope.id = "" + metadata.id;
        } else {
            envelope.id = generateRandomUuid();
        }
        
        // Possibly previous could be either a string with sha256AndLength or an object: {uuid: "???", sha256AndLength: "???"}
        if (metadata.previous) envelope.previous = metadata.previous;
        
        /*
        if (metadata.revision) {
            envelope.revision = metadata.revision;
        } else {
            envelope.revision = uuid();
        }
        */


        // TODO: More validation to ensure triples each look good and that it is an array
        if (metadata.triples && metadata.triples.length > 0) envelope.triples = metadata.triples;
        
        // TODO: More validation to ensure strings for tags and that it is an array
        if (metadata.tags && metadata.tags.length > 0 && envelope.id) {
            var triples;
            if (envelope.triples) {
                // Copy the array if it exists because we will be changing it
                triples = envelope.triples.slice(0);
            } else {
                triples = [];
            }
            for (var i = 0; i < metadata.tags.length; i++) {
                var tag = metadata.tags[i];
                if (!tag) continue;
                triples.push({a: envelope.id, b: standardDocumentTagRelationship, c: tag});
            }
            envelope.triples = triples;
        }
        
        
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
        if (!itemReference) {
            var errorMessage = "ERROR: itemReference not specified in call to fetchEnvelope";
            console.log(errorMessage);
            throw new Error(errorMessage);
        }
        
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
    
    // TODO: This adds "discoverability", but what happens when there are too many IDs?
    // Returns structure with an idList field
    function pointrel_fetchIDs(callback) {
        console.log("pointrel_fetchIDs");
        
        xhr.get(idIndexPath, {
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
    
    function pointrel_queryByID(id, callback) {
        console.log("pointrel_queryByID", id);
        if (!id) {
            var errorMessage = "ERROR: id not specified in call to queryByID";
            console.log(errorMessage);
            throw new Error(errorMessage);
        }
        
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
        if (!tag) {
            var errorMessage = "ERROR: tag not specified in call to queryByTag";
            console.log(errorMessage);
            throw new Error(errorMessage);
        }
        
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
    
    // c and queryType are optional args
    function pointrel_queryByTriple(a, b, c, queryType, callback) {
        if (arguments.length === 3 && typeof(c) === "function") {
            callback = c;
            c = null;
            queryType = "latest";
        }
        
        if (arguments.length === 4 && typeof(queryType) === "function") {
            callback = queryType;
            queryType = "latest";
        }
        
        console.log("pointrel_queryByTriple", queryType, a, b, c);
        
        var serverQueryType = null;
        
        if (a && b && c === null && queryType === "all") {
            serverQueryType = "findAllCForAB"; 
        } else if (a && b === null && c && queryType === "all") {
            serverQueryType = "findAllBForAC"; 
        } else if (a === null && b && c && queryType === "all") {
            serverQueryType = "findAllAForBC"; 
        } else if (a && b && c === null && queryType === "latest") {
            serverQueryType = "findLatestCForAB"; 
        } else if (a && b === null && c && queryType === "latest") {
            serverQueryType = "findLatestBForAC"; 
        } else if (a === null && b && c && queryType === "latest") {
            serverQueryType = "findLatestAForBC"; 
        }
        
        if (serverQueryType === null) {
            var errorMessage = "Unsupported query type in call to queryByTriple";
            console.log(errorMessage);
            throw new Error(errorMessage);
            // callback("Unsupported query type", null);
        }
        
        var query = {queryType: serverQueryType, a: a, b: b, c: c};
        var queryString = JSON.stringify(query, null, 2);
        
        xhr.post(tripleQueryIndexPath, {
            handleAs: "text",
            data: queryString,
            headers: {'Content-Type': 'application/json; charset=UTF-8'}
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
        if (!sha256AndLength) {
            var errorMessage = "ERROR: sha256AndLength not specified in call to fetchItem";
            console.log(errorMessage);
            throw new Error(errorMessage);
        }
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
        if (!id) {
            var errorMessage = "ERROR: id not specified in call to loadEnvelopesForID";
            console.log(errorMessage);
            throw new Error(errorMessage);
        }
        pointrel_queryByID(id, function(error, queryResult) {
            if (error) { console.log("loadEnvelopesForID error", error); return callback(error);}
            console.log("Got queryResult for id", id, queryResult);
            
            var indexEntries = queryResult.indexEntries;
            
            var promises = [];
            for (var index = 0; index <= indexEntries.length; index++) {
                var indexEntry = indexEntries[index];
                if (!referenceToEnvelopeMap[indexEntry.sha256AndLength]) {
                    if (!indexEntry.sha256AndLength) {
                        var errorMessage = "ERROR: indexEntry.sha256AndLength value missing in result from loadEnvelopesForID";
                        console.log(errorMessage);
                        console.log("queryResult", queryResult);
                        throw new Error(errorMessage);
                    }
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
        if (!id) {
            var errorMessage = "ERROR: id not specified in call to loadLatestEnvelopeForID";
            console.log(errorMessage);
            throw new Error(errorMessage);
        }
        pointrel_queryByID(id, function(error, queryResult) {
            if (error) { console.log("loadLatestEnvelopeForID error", error); return callback(error);}
            console.log("Got queryResult for id", id, queryResult);
            
            var indexEntries = queryResult.indexEntries;
            
            var latestEntry = null;
            for (var index = 0; index < indexEntries.length; index++) {
                var indexEntry = indexEntries[index];
                if (!latestEntry || latestEntry.timestamp <= indexEntry.timestamp) {
                    latestEntry = indexEntry;
                }
            }
            
            if (latestEntry) {
                if (!latestEntry.sha256AndLength) {
                    var errorMessage = "ERROR: latestEntry.sha256AndLength value missing in result from loadLatestEnvelopeForID";
                    console.log(errorMessage);
                    console.log("queryResult", queryResult);
                    throw new Error(errorMessage);
                }
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
        if (!tag) {
            var errorMessage = "ERROR: tag not specified in call to loadEnvelopesForTag";
            console.log(errorMessage);
            throw new Error(errorMessage);
        }
        pointrel_queryByTag(tag, function(error, queryResult) {
            if (error) { console.log("loadEnvelopesForTag error", error); return callback(error);}
            console.log("Got queryResult for tag", tag, queryResult);
            
            var documentEntries = queryResult.documentEntries;
            
            var promises = [];
            for (var index = 0; index < documentEntries.length; index++) {
                var documentEntry = documentEntries[index];
                if (!referenceToEnvelopeMap[documentEntry.sha256AndLength]) {
                    if (!documentEntry.sha256AndLength) {
                        var errorMessage = "ERROR: documentEntry.sha256AndLength value missing in result from loadEnvelopesForTag";
                        console.log(errorMessage);
                        console.log("queryResult", queryResult);
                        throw new Error(errorMessage);
                    }
                    promises.push(fetchItem(referenceToEnvelopeMap, documentEntry.sha256AndLength));
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
        if (!tag) {
            var errorMessage = "ERROR: tag not specified in call to loadLatestEnvelopeForTag";
            console.log(errorMessage);
            throw new Error(errorMessage);
        }
        pointrel_queryByTag(tag, function(error, queryResult) {
            if (error) { console.log("loadLatestEnvelopeForTag error", error); return callback(error);}
            console.log("Got queryResult for tag", tag, queryResult);
            
            var documentEntries = queryResult.documentEntries;
            
            var latestEntry = null;
            for (var index = 0; index < documentEntries.length; index++) {
                var documentEntry = documentEntries[index];
                if (!latestEntry || latestEntry.timestamp <= documentEntry.timestamp) {
                    latestEntry = documentEntry;
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
        fetchIDs: pointrel_fetchIDs,
        queryByID: pointrel_queryByID,
        queryByTag: pointrel_queryByTag,
        queryByTriple: pointrel_queryByTriple,
        loadEnvelopesForID: loadEnvelopesForID,
        loadLatestEnvelopeForID: loadLatestEnvelopeForID,
        loadEnvelopesForTag: loadEnvelopesForTag,
        loadLatestEnvelopeForTag: loadLatestEnvelopeForTag
    };
});
