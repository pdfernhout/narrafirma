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

// The current pointrel server version -- bump this up as significant changes are made, especially to the communication API
var pointrelServerVersion = "pointrel20150417-0.0.4";

// All stored message files will have this suffix added to them
var messageFileSuffix = ".pce";

// Standard nodejs modules
var fs = require('fs');

// Our modules
var utility = require('./pointrelUtility');
var log = utility.log;
var makeSuccessResponse = utility.makeSuccessResponse;
var makeFailureResponse = utility.makeFailureResponse;

//--- Journals
// TODO: Protect agains __proto__ and so on (was StringMap, might do differently)
var journals = {};

var configuration = {
    // The identifier used in setting the trace in incoming and outgoing messages
    serverName: "server",
    
    // The endpoint where we expect the client to send Ajax requests
    apiBaseURL: '/api/pointrel20150417',
    
    // This field is not currently used, but presumably is where more general server configuration information could be stored
    serverDataDirectory: "../server-data/",
    
    // Where to create and store journal files
    journalsDirectory: "../server-data/journals/",
    
    // Whether to just store everything in "memory" (used for testing), to a "file", or other in the future
    // TODO: Maybe support this per journal?
    storageType: "file",
        
     // The option maximumTimeDriftAllowed_ms is the maximum time drift allowed for messages to be in the future to allow for slightly different clocks
     // The more frequently records are written to the server, the smaller this value should be
    maximumTimeDriftAllowed_ms: 10000,
    
    // You might not want to cache message contents if you have a lot of big media files in applications
    // However, caching from the start is the right default for small projects (like with, say, typically less than 100 MB of data)
    cacheMessageContents: true,
    
    /// Limits for including message results in query responses
    maximumQueryResponseLimit: 100,
    maximumMessageBodyBytes: 1000000,
    
    // Whether to allow requests to be attempted even if unauthenticated; otherwise athentication is only checked for identifer users
    // Note that even if this flag is set to true, journal access may fail if the anonymous user is not allowed to do some operation
    isAnonymousAccessAllowed: true,
    
    // An optional function that should return a boolean if a user is authenticated; userCredentials typically has userIdentifier and userPassword
    // Typically this should be set to pointrelAccessControl.isAuthenticated
    // isAuthenticated(userIdentifier, userCredentials)
    isAuthenticatedCallback: null,

    // An optional function that should return a boolean if a request is authorized for the user
    // Typically this should be set to pointrelAccessControl.isAuthorized
    // isAuthorized(journalIdentifier, userIdentifier, requestedAction, apiRequest, request)
    isAuthorizedCallback: null,

    // An optional function that should return a boolean if the user is the superuser
    // Typically this should be set to pointrelAccessControl.isSuperUser
    // isSuperUser(userIdentifier)
    isSuperUserCallback: null,
    
    // An optional callback to return an object listing the journals a user can access and the permissions authorized
    // Typically this should be set to pointrelAccessControl.determineJournalsAccessibleByUser
    // determineJournalsAccessibleByUserCallback(userIdentifier)
    determineJournalsAccessibleByUserCallback: null
};

function isUsingFiles() {
    return configuration.storageType === "file";
}

function configure(options) {
    for (var key in options) {
        configuration[key] = options[key];
    }
}

function makeJournal(journalIdentifier, journalDirectory) {
    var journal = {
        journalIdentifier: journalIdentifier,
        journalDirectory: journalDirectory,
        sha256AndLengthToReceivedRecordMap: [],
        topicSHA256ToTopicMap: {},
        // This array is sorted by received timestamp
        // TODO: Replace with Node.js Binary Search Tree like https://github.com/louischatriot/node-binary-search-tree
        allMessageReceivedRecordsSortedByTimestamp: []
    };
    return journal;
}

// TODO: This is a kludge for testing right now -- no validation
function addJournalSync(journalIdentifier) {
   log("----- addJournalSync", journalIdentifier, "--------------------------------------------------");
   var sanitizedFileName = utility.sanitizeFileName(journalIdentifier);
   if (journalIdentifier !== sanitizedFileName) {
       throw new Error("addJournalSync: journalIdentifier contains unacceptable characters like spaces, double periods, or slashes");
   }
   
   if (journalIdentifier.length > 63) {
       // TODO: Arbitrary limit for now. What should it be?
       throw new Error("addJournalSync: journalIdentifier is more than 63 characters long");
   }
   
   var journalDirectory = configuration.journalsDirectory + journalIdentifier + "/";

   if (isUsingFiles()) {
       if (!fs.existsSync(journalDirectory)) {
           fs.mkdirSync(journalDirectory);
           log("Made directory: " + journalDirectory);
       }
   }
 
   var journal = makeJournal(journalIdentifier, journalDirectory);
   journals[JSON.stringify(journalIdentifier)] = journal;
   
   // console.log("journals", journals);
}

function resetJournalSync(journalIdentifier) {
    log("----- resetJournalSync", journalIdentifier, "--------------------------------------------------");
    var sanitizedFileName = utility.sanitizeFileName(journalIdentifier);
    if (journalIdentifier !== sanitizedFileName) {
        throw new Error("resetJournalSync: journalIdentifier contains unacceptable characters like spaces, double periods, or slashes");
    }
    
    if (journalIdentifier.length > 63) {
        // TODO: Arbitrary limit for now. What should it be?
        throw new Error("resetJournalSync: journalIdentifier is more than 63 characters long");
    }
    
    var journalDirectory = configuration.journalsDirectory + journalIdentifier + "/";
    const fileDate = new Date().toISOString();
    var journalDirectoryBackup = configuration.journalsDirectory + "." + journalIdentifier + ".backup-" + fileDate + "/";
 
    if (isUsingFiles()) {
        if (!fs.existsSync(journalDirectory)) {
            throw new Error("resetJournalSync: journal does not exist on disk");
        }
        fs.renameSync(journalDirectory, journalDirectoryBackup);
        log("Renamed directory: " + journalDirectory + " to: " + journalDirectoryBackup);
        fs.mkdirSync(journalDirectory);
        log("Made directory: " + journalDirectory);
    }
  
    var journal = makeJournal(journalIdentifier, journalDirectory);
    journals[JSON.stringify(journalIdentifier)] = journal;
 }

 function hideJournalSync(journalIdentifier) {
    log("----- hideJournalSync", journalIdentifier, "--------------------------------------------------");
    var sanitizedFileName = utility.sanitizeFileName(journalIdentifier);
    if (journalIdentifier !== sanitizedFileName) {
        throw new Error("hideJournalSync: journalIdentifier contains unacceptable characters like spaces, double periods, or slashes");
    }
    
    if (journalIdentifier.length > 63) {
        // TODO: Arbitrary limit for now. What should it be?
        throw new Error("hideJournalSync: journalIdentifier is more than 63 characters long");
    }
    
    var journalDirectory = configuration.journalsDirectory + journalIdentifier + "/";
    var journalDirectoryHidden = configuration.journalsDirectory + "." + journalIdentifier + "/";
 
    if (isUsingFiles()) {
        if (!fs.existsSync(journalDirectory)) {
            throw new Error("hideJournalSync: journal does not exist on disk");
        }
        fs.renameSync(journalDirectory, journalDirectoryHidden);
        log("Renamed directory: " + journalDirectory + " to: " + journalDirectoryHidden);
    }
 }

//--- Indexing

function isSHA256AndLengthIndexed(journal, sha256AndLength) {
    // console.log("isSHA256AndLengthIndexed", sha256AndLength, journal);
    return !!journal.sha256AndLengthToReceivedRecordMap[sha256AndLength];
}

function resetIndexesForJournal(journal) {
    journal.allMessageReceivedRecordsSortedByTimestamp = [];
}

// Loads all journals after determining identifiers from storage
function indexAllJournals() {
    log("=================================== indexAllJournals");
    
    var journalsDirectory = configuration.journalsDirectory;
    
    if (!isUsingFiles()) return;
        
    var fileNames;
    try {
        fileNames = fs.readdirSync(journalsDirectory);
    } catch (error) {
        console.log("ERROR: Problem reading directory", journalsDirectory, error);
    }
    for (var fileNameIndex = 0; fileNameIndex < fileNames.length; fileNameIndex++) {
        var fileName = fileNames[fileNameIndex];
        if (fileName.charAt(0) === ".") continue;
        var stat = fs.statSync(journalsDirectory + fileName);
        if (stat.isDirectory()) {
            console.log("Adding journal: ", fileName);
            // TODO: Wasteful in this case that addJournalSync will check again if the journal exists
            addJournalSync(fileName);
        }
    }

    log("indexAllJournals found journals", journals);
    
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

// Intended to be used by other pointrel modules, not by the client
function getAllJournalIdentifiers() {
    var result = [];
    for (var key in journals) {
        result.push(journals[key].journalIdentifier);
    }
    return result;
}

// The power of deleting code that is not currently used to reduce clutter? Knowing it is rewriteable again or findable in other versions?

// Returns null if can not read file, which means client should ignore the message as unobtainable
function readMessageContentsFromFile(receivedRecord) {
    if (!isUsingFiles()) return undefined;
    
    var fileContents;
    var message;
    try {
        fileContents = fs.readFileSync(receivedRecord.fullFileName);
    } catch (e) {
        console.log("Problem reading message file", receivedRecord, e);
        return null;
    }
    try {
        message = JSON.parse(fileContents);
    } catch (e) {
        console.log("Problem parsing message file", receivedRecord, e);
        return null;
    }
    return message;
}

// TODO: Maybe wasteful to store full file name if it can be calculated
function ingestMessage(journal, receivedTimestamp, sha256AndLength, fullFileName, topicSHA256, topicTimestamp, messageContents) {
    if (!topicSHA256) topicSHA256 = null;
    if (!topicTimestamp) topicTimestamp = null;
    
    var receivedRecord = {
        sha256AndLength: sha256AndLength,
        receivedTimestamp: receivedTimestamp,
        topicSHA256: topicSHA256,
        topicTimestamp: topicTimestamp,
        fullFileName: fullFileName,
        loadingSequence : journal.allMessageReceivedRecordsSortedByTimestamp.length + 1
    };
    
    if (configuration.cacheMessageContents) {
        if (messageContents) {
            receivedRecord.messageContents = messageContents;
        } else {
            receivedRecord.messageContents = readMessageContentsFromFile(receivedRecord);
        }
    }
    
    // console.log("ingestMessage", receivedRecord);
    
    utility.addItemToSortedArray(journal.allMessageReceivedRecordsSortedByTimestamp, receivedRecord, utility.compareReceivedRecords);
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
            // Note that these records should never be equal -- which might indicated a duplicate sha256AndLength in records which should be prevented
            if (utility.compareReceivedRecordsByTopicTimestamp(receivedRecord, topic.latestReceivedRecordByTopicTimestamp) >= 0) {
                topic.latestReceivedRecordByTopicTimestamp = receivedRecord;
            }
        }
    }
}

function indexAllMessagesInDirectory(journal, directory) {
    // TODO: If files are added while reindexing is going on and reindexing takes a long time, the new files could be reject as later than this maximum
    // log("indexAllMessagesInDirectory", directory);
    var maximumAllowedTimestamp = utility.calculateMaximumAllowedTimestamp(configuration.maximumTimeDriftAllowed_ms);
    
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
            
            // Need to be reassigned every time through loop so does not use previous values
            var topicSHA256 = null;
            var topicTimestamp = null;
            
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

function respondForReportJournalStatusRequest(journal, userIdentifier, isAuthorizedPartial, isSuperUser, callback) {
    var sortedReceivedRecords = journal.allMessageReceivedRecordsSortedByTimestamp;
    var earliestRecord = null;
    var latestRecord = null;
    if (sortedReceivedRecords.length) {
        earliestRecord = makeReceivedRecordForClient(sortedReceivedRecords[0]);
        latestRecord = makeReceivedRecordForClient(sortedReceivedRecords[sortedReceivedRecords.length - 1]);
    }
    
    var readAuthorization = isAuthorizedPartial("read");
    var writeAuthorization = isAuthorizedPartial("write");
    var adminAuthorization = isAuthorizedPartial("admin");
    
    var response =  {
        status: 'OK',
        version: pointrelServerVersion,
        currentUniqueTimestamp: utility.getCurrentUniqueTimestamp(),
        journalIdentifier: journal.journalIdentifier,
        permissions: {
            // TODO: What about partial authorization for only some messages?
            read: readAuthorization,
            write: writeAuthorization,
            admin: adminAuthorization,
            superUser: isSuperUser()
        }
    };
    
    if (readAuthorization) {
        response.journalEarliestRecord = earliestRecord;
        response.journalLatestRecord = latestRecord;
        response.journalRecordCount = sortedReceivedRecords.length;
    }
    
    if (writeAuthorization) {
        // Not sure what I really mean by this flag; sort of that the journal is currently in readOnly mode on the server end?
        response.readOnly = false;
    }
    
    return callback(makeSuccessResponse(200, "Success", response));
}

//--- Loading and storing messages on disk

function setOutgoingMessageTrace(userIdentifier, requesterIPAddress, journal, message, makeCopy) {
    if (makeCopy) message = JSON.parse(JSON.stringify(message));
    // TODO: More thinking about the meaning of a trace???
    // TODO: Add more info about who requested this information
    // TODO: Maybe add other things, like requester IP or user identifier?
    var sentTimestamp = utility.getCurrentUniqueTimestamp();
    var traceEntry = {
        sentByJournalIdentifier: journal.journalIdentifier,
        sentByServer: configuration.serverName,
        // TODO: How to best identify from where or from whom this is requested from???
        requesterIPAddress: requesterIPAddress,
        userIdentifier: userIdentifier,
        sentTimestamp: sentTimestamp
    };
    if (!message.__pointrel_trace) message.__pointrel_trace = [];
    message.__pointrel_trace.push(traceEntry);
    return message;
}

function respondForLoadMessageRequest(userIdentifier, requesterIPAddress, journal, topicIdentifier, sha256AndLength, callback) {
    if (!isSHA256AndLengthIndexed(journal, sha256AndLength)) {
        return callback(makeFailureResponse(404, "No message indexed for sha256AndLength", {sha256AndLength: sha256AndLength}));
    }
    
    var receivedRecord = journal.sha256AndLengthToReceivedRecordMap[sha256AndLength];
    if (!receivedRecord) {
        return callback(makeFailureResponse(404, "No message file found for sha256AndLength", {sha256AndLength: sha256AndLength}));        
    }
    
    var message;
    
    if (receivedRecord.messageContents) {
        // Safeguard to ensure the user knows what topic this message is for if only permissions to read in a specific topic
        if (topicIdentifier !== undefined && receivedRecord.messageContents._topicIdentifier !== topicIdentifier) {
            return callback(makeFailureResponse(404, "No message file found for sha256AndLength and topicIdentifier", {sha256AndLength: sha256AndLength, topicIdentifier: topicIdentifier}));        
        }
        
        message = setOutgoingMessageTrace(userIdentifier, requesterIPAddress, journal, receivedRecord.messageContents, true);
        return callback(makeSuccessResponse(200, "Success", {detail: 'Read content', sha256AndLength: sha256AndLength, message: message}));
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
        
        // Safeguard to ensure the user knows what topic this message is for if only permissions to read in a specific topic
        if (topicIdentifier !== undefined && parsedJSON._topicIdentifier !== topicIdentifier) {
            return callback(makeFailureResponse(404, "No message file found for sha256AndLength and topicIdentifier", {sha256AndLength: sha256AndLength, topicIdentifier: topicIdentifier}));        
        }
        
        message = setOutgoingMessageTrace(userIdentifier, requesterIPAddress, journal, parsedJSON, false);
        
        return callback(makeSuccessResponse(200, "Success", {detail: 'Read content', sha256AndLength: sha256AndLength, message: message}));
    });
}

function sanitizeISOTimestamp(timestamp) {
    // TODO: Can't trust user-supplied topic timestamp...
    return timestamp;
}

function respondForStoreMessageRequest(userIdentifier, senderIPAddress, journal, message, callback) {
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
        console.log("Problem with new claculated sha not matching old supplied one:", oldSHA256AndLength, "new:", sha256AndLength, message, JSON.stringify(message));
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
        receivedByServer: configuration.serverName,
        // TODO: How to best identify from where or from whom this is received from???
        senderIPAddress: senderIPAddress,
        userIdentifier: userIdentifier,
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
    
    // Using local function to ingest and do callback because two paths to call this code, one directlay and one in a file callback
    function finish() {
        ingestMessage(journal, receivedTimestamp, sha256AndLength, fullFileName, topicSHA256, topicTimestamp, message);
        return callback(makeSuccessResponse(200, "Success", {detail: 'Wrote content', sha256AndLength: sha256AndLength, receivedTimestamp: receivedTimestamp}));
    }
    
    if (isUsingFiles()) {
        // TODO: Write to a temp file first and then move it
        // TODO: maybe change permission mode from default?
        log("about to write file: %s", fullFileName);
        fs.writeFile(fullFileName, buffer, function (error) {
            if (error) {
                return callback(makeFailureResponse(500, "Server error: writeFile: '" + error + "'"));
            }
            return finish();
        });
    } else {
        return finish();
    }
}

function makeReceivedRecordForClient(receivedRecord) {
    var receivedRecordForClient = {
        receivedTimestamp: receivedRecord.receivedTimestamp,
        sha256AndLength: receivedRecord.sha256AndLength,
        topicSHA256: receivedRecord.topicSHA256,
        topicTimestamp: receivedRecord.topicTimestamp,
        _debugLoadingSequence: receivedRecord.loadingSequence
    };
    return receivedRecordForClient;
}

function respondForQueryForNextMessageRequest(userIdentifier, requesterIPAddress, journal, topicIdentifier, fromTimestampExclusive, limitCount, includeMessageContents, callback) {
    // TODO: Optimize to read from end rather than scan entire list when given specific start date
    // TODO: And/or use some kind of sorted map so can quickly find message versions after a certain date
    log("======== respondForQueryForNext", fromTimestampExclusive, limitCount);
    
    var now = utility.getCurrentUniqueTimestamp();
    
    if (limitCount > configuration.maximumQueryResponseLimit) limitCount = configuration.maximumQueryResponseLimit;

    var messagesSortedByReceivedTimestamp;
    if (topicIdentifier === undefined) {
        messagesSortedByReceivedTimestamp = journal.allMessageReceivedRecordsSortedByTimestamp;
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
    var totalMessageBodyBytesIncluded = 0; 
    var bytesForMessage;
    var i;
    for (i = 0; i < messagesSortedByReceivedTimestamp.length; i++) {
        var receivedRecord = messagesSortedByReceivedTimestamp[i];
        if (checkForMatch) {
            if (utility.compareISOTimestamps(receivedRecord.receivedTimestamp, fromTimestampExclusive) <= 0) continue;
            checkForMatch = false;
        }
        // Don't send any more messages with bodies if this next one would go over the limit, but always send at least one
        if (includeMessageContents) {
            try {
                // console.log("receivedRecord.sha256AndLength", receivedRecord.sha256AndLength);
                bytesForMessage = parseInt(receivedRecord.sha256AndLength.split("_")[1]);
            } catch (e) {
                console.log("Problem parsing length from sha256", receivedRecord);
                // TODO: What should this value be on a failure? Can we assume we will not be able to read the file too?
                bytesForMessage = 0;
            }
            var wouldExceedMaximimumBytes = (totalMessageBodyBytesIncluded + bytesForMessage > configuration.maximumMessageBodyBytes);
            // console.log("bytesForMessage", i, bytesForMessage, wouldExceedMaximimumBytes, totalMessageBodyBytesIncluded + bytesForMessage);
            if (i > 0 && wouldExceedMaximimumBytes) break;   
        }
        var receivedRecordForClient = makeReceivedRecordForClient(receivedRecord);
        if (includeMessageContents) {
            var message;
            var copyMessage = false;
            // TODO: Need to set limits on size of returned record
            // TODO: What if record got deleted or failed to load at startup but is available now? Would the sequency be wrong?
            if (receivedRecord.messageContents) {
                // TODO: Need to copy this, and set the outgoing trace
                message = receivedRecord.messageContents;
                copyMessage = true;
            } else {
                message = readMessageContentsFromFile(receivedRecord);
            }
            if (message) {
                message = setOutgoingMessageTrace(userIdentifier, requesterIPAddress, journal, message, copyMessage);
                totalMessageBodyBytesIncluded += bytesForMessage;
            }
            receivedRecordForClient.messageContents = message;   
        }
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
    log("======== respondForQueryForLatestMessage", topicIdentifier);
    
    var latestRecord = latestReceivedRecordForTopic(journal, topicIdentifier);
    
    var now = utility.getCurrentUniqueTimestamp();
    // TODO: perhaps return message contents with trace set
    // TODO: Restrict data sent back for record to not include fullFileName
    return callback(makeSuccessResponse(200, "Success", {detail: 'latest',  currentTimestamp: now, latestRecord: latestRecord}));
}

// TODO: need to filter what is sent back to client instead of returning entire latestRecord
// TODO: querying for latest message is expecting result, but might need to actually retrieve it

function latestReceivedRecordForTopic(journal, topicIdentifier) {
    // console.log("latestReceivedRecordForTopic", topicIdentifier);
    var messagesSortedByReceivedTimestamp;
    if (topicIdentifier === undefined) {
        messagesSortedByReceivedTimestamp = journal.allMessageReceivedRecordsSortedByTimestamp;
    } else {
        // console.log("have topic identifier");
        var topicSHA256 = utility.calculateCanonicalSHA256ForObject(topicIdentifier);
        // console.log("topicSHA256", topicSHA256);
        var topic = journal.topicSHA256ToTopicMap[topicSHA256];
        // console.log("topic", topic);
        if (!topic) {
            messagesSortedByReceivedTimestamp = [];
        } else {
            messagesSortedByReceivedTimestamp = topic.receivedRecords;
        }
    }
    // console.log("messagesSortedByReceivedTimestamp.length", messagesSortedByReceivedTimestamp.length);
    var latestRecord;
    if (messagesSortedByReceivedTimestamp && messagesSortedByReceivedTimestamp.length) {
        latestRecord = messagesSortedByReceivedTimestamp[messagesSortedByReceivedTimestamp.length - 1];
    } else {
        latestRecord = null;
    }
    
    return latestRecord;
}

// This is latest message by topic timestamp, not by received timestamp, unless byReceivedTimestamp set to true
function latestMessageForTopicSync(journalIdentifier, topicIdentifier, byReceivedTimestamp) {
    var journal = journals[JSON.stringify(journalIdentifier)];
    if (!journal) return null;
    
    var receivedRecord = null;
    
    if (byReceivedTimestamp) {
        receivedRecord = latestReceivedRecordForTopic(journal, topicIdentifier);
    } else {
        if (topicIdentifier === undefined) {
            throw new Error("topicIdentifier must be defined if byReceivedTimestamp is not true");
        }
        var topicSHA256 = utility.calculateCanonicalSHA256ForObject(topicIdentifier);
        var topic = journal.topicSHA256ToTopicMap[topicSHA256];
        if (topic) receivedRecord = topic.latestReceivedRecordByTopicTimestamp;
    }
    
    if (!receivedRecord) return null;
    var message = receivedRecord.messageContents;
    if (!receivedRecord.messageContents) {
        message = readMessageContentsFromFile(receivedRecord);
    }
    return message;
}

function respondForCurrentUserInformation(userIdentifierFromServerRequest, callback) {
    log("======== respondForCurrentUserInformation", userIdentifierFromServerRequest);
    
    var result = {
        userIdentifier: userIdentifierFromServerRequest
    };
    
    // TODO: Maybe only do this if a flag is set in the request?
    if (configuration.determineJournalsAccessibleByUserCallback) {
        var journalPermissions = configuration.determineJournalsAccessibleByUserCallback(userIdentifierFromServerRequest);
        result.journalPermissions = journalPermissions;
    }
    
    return callback(makeSuccessResponse(200, "Success", result));
}


//--- Dispatching requests

function senderIPAddressForRequest(request) {
    return request.headers['x-forwarded-for'] || 
        request.connection.remoteAddress || 
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress;
}

// Callback has one argument, response, which has a "success" field of true/false a
// A response also has other fields including a statusCode, a description, and possible extra fields
function processRequest(apiRequest, callback, request) {
    try {
        var senderIPAddress;
        if (request) senderIPAddress = senderIPAddressForRequest(request);
        
        var user = null;
        if (request && request.user) user = request.user;
         
        log("======== processRequest", senderIPAddress, JSON.stringify(user), JSON.stringify(apiRequest));
        
        if (!apiRequest) {
            return callback(makeFailureResponse(400, "Not acceptable: apiRequest is missing"));
        }
        
        if (!apiRequest.action) {
            return callback(makeFailureResponse(400, "Not acceptable: action field missing in apiRequest", {apiRequest: apiRequest}));
        }
        
        // Using "action" for WordPress compatibility
        // TODO: Make this string a constant
        if (!utility.startsWith(apiRequest.action, "pointrel20150417_")) {
            return callback(makeFailureResponse(400, "Not acceptable: Unsupported action in apiRequest (must start with pointrel20150417_)"));
        }
        
        var userCredentials = apiRequest.userCredentials;
        if (!userCredentials || typeof userCredentials !== 'object') userCredentials = {};
        
        // TODO: May want to check that messages stamped with a userIdentifier match the userIdentifier in the credentials?

        var userIdentifierFromServerRequest;
        if (user !== null) {
            userIdentifierFromServerRequest = user.userIdentifier;
        }
        
        // We don't need to authenticate the user's credentials if the claimed user was authenticated already by the server
        var isAlreadyAuthenticated = false;
        var userIdentifier = userCredentials.userIdentifier;
        if (user !== null) {
            userIdentifierFromServerRequest = user.userIdentifier;
            if (userIdentifier === undefined) {
                userIdentifier = userIdentifierFromServerRequest;
                isAlreadyAuthenticated = true;
            } else {
                if (userIdentifier !== undefined && userIdentifier === userIdentifierFromServerRequest) {
                    isAlreadyAuthenticated = true;
                }
            }
        }
        if (userIdentifier === undefined) userIdentifier = "anonymous";
        
        // console.log("userIdentifierFromServerRequest:", userIdentifierFromServerRequest, "userIdentifier:", userIdentifier, "user:", user);
        
        // Returning 403 for unauthenticated instead of 401 because we are using custom authentication; see:
        // http://stackoverflow.com/questions/3297048/403-forbidden-vs-401-unauthorized-http-responses/14713094#14713094
        if (!configuration.isAnonymousAccessAllowed && userIdentifier === "anonymous") {
            return callback(makeFailureResponse(403, "Unauthenticated -- anonyomous access is not permitted", {userIdentifier: userIdentifier}));
        }
        
        if (!isAlreadyAuthenticated && userIdentifier !== "anonymous" && configuration.isAuthenticatedCallback) {
            var authenticated = configuration.isAuthenticatedCallback(userIdentifier, userCredentials);
            if (!authenticated) {
                return callback(makeFailureResponse(403, "Unauthenticated", {userIdentifier: userIdentifier}));
            }
        }
        
        var requestType = apiRequest.action;
        
        // Requests not requiring a specific journal
        
        if (requestType === "pointrel20150417_currentUserInformation") {
            return respondForCurrentUserInformation(userIdentifier, callback);
        }
        
        // Requests requiring a specific journal
        
        var journalIdentifier = apiRequest.journalIdentifier;
        
        if (!journalIdentifier) return callback(makeFailureResponse(400, "journalIdentifier field is not defined in apiRequest"));
        
        var journal = journals[JSON.stringify(journalIdentifier)];
        
        // TODO: Could check for security authorization here
        
        if (!journal && requestType !== "pointrel20150417_createJournal") return callback(makeFailureResponse(404, "No such journal", {journalIdentifier: journalIdentifier}));
        
        if (requestType !== "pointrel20150417_reportJournalStatus") {
            var requestedCapability = "read";
            if (requestType === "pointrel20150417_storeMessage") requestedCapability = "write";
            if (requestType === "pointrel20150417_createJournal") requestedCapability = "administrate";
            if (requestType === "pointrel20150417_resetJournal") requestedCapability = "administrate";
            if (requestType === "pointrel20150417_hideJournal") requestedCapability = "administrate";
            
            var authorized = true;
            if (configuration.isAuthorizedCallback) {
                // TODO: Could get more fine-grained authorization for messageType
                authorized = configuration.isAuthorizedCallback(journalIdentifier, userIdentifier, requestedCapability, apiRequest, request);
            }
            
            if (!authorized) {
                var message = 'Forbidden -- user "' + userIdentifier + '" is not authorized to "' + requestedCapability + '" in ' + JSON.stringify(journalIdentifier) + " (perhaps for the specific topic, message, and/or api request length)";
                return callback(makeFailureResponse(403, message, {userIdentifier: userIdentifier, journalIdentifier: journalIdentifier, requestedCapability: requestedCapability}));
            }
        }
           
        if (requestType === "pointrel20150417_loadMessage") {
            // Topic identifier is used as a safeguard to ensure the message is in a topic permitted to be read by the user
            return respondForLoadMessageRequest(userIdentifier, senderIPAddress, journal, apiRequest.topicIdentifier, apiRequest.sha256AndLength, callback);
        }
        
        if (requestType === "pointrel20150417_queryForNextMessage") {
            return respondForQueryForNextMessageRequest(userIdentifier, senderIPAddress, journal, apiRequest.topicIdentifier, apiRequest.fromTimestampExclusive, apiRequest.limitCount, apiRequest.includeMessageContents, callback);
        }
        
        if (requestType === "pointrel20150417_queryForLatestMessage") {
            // TODO: May want to include the userIdentifier and senderIPAddress in the message trace?
            return respondForQueryForLatestMessageRequest(journal, apiRequest.topicIdentifier, callback);
        }
        
        if (requestType === "pointrel20150417_storeMessage") {
            return respondForStoreMessageRequest(userIdentifier, senderIPAddress, journal, apiRequest.message, callback);
        }
        
        if (requestType === "pointrel20150417_reportJournalStatus") {
            var isAuthorizedPartial = function (requestedCapability) {
                if (configuration.isAuthorizedCallback) {
                    // TODO: Could get more fine-grained authorization for messageType
                    return configuration.isAuthorizedCallback(journalIdentifier, userIdentifier, requestedCapability);
                } else {
                    return true;
                }
            };
            var isSuperUser = function() {
                if (configuration.isSuperUserCallback) {
                    return configuration.isSuperUserCallback(userIdentifier);
                } else {
                    return false;
                }
            }
            return respondForReportJournalStatusRequest(journal, userIdentifier, isAuthorizedPartial, isSuperUser, callback);
        }
        
        if (requestType === "pointrel20150417_createJournal") {
            if (journal) return callback(makeFailureResponse(409, "Conflict: Journal already exists", {journalIdentifier: journalIdentifier}));
            // TODO: Should make this all into a function, and this call should be asynchronous
            addJournalSync(apiRequest.journalIdentifier);
            return callback(makeSuccessResponse(200, "Success", {journalIdentifier: journalIdentifier}));
        }

        if (requestType === "pointrel20150417_resetJournal") {
            if (!journal) return callback(makeFailureResponse(409, "Journal does not exist", {journalIdentifier: journalIdentifier}));
            // TODO: Should make this all into a function, and this call should be asynchronous
            resetJournalSync(apiRequest.journalIdentifier);
            return callback(makeSuccessResponse(200, "Success", {journalIdentifier: journalIdentifier}));
        }

        if (requestType === "pointrel20150417_hideJournal") {
            if (!journal) return callback(makeFailureResponse(409, "Journal does not exist", {journalIdentifier: journalIdentifier}));
            // TODO: Should make this all into a function, and this call should be asynchronous
            hideJournalSync(apiRequest.journalIdentifier);
            return callback(makeSuccessResponse(200, "Success", {journalIdentifier: journalIdentifier}));
        }
        
        // Catchall for unsupported request
        return callback(makeFailureResponse(501, "Not Implemented: requestType not supported", {requestType: requestType}));
    } catch (e) {
        return callback(makeFailureResponse(500, "Server error", {error: e.stack}));
    }
}

//--- Exports

exports.configure = configure;
exports.addJournalSync = addJournalSync;
exports.processRequest = processRequest;
exports.getCurrentUniqueTimestamp = utility.getCurrentUniqueTimestamp;
exports.indexAllJournals = indexAllJournals;
exports.latestMessageForTopicSync = latestMessageForTopicSync;
exports.getAllJournalIdentifiers = getAllJournalIdentifiers;