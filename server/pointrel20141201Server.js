/*jslint node: true */
"use strict";

/* "The only reason for time is so that everything doesn't happen at once. (Albert Einstein)" */

// Simplified version of Pointrel system (building on Pointrel20130202)
// Stores JSON resources in files
// Keeps indexes for them in memory
// Indexes created from parsing all resources at startup
// Trying to avoid maintaining log files which could get corrupted
// Also making this module usable directly from server code in nodejs

// This version relies on using timestamps to get latest version of content
// It will not index stored resources with timestamps in the future, and will reject them when added via API
// This is to prevent a resource significantly in the future always being returned as the "latest" version for an ID or triple
// Otherwise, that would be an error that can't be recovered from short of deleting the resource file manually and restarting the server

// The constant maximumTimeDriftAllowed_ms is the maximum time drift allowed for resources to be in the future to allow for slightly different clocks
// The more frequently records are written to the server, the smaller this value should be
var maximumTimeDriftAllowed_ms = 10000;

// TODO: Use internet time service somehow to check if server time looks close enough to OK when startup
// TODO: Should documents use 128-bit NTP timestamps based on NTP epoch?
// TODO: Distinguish different types of timestamp: contributed when, authored when, about event when, primary source when???

var pointrelServerVersion = "pointrel20141201-0.0.3";
var pointrelDocumentEnvelopeVersion = "pointrel20141201-0.0.3";
var resourceFileSuffix = ".pce";
var signatureType = "org.pointrel.pointrel20141201.PointrelContentEnvelope";

// resourceDirectoryLevels of 2 should be good for about 6 million resource files or so (256 * 256 * 100)
// with at most 100 in a directory if sha256 is distributed randomly
// Increase it before using the server to store any data if you expect more files than that
// If the files grow beyond that, there will be more and more files in leaf directories,
// which should work but becomes inefficient, including when doing an ls in a directory
var resourceDirectoryLevels = 2;
var resourceDirectorySegmentLength = 2;

var apiBaseURL = '/api/pointrel20141201';
var serverDataDirectory = "../server-data/";
var resourcesDirectory = serverDataDirectory + "resources/";

// Standard nodejs modules
var fs = require('fs');
var crypto = require('crypto');

// The modules below require npm installation
var bodyParser = require('body-parser');
var mkdirp = require('mkdirp');

// Local modules
var TripleStore = require("./PointrelTripleStore");

/* Indexing */

var indexes = {
     // Maps whether an item was added to the indexes (use to quickly tell if it exists)
     referenceToIsIndexed: {},   
        
     // Maps document id to array of sha256AndLength strings, one for each "version"
     idToReferences: {},

     tripleStore: new TripleStore(), 
};

function referenceIsIndexed(reference) {
    return indexes.referenceToIsIndexed[reference] === true;
}

function referencesForID(id) {
    return indexes.idToReferences[id];
}

function referencesForTag(tag) {
    return indexes.tripleStore.findAllAForBC(TripleStore.standardDocumentTagRelationship, tag);
}

function addToIndex(indexType, index, key, itemReference) {
    // console.log("addToIndex", indexType, index, key, itemReference);
    var itemsForKey = index[key];
    if (!itemsForKey) {
        itemsForKey = [];
        index[key] = itemsForKey;
    }
    itemsForKey.push(itemReference);
}

function addToIndexes(body, sha256AndLength) {
    //  console.log("addToIndexes", sha256AndLength, body);
    var id = body.id;
    var contentType = body.contentType;
    
    if (referenceIsIndexed(sha256AndLength)) {
        console.log("Already indexed " + sha256AndLength);
        return false;
    }
    
    indexes.referenceToIsIndexed[sha256AndLength] = true;
    
    if (body.__type !== signatureType) {
        // console.log("Not indexing content as no __type signatureType of %s for: %s", signatureType, sha256AndLength);
        return;
    }
    
    // TODO: Maybe store body content in indexEntry if it is small... (< 10K?)
    // Put in essential envelope data
    var indexEntry = {sha256AndLength: sha256AndLength};
    if (body.id) indexEntry.id = body.id;
    if (body.contentType) indexEntry.contentType = body.contentType;
    if (body.author) indexEntry.author = body.author;
    if (body.committer) indexEntry.committer = body.committer;
    if (body.timestamp) indexEntry.timestamp = body.timestamp;
    
    if (id) {
        // Multiple resources with the same ID are assumed to be versions of the same abstract entity
        addToIndex("id", indexes.idToReferences, "" + id, indexEntry);
    }
    
    // Need to call this even if there are no triples in this version because triples may need to be removed for earlier versions
    indexes.tripleStore.addOrRemoveTriplesForDocument(body, sha256AndLength);
    
    // TODO: Not sure if should keep triples in index entry???
    if (body.triples) indexEntry.triples = body.triples;

    return true;
}

function reindexAllResources() {
    console.log("reindexAllResources");
    indexes.referenceToIsIndexed = {};
    indexes.idToReferences = {};
    indexes.tripleStore = new TripleStore();
    
    reindexAllResourcesInDirectory(resourcesDirectory);
    
    var resourceCount = 0;
    for (var key in indexes.referenceToIsIndexed) resourceCount++;
    console.log("Indexed %s resources", resourceCount);
    
    // console.log("id index", indexes.idToReferences);
    // console.log("tag index", indexes.tagToReferences);
}

function reindexAllResourcesInDirectory(directory) {
    // console.log("reindexAllResourcesInDirectory", directory);
    var maximumAllowedTimestamp = calculateMaximumAllowedTimestamp();
    
    var fileNames;
    try {
        fileNames = fs.readdirSync(directory);
    } catch(error) {
        console.log("Problem reading directory %s error: %s", directory, error);
    }
    // console.log("fileNames", fileNames);
    for (var fileNameIndex in fileNames) {
        var fileName = fileNames[fileNameIndex];
        if (endsWith(fileName, resourceFileSuffix)) {
            // console.log("Indexing: ", fileName);
            try {
                var resourceContent = fetchContentForReferenceSync(fileName.substring(0, fileName.length - resourceFileSuffix.length));
                var resourceObject = JSON.parse(resourceContent);
                // console.log("resourceObject", resourceObject);
                // Reject items with a future timestamp
                var envelopeTimestamp = resourceObject.timestamp;
                if (!isTimestampInFuture(envelopeTimestamp, maximumAllowedTimestamp)) {
                    addToIndexes(resourceObject, fileName.substring(0, fileName.length-4));
                } else {
                    return console.log("Item not indexed: " + fileName + " because resource envelope timestamp of: " + envelopeTimestamp + " is later than the currently maximumAllowedTimestamp of: " + maximumAllowedTimestamp);
                    
                }
            } catch(error) {
                console.log("Problem indexing %s error: %s", fileName, error);
            }
        } else {
            if (!startsWith(fileName, ".") && fileName.length === resourceDirectorySegmentLength) {
                var isDirectory = fs.lstatSync(directory + fileName).isDirectory();
                if (isDirectory) reindexAllResourcesInDirectory(directory + fileName + "/");
            }
        }
    }
}

function calculateStoragePath(baseDirectory, hexDigits, levelCount, segmentLength) {
    // console.log("calculateStoragePath", baseDirectory, hexDigits, levelCount, segmentLength);
    var fullPath = baseDirectory;
    for (var level = 0; level < levelCount; level++) {
        var startOfSegment = level * segmentLength;
        var segment = hexDigits.substring(startOfSegment, startOfSegment + segmentLength);
        fullPath = fullPath + segment + "/";
    }

    // console.log("calculated path:", fullPath);
    return fullPath;
  }

/* Fetching and storing resources to disk */

function fetchContentForReference(sha256AndLength, callback) {
    var fileDirectory = calculateStoragePath(resourcesDirectory, sha256AndLength, resourceDirectoryLevels, resourceDirectorySegmentLength);
    var fileName = sha256AndLength + resourceFileSuffix;
    fs.readFile(fileDirectory + fileName, "utf8", callback);
}

function fetchContentForReferenceSync(sha256AndLength) {
    var fileDirectory = calculateStoragePath(resourcesDirectory, sha256AndLength, resourceDirectoryLevels, resourceDirectorySegmentLength);
    var fileName = sha256AndLength + resourceFileSuffix;
    return fs.readFileSync(fileDirectory + fileName, "utf8");
}

function storeContentForReference(sha256AndLength, data, callback) {
    var fileDirectory = calculateStoragePath(resourcesDirectory, sha256AndLength, resourceDirectoryLevels, resourceDirectorySegmentLength);
    var fileName = sha256AndLength + resourceFileSuffix;
    // TODO: Write to a temp file first and then move it
    // TODO: maybe change permission mode from default?
    mkdirp(fileDirectory, function(error) {
        if (error) {
            if (callback) callback(error);
            return;
        }
        console.log("writing file: %s", fileDirectory + fileName);
        fs.writeFile(fileDirectory + fileName, data, "utf8", callback);
    });
}

function storeContentForReferenceSync(sha256AndLength, data) {
    var fileDirectory = calculateStoragePath(resourcesDirectory, sha256AndLength, resourceDirectoryLevels, resourceDirectorySegmentLength);
    var fileName = fileDirectory + sha256AndLength + resourceFileSuffix;
    // TODO: Write to a temp file first and then move it
    // TODO: maybe change permission mode from default?
    mkdirp.sync(fileDirectory);
    console.log("writing file: %s", fileDirectory + fileName);
    fs.writeFileSync(fileDirectory + fileName, data, "utf8");
}

/* Utility */

function startsWith(str, prefix) {
    return str.indexOf(prefix) === 0;
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function calculateSHA256(bufferOrString) {
    var hash = crypto.createHash('sha256');
    // 'utf8' is ignored if passed a buffer and not a string
    hash.update(bufferOrString, 'utf8');
    return hash.digest('hex');
}

function sanitizeFileName(fileName) {
    return fileName.replace(/\s/g, "_").replace(/\.[\.]+/g, "_").replace(/[^\w_\.\-]/g, "_");
}

function sendFailureMessage(response, code, message, extra) {
    var sending = {status: code, error: message};
    if (extra) {
        for (var key in extra) {
            sending[key] = extra[key];
        }
    }
    response.status(code).send(JSON.stringify(sending));
    return false;
}

function returnResource(sha256AndLength, response) {
    if (!referenceIsIndexed(sha256AndLength)) {
        return sendFailureMessage(response, 404, "Not found: " + sha256AndLength);
    }
    
    fetchContentForReference(sha256AndLength, function (error, data) {
        if (error) {
            // TODO: Should check what sort of error and respond accordingly
            return sendFailureMessage(response, 500, "Server error: " + error);
         }
        // response.json(content);
        response.setHeader('Content-Type', 'application/json');
        response.send(data);
    });
}

function getCurrentTimestamp() {
    return new Date().toISOString();
}

function calculateMaximumAllowedTimestamp() {
    var currentTime = new Date();
    var futureTime = new Date(currentTime.getTime() + maximumTimeDriftAllowed_ms);
    return futureTime.toISOString();
}

/* Responding to requests */

function respondWithStatus(request, response) {
    response.json({status: 'OK', version: pointrelServerVersion, currentTimestamp: getCurrentTimestamp()});
}

function respondForResourceGet(request, response) {
    // Sanitizes resource ID to prevent reading arbitrary files
    // TODO: Improve with length limits on sections and checking if SHA256 looks good
    var sha256AndLength = sanitizeFileName(request.params.sha256AndLength);
    
    console.log("==== GET by sha256AndLength", request.url);
    returnResource(sha256AndLength, response);
}

// To use: var maximumAllowedTimestamp = calculateMaximumAllowedTimestamp();
function isTimestampInFuture(timestamp, maximumAllowedTimestamp) {
    if (!timestamp) return false;
    // TODO: Could check timestamp format
    var isRequestTimestampIsInFuture = timestamp > maximumAllowedTimestamp;
    // console.log("Checking timestamp request: %s maximumAllowedTimestamp: %s isRequestTimestampIsInFuture: %s",  timestamp, maximumAllowedTimestamp,  isRequestTimestampIsInFuture);
    return isRequestTimestampIsInFuture;
}

function respondForResourcePost(request, response) {
    // console.log("POST", request.url, request.body);
    
    var requestEnvelope = request.body;
    
    if (!requestEnvelope) {
        return sendFailureMessage(response, 406, "Not acceptable: post is missing JSON Content-Type body");
    }
    
    if (requestEnvelope.__type !== signatureType) {
        return sendFailureMessage(response, 406, "Not acceptable: post requestEnvelope is missing __type signatureType of " + signatureType);
    }
    
    if (requestEnvelope.__envelopeVersion !== true && requestEnvelope.__envelopeVersion !==  pointrelDocumentEnvelopeVersion) {
        return sendFailureMessage(response, 406, "Not acceptable: post requestEnvelope __envelopeVersion is not supported; expected true or " + pointrelDocumentEnvelopeVersion);
    }
    
    if (requestEnvelope.__envelopeVersion === true) {
        requestEnvelope.__envelopeVersion = pointrelDocumentEnvelopeVersion;
    } else if (requestEnvelope.__envelopeVersion !== pointrelDocumentEnvelopeVersion) {
        return sendFailureMessage(response, 406, "Not acceptable: post requestEnvelope __envelopeVersion is not supported; expected true or " + pointrelDocumentEnvelopeVersion);
    }
    
    var requestTimestamp = requestEnvelope.timestamp;
    if (requestTimestamp !== undefined) {
        if (requestTimestamp === true) {
            // Add server timestamp
            requestEnvelope.timestamp = getCurrentTimestamp();
        } else {
            // Check if using a future time and reject if so
            // TODO: allow perhaps for some configurable limited time drift like 10 seconds)
            var maximumAllowedTimestamp = calculateMaximumAllowedTimestamp();
            if (isTimestampInFuture(requestTimestamp, maximumAllowedTimestamp)) {
                return sendFailureMessage(response, 406, "Not acceptable: Please check you computer's clock; request timestamp of: " + requestTimestamp + " is further in the future than the currently maximum allowed timestamp of: " + maximumAllowedTimestamp);
            }
            var triples = requestEnvelope.triples;
            if (triples) {
                for (var i = 0; i < triples.length; i++) {
                    var triple = triples[i];
                    var tripleTimestamp = triple.timestamp;
                    if (tripleTimestamp && isTimestampInFuture(tripleTimestamp, maximumAllowedTimestamp)) {
                        return sendFailureMessage(response, 406, "Not acceptable: Please check you computer's clock; triple timestamp of: " + tripleTimestamp + " for triple[" + i + "] is further in the future than the currently maximum allowed timestamp of: " + maximumAllowedTimestamp);
                    }
                }
            }
        }
    }
      
    // TODO: Maybe add other things, like requester IP or user ID?
       
    // Pretty printing it even though wasteful -- easier for developer to look at
    var content = JSON.stringify(requestEnvelope, null, 2);
    var buffer = new Buffer(content, "utf8");
    
    var sha256 = calculateSHA256(buffer);
    var sha256AndLength = sha256 + "_" + buffer.length;
    
    console.log("sha256AndLength calculated for POST request", sha256AndLength);
    
    if (referenceIsIndexed(sha256AndLength)) {
        return sendFailureMessage(response, 409, "Conflict: The resource already exists on the server", {sha256AndLength: sha256AndLength});
    }
    
    console.log("==== POST: ", request.url, sha256AndLength);
    
    storeContentForReference(sha256AndLength, buffer, function(error) {
        // TODO: Maybe reject new resource if the ID already exists?

        if (error) {
            return sendFailureMessage(response, 500, "Server error: ' + error + '");
        }
        
        addToIndexes(request.body, sha256AndLength);
        
        return response.json({status: 'OK', message: 'Wrote content', sha256AndLength: sha256AndLength});
        
    });
}

function respondForIDList(request, response) {
    console.log("==== GET by id list", request.url);
    
    var idList = Object.keys(indexes.idToReferences);
    
    return response.json({status: 'OK', message: "List of IDs", idList: idList});
}

function respondForID(request, response) {
    var id = request.params.id;
    console.log("==== GET by id", request.url, id);
    
    var indexEntryList = referencesForID(id);
    
    // It the request ID is not available, return not found error
    if (!indexEntryList || indexEntryList.length === 0) {
        return sendFailureMessage(response, 404, "Not found");
    }
    
    // Return all the document versions
    return response.json({status: 'OK', message: "Index for ID", idRequested: id, indexEntries: indexEntryList});
}

function respondForTag(request, response) {
    var tag = request.params.tag;
    console.log("==== GET by tag", request.url, tag);
    
    var documentIDList = referencesForTag(tag);
    
    // It's not an error if there are no items for a tag -- just return an empty list
    if (!documentIDList) {
        documentIDList = [];
    }
    
    var documentEntriesList = [];
    
    for (var i = 0; i < documentIDList.length; i++) {
        var documentID = documentIDList[i];
        var documentEntryFromTripleStore = indexes.tripleStore.documents[documentID];
        var timestamp = documentEntryFromTripleStore.documentTimestamp;
        var sha256AndLength = documentEntryFromTripleStore.sha256AndLength;
         
        var documentEntry = {documentID: documentID, timestamp: timestamp, sha256AndLength: sha256AndLength};
        documentEntriesList.push(documentEntry);
    }
    
    // Return all the matching documents
    return response.json({status: 'OK', message: "Index for Tag", tagRequested: tag, documentEntries: documentEntriesList});
}

function respondForTriplesQueryPost(request, response) {    
    var query = request.body;

    var queryType = query.queryType;
    var a = query.a;
    var b = query.b;
    var c = query.c;
    
    console.log("==== POST respondForQueryPost", request.url, JSON.stringify([a, b, c, queryType]));
    
    var result = null;
    
    if (queryType === "findAllCForAB") {
        result = indexes.tripleStore.findAllCForAB(a, b);
    } else if (queryType === "findAllBForAC") {
        result = indexes.tripleStore.findAllBForAC(a, c);
    } else if (queryType === "findAllAForBC") {
        result = indexes.tripleStore.findAllAForBC(b, c);
    } else if (queryType === "findLatestCForAB") {
        result = indexes.tripleStore.findLatestCForAB(a, b);
    } else if (queryType === "findLatestBForAC") {
        result = indexes.tripleStore.findLatestBForAC(a, c);
    } else if (queryType === "findLatestAForBC") {
        result = indexes.tripleStore.findLatestAForBC(b, c);
    } else {
        return sendFailureMessage(response, 406, "Not acceptable: query type not supported: " + queryType);
        // return response.json({status: 'FAILED', message: "Unsupported query type", query: query});  
    }
    
    return response.json({status: 'OK', query: query, result: result});        
}

/* Other */

// Intended for module users
function storeAndIndexItem(item, callback) {
    if (item.__type !== signatureType) {
        // Error
        callback("Item is missing __type signatureType of " + signatureType);
    }
    
    var itemString = JSON.stringify(item);
    var sha256 = calculateSHA256(itemString);
    var sha256AndLength = sha256 + "_" + itemString.length;
    
    storeContentForReference(sha256AndLength, itemString, function(error) {
        if (error) {
            if (callback) callback(error);
            return;
        }
        
        addToIndexes(item, sha256AndLength);
        if (callback) callback();
    });
}

// Do indexing and set up default paths
function initialize(app, config) {
    if (config) {
        if (config.serverDataDirectory) {
            serverDataDirectory = config.serverDataDirectory;
            resourcesDirectory = serverDataDirectory + "resources/";
        }
        if (config.apiBaseURL) apiBaseURL = config.apiBaseURL;
    }
    reindexAllResources();

    app.use(bodyParser.json({
        limit: '10mb'
        // verify: bodyParserVerifyAddSHA256
    }));
    
    app.use(apiBaseURL + '/server/status', respondWithStatus);
    
    app.get(apiBaseURL + '/resources/:sha256AndLength', respondForResourceGet);
    app.post(apiBaseURL + '/resources', respondForResourcePost);
    app.get(apiBaseURL + '/indexes/id/', respondForIDList);
    app.get(apiBaseURL + '/indexes/id/:id(*)', respondForID);
    app.get(apiBaseURL + '/indexes/tag/:tag(*)', respondForTag);
    app.post(apiBaseURL + '/indexes/triples', respondForTriplesQueryPost);
}

exports.version = pointrelServerVersion;
exports.initialize = initialize;
exports.reindexAllResources = reindexAllResources;
exports.referenceIsIndexed = referenceIsIndexed;
exports.referencesForID = referencesForID;
exports.referencesForTag = referencesForTag;
exports.fetchContentForReference = fetchContentForReference;
exports.fetchContentForReferenceSync = fetchContentForReferenceSync;
exports.storeAndIndexItem = storeAndIndexItem;
