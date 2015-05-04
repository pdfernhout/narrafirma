/*jslint node: true */
"use strict";

// TODO: Fix %s log messages that no longer work

/* "The only reason for time is so that everything doesn't happen at once. (Albert Einstein)" */

/* From Design & Memory: Computer Programming in the 20th Century" by Peter H. Huyck &  Nellie W. Kremenak:
 * 1. Language is a part of nature.
 * 2. Languge may be hosted in digital storage.
 * 3. Programming is supposed to make digital storage useful.
 */

// Even more simplified version of Pointrel system (building on Pointrel20130202)

// Stores JSON data items (representing messages) in files
// The JSON files have a __trace field that is an array of email-like headers describing the provenance of the data item

// Trying to avoid maintaining log files which could get corrupted
// Also making this module usable directly from server code in nodejs

// TODO: Use internet time service somehow to check if server time looks close enough to OK when startup
// TODO: Should documents use 128-bit NTP timestamps based on NTP epoch?
// TODO: Think more about different types of timestamp: contributed when, authored when, about event when, primary source when, other?

var pointrelServerVersion = "pointrel20150417-0.0.3";
var messageFileSuffix = ".pce";

var apiBaseURL = '/api/pointrel20150417';
var serverDataDirectory = "../server-data/";
var journalsDirectory = serverDataDirectory + "journals/";

// The constant maximumTimeDriftAllowed_ms is the maximum time drift allowed for messages to be in the future to allow for slightly different clocks
// The more frequently records are written to the server, the smaller this value should be
var maximumTimeDriftAllowed_ms = 10000;

// Standard nodejs modules
var fs = require('fs');

// Our modules
var utility = require('./pointrel20150417Utility');
var log = utility.log;
var makeSuccessResponse = utility.makeSuccessResponse;
var makeFailureResponse = utility.makeFailureResponse;

//--- Journals
// TODO: Protect agains __proto__ and so on (was StringMap, might do differently)
var journals = {};
var serverName = "server";

function setServerName(name) {
    serverName = name;
}

function makeJournal(journalIdentifier, journalDirectory) {
    var journal = {
        journalIdentifier: journalIdentifier,
        journalDirectory: journalDirectory,
        sha256AndLengthToReceivedRecordMap: [],
        topicSHA256ToTopicMap: {}
    };
    resetIndexesForJournal(journal);
    return journal;
}

// TODO: This is a kludge for testing right now -- no validation
function addJournalSync(journalIdentifier) {
   log("----- addJournalSync", journalIdentifier, "--------------------------------------------------");
   var sanitizedFileName = utility.sanitizeFileName(journalIdentifier);
   if (journalIdentifier !== sanitizedFileName) {
       throw new Error("addJournalSync: journalIdentifier contains unacceptable characters like leading periods or slashes");
   }
   
   if (journalIdentifier.length > 63) {
       // TODO: Arbitrary limit for now. What should it be?
       throw new Error("addJournalSync: journalIdentifier is more than 63 characters long");
   }
   
   
   var journalDirectory = journalsDirectory + journalIdentifier + "/";

   if (!fs.existsSync(journalDirectory)){
       fs.mkdirSync(journalDirectory);
       log("Made directory: " + journalDirectory);
   }
 
   var journal = makeJournal(journalIdentifier, journalDirectory);
   journals[JSON.stringify(journalIdentifier)] = journal;
   
   // console.log("journals", journals);
}

//--- Indexing

function isSHA256AndLengthIndexed(journal, sha256AndLength) {
    // console.log("isSHA256AndLengthIndexed", sha256AndLength, journal);
    return !!journal.sha256AndLengthToReceivedRecordMap[sha256AndLength];
}

function resetIndexesForJournal(journal) {
    // This array is sorted by received timestamp
    // TODO: Replace with Node.js Binary Search Tree like https://github.com/louischatriot/node-binary-search-tree
    journal.allMessagesSortedByReceivedTimestamp = [];
}

// TODO: Fix so loads all journals after determining identifiers from storage?
function indexAllJournals() {
    log("indexAllJournals", journals);
    
    // TODO: Load journals from disk
    for (var key in journals) {
        var journal = journals[key];
        log("indexing journal", journal.journalIdentifier);
        resetIndexesForJournal(journal);
        
        indexAllMessagesInDirectory(journal, journal.journalDirectory);
        
        var messageCount = 0;
        for (var messageKey in journal.sha256AndLengthToReceivedRecordMap) messageCount++;
        log("journalIdentifier:", journal.journalIdentifier, "indexed message count:", messageCount);
    }

    // console.log("messageIdentifier index", indexes.messageIdentifierToReferences);
    log("Done with indexAllJournals");
}

// The power of deleting code that is not currently used to reduce clutter? Knowing it is rewriteable again or findable in other versions?

// TODO: Maybe wasteful to store full file name if it can be calculated
function ingestMessage(journal, receivedTimestamp, sha256AndLength, fullFileName, topicSHA256, topicTimestamp) {
    if (!topicSHA256) topicSHA256 = null;
    if (!topicTimestamp) topicTimestamp = null;
    
    var receivedRecord = {
        sha256AndLength: sha256AndLength,
        receivedTimestamp: receivedTimestamp,
        topicSHA256: topicSHA256,
        topicTimestamp: topicTimestamp,
        fullFileName: fullFileName,
        loadingSequence : journal.allMessagesSortedByReceivedTimestamp.length + 1
    };
    
    // console.log("ingestMessage", receivedRecord);
    
    utility.addItemToSortedArray(journal.allMessagesSortedByReceivedTimestamp, receivedRecord, utility.compareReceivedRecords);
    journal.sha256AndLengthToReceivedRecordMap[sha256AndLength] = receivedRecord;
    
    // Only index topics if data was supplied
    if (topicSHA256) {
        // Issue in that the older items could be inserted in the list before others, and querying next would miss them...
        // So, need to keep them sorted by ingestion timestamp -- however, to find the "latest", all must be considered
        var topic = journal.topicSHA256ToTopicMap[topicSHA256];
        if (!topic) {
            topic = {
                topicSHA256: topicSHA256,
                receivedRecords: [],
                latestReceivedRecordByTopicTimestamp: null
            };
            journal.topicSHA256ToTopicMap[topicSHA256] = topic;
        }
        utility.addItemToSortedArray(topic.receivedRecords, receivedRecord, utility.compareReceivedRecords);
        if (topic.latestReceivedRecordByTopicTimestamp === null) {
            topic.latestReceivedRecordByTopicTimestamp = receivedRecord;
        } else {
            if (utility.compareReceivedRecordsByTopicTimestamp(topic.latestReceivedRecordByTopicTimestamp, receivedRecord) > 0) {
                topic.latestReceivedRecordByTopicTimestamp = receivedRecord;
            }
        }
    }
}

function indexAllMessagesInDirectory(journal, directory) {
    // TODO: If files are added while reindexing is going on and reindexing takes a long time, the new files could be reject as later than this maximum
    // log("indexAllMessagesInDirectory", directory);
    var maximumAllowedTimestamp = utility.calculateMaximumAllowedTimestamp(maximumTimeDriftAllowed_ms);
    
    var fileNames;
    try {
        fileNames = fs.readdirSync(directory);
    } catch(error) {
        log("Problem reading directory %s error: %s", directory, error);
    }
    // log("fileNames", fileNames);
    // Determine the sha256AndLength and received timestamp from the filenames so we don't have to read the file contents (yet)
    for (var fileNameIndex = 0; fileNameIndex < fileNames.length; fileNameIndex++) {
        var fileName = fileNames[fileNameIndex];
        if (utility.endsWith(fileName, messageFileSuffix)) {
            // log("Indexing: ", fileName);
            var fileNameWithoutExtension = fileName.slice(0, -4);
            var segments = fileNameWithoutExtension.split("_");
            if (segments.length !== 4 && segments.length !== 7) {
                console.log("problem parsing timestamp and sha256AndLength from file name: " + fileName);
                continue;
            }
            
            // Reconstruct ISO timestamp using parts in fileName
            var receivedTimestamp = segments[0] + "T" + segments[1].replace(/-/g, ":");
            
            // Reconstruct sha256AndLength using parts in fileName
            var sha256AndLength = segments[2] + "_" + segments[3];
            
            var topicSHA256;
            var topicTimestamp;
            
            if (segments.length === 7) {
                // Reconstruct topic SHA using parts in fileName
                topicSHA256 = segments[4];
                
                // Reconstruct ISO timestamp using parts in fileName
                topicTimestamp = segments[5] + "T" + segments[6].replace(/-/g, ":");
            }

            // TODO: More sanity checks on timestamp and length, as well as topic information
            
            // Reject items with a future timestamp -- this should never happen unless the server clock is in error
            if (utility.isTimestampInFuture(receivedTimestamp, maximumAllowedTimestamp)) {
                log("ERROR: Item not indexed: " + fileName + " because message received timestamp of: " + receivedTimestamp + " is later than the currently maximumAllowedTimestamp of: " + maximumAllowedTimestamp); 
                log("This probably means the server clock is incorrect now or was incorrect in the past when the message was received.");
                log("You might need to remove the file and reingest it to be able to load it depending on the reason for the time error.");
                continue;
            }
            
            // TODO: Reject future timestamps for topics as well?

            if (isSHA256AndLengthIndexed(journal, sha256AndLength)) {
                log("indexAllMessagesInDirectory: Not indexing as same sha256AndLength already indexed", directory, fileName, sha256AndLength, journal.sha256AndLengthToReceivedRecordMap[sha256AndLength]);
                continue;
            }
            
            var fullFileName = directory + fileName;
            
            // TODO: No validation possible for timestamps and actual sha256AndLength or other envelope information if not reading files on startup?
            ingestMessage(journal, receivedTimestamp, sha256AndLength, fullFileName, topicSHA256, topicTimestamp);
        }
    }
}

//---  Status request

function respondForReportStatusRequest(callback) {
    callback(makeSuccessResponse(200, "Success", {status: 'OK', version: pointrelServerVersion, currentUniqueTimestamp: utility.getCurrentUniqueTimestamp()}));
}


//--- Loading and storing messages on disk

function respondForLoadMessageRequest(requesterIPAddress, journal, sha256AndLength, callback) {
    if (!isSHA256AndLengthIndexed(journal, sha256AndLength)) {
        return callback(makeFailureResponse(404, "No message indexed for sha256AndLength", {sha256AndLength: sha256AndLength}));
    }
    
    var receivedRecord = journal.sha256AndLengthToReceivedRecordMap[sha256AndLength];
    if (!receivedRecord) {
        return callback(makeFailureResponse(404, "No message file found for sha256AndLength", {sha256AndLength: sha256AndLength}));        
    }
    // console.log("respondForLoadMessage", receivedRecord);
    var fullFileName = receivedRecord.fullFileName;
    fs.readFile(fullFileName, "utf8", function (error, data) {
        if (error) {
            // TODO: Should check what sort of error and respond accordingly
            return callback(makeFailureResponse(500, "Server error", {detail: 'Problem reading JSON from file', sha256AndLength: sha256AndLength, error: error}));
         }
        
        var parsedJSON;
        // TODO: Assumes file not too big to handle
        try {
            // console.log("about to parse data", data);
            parsedJSON = JSON.parse(data);
            // TODO: Could remove any sensitive "__pointrel_" information if needed...
        } catch (exception) {
            console.log("exception during JSON parsing", exception);
            return callback(makeFailureResponse(500, "Server error", {detail: 'Problem parsing JSON from file', sha256AndLength: sha256AndLength, error: exception}));
        }
        
        // TODO: More thinking about the meaning of a trace???
        // TODO: Add more info about who requested this information
        // TODO: Maybe add other things, like requester IP or user identifier?
        var sentTimestamp = utility.getCurrentUniqueTimestamp();
        var traceEntry = {
            sentByJournalIdentifier: journal.journalIdentifier,
            sentByServer: serverName,
            // TODO: How to best identify from where or from whom this is requested from???
            requesterIPAddress: requesterIPAddress,
            sentTimestamp: sentTimestamp
        };
        if (!parsedJSON.__pointrel_trace) parsedJSON.__pointrel_trace = [];
        parsedJSON.__pointrel_trace.push(traceEntry);
        
        return callback(makeSuccessResponse(200, "Success", {detail: 'Read content', sha256AndLength: sha256AndLength, message: parsedJSON}));
    });
}

function sanitizeISOTimestamp(timestamp) {
    // TODO: Can't trust user-supplied topic timestamp...
    return timestamp;
}

function respondForStoreMessageRequest(senderIPAddress, journal, message, callback) {
    console.log("respondForStoreMessage");
    
    // TODO: Need some way to verify protocol or expectations the client is using, like a client verison...
    
    var receivedTimestamp = utility.getCurrentUniqueTimestamp();
    
    // If no topic, does not index it (even if it has a topic timestamp)
    var topicSHA256;
    var topicTimestamp;
    var topicIdentifier = message._topicIdentifier;
    if (topicIdentifier !== undefined) {
        topicSHA256 = utility.calculateCanonicalSHA256ForObject(topicIdentifier);
        topicTimestamp = message._topicTimestamp;
        // TODO: How to handle missing timestamps? This is not correct!!!
        if (!topicTimestamp) {
            topicTimestamp = receivedTimestamp;
        } else {
            // Need to ensure user data can be used safely in a file name
            topicTimestamp = sanitizeISOTimestamp(topicTimestamp);
        }
    } else {
        topicSHA256 = null;
        topicTimestamp = null;
    }
            
    var oldSHA256AndLength = message.__pointrel_sha256AndLength;
    var oldTrace = message.__pointrel_trace;
    
    if (oldTrace && !Array.isArray(oldTrace)) {
        throw new Error("respondForStoreMessage: trace field should be an array if it is defined");
    }
    
    if (!oldTrace) oldTrace = [];
    
    // Calculate the sha256AndLength without the pointrel fields
    // Remove all "__pointrel_" tags from the top level, which includes sha256AndLength and trace and any other local metadata
    for (var key in message) {
        if (utility.startsWith(key, "__pointrel_")) {
            delete message[key];
        }
    }

    var sha256AndLengthObject = utility.calculateCanonicalSHA256AndLengthForObject(message);
    var sha256AndLength = utility.makeSHA256AndLength(sha256AndLengthObject);

    if (oldSHA256AndLength && oldSHA256AndLength !== sha256AndLength) {
        throw new Error("respondForStoreMessage: sha256AndLength was supplied in message but it does not match the calculated value; old: " + oldSHA256AndLength + " new: " + sha256AndLength);
    }
    
    if (isSHA256AndLengthIndexed(journal, sha256AndLength)) {
        return callback(makeFailureResponse(409, "Conflict: The message already exists on the server", {sha256AndLength: sha256AndLength}));
    }
    
    message.__pointrel_sha256AndLength = sha256AndLength;
    
    // Put in some local information
    // TODO: More thinking about the meaning of a trace???
    // TODO: Add more info about who stored this information
    // TODO: Maybe add other things, like requester IP or user identifier?
    var traceEntry = {
        receivedByJournalIdentifier: journal.journalIdentifier,
        receivedByServer: serverName,
        // TODO: How to best identify from where or from whom this is received from???
        senderIPAddress: senderIPAddress,
        receivedTimestamp: receivedTimestamp
    };
    
    var newTrace = oldTrace.concat(traceEntry);
    
    message.__pointrel_trace = newTrace;
    
    var canonicalMessage = utility.copyObjectWithSortedKeys(message);
    
    var currentTimestampForFileName = receivedTimestamp.replace(/:/g, "-").replace("T", "_");
    
    var fileName = currentTimestampForFileName + "_" + sha256AndLength;
    if (topicSHA256) {
        var topicTimestampForFileName = topicTimestamp.replace(/:/g, "-").replace("T", "_");
        fileName += "_" + topicSHA256 + "_" + topicTimestampForFileName;
    }
    fileName += messageFileSuffix;
    
    var fullFileName = journal.journalDirectory + fileName;
    
    // Pretty printing it even though wasteful -- easier for developer to look at in stored files
    var prettyJSON = JSON.stringify(canonicalMessage, null, 2);
    var buffer = new Buffer(prettyJSON, "utf8");

    log("about to store", sha256AndLength);
    // log("prettyJSON", prettyJSON);
    
    // TODO: Write to a temp file first and then move it
    // TODO: maybe change permission mode from default?
    log("about to write file: %s", fullFileName);
    fs.writeFile(fullFileName, buffer, function (error) {
        if (error) {
            return callback(makeFailureResponse(500, "Server error: writeFile: '" + error + "'"));
        }
        
        ingestMessage(journal, receivedTimestamp, sha256AndLength, fullFileName, topicSHA256, topicTimestamp);

        return callback(makeSuccessResponse(200, "Success", {detail: 'Wrote content', sha256AndLength: sha256AndLength, receivedTimestamp: receivedTimestamp}));
    });
}

function respondForQueryForNextMessageRequest(journal, topicIdentifier, fromTimestampExclusive, limitCount, callback) {
    // TODO: Optimize to read from end rather than scan entire list when given specific start date
    // TODO: And/or use some kind of sorted map so can quickly find message versions after a certain date
    log("=========================== respondForQueryForNext", fromTimestampExclusive, limitCount);
    
    var now = utility.getCurrentUniqueTimestamp();
    
    var messagesSortedByReceivedTimestamp;
    if (topicIdentifier === undefined) {
        messagesSortedByReceivedTimestamp = journal.allMessagesSortedByReceivedTimestamp;
    } else {
        var topicSHA256 = utility.calculateCanonicalSHA256ForObject(topicIdentifier);
        var topic = journal.topicSHA256ToTopicMap[topicSHA256];
        if (!topic) {
            messagesSortedByReceivedTimestamp = [];
        } else {
            messagesSortedByReceivedTimestamp = topic.receivedRecords;
        }
    }
    
    var checkForMatch = true;
    if (!fromTimestampExclusive) checkForMatch = false;
    
    var receivedRecordsForClient = [];
    var lastReceivedTimestampConsidered = null;
    var i;
    for (i = 0; i < messagesSortedByReceivedTimestamp.length; i++) {
        var receivedRecord = messagesSortedByReceivedTimestamp[i];
        if (checkForMatch) {
            if (utility.compareISOTimestamps(receivedRecord.receivedTimestamp, fromTimestampExclusive) <= 0) continue;
            checkForMatch = false;
        }
        var receivedRecordForClient = {
            receivedTimestamp: receivedRecord.receivedTimestamp,
            sha256AndLength: receivedRecord.sha256AndLength,
            topicSHA256: receivedRecord.topicSHA256,
            topicTimestamp: receivedRecord.topicTimestamp,
            _debugLoadingSequence: receivedRecord.loadingSequence
        };
        receivedRecordsForClient.push(receivedRecordForClient);
        if (limitCount && receivedRecordsForClient.length >= limitCount) break;
    }
    // If reach the end of the list or there are no results, the search is up-to-date to now
    if (i === messagesSortedByReceivedTimestamp.length || receivedRecordsForClient.length === 0) {
        lastReceivedTimestampConsidered = now;
    } else if (receivedRecordsForClient.length) {
        lastReceivedTimestampConsidered = receivedRecordsForClient[receivedRecordsForClient.length - 1].receivedTimestamp;
    }
    
    return callback(makeSuccessResponse(200, "Success", {detail: 'revisions',  currentTimestamp: now, lastReceivedTimestampConsidered: lastReceivedTimestampConsidered, receivedRecords: receivedRecordsForClient}));
    // return callback(makeFailureResponse(500, "Unfinished"));
}
   
function respondForQueryForLatestMessageRequest(journal, topicIdentifier, callback) {
    log("=========================== respondForQueryForLatestMessage", topicIdentifier);
    
    var messagesSortedByReceivedTimestamp;
    if (topicIdentifier === undefined) {
        messagesSortedByReceivedTimestamp = journal.allMessagesSortedByReceivedTimestamp;
    } else {
        var topicSHA256 = utility.calculateCanonicalSHA256ForObject(topicIdentifier);
        var topic = journal.topicSHA256ToTopicMap[topicSHA256];
        if (!topic) {
            messagesSortedByReceivedTimestamp = [];
        } else {
            messagesSortedByReceivedTimestamp = topic.receivedRecords;
        }
    }
    
    var latestRecord;
    if (messagesSortedByReceivedTimestamp && messagesSortedByReceivedTimestamp.length) {
        latestRecord = messagesSortedByReceivedTimestamp[messagesSortedByReceivedTimestamp.length - 1];
    } else {
        latestRecord = null;
    }
    
    var now = utility.getCurrentUniqueTimestamp();
    return callback(makeSuccessResponse(200, "Success", {detail: 'latest',  currentTimestamp: now, latestRecord: latestRecord}));
}
    

//--- Dispatching requests

// Callback has one argument, response, which has a "success" field of true/false a
// A response also has other fields including a statusCode, a description, and possible extra fields
function processRequest(apiRequest, callback, senderIPAddress) {
    log("====================================== processRequest", JSON.stringify(apiRequest));
    
    if (!apiRequest) {
        return callback(makeFailureResponse(406, "Not acceptable: apiRequest is missing"));
    }
    
    if (!apiRequest.action) {
        return callback(makeFailureResponse(406, "Not acceptable: action field missing in apiRequest", {apiRequest: apiRequest}));
    }
    
    // Using "action" for WordPress compatibility
    // TODO: Make this string a constant
    if (!utility.startsWith(apiRequest.action, "pointrel20150417_")) {
        return callback(makeFailureResponse(406, "Not acceptable: Unsupported action in apiRequest (must start with pointrel20150417_)"));
    }
    
    var journalIdentifier = apiRequest.journalIdentifier;
    
    if (!journalIdentifier) return callback(makeFailureResponse(406, "journalIdentifier field is not defined in apiRequest"));
    
    var journal = journals[JSON.stringify(journalIdentifier)];
    
    // TODO: Could check for security authorization here
    
    if (!journal) return callback(makeFailureResponse(406, "No such journal"));
    
    // TODO: Could support multiple requests if apiRequest is an array.
    
    var requestType = apiRequest.action;
    
    // Problem!!! Confusion between "message" as a general term (like "Discipline of Organizing") with its own identifier and versions
    // vs. whatever we're storing here which is immutable object with an identifier that is the sha256AndLength.
    // So, being clear that to load a specific message you need its sha256AndLength.
    
    if (requestType === "pointrel20150417_loadMessage") {
        return respondForLoadMessageRequest(senderIPAddress, journal, apiRequest.sha256AndLength, callback);
    } else if (requestType === "pointrel20150417_queryForNextMessage") {
        return respondForQueryForNextMessageRequest(journal, apiRequest.topicIdentifier, apiRequest.fromTimestampExclusive, apiRequest.limitCount, callback);
    } else if (requestType === "pointrel20150417_queryForLatestMessage") {
        return respondForQueryForLatestMessageRequest(journal, apiRequest.topicIdentifier, callback);
    } else if (requestType === "pointrel20150417_storeMessage") {
        return respondForStoreMessageRequest(senderIPAddress, journal, apiRequest.message, callback);
    } else if (requestType === "pointrel20150417_reportStatus") {
        return respondForReportStatusRequest(callback);
    } else {
        return callback(makeFailureResponse(501, "Not Implemented: requestType not supported", {requestType: requestType}));
    }
}

//--- Exports

exports.setServerName = setServerName;
exports.addJournalSync = addJournalSync;
exports.processRequest = processRequest;
exports.getCurrentUniqueTimestamp = utility.getCurrentUniqueTimestamp;
exports.indexAllJournals = indexAllJournals;