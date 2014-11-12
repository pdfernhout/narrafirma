// Test at: http://localhost:8080/pointrel/pointrel-app/
/*jslint node: true */
"use strict";

// TODO: Review error handling in terms of exceptions that could be throws from file-related Sync operations

// TODO: Mostly left in place the synchronized approach to file handling from PHP; need to revisit for nodejs performance

// Standard nodejs modules

var fs = require('fs');
var crypto = require('crypto');
var path = require('path');

// Configuration file from current directory
var pointrelConfigFromUser = require("./pointrelConfig");

// The modules below require npm installation

var md5 = require('MD5');
var mime = require("mime");
var uuid = require('node-uuid');
var fsExtra = require("fs-extra");
	
function cleanupRelativePath(base, relativePath) {
    if (startsWith(relativePath, "/")) return relativePath;
    var result = path.normalize(base + "/" + relativePath);
    if (!endsWith(result, "/")) result = result + "/";
    return result;
}

// pointrelConfig will get filled in from the config file or from defaults
var pointrelConfig = {};

function fixupConfigOptions() {
    
    // Set up defaults...
    pointrelConfig.baseDirectory = "../";

    // This prevents any changes to the repository, but it can still be read.
    // More fine-grained writing control options are below but this overrides them.
    pointrelConfig.pointrelRepositoryIsReadOnly = false;
    
    pointrelConfig.pointrelResourcesDirectory = "pointrel/pointrel-data/resources/";
    
    pointrelConfig.pointrelJournalsDirectory = "pointrel/pointrel-data/journals/";
    pointrelConfig.pointrelJournalsAllow = true;
    pointrelConfig.pointrelJournalsDeleteAllow = true;
    
    pointrelConfig.pointrelVariablesDirectory = "pointrel/pointrel-data/variables/";
    pointrelConfig.pointrelVariablesAllow = true;
    pointrelConfig.pointrelVariablesDeleteAllow = true;
    
    pointrelConfig.pointrelLogsDirectory = "pointrel/pointrel-data/logs/";
    
    pointrelConfig.pointrelPublishingDirectory = "pointrel/pointrel-www/";
    pointrelConfig.pointrelPublishingAllow = true;
    
    pointrelConfig.pointrelIndexesDirectory = "pointrel/pointrel-data/indexes/";
    pointrelConfig.pointrelIndexesMaintain = true;
    
    //Set to 0 to turn off, 2048 for probably a reasonable size (the content is base 64 encoded so takes somewhat more space)
    pointrelConfig.pointrelIndexesEmbedContentSizeLimitInBytes = 2048;
    
    // This can be a function to create custom indexings (not supported well for now, so don't use)
    pointrelConfig.pointrelIndexesCustomFunction = null;
    
    pointrelConfig.requireAuthentication = false;
    
    // Copy over values from config to overwrite defaults
    for (var key in pointrelConfigFromUser) {
        if (pointrelConfigFromUser.hasOwnProperty(key)) {
            pointrelConfig[key] = pointrelConfigFromUser[key];
        }
    }

    //Update config paths as needed to be relative to base
    pointrelConfig.baseDirectory = cleanupRelativePath(__dirname, pointrelConfig.baseDirectory);
    pointrelConfig.pointrelResourcesDirectory = cleanupRelativePath(pointrelConfig.baseDirectory, pointrelConfig.pointrelResourcesDirectory);
    pointrelConfig.pointrelJournalsDirectory = cleanupRelativePath(pointrelConfig.baseDirectory, pointrelConfig.pointrelJournalsDirectory);
    pointrelConfig.pointrelVariablesDirectory = cleanupRelativePath(pointrelConfig.baseDirectory, pointrelConfig.pointrelVariablesDirectory);
    pointrelConfig.pointrelLogsDirectory = cleanupRelativePath(pointrelConfig.baseDirectory, pointrelConfig.pointrelLogsDirectory);
    pointrelConfig.pointrelPublishingDirectory = cleanupRelativePath(pointrelConfig.baseDirectory, pointrelConfig.pointrelPublishingDirectory);
    pointrelConfig.pointrelIndexesDirectory = cleanupRelativePath(pointrelConfig.baseDirectory, pointrelConfig.pointrelIndexesDirectory);
    
    console.log("pointrelConfig", pointrelConfig);
}

//Constants

var MaximumVariableVersionBufferSize = 8192;
var NO_FAILURE_HEADER = false;
var SEND_FAILURE_HEADER = true;

//These four constants used to figure out where to put resources and variables
//The defaults here should support about a trillion resources and a billion variables
//If you change these after you have started using the system, previously stored resources and variables
//won't be found unless you move them into the new expected places somehow --
//unless you make other changes to look first in the old locations
var RESOURCE_STORAGE_LEVEL_COUNT = 4;
var RESOURCE_STORAGE_SEGMENT_LENGTH = 2;
var VARIABLE_STORAGE_LEVEL_COUNT = 3;
var VARIABLE_STORAGE_SEGMENT_LENGTH = 2;

//The short name of the main index of all resources added to the archive
var POINTREL_ALL_RESOURCES_INDEX_FILE_NAME = "__PointrelAllResources.pointrelIndex";
var POINTREL_ALL_INDEXES_INDEX_FILE_NAME = "__PointrelAllIndexes.pointrelIndex";
var POINTREL_ALL_JOURNALS_INDEX_FILE_NAME = "__PointrelAllJournals.pointrelIndex";
var POINTREL_ALL_VARIABLES_INDEX_FILE_NAME = "__PointrelAllVariables.pointrelIndex";

function exitWithJSONStatusMessage(response, message, sendFailureHeader, errorNumberForHeader) {
    if (sendFailureHeader === undefined) sendFailureHeader = NO_FAILURE_HEADER;
    if (errorNumberForHeader === undefined) errorNumberForHeader = 400;
    
    if (sendFailureHeader) response.writeHeader(errorNumberForHeader, message);
    var messageWithQuotesEscaped;
    try {
        messageWithQuotesEscaped = message.replace('"', '\\"');
    } catch(error) {
        console.log("error during exitWithJSONStatusMessage", error);
        messageWithQuotesEscaped = "Problem converting message to return it";
    }
    response.end('{"status": "FAIL", "message": "' + messageWithQuotesEscaped + '"}');
    return false;
}

// Returns true if should exit
function exitIfCGIRequestMethodIsNotPost(request, response) {
    if (request.method !== 'POST') {
        exitWithJSONStatusMessage(response, "Request to change data must be a POST", SEND_FAILURE_HEADER, 400);
        return true;
    }
    return false;
}

// Returns false if should exit
function validateFileExistsOrExit(response, fullFileName) {
    if (!fs.existsSync(fullFileName)) {
        // TODO: Can't replace with exitWithJSONStatusMessage because has extra value
        // header("HTTP/1.1 400 File does not exist: " + fullFileName);
        response.send('{"status": "FAIL", "message": "File does not exist: ' + fullFileName + '", "currentValue": null}');
        return false;
    }
    return true;
}

//TODO: add option to validate for SHA256 content
//Returns short name (after pointrel://) or returns false if an error and should exit
function validateURIOrExit(response, pointrelURI, sendHeader) {
    if (sendHeader === undefined) sendHeader = NO_FAILURE_HEADER;
    
    // TODO: Sanitize error messages as they repeat user input
    var pointrelAndRest = explode("//", pointrelURI, 2);
     
    if (pointrelAndRest[0] !== "pointrel:") {
        return exitWithJSONStatusMessage(response, "URI does not start with pointrel://", sendHeader, 406);
    }
     
    if (pointrelAndRest.length < 2) {
        return exitWithJSONStatusMessage(response, 'URI is malformed with missing "//"', sendHeader, 406);
    }
    
    if (pointrelAndRest.length > 2) {
        return exitWithJSONStatusMessage(response, 'URI is malformed with extra "//"', sendHeader, 406);
    }
     
    var shortName = pointrelAndRest[1];
     
    if (shortName.length === 0) {
        return exitWithJSONStatusMessage(response, 'URI is missing the section after pointrel://', sendHeader, 406);
    }

    // sha256_HEX_SIZE.extension
    var shaAndRest = explode("_", shortName, 3);

    if (shaAndRest[0] !== "sha256") {
        return exitWithJSONStatusMessage(response, "URI does not use sha256", sendHeader, 406);
    }

    var hexDigits = shaAndRest[1];

    if (hexDigits.length !== 64) {
        return exitWithJSONStatusMessage(response, "URI does have 64 sha256 characters", sendHeader, 406);
    }

    // TODO: Make sanitization stricter for extension; size and hexDigits are probably good enough as they are compared with actual values from the content
    if (shortName.indexOf("/") !== -1 || shortName.indexOf("'") !== -1 || shortName.indexOf('"') !== -1 || shortName.indexOf('\\') !== -1 || shortName.indexOf('..') !== -1) {
        return exitWithJSONStatusMessage(response, "Bad characters in URI", sendHeader, 406);
    }

    var lengthAndRest = explode(".", shaAndRest[2]);
    var lengthString = lengthAndRest[0];

    if (lengthString.length === 0) {
        return exitWithJSONStatusMessage(response, "URI does have a length field", sendHeader, 406);
    }

    var length = parseInt(lengthString, 10);

    if (length < 0) {
        return exitWithJSONStatusMessage(response, "URI has negative length field", sendHeader, 406);
    }

    // var dotPosition = shortName.indexOf('.');
    // if (dotPosition === -1) {
    //     extension = "_no_extension_";
    // } else {
    //     // TODO: escape extension
    //     extension = shortName.substring(dotPosition + 1));
    // }

    return {
        "pointrelURI": pointrelURI,
        "shortName": shortName,
        "hexDigits": hexDigits,
        // "extension": extension,
        "length": length
    };
}

function getCGIField(request, fieldName) {
    var result = "";
    if (request.method === "POST") {
        result = request.body[fieldName];
    } else {
        // Should be GET
        result = request.query[fieldName];
    }
    // console.log("getCGIField", request.method, fieldName, result);
    return result;
}

function getIPAddress(request) { 
    // http://stackoverflow.com/questions/8107856/how-can-i-get-the-users-ip-address-using-node-js
    var ip = request.headers['x-forwarded-for'] || 
        request.connection.remoteAddress || 
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress;
    return ip;
}

// Other support

//Returns the path where this file would go
function calculateStoragePath(baseDirectory, hexDigits, levelCount, segmentLength, createSubdirectories) {
    // console.log("calculateStoragePath", baseDirectory, hexDigits, levelCount, segmentLength, createSubdirectories);
  var fullPath = baseDirectory;
  for (var level = 0; level < levelCount; level++) {
      var startOfSegment = level * segmentLength;
      var segment = hexDigits.substring(startOfSegment, startOfSegment + segmentLength);
      fullPath = fullPath + segment + "/";
      if (createSubdirectories) fsExtra.ensureDirSync(fullPath);
  }

  // console.log("calculated path:", fullPath);
  return fullPath;
}

function currentTimeStamp() {
    return new Date().toISOString();
}

// String functions

function startsWith(haystack, needle) {
    return haystack.lastIndexOf(needle, 0) === 0;
}

function endsWith(haystack, needle) {
    return haystack.indexOf(needle, haystack.length - needle.length) !== -1;
}

function explode(separator, source, limit)
{
  var result = source.split(separator);
  if (limit) {
      var extra = result.splice(limit - 1);
      result.push(extra.join(separator));
  }
  return result;
}

// trim functions from: http://www.somacon.com/p355.php
function trim(stringToTrim) {
    return stringToTrim.replace(/^\s+|\s+$/g,"");
}

function ltrim(stringToTrim) {
    return stringToTrim.replace(/^\s+/,"");
}

function rtrim(stringToTrim) {
    return stringToTrim.replace(/\s+$/,"");
}

// From: http://stackoverflow.com/questions/2668854/sanitizing-strings-to-make-them-url-and-filename-safe
// but changed to change dots to underscores
function sanitizeFileName(fileName) {
    return fileName.replace(/\s/g, "_").replace(/\.[\.]+/g, "_").replace(/[^\w_\.\-]/g, "_");
}

function is_string(something) {
    return (typeof something == 'string' || something instanceof String);
}

// File functions

function createFile(response, fullFileName, contents) {
    try {
        fs.writeFileSync(fullFileName, contents);
    } catch(err) {
        console.log("error creating file", fullFileName, err, new Error().stack);
        return exitWithJSONStatusMessage(response, "Could not create or write to file: '" + fullFileName + '"', NO_FAILURE_HEADER, 500);
    }
    return true;
}

function appendDataToFile(response, fullFileName, dataToAppend) {
	// console.log("appendDataToFile", fullFileName, dataToAppend);
	if (dataToAppend === undefined) {
		return exitWithJSONStatusMessage(response, "Could not append undefined data to file: '" + fullFileName + '"', NO_FAILURE_HEADER, 500);
	}
    try {
        fs.appendFileSync(fullFileName, dataToAppend);
    } catch(err) {
        console.log("error appending to file", fullFileName, err, new Error().stack);
        return exitWithJSONStatusMessage(response, "Could not append to file: '" + fullFileName + '"', NO_FAILURE_HEADER, 500);
    }
    // console.log("successful appending");
    return true;    
}

function error_log(response, message) {
    console.log("log", message);
    // Calculate today's log file name
    var today = new Date().toISOString().substring(0, 10);
    var fullLogFileName = pointrelConfig.pointrelLogsDirectory + today + ".log";
    if (!fs.existsSync(fullLogFileName)) {
        return createFile(response, fullLogFileName, message);
    } else {
        return appendDataToFile(response, fullLogFileName, message);
    }
}

function getFileExtension(fileName) {
    return path.extname(fileName);
}

function generateRandomUUID(prefix) {
    return prefix + uuid.v4();
}

////// Indexing support

// There could be concurrency issues in between the time a check for existency is done for a file and when it is modified?
// Index entries have a newline at the start as well as at the end to make it easier to recover from partial writes of an index entry
// If there is only one newline, then most likely the previous line is incomplete
// TODO: Instead of userID, should have an array of receiving steps like in email headers, to track how data gets pushed into system across distributed network

// "All" indexes are for all resources, all indexes, all journals, and all variables
// TODO: Add support for recording when a journal or variable is deleted

function makeTrace(timestamp, userID) {
    return '[{"timestamp":"' + timestamp + '","userID":' + JSON.stringify(userID) + '}]';
}

function addIndexEntryToAllIndexesIndex(response, allIndexShortFileName, indexName, randomUUID) {
	// console.log("addIndexEntryToAllIndexesIndex");
    var fullAllIndexFileName = pointrelConfig.pointrelIndexesDirectory + allIndexShortFileName;

    if (!createIndexFileIfMissing(response, fullAllIndexFileName, allIndexShortFileName, false)) return false;
    
    // Create special index entry for the allIndexes index
    var jsonForIndex = "\n" + '{"operation":"add","name":' + JSON.strinify(indexName) + ',"versionUUID":"' + randomUUID + '"}' + "\n";
    return appendDataToFile(response, fullAllIndexFileName, jsonForIndex);
}

function createIndexFileIfMissing(response, fullIndexFileName, indexName, addToAllIndexesIndex) {
	// console.log("createIndexFileIfMissing");
    if (!fs.existsSync(fullIndexFileName)) {
        var randomUUID = generateRandomUUID('pointrelIndex:');
        var jsonForIndex = '{"indexFormat":"index","indexName":' + JSON.stringify(indexName) + ',"versionUUID":"' + randomUUID + '"}';
        var firstLineHeader = jsonForIndex + "\n";
        if (addToAllIndexesIndex) addIndexEntryToAllIndexesIndex(response, POINTREL_ALL_INDEXES_INDEX_FILE_NAME, indexName, randomUUID);
        return createFile(response, fullIndexFileName, firstLineHeader);
    }
    return true;
}

function addResourceIndexEntryToIndex(response, fullIndexFileName, resourceURI, trace, encodedContent) {
	// console.log("addResourceIndexEntryToIndex");
    var resourceContentIfEmbedding;
    if (is_string(encodedContent) && encodedContent.length < pointrelConfig.pointrelIndexesEmbedContentSizeLimitInBytes) {
        resourceContentIfEmbedding = ',"xContent":"' + encodedContent + '"';
    } else {
        resourceContentIfEmbedding = "";
    }
    var jsonForIndex = "\n" + '{"operation":"add","name":"' + resourceURI + '","trace":' + trace + resourceContentIfEmbedding + '}' + "\n";
    return appendDataToFile(response, fullIndexFileName, jsonForIndex);    
}

function createResourceIndexEntry(response, indexName, resourceURI, trace, encodedContent) {
	// console.log("createResourceIndexEntry");
    var shortFileNameForIndexName = sanitizeFileName(indexName);
    
    var hexDigits = md5(shortFileNameForIndexName);
    var createSubdirectories = true;
    var storagePath = calculateStoragePath(pointrelConfig.pointrelIndexesDirectory, hexDigits, VARIABLE_STORAGE_LEVEL_COUNT, VARIABLE_STORAGE_SEGMENT_LENGTH, createSubdirectories);
    var fullIndexFileName = storagePath + "index_" + hexDigits + "_" + shortFileNameForIndexName + '.pointrelIndex';
    
    if (!createIndexFileIfMissing(response, fullIndexFileName, indexName, true)) return false;
    return addResourceIndexEntryToIndex(response, fullIndexFileName, resourceURI, trace, encodedContent);
}

function addNewJournalToIndexes(response, journalName, header, timestamp, userID) {
	// console.log("addNewJournalToIndexes");
    if (pointrelConfig.pointrelIndexesMaintain !== true) {
        return true;
    }
    
    var shortFileNameForAllIndex = POINTREL_ALL_JOURNALS_INDEX_FILE_NAME;
    var fullAllIndexFileName = pointrelConfig.pointrelIndexesDirectory + shortFileNameForAllIndex;
    
    // This trace would get more complex for items received from other servers (similar to email received: headers)
    var trace = makeTrace(timestamp, userID);
    
    // TODO: Ideally should just do this once when install, not every time we add a journal
    if (!createIndexFileIfMissing(response, fullAllIndexFileName, shortFileNameForAllIndex, false)) return false;
    
    var jsonForIndex = "\n" + '{"operation":"add","name":' + JSON.stringify(journalName) + ',"header":' + JSON.stringify(header) + ',"trace":' + trace + '}' + "\n";
    return appendDataToFile(response, fullAllIndexFileName, jsonForIndex);
}

function removeJournalFromIndexes(response, journalName, header, timestamp, userID) {
	// console.log("removeJournalFromIndexes");
    if (pointrelConfig.pointrelIndexesMaintain !== true) {
        return true;
    }
    
    var shortFileNameForAllIndex = POINTREL_ALL_JOURNALS_INDEX_FILE_NAME;
    var fullAllIndexFileName = pointrelConfig.pointrelIndexesDirectory + shortFileNameForAllIndex;
    
    // This trace would get more complex for items received from other servers (similar to email received: headers)
    var trace = makeTrace(timestamp, userID);
    
    // TODO: Ideally should just do this once when install, not every time we add a journal
    if (!createIndexFileIfMissing(response, fullAllIndexFileName, shortFileNameForAllIndex, false)) return false;
    
    var jsonForIndex = "\n" + '{"operation":"remove","name":' + JSON.stringify(journalName) + ',"header":' + JSON.stringify(header) + ',"trace":' + trace + '}' + "\n";
    return appendDataToFile(response, fullAllIndexFileName, jsonForIndex);
}

function addNewVariableToIndexes(response, variableName, timestamp, userID) {
	// console.log("addNewVariableToIndexes");
    if (pointrelConfig.pointrelIndexesMaintain !== true) {
        return true;
    }
    
    var shortFileNameForAllIndex = POINTREL_ALL_VARIABLES_INDEX_FILE_NAME;
    var fullAllIndexFileName = pointrelConfig.pointrelIndexesDirectory + shortFileNameForAllIndex;
    
    // This trace would get more complex for items received from other servers (similar to email received: headers)
    var trace = makeTrace(timestamp, userID);
    
    // TODO: Ideally should just do this once when install, not every time we add a variable
    if (!createIndexFileIfMissing(response, fullAllIndexFileName, shortFileNameForAllIndex, false)) return false;
    
    var jsonForIndex = "\n" + '{"operation":"add","name":' + JSON.stringify(variableName) + ',"trace":' + trace + '}' + "\n";
    return appendDataToFile(response, fullAllIndexFileName, jsonForIndex);
}
    
function removeVariableFromIndexes(response, variableName, timestamp, userID) {
	// console.log("removeVariableFromIndexes");
    if (pointrelConfig.pointrelIndexesMaintain !== true) {
        return true;
    }
    
    var shortFileNameForAllIndex = POINTREL_ALL_VARIABLES_INDEX_FILE_NAME;
    var fullAllIndexFileName = pointrelConfig.pointrelIndexesDirectory + shortFileNameForAllIndex;
    
    // This trace would get more complex for items received from other servers (similar to email received: headers)
    var trace = makeTrace(timestamp, userID);
    
    // TODO: Ideally should just do this once when install, not every time we add a variable
    if (!createIndexFileIfMissing(response, fullAllIndexFileName, shortFileNameForAllIndex, false)) return false;
    
    var jsonForIndex = "\n" + '{"operation":"remove","name":' + JSON.stringify(variableName) + ',"trace":' + trace + '}' + "\n";
    return appendDataToFile(response, fullAllIndexFileName, jsonForIndex);
}

function addResourceToIndexes(response, resourceURI, timestamp, userID, content, encodedContent) {
	// console.log("addResourceToIndexes");
    if (pointrelConfig.pointrelIndexesMaintain !== true) {
        return true;
    }
    
    var shortFileNameForAllIndex = POINTREL_ALL_RESOURCES_INDEX_FILE_NAME;
    var fullAllIndexFileName = pointrelConfig.pointrelIndexesDirectory + shortFileNameForAllIndex;
    
    // This trace would get more complex for items received from other servers (similar to email received: headers)
    var trace = makeTrace(timestamp, userID);
    
    // TODO: Ideally should just do this once when install, not every time we add a resource
    if (!createIndexFileIfMissing(response, fullAllIndexFileName, shortFileNameForAllIndex, false)) return false;
    
    // TODO: Implement recovery plan if fails while writing, like keeping resource in temp directory until finished indexing
    if (!addResourceIndexEntryToIndex(response, fullAllIndexFileName, resourceURI, trace, encodedContent)) return false;
    
    // TODO: What kind of files to index? All JSON? Seem wasteful of CPU time and will strain memory.
    // So, only doing ones with ".pce.json", which are in effect "pieces" of a larger hyperdocument.
    // PCE could also be seen to stand for "Pointrel Content Engine".
    if (endsWith(resourceURI, ".pce.json")) {
        // echo "indexable; trying to decode json\n";
        // Do indexing
        var json = JSON.parse(content);
        // Error if array: echo "decoded into: 'json'\n";
        // echo "content: 'content'\n";
        if (json) {
            if (typeof json === "object") {
                // echo "trying to index\n";
                var indexing = json._pointrelIndexing;
                // echo "the array is: indexing";
                if (indexing && indexing instanceof Array) {
                    for (var i = 0; i < indexing.length; i++) {
                        var indexString = indexing[i];
                        // echo "Index on: indexString/n";
                        // Create index entry for item
                        if (!createResourceIndexEntry(response, indexString, resourceURI, trace, encodedContent)) return false;
                    }
                } else {
                    // echo "No indexes\n";
                }
            } else {
                // json_printable = print_r(json, true);
                // echo "not array 'json_printable'\n";
            }
        }
    }
    // echo "Done indexing";

    if (pointrelConfig.pointrelIndexesCustomFunction !== null) {
        pointrelConfig.pointrelIndexesCustomFunction(resourceURI, timestamp, userID, content);
    }
    
    return true;
}


function getJournalFileSizeAndHeader(fullJournalFileName) {
    var fd = null;
    try {
        fd = fs.openSync(fullJournalFileName, "r");
        // console.log("getJournalFileSizeAndHeader fd", fd);
        var stats = fs.fstatSync(fd);
        var size = stats.size;
        var buffer = new Buffer(1024);
        var bytesToRead = 1024;
        if (size < bytesToRead) bytesToRead = size;
        var bytesRead = 0;
        if (bytesToRead > 0) {
            bytesRead = fs.readSync(fd, buffer, 0, bytesToRead, 0);
        }
        fs.closeSync(fd);
        var data = buffer.toString("utf8", 0, bytesRead);
        var segments = data.split("\n");
        var firstLine = segments[0];
        // console.log("firstLine", firstLine);
        var firstLineHeader = rtrim(firstLine);
        return {size: size, firstLineHeader: firstLineHeader};
    } catch (err) {
        console.log("getJournalFileSizeAndHeader error", err, new Error().stack);
        // if (fd) fs.closeSync(fd);
        return false;
    }
}

function getJournalFileSegment(fullJournalFileName, start, length, encoding) {
	if (!encoding) encoding = "base64";
	// console.log("getJournalFileSegment start/length", start, length);
    var fd = null;
    try {
        if (start < 0) return "";
        if (length === "END") {
            var stats = fs.statSync(fullJournalFileName);
            length = stats.size - start;
        }
        if (length <= 0) return "";
        // Limit length if too long; TODO: Improve so caller knows it failed?
        if (length > 10000000) {
            console.log("getJournalFileSegment length is too long", length);
            length = 1024 * 1024;
        }
        fd = fs.openSync(fullJournalFileName, "r");
        // console.log("getJournalFileSegment fd", fd);
        var buffer = new Buffer(length);
        var bytesToRead = length;
        // if (size < bytesToRead) bytesToRead = size;
        var bytesRead = 0;
        if (bytesToRead > 0) {
            bytesRead = fs.readSync(fd, buffer, 0, bytesToRead, start);
        }
        fs.closeSync(fd);
        var data = buffer.toString(encoding, 0, bytesRead);
        return data;
    } catch (err) {
        console.log("getJournalFileSegment error", err, new Error().stack);
        // if (fd) fs.closeSync(fd);
        return false;
    }
}

//Handling CGI requests

function journalStore(request, response) {
	// console.log("journalStore", request.url);
    // Not locking file as this server is single threaded; might be an issue on multiple-core machines...
    // Support creating an append-only journal under a specific name;
    // the journal ideally should be mergable with other journals of the same name on other systems

    // TODO: Should escape all user input returned as errors with htmlspecialchars or something else
    // TODO: Ensure new line translation so it is always the same regardless of platform encoding

    // PHP uses advisory locking on many platforms, so this locking may only be adequate if the file  is only accessed by this script
    // There could be concurrency issues in between the time a check for existency is done for a file and when it is modified?

    // the userID making the request
    var userID = getCGIField(request, 'userID');

    // the name of the journal
    var journalName = getCGIField(request, 'journalName');

    // Operations and operands: 
    //   exists -- see if journal exists
    //   create -- make the journal
    //   delete userSuppliedHeader userSuppliedSize -- remove the journal, verifying header and size
    //   info -- returns data from the first line of the journal (which has a uuid) and the journal's size
    //   get start length -- retrieves a number of bytes starting from start and ending at start + length - 1
    //   put hash size type path data -- adds data to the journal, verifying the hash
    var operation = getCGIField(request, 'operation');

    // can be journal, index, or all
    var journalType = getCGIField(request, 'journalType');
    if (!journalType) journalType = "journal";
    
    var remoteAddress = getIPAddress(request);
    var logTimeStamp = currentTimeStamp();

    // Ideas for later use; need to add to log
    // var session = getCGIField(request, 'session');
    // var authentication = getCGIField(request, 'authentication');

    // Log what was requested
    var couldWriteLog = error_log(response, '{"timeStamp": "' + logTimeStamp + '", "remoteAddress": "' + remoteAddress + '", "request": "journal-store", journalName": "' + journalName + '", "operation": "' + operation + '", "userID": "' + userID + '"}' + "\n");
    if (!couldWriteLog) return false;
    
    if (pointrelConfig.pointrelRepositoryIsReadOnly && operations[operation] === 2) {
        return exitWithJSONStatusMessage(response, "Writing is not currently allowed", NO_FAILURE_HEADER, 400);
    }

    if (pointrelConfig.pointrelJournalsAllow !== true && journalType === "journal") {
        return exitWithJSONStatusMessage(response, "Journals not allowed", SEND_FAILURE_HEADER, 400);
    }

    // Validate the input, returning error messages if there is something lacking

    if (!userID) {
        return exitWithJSONStatusMessage(response, "No userID was specified", NO_FAILURE_HEADER, 400);
    }

    if (!journalName) {
        return exitWithJSONStatusMessage(response, "No journalName was specified", NO_FAILURE_HEADER, 400);
    }

    if (journalName.length > 100) {
        return exitWithJSONStatusMessage(response, "Journal name is too long (maximum 100 characters)", NO_FAILURE_HEADER, 400);
    }

    if (operation === null) {
        return exitWithJSONStatusMessage(response, "No operation was specified", NO_FAILURE_HEADER, 400);
    }

    var operations = {"exists": 1, "create": 2, "delete": 2, "info": 1, "get": 1, "put": 2};
    if (!(operation in operations)) {
        return exitWithJSONStatusMessage(response, "Unsupported operation: 'operation'", NO_FAILURE_HEADER, 400);
    }
    
    if (pointrelConfig.pointrelRepositoryIsReadOnly && operations[operation] === 2) {
        return exitWithJSONStatusMessage(response, "Writing is not currently allowed", NO_FAILURE_HEADER, 400);
    }

    var journalTypes = {"journal": 1, "index": 1, "allResources": 1, "allIndexes": 1, "allJournals": 1, "allVariables": 1};
    if (!(journalType in journalTypes)) {
        return exitWithJSONStatusMessage(response, "Unsupported journalType: 'journalType'", NO_FAILURE_HEADER, 400);
    }

    // Determine the file name to go with the journal

    var shortFileNameForJournalName = sanitizeFileName(journalName);

    var fullJournalFileName;
    
    if (journalType === "allResources") {
        fullJournalFileName = pointrelConfig.pointrelIndexesDirectory + POINTREL_ALL_RESOURCES_INDEX_FILE_NAME;
    } else if (journalType === "allIndexes") {
        fullJournalFileName = pointrelConfig.pointrelIndexesDirectory + POINTREL_ALL_INDEXES_INDEX_FILE_NAME;
    } else if (journalType === "allJournals") {
        fullJournalFileName = pointrelConfig.pointrelIndexesDirectory + POINTREL_ALL_JOURNALS_INDEX_FILE_NAME;
    } else if (journalType === "allVariables") {
        fullJournalFileName = pointrelConfig.pointrelIndexesDirectory + POINTREL_ALL_VARIABLES_INDEX_FILE_NAME;
    } else {
        var baseDirectory;
        if (journalType === "index") {
            baseDirectory = pointrelConfig.pointrelIndexesDirectory;
        } else {
            baseDirectory = pointrelConfig.pointrelJournalsDirectory;
        }
        var hexDigits = md5(shortFileNameForJournalName);
        
        var createSubdirectories = (operation === "create" && journalType !== "index");
        if (createSubdirectories) {
            if (exitIfCGIRequestMethodIsNotPost(request, response)) return false;
        }
        
        var storagePath = calculateStoragePath(baseDirectory, hexDigits, VARIABLE_STORAGE_LEVEL_COUNT, VARIABLE_STORAGE_SEGMENT_LENGTH, createSubdirectories);
        if (journalType === "index") {
            fullJournalFileName = storagePath + "index_" + hexDigits + "_" + shortFileNameForJournalName + '.pointrelIndex';
        } else {
            fullJournalFileName = storagePath + "journal_" + hexDigits + "_" + shortFileNameForJournalName + '.pointrelJournal';
        }   
    }

    var journalFileInfo;
    var jsonToReturn = '"ERROR"';

    // operation: exists

    if (operation === "exists") {
        if (fs.existsSync(fullJournalFileName)) {
            // TODO: Can't replace this one because it has OK
            return response.send('{"status": "OK", "exists": true, "message": "Journal file exists: ' + shortFileNameForJournalName + '"}');
        } else {
            return response.send('{"status": "OK", "exists": false, "message": "Journal file does not exist: ' + shortFileNameForJournalName + '"}');
        }
        // return exitWithJSONStatusMessage(response, "Journal file does not exist: '" + shortFileNameForJournalName + "'", NO_FAILURE_HEADER, 0);
    }

    // operation: create
    // Creates the journal, with the first entry being a JSON object that has a unique ID for this journal instance

    if (operation === "create") {
        if (exitIfCGIRequestMethodIsNotPost(request, response)) return false;
        
        if (journalType !== "journal") {
            return exitWithJSONStatusMessage(response, "Only journalType of journal can be created", NO_FAILURE_HEADER, 400);
        }
        
        if (fs.existsSync(fullJournalFileName)) {
            return exitWithJSONStatusMessage(response, "Journal file already exists: '" + fullJournalFileName + "'", NO_FAILURE_HEADER, 400);
        }
        
        var journalFormat = getCGIField(request, 'journalFormat');
        
        if (!journalFormat) {
            return exitWithJSONStatusMessage(response, "No journalFormat was specified", NO_FAILURE_HEADER, 400);
        }
        
        // TODO: Should also put journalName in somehow
        var randomUUID = generateRandomUUID('pointrelJournalInstance:');
        // TODO: Maybe should use journalName passed in, but with replacement for any double quotes in it? Same for journalFormat?
        var jsonForJournal = '{"journalFormat":"' + journalFormat + '","journalName":' + JSON.stringify(journalName) + ',"versionUUID":"' + randomUUID + '"}';
        var firstLineHeader = jsonForJournal + "\n";

        if (!addNewJournalToIndexes(response, journalName, jsonForJournal, logTimeStamp, userID)) return false;
        if (!createFile(response, fullJournalFileName, firstLineHeader)) return false;
        // Return a nested json object instead of a string
        jsonToReturn = rtrim(firstLineHeader);
    }
    
    // operation: delete userSuppliedHeader userSuppliedSize

    if (operation === "delete") {
        if (exitIfCGIRequestMethodIsNotPost(request, response)) return false;
        
        if (pointrelConfig.pointrelJournalsDeleteAllow !== true) {
            return exitWithJSONStatusMessage(response, "Journals delete not allowed", SEND_FAILURE_HEADER, 400);
        }
        
        if (journalType !== "journal") {
            return exitWithJSONStatusMessage(response, "Only journalType of journal can be deleted", NO_FAILURE_HEADER, 400);
        }
        
        if (!validateFileExistsOrExit(response, fullJournalFileName)) return false;
        
        // Check that header info and size are correct; header must be in canonical form as supplied
        var userSuppliedHeader = getCGIField(request, 'userSuppliedHeader');
        
        if (!userSuppliedHeader) {
            return exitWithJSONStatusMessage(response, "No userSuppliedHeader was specified", NO_FAILURE_HEADER, 400);
        }
        
        var userSuppliedSize = getCGIField(request, 'userSuppliedSize');
        
        if (userSuppliedSize === "") {
            return exitWithJSONStatusMessage(response, "No userSuppliedSize was specified", NO_FAILURE_HEADER, 400);
        }
        
        journalFileInfo = getJournalFileSizeAndHeader(fullJournalFileName);
        if (journalFileInfo === false) {
            return exitWithJSONStatusMessage(response, "Could not read the journal file for info: '" + fullJournalFileName + "'", NO_FAILURE_HEADER, 500);  
        }
        
        if (journalFileInfo.size != userSuppliedSize) {
            return exitWithJSONStatusMessage(response, "Current journal size: size was not as supplied: " + userSuppliedSize, NO_FAILURE_HEADER, 409);
        }
        if (journalFileInfo.firstLineHeader != userSuppliedHeader) {
            return exitWithJSONStatusMessage(response, "Current journal header: firstLineHeader was not as supplied: '" + userSuppliedHeader + "'", NO_FAILURE_HEADER, 409);
        }
        
        try {
            fs.unlinkSync(fullJournalFileName);
        } catch (err) {
            console.log("file unlink error", err);
            return exitWithJSONStatusMessage(response, "Journal file could not be removed for some reason", SEND_FAILURE_HEADER, 400);
        }
        
        if (!removeJournalFromIndexes(response, journalName, userSuppliedHeader, logTimeStamp, userID)) return false;
    }

    // operation: info

    if (operation === "info") {
        if (!validateFileExistsOrExit(response, fullJournalFileName)) return false;
        journalFileInfo = getJournalFileSizeAndHeader(fullJournalFileName);
        if (journalFileInfo === false) {
            return exitWithJSONStatusMessage(response, "Could not read the journal file for info: '" + fullJournalFileName + "'", NO_FAILURE_HEADER, 500);  
        }
        // console.log("journalFileInfo", journalFileInfo);
        // Returning the header as a string, both so it can be used for deletes and also because if the file is corrupt, it might not be valid json
        var firstLineHeaderWithReplacedQuotes = JSON.stringify(journalFileInfo.firstLineHeader); // journalFileInfo.firstLineHeader.replace('"', '\\"');
        jsonToReturn = '{"header": ' + firstLineHeaderWithReplacedQuotes + ', "size": ' + journalFileInfo.size + "}";
    }

    // operation: get
    // This may return JSON if there is an error; otherwise it returns the byte data in that section of file

    if (operation === "get") {
        if (!validateFileExistsOrExit(response, fullJournalFileName)) return false;
        
        var start = getCGIField(request, 'start');
        
        if (start === '') {
            return exitWithJSONStatusMessage(response, "No start was specified", NO_FAILURE_HEADER, 400);
        }
        
        start = parseInt(start, 10);
        
        var length = getCGIField(request, 'length');
        
        if (!length) {
            return exitWithJSONStatusMessage(response, "No length was specified", NO_FAILURE_HEADER, 400);
        }
        
        if (length !== "END") length = parseInt(length, 10);
        
        // Need to return arbitrary length content in body instead of JSON status result
        // TODO: Just doing it as a single read to a string, which should be improved such as done 
        // in previous pointrel version as readfile at end or instead with buffering similar to::
        // http://stackoverflow.com/questions/1395656/is-there-a-good-implementation-of-partial-file-downloading-in-php
        // http://www.coneural.org/florian/papers/04_byteserving.php
        var contentsPartialEncoded = getJournalFileSegment(fullJournalFileName, start, length, "base64");
        // console.log("contentsPartial: ***", contentsPartial, "***");
        if (contentsPartialEncoded === false) {
            // jsonToReturn = '"FAILED"';
            return exitWithJSONStatusMessage(response, "Could not read the journal file for get: '" + fullJournalFileName + "'", NO_FAILURE_HEADER, 500);
        } else {
            jsonToReturn = '"' + contentsPartialEncoded + '"';
            // If wanted to write it out without encoding:
            // header("Content-type: application/octet-stream");
            // echo contentsPartial;
            // exit();
        }
    }

    // operation: put

    if (operation === "put") {
        // console.log("journal put");
        if (exitIfCGIRequestMethodIsNotPost(request, response)) return false;
        
        if (journalType !== "journal") {
            return exitWithJSONStatusMessage(response, "Only journalType of journal can be appended", NO_FAILURE_HEADER, 400);
        }
        
        if (!validateFileExistsOrExit(response, fullJournalFileName)) return false;
        
        var encodedContent = getCGIField(request, 'encodedContent');
        if (!encodedContent) {
            return exitWithJSONStatusMessage(response, "No encodedContent was specified", NO_FAILURE_HEADER, 400);
        }   
        
        var content = new Buffer(encodedContent, "base64");
        // console.log("content", content);
        
        // TODO: Could check that it is valid JSON content
        if (!appendDataToFile(response, fullJournalFileName, content)) return false;
        
        // console.log("appended data", fullJournalFileName);
        
        jsonToReturn = '"ADDED"';
    }

    // response.setHeader("Content-type", "application/json; charset=UTF-8");
    response.setHeader("Content-type", "application/json");
    response.send('{"status": "OK", "message": "Successful operation: ' + operation + '", "journalName": "' + journalName + '", "journalType": "' + journalType + '", "result": ' + jsonToReturn + '}');
    return true;
}

function resourceAdd(request, response) {
    var resourceURI = getCGIField(request, 'resourceURI');
    var encodedContent = getCGIField(request, 'resourceContent');
    var userID = getCGIField(request, 'userID');

    // For later use
    var session = getCGIField(request, 'session');
    // var authentication = getCGIField(request, 'authentication');

    var remoteAddress = getIPAddress(request);
    var logTimeStamp = currentTimeStamp();
    var couldWriteLog = error_log(response, '{"timeStamp": "' + logTimeStamp + '", "remoteAddress": "' + remoteAddress + '", "request": "resource-add", "resourceURI": "' + resourceURI + '", "userID": "' + userID + '", "session": "' + session + '"}' + "\n");
    if (!couldWriteLog) return false;

    if (exitIfCGIRequestMethodIsNotPost(request, response)) return false;

    if (!resourceURI) {
      return exitWithJSONStatusMessage(response, "No resourceURI was specified", SEND_FAILURE_HEADER, 400);
    }

    if (encodedContent === null) {
      return exitWithJSONStatusMessage(response, "No resourceContent was specified", SEND_FAILURE_HEADER, 400);
    }

    if (!userID) {
      return exitWithJSONStatusMessage(response, "No userID was specified", SEND_FAILURE_HEADER, 400);
    }
    
    if (pointrelConfig.pointrelRepositoryIsReadOnly) {
        return exitWithJSONStatusMessage(response, "Writing is not currently allowed", NO_FAILURE_HEADER, 400);
    }

    var urlInfo = validateURIOrExit(response, resourceURI, NO_FAILURE_HEADER);
    if (urlInfo === false) return false;
    var shortName = urlInfo.shortName;
    var hexDigits = urlInfo.hexDigits;
    var uriSpecifiedLength = urlInfo.length;
    
    // console.log("resourceAdd encodedContent:", encodedContent.length, encodedContent);

    // TODO -- confirm the content is converted correctly and then hashed correctly
    var content = new Buffer(encodedContent, "base64");
    var contentLength = content.length;
    
    // console.log("resourceAdd decodedContent:", content.length, content);
    
    var contentSHA256Actual = crypto.createHash("sha256").update(content).digest("hex");
    // console.log("contentSHA256Supplied", hexDigits);
    // console.log("contentSHA256Actual", contentSHA256Actual);

    if (uriSpecifiedLength !== contentLength) {
        // for debugging -- send back content
        // return exitWithJSONStatusMessage(response, "Lengths do not agree from URI: uriSpecifiedLength and from content: contentLength with content: 'content''", NO_FAILURE_HEADER, 0);
        return exitWithJSONStatusMessage(response, "Lengths do not agree from URI: " + uriSpecifiedLength + " and from content: " + contentLength, NO_FAILURE_HEADER, 0);
    }

    if (hexDigits !== contentSHA256Actual) {
        return exitWithJSONStatusMessage(response, "SHA256 values do not agree from URI: " + hexDigits + " and computed from content: " + contentSHA256Actual, NO_FAILURE_HEADER, 0);
    }

    // TODO: Validate shortName is OK for files

    var createSubdirectories = true;
    var storagePath = calculateStoragePath(pointrelConfig.pointrelResourcesDirectory, hexDigits, RESOURCE_STORAGE_LEVEL_COUNT, RESOURCE_STORAGE_SEGMENT_LENGTH, createSubdirectories);
    var fullName = storagePath + shortName;

    if (fs.existsSync(fullName)) {
      return exitWithJSONStatusMessage(response, 'File already exists: "' + fullName + '"', NO_FAILURE_HEADER, 0);
    }

    // TODO; Is it good enough to create indexes before writing file, with the implication it is OK if an index entry can't be found or is corrupt?
    addResourceToIndexes(response, "pointrel://" + shortName, logTimeStamp, userID, content, encodedContent);

    if (!createFile(response, fullName, content)) return false;

    // ??? header("Content-type: text/json; charset=UTF-8");
    response.send('{"status": "OK", "message": "Wrote ' + fullName + '"}');
}

function resourceGet(request, response) {
    // Example: http://localhost/~pdf/pointrel-app/resource-get.php?userID=anonymous&resourceURI=pointrel://sha256_a2ca24b424919216bdf441301d65fd83215562891a2bd2195984313a26f04029_12466.txt&contentType=text/plain&charset=UTF-8

    var resourceURI = getCGIField(request, 'resourceURI');
    var userID = getCGIField(request, 'userID');
    var contentType = getCGIField(request, 'contentType');
    var charset = getCGIField(request, 'charset');
    var attachmentName = getCGIField(request, 'attachmentName');

    // For later use
    var session = getCGIField(request, 'session');
    // var authentication = getCGIField(request, 'authentication');

    var remoteAddress = getIPAddress(request);

    var couldWriteLog = error_log(response, '{"timeStamp": "' + currentTimeStamp() + '", "remoteAddress": "' + remoteAddress + '", "request": "resource-get", "resourceURI": "' + resourceURI + '", "userID": "' + userID + '", "session": "' + session + '"}' + "\n");
    if (!couldWriteLog) return false;
    
    if (!resourceURI) {
        return exitWithJSONStatusMessage(response, "No resourceURI was specified", SEND_FAILURE_HEADER, 400);
    }

    if (!userID) {
        return exitWithJSONStatusMessage(response, "No userID was specified", SEND_FAILURE_HEADER, 400);
    }

    var urlInfo = validateURIOrExit(response, resourceURI, SEND_FAILURE_HEADER);
    if (urlInfo === false) return false;
    
    var shortName = urlInfo.shortName;
    var hexDigits = urlInfo.hexDigits;

    var createSubdirectories = false;
    var storagePath = calculateStoragePath(pointrelConfig.pointrelResourcesDirectory, hexDigits, RESOURCE_STORAGE_LEVEL_COUNT, RESOURCE_STORAGE_SEGMENT_LENGTH, createSubdirectories);
    var fullName = storagePath + shortName;

    if (!fs.existsSync(fullName)) {
        return exitWithJSONStatusMessage(response, 'File does not exist: "' + fullName + '"', SEND_FAILURE_HEADER, 404);
    }

    // TODO: mime_content_type has been deprecated for later versions of PHP -- check and use replacement?
    if (!contentType) contentType = mime.lookup(fullName);
    if (!contentType) contentType = "text/plain";
    if (!charset) charset = "utf-8";

    response.setHeader("Content-type", contentType + "; charset=" + charset);
    if (attachmentName) response.setHeader("Content-Disposition", 'attachment; filename="' + attachmentName + '"');
    // console.log("about to sendFile", fullName);
    response.sendFile(fullName);
    return true;
}

function resourcePublish(request, response) {
    // Publish a resource to the static part of the website

    var resourceURI = getCGIField(request, 'resourceURI');
    var destinationURL = getCGIField(request, 'destinationURL');
    var userID = getCGIField(request, 'userID');

    // For later use
    var session = getCGIField(request, 'session');
    // var authentication = getCGIField(request, 'authentication');

    var remoteAddress = getIPAddress(request);

    var couldWriteLog = error_log(response, '{"timeStamp": "' + currentTimeStamp() + '", "remoteAddress": "' + remoteAddress + '", "request": "resource-publish", "resourceURI": "' + resourceURI + '", "destinationURL": "' + destinationURL + '", "userID": "' + userID + '", "session": "' + session + '"}' + "\n");
    if (!couldWriteLog) return false;
    
    if (exitIfCGIRequestMethodIsNotPost(request, response)) return false;

    if (pointrelConfig.pointrelPublishingAllow !== true) {
        return exitWithJSONStatusMessage(response, "Publishing not allowed", SEND_FAILURE_HEADER, 400);
    }

    if (!resourceURI) {
        return exitWithJSONStatusMessage(response, "No resourceURI was specified", SEND_FAILURE_HEADER, 400);
    }

    if (!destinationURL) {
        return exitWithJSONStatusMessage(response, "No destinationURL was specified", SEND_FAILURE_HEADER, 400);
    }

    if (destinationURL.indexOf("../") !== -1) {
        return exitWithJSONStatusMessage(response, "Destination URL may not have ../ in it", SEND_FAILURE_HEADER, 400);
    }

    if (!userID) {
        return exitWithJSONStatusMessage(response, "No userID was specified", SEND_FAILURE_HEADER, 400);
    }
    
    if (pointrelConfig.pointrelRepositoryIsReadOnly) {
        return exitWithJSONStatusMessage(response, "Writing is not currently allowed", NO_FAILURE_HEADER, 400);
    }

    var urlInfo = validateURIOrExit(response, resourceURI, SEND_FAILURE_HEADER);
    if (urlInfo === false) return false;
    var shortName = urlInfo.shortName;
    var hexDigits = urlInfo.hexDigits;

    var createSubdirectories = false;
    var storagePath = calculateStoragePath(pointrelConfig.pointrelResourcesDirectory, hexDigits, RESOURCE_STORAGE_LEVEL_COUNT, RESOURCE_STORAGE_SEGMENT_LENGTH, createSubdirectories);
    var fullName = storagePath + shortName;

    if (!fs.existsSync(fullName)) {
        return exitWithJSONStatusMessage(response, 'File does not exist: "' + fullName + '"', SEND_FAILURE_HEADER, 404);
    }

    var extension = getFileExtension(shortName);

    var destinationFileName = pointrelConfig.pointrelPublishingDirectory + destinationURL;

    if (!endsWith(destinationFileName, extension)) {
        return exitWithJSONStatusMessage(response, 'File "' + destinationFileName + '" does not end with the same extension "' + extension + '" as the resource: "' + shortName + '"', NO_FAILURE_HEADER, 404);
    }

    // Inspired by: http://stackoverflow.com/questions/1911382/sanitize-file-path-in-php
    // using call to expandPath to deal with relative paths
    var baseDir = path.resolve(pointrelConfig.pointrelPublishingDirectory);
    var desiredPath = path.resolve(destinationFileName);

    if (desiredPath.indexOf(baseDir) !== 0) {
        return exitWithJSONStatusMessage(response, 'File has an invalid path: "' + desiredPath + '"', NO_FAILURE_HEADER, 404);
    }

    // Overwritting .htaccess and .htpasswd should not be possible if these files are owned by root or a another webserver owner, but adding this as extra check

    // Disable overwriting the .htaccess file
    if (endsWith(desiredPath, ".htaccess")) {
        return exitWithJSONStatusMessage(response, 'File has an invalid path (2): "' + desiredPath + '"', NO_FAILURE_HEADER, 404);
    }

    // Disable overwriting the .htpasswd file
    if (endsWith(desiredPath, ".htpasswd")) {
        return exitWithJSONStatusMessage(response, 'File has an invalid path (3): "' + desiredPath + '"', NO_FAILURE_HEADER, 404);
    }

    if (!desiredPath) {
        return exitWithJSONStatusMessage(response, "The desiredPath 'desiredPath' is empty for destinationFileName 'destinationFileName' with baseDir 'baseDir'", NO_FAILURE_HEADER, 400);
    }

    var targetDirectory = path.dirname(desiredPath);

    // ensure intermediate directories exist
    try {
        fsExtra.ensureDirSync(targetDirectory, "0777");
    } catch (err) {
        response.send('{"status": "FAILED", "message": "Could not create directories needed for "' + desiredPath + '"}');
    }

    try {
        fsExtra.copySync(fullName, desiredPath);
    } catch (err) {
        response.send('{"status": "FAILED", "message": "Could not copy ' + fullName + ' to: ' + desiredPath + '"}');
    }

    // ??? header("Content-type: text/json; charset=UTF-8");
    response.send('{"status": "OK", "message": "Copied ' + fullName + ' to: ' + desiredPath + '"}');
}

function successfulVariableOperation(response, operation, variableName, variableValueAfterOperation) {
    // ??? header("Content-type: text/json; charset=UTF-8");
    response.send('{"status": "OK", "message": "Successful operation: ' + operation + '", "variable": "' + variableName + '", "currentValue": "' + variableValueAfterOperation + '"}');
    return true;
}

function writeVariableToNewFile(response, fullVariableFileName, newValue) {
    try {
        fs.writeFileSync(fullVariableFileName, newValue, "utf8");
    } catch(err) {
        return exitWithJSONStatusMessage(response, "Could not create variable file: '" + fullVariableFileName + '"', NO_FAILURE_HEADER, 500);
    }
    return true;
}

function variableQuery(request, response) {
    // console.log("variableQuery", request.url, request.body);

    var variableName = getCGIField(request, 'variableName');
    var operation = getCGIField(request, 'operation');
    var createIfMissing = getCGIField(request, 'createIfMissing');
    var newValue = getCGIField(request, 'newValue');
    var currentValue = getCGIField(request, 'currentValue');
    var userID = getCGIField(request, 'userID');

    // For later use
    var session = getCGIField(request, 'session');
    // var authentication = getCGIField(request, 'authentication');

    // Default createIfMissing to true unless explicitly set to false
    if (createIfMissing === "f" || createIfMissing === "false" || createIfMissing === "F" || createIfMissing === "FALSE") {
        createIfMissing = false;
    } else {
        createIfMissing = true;
    }
    
    var remoteAddress = getIPAddress(request);
    var logTimeStamp = currentTimeStamp();
    var couldWriteLog = error_log(response, '{"timeStamp": "' + logTimeStamp + '", "remoteAddress": "' + remoteAddress + '", "request": "variable-change", "variableName": "' + variableName + '", "operation": "' + operation + '", "newValue": "' + newValue + '", "currentValue": "' + currentValue + '", "userID": "' + userID + '", "session": "' + session + '"}' + "\n");
    if (!couldWriteLog) return false;
    
    if (pointrelConfig.pointrelVariablesAllow !== true) {
        return exitWithJSONStatusMessage(response, "Variables not allowed", SEND_FAILURE_HEADER, 400);
    }

    if (operation === null) {
        return exitWithJSONStatusMessage(response, "No operation was specified", NO_FAILURE_HEADER, 400);
    }

    var operations = {"exists": 1, "new": 2, "delete": 2, "get": 1, "set": 2, "query": 1};
    if (!(operation in operations)) {
        return exitWithJSONStatusMessage(response, "Unsupported operation: '" + operation + "'", NO_FAILURE_HEADER, 400);
    }
    
    if (pointrelConfig.pointrelRepositoryIsReadOnly && operations[operation] === 2) {
        return exitWithJSONStatusMessage(response, "Writing is not currently allowed", NO_FAILURE_HEADER, 400);
    }

    if (!userID) {
        return exitWithJSONStatusMessage(response, "No userID was specified", NO_FAILURE_HEADER, 400);
    }

    if (!variableName) {
        return exitWithJSONStatusMessage(response, "No variableName was specified", NO_FAILURE_HEADER, 400);
    }

    if (variableName.length > 100) {
        return exitWithJSONStatusMessage(response, "Variable name is too long (maximum 100 characters)", NO_FAILURE_HEADER, 400);
    }
    
    var shortFileNameForVariableName = sanitizeFileName(variableName);

    var hexDigits = md5(shortFileNameForVariableName);

    var createSubdirectories = (operation === "new") || (operation === "set" && currentValue === "");
    if (createSubdirectories) {
        if (exitIfCGIRequestMethodIsNotPost(request, response)) return false;
    }

    var storagePath = calculateStoragePath(pointrelConfig.pointrelVariablesDirectory, hexDigits, VARIABLE_STORAGE_LEVEL_COUNT, VARIABLE_STORAGE_SEGMENT_LENGTH, createSubdirectories);

    var fullVariableFileName = storagePath + "variable_" + hexDigits + "_" + shortFileNameForVariableName + '.txt';
    var variableValueAfterOperation = "ERROR";
    var contents = "";
    
    if (operation === "exists") {
        if (fs.existsSync(fullVariableFileName)) {
            // TODO: Can't replace this one because it has OK
            return response.send('{"status": "OK", "message": "Variable file exists: ' + fullVariableFileName + '"}');
        }
        return exitWithJSONStatusMessage(response, "Variable file does not exist: '" + fullVariableFileName + "'", NO_FAILURE_HEADER, 0);
    } else if (operation === "new") {
        if (exitIfCGIRequestMethodIsNotPost(request, response)) return false;
        
        if (fs.existsSync(fullVariableFileName)) {
            return exitWithJSONStatusMessage(response, "Variable file already exists: '" + fullVariableFileName + "'", NO_FAILURE_HEADER, 400);
        }
        if (!validateURIOrExit(response, newValue, NO_FAILURE_HEADER)) return false;

        addNewVariableToIndexes(response, variableName, logTimeStamp, userID);
        if (!writeVariableToNewFile(response, fullVariableFileName, newValue)) return false;
        variableValueAfterOperation = newValue;
        return successfulVariableOperation(response, operation, variableName, variableValueAfterOperation);
    } else if (operation === "delete") {
        // Code here is more reliable than PHP since we know the entire server is running in a single thread here and so can't be interrupted...
        // So do not need to write "DELETE" to file before removing
          if (exitIfCGIRequestMethodIsNotPost(request, response)) return false;
        
        if (pointrelConfig.pointrelVariablesDeleteAllow !== true) {
            return exitWithJSONStatusMessage(response, "Variables delete not allowed", SEND_FAILURE_HEADER, 400);
        }
        
        if (!validateFileExistsOrExit(response, fullVariableFileName)) return false;
        if (!validateURIOrExit(response, currentValue, NO_FAILURE_HEADER)) return false;
        
        try {
            contents = fs.readFileSync(fullVariableFileName, "utf8");
        } catch (err) {
            console.log("file read error", err);
            return exitWithJSONStatusMessage(response, "Variables file could not be opened to confirm value", SEND_FAILURE_HEADER, 400);
        }

        if (contents !== currentValue) {
            return exitWithJSONStatusMessage(response, "Variable value was changed by another user to (1): " + contents, NO_FAILURE_HEADER, 409);
        }
        try {
            fs.unlinkSync(fullVariableFileName);
        } catch (err) {
            console.log("file unlink error", err);
            return exitWithJSONStatusMessage(response, "Variables file could not be removed for some reason", SEND_FAILURE_HEADER, 400);
        }            
        // TODO: Perhaps should return JSON null, not a string?
        variableValueAfterOperation = "DELETED";
        removeVariableFromIndexes(response, variableName, logTimeStamp, userID);
        return successfulVariableOperation(response, operation, variableName, variableValueAfterOperation);
    } else if (operation === "set") {
        if (exitIfCGIRequestMethodIsNotPost(request, response)) return false;
        
        if (currentValue !== "" && !validateURIOrExit(response, currentValue, NO_FAILURE_HEADER)) return false;
        if (newValue !== "" && !validateURIOrExit(response, newValue, NO_FAILURE_HEADER)) return false;
        if (!fs.existsSync(fullVariableFileName)) {
            // Maybe create the file if it does not exists
            if (createIfMissing === false) {
                // TODO: Can't replace this as it has extra fields beyond message
                return response.send('{"status": "FAIL", "message": "Variable file does not exist and createIfMissing is false: ' + fullVariableFileName + '", "createIfMissing": "' + createIfMissing + '", "currentValue": "' + currentValue + '"}');
            } else if (currentValue !== "") {
                // TODO: Can't replace this as it has extra fields beyond message
                return response.send('{"status": "FAIL", "message": "Variable file does not exist and currentValue is not empty: ' + fullVariableFileName + '", "createIfMissing": "' + createIfMissing + '", "currentValue": "' + currentValue + '"}');
            } else {
                // TODO: Window of vulnerability where another user could create the file???
                // Not vulnerable under NodeJS if just one process -- but what if more processes?
                addNewVariableToIndexes(response, variableName, logTimeStamp, userID);
                if (!writeVariableToNewFile(response, fullVariableFileName, newValue)) return false;
                variableValueAfterOperation = newValue;
            }
        } else {
            try {
                contents = fs.readFileSync(fullVariableFileName, "utf8");
            } catch (err) {
                console.log("file read error", err);
                return response.send('{"status": "FAIL", "message": "Could not open file for updating: ' + fullVariableFileName + '"}');
            }
            if (contents !== currentValue) {
                // header("HTTP/1.1 409 Variable value was changed by another user to: " + contents);
                return response.send('{"status": "FAIL", "message": "Variable value was changed by another user to (2): ' + contents + '", "currentValue": "' + contents + '"}');
            }
            if (!writeVariableToNewFile(response, fullVariableFileName, newValue)) return false;
            variableValueAfterOperation = newValue;
        }
        return successfulVariableOperation(response, operation, variableName, variableValueAfterOperation);
    } else if (operation === "get") {
        if (!validateFileExistsOrExit(response, fullVariableFileName)) {
            return false;
        }
        fs.readFile(fullVariableFileName, "utf8", function (err, data) {
            if (err) {
                return exitWithJSONStatusMessage(response, "Could not read variable file: " + fullVariableFileName, SEND_FAILURE_HEADER, 500);
            }
            variableValueAfterOperation = data;
            // console.log("variableValueAfterOperation", variableValueAfterOperation);
            return successfulVariableOperation(response, operation, variableName, variableValueAfterOperation);
        });
        // TODO: Add support for queries to reduce back-and-forth traffic, like to follow previousVersion or retrieve contents of value
        // If a value is a pointrel resource URI ending in ".json", it would be read in if more fields of it are wanted
        // Example: "value value.contents previousVersion.contents previousVersion.previousVersion previousVersion.previousVersion.contents
    } else if (operation === "query") {
        // TODO
        return exitWithJSONStatusMessage(response, "unfinished query", SEND_FAILURE_HEADER, 500);
    } else {
        return exitWithJSONStatusMessage(response, "Unsupported operation: '" + operation + "'", NO_FAILURE_HEADER, 400);
    }
    return false;
}

// Main code

console.log("Pointrel20130202Server module for nodejs loaded: " + Date());

console.log("__dirname", __dirname);

fixupConfigOptions();

exports.journalStore = journalStore;
exports.resourceAdd = resourceAdd;
exports.resourceGet = resourceGet;
exports.resourcePublish = resourcePublish;
exports.variableQuery = variableQuery;
exports.pointrelConfig = pointrelConfig; 
