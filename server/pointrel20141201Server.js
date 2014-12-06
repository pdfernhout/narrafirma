/*jslint node: true */
"use strict";

// Simplified version of Pointrel system (building on Pointrel20130202)
// Stores JSON resources in files
// Keeps indexes for them in memory
// indexes created from parsing all resources at startup
// Trying to avoid maintaining log files which could get corrupted
// Also making this module usable directly from server code in nodejs

// TODO: use nested directories so can support lots of files better

var version = "pointrel20141201-0.0.2";
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

/* Indexing */

var indexes = {
     // Maps whether an item was added to the indexes (use to quickly tell if it exists)
     referenceToIsIndexed: {},   
        
     // Maps id to sha256AndLength, array (but should ideally only be one)
     idToReferences: {},

     // Maps tags to sha256AndLength, array
     tagToReferences: {},

     // Maps contentType to sha256AndLength, array
     contentTypeToReferences: {}       
};

function referenceIsIndexed(reference) {
    return indexes.referenceToIsIndexed[reference] === true;
}

function referencesForID(id) {
    return indexes.idToReferences[id];
}

function referencesForTag(tag) {
    return indexes.tagToReferences[tag];
}

function referencesForContentType(contentType) {
    return indexes.contentTypeToReferences[contentType];
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
    var tags = body.tags;
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
    if (body.tags) indexEntry.tags = body.tags;
    if (body.contentType) indexEntry.contentType = body.contentType;
    if (body.author) indexEntry.author = body.author;
    if (body.committer) indexEntry.committer = body.committer;
    if (body.timestamp) indexEntry.timestamp = body.timestamp;
    
    if (id) {
        if (referencesForID(id)) {
            console.log("ERROR: duplicate reference to ID in %s and %s", indexes.idToReferences[id], sha256AndLength);
        }
        addToIndex("id", indexes.idToReferences, "" + id, indexEntry);
    }
    if (tags) {
        for (var tagKey in tags) {
            var tag = tags[tagKey];
            addToIndex("tags", indexes.tagToReferences, "" + tag, indexEntry);
        }
    }
    if (contentType) {
        addToIndex("contentType", indexes.contentTypeToReferences, "" + contentType, indexEntry);
    }
    
    return true;
}

function reindexAllResources() {
    console.log("reindexAllResources");
    indexes.referenceToIsIndexed = {};
    indexes.idToReferences = {};
    indexes.tagToReferences = {};
    indexes.contentTypeToReferences = {};
    
    reindexAllResourcesInDirectory(resourcesDirectory);
    
    var resourceCount = 0;
    for (var key in indexes.referenceToIsIndexed) resourceCount++;
    console.log("Indexed %s resources", resourceCount);
    
    // console.log("id index", indexes.idToReferences);
    // console.log("tag index", indexes.tagToReferences);
    // console.log("contentType index", indexes.contentTypeToReferences);
}

function reindexAllResourcesInDirectory(directory) {
    // console.log("reindexAllResourcesInDirectory", directory);
    
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
                addToIndexes(resourceObject, fileName.substring(0, fileName.length-4));
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

//For JSON body parser to preserve original content send via POST
function bodyParserVerifyAddSHA256(request, result, buffer, encoding) {
    
    request.sha256 = calculateSHA256(buffer);
    // console.log("hash", request.sha256);
 
    request.rawBodyBuffer = buffer;
    // console.log("rawBodyBuffer", request.rawBodyBuffer);
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

/* Responding to requests */

function respondWithStatus(request, response) {
    response.json({status: 'OK', version: version});
}

function respondForResourceGet(request, response) {
    // Sanitizes resource ID to prevent reading arbitrary files
    var sha256AndLength = sanitizeFileName(request.params.sha256AndLength);
    
    console.log("==== GET by sha256AndLength", request.url);
    returnResource(sha256AndLength, response);
}

function respondForResourcePost(request, response) {
    // console.log("POST", request.url, request.body);
    
    if (referenceIsIndexed(request.params.sha256AndLength)) {
        return sendFailureMessage(response, 409, "Conflict: The resource already exists on the server", {sha256AndLength: request.params.sha256AndLength});
    }
                       
    var sha256 = request.sha256;
    // console.log("sha256:", sha256);
    
    if (!request.rawBodyBuffer) {
        return sendFailureMessage(response, 406, "Not acceptable: post is missing JSON Content-Type body");
    }
    
    if (request.body.__type !== signatureType) {
        return sendFailureMessage(response, 406, "Not acceptable: post is missing __type signatureType of " + signatureType);
    }

    var length = request.rawBodyBuffer.length;
    
    // Probably should validate content as utf8 and valid JSON and so on...
    
    var sha256AndLength = sha256 + "_" + length;
    console.log("==== POST: ", request.url, sha256AndLength);
    
    if (sha256AndLength !== request.params.sha256AndLength) {
        return sendFailureMessage(response, 406, "Not acceptable: sha256AndLength of content does not match that of request url");
    }
    
    storeContentForReference(sha256AndLength, request.rawBodyBuffer, function(error) {
        // TODO: Maybe reject new resource if the ID already exists?

        if (error) {
            return sendFailureMessage(response, 500, "Server error: ' + error + '");
        }
        
        addToIndexes(request.body, sha256AndLength);
        
        return response.json({status: 'OK', message: 'Wrote content', sha256AndLength: sha256AndLength});
        
    });
}

function respondForID(request, response) {
    console.log("==== GET by id", request.url);
    
    var id = request.params.id;
    
    var indexEntryList = referencesForID(id);
    
    // It the request ID is not available, return not found error
    if (!indexEntryList || indexEntryList.length === 0) {
        return sendFailureMessage(response, 404, "Not found");
    }
    
    // Return the first -- should signal error if more than one?
    return response.json({status: 'OK', message: "Index for ID", idRequested: id, indexEntries: indexEntryList});
}

function respondForTag(request, response) {
    console.log("==== GET by tag", request.url);
    
    var tag = request.params.tag;
    
    var indexEntryList = referencesForTag(tag);
    
    // It's not an error if there are no items for a tag -- just return an empty list
    if (!indexEntryList) {
        indexEntryList = [];
    }
    
    // Return the first -- should signal error if more than one?
    return response.json({status: 'OK', message: "Index for Tag", tagRequested: tag, indexEntries: indexEntryList});
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
        verify: bodyParserVerifyAddSHA256
    }));
    
    app.use(apiBaseURL + '/status', respondWithStatus);
    
    app.get(apiBaseURL + '/resources/:sha256AndLength', respondForResourceGet);
    app.post(apiBaseURL + '/resources/:sha256AndLength', respondForResourcePost);
    app.get(apiBaseURL + '/indexes/id/:id', respondForID);
    app.get(apiBaseURL + '/indexes/tag/:tag', respondForTag);
}

exports.version = version;
exports.initialize = initialize;
exports.reindexAllResources = reindexAllResources;
exports.referenceIsIndexed = referenceIsIndexed;
exports.referencesForID = referencesForID;
exports.referencesForTag = referencesForTag;
exports.referencesForContentType = referencesForContentType;
exports.fetchContentForReference = fetchContentForReference;
exports.fetchContentForReferenceSync = fetchContentForReferenceSync;
exports.storeAndIndexItem = storeAndIndexItem;
