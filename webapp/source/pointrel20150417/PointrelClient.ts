// Pointrel20150417 for NodeJS and WordPress
// The focus is on client getting all messages of interest as they are received by the server and indexing them locally
// Each message needs to have enough easily available metadata for the server and client to do that filtering

// Messages could include a collection of semantic (RDF-like) triples representing a semantic transaction.
// Messages are placed into message streams.
// Message streams on a server typically store all the messages for playback by future clients to reconstruct a semantic structure defined by the messages.
// Messages have a trace, which is the path they have travelled through the overall system from client to server (to server...) to client.

// Messages have a timestamp in the oldest trace receivedTimestamp field (the effective time,
// which on creation should be "now" or possible in the past, but never in the future).
// Messages also have an originator defined by the trace, which is usually a person.

// Ideally (future work), messages should be signed in the trace by the originator and/or
// other certifying authorities as to the authenticity.
// The signature process is intented in part to identify potentially unwanted messages from unknown or unauthenticated users).

// PCE in stored server files stands for "Pointrel Collected Event". :-)

import sha256 = require("./sha256");
import stringToUtf8 = require("./stringToUtf8");
import generateRandomUuid = require("./generateRandomUuid");
import topic = require("./topic");

"use strict";

const defaultCheckFrequency_ms = 15000;

const shortTimeout_ms = 10000;
const longTimeout_ms = 30000;

let debugMessaging = false;

// TODO: Think more deeply about what server status can be, like states it transitions through
// (perhaps startup, polling, loading, storing, waiting-to-poll, timed-out, recovering, etc.)

// TODO: Handle the queue of outgoing messages better, and don't allow for possibility one could
// get dropped if timeout or server failure or such

// TODO: Flag if you don't want to receive incoming messages that you sent if they are in the order sent
// TODO: (Maybe) Flag if you don't want to receive any of the messages that you sent...

// The userCredentials have the form {userIdentifier: "some name", userPassword: "some password"}
// If a string is passed in, it is assumed just the userIdentifier is being supplied

type Timestamp = string;

interface Message {
    _topicIdentifier: any,
    _topicTimestamp: Timestamp,
    // TODO: TripleStoreaddTriple does not set creator or creationTimestamp so these were made optional, but maybe addTriple should?
    creator?: string,
    creationTimestamp?: Timestamp,
    messageType?: string, 
    change: any;
    [field: string]: any;
};

class PointrelClient {
    apiURL: string = null;
    journalIdentifier = null;
    userIdentifier = null;
    
    started = false;
    frequencyOfChecks_ms = defaultCheckFrequency_ms;
    timer = null;
    
    // By default, includeMessageContents of true will retrieve the message contents when polling to reduce back-and-forth latency to server
    // Clients might want to turn this off if they cache messages locally
    // or if they application selectively downloads big messages like images or other media perhaps depending on the topic they are in
    includeMessageContents = true;
    
    // This field is used to ensure only one request at a time is sent to the server
    outstandingServerRequestSentAtTimestamp = null;
    
    // TODO: This flag may no longer be needed on the client libary side; app should implement something like it somehow?
    serverResponseWarningIssued = false;
    
    lastReceivedTimestampConsidered = null;
    incomingMessageRecords: Message[] = [];
    messagesSortedByReceivedTimeArray = [];
    sha256AndLengthToMessageMap = {};

    areOutgoingMessagesSuspended = false;
    outgoingMessageQueue: Message[] = [];
    
    messageReceivedCallback: Function = null;
    serverStatusCallback: Function = null;
    
    messageSentCount = 0;
    messageReceivedCount = 0;
    
    topicIdentifier = undefined;
    
    idleCallback = null;
    
    // Variables related to generating unique timestamps
    // Note: timestamp padding needs to get longer as computers get faster
    private static lastTimestamp = null;
    private static lastTimestampIncrement = 0;
    private static timestampIncrementPadding = "000";
    private static timestampRandomPadding = "000"; 
    
    constructor(apiURL, journalIdentifier, userCredentials, messageReceivedCallback = null, serverStatusCallback = null) {
        if (!apiURL) throw new Error("No apiURL supplied");
        if (!journalIdentifier) throw new Error("No journalIdentifier supplied");
        if (!userCredentials) throw new Error("No userCredentials supplied");
        
        if (typeof userCredentials === "string" || userCredentials instanceof String) {
            userCredentials = {
                userIdentifier: userCredentials
            };
        }
        
        // Use the WordPress AJAX api instead as an override if it is defined
        this.apiURL = window["ajaxurl"] || apiURL;
        
        this.journalIdentifier = journalIdentifier;
        this.userIdentifier = userCredentials.userIdentifier;
        
        // private variable to protect against access by other code; see: http://javascript.crockford.com/private.html
        const _userCredentials = userCredentials;
        
        // privileged method that can access private variable
        this["_prepareApiRequestForSending"] = function(apiRequest) {
            apiRequest.userCredentials = _userCredentials;
        };
        
        this.messageReceivedCallback = messageReceivedCallback;
        this.serverStatusCallback = serverStatusCallback;
    }

    resetJournalContents() {
        this.lastReceivedTimestampConsidered = null;
        this.incomingMessageRecords = [];
        this.messagesSortedByReceivedTimeArray = [];
        this.sha256AndLengthToMessageMap = {};
        this.areOutgoingMessagesSuspended = false;
        this.outgoingMessageQueue = [];
    }
    
    prepareApiRequestForSending(apiRequest) {
        // Call privileged method that can access private variable
        return this["_prepareApiRequestForSending"](apiRequest);
    }

    // This should be called to start the polling process to keep a client up-to-date with what is in a Journal
    // You should not start polling though if you just want to get the latest message in a topic
    //  like for an application that selectively loads just a bit of published data
    startup() {
        console.log(new Date().toISOString(), "starting up PointrelClient", this);
        if (this.apiURL === "loopback") {
            console.log("No polling done on loopback");
        } else {
            this.started = true;
            this.startTimer();
            this.pollServerForNewMessages();
        }
    }
    
    // Call this to shut down polling, like when you destroy a related GUI component
    shutdown() {
        console.log(new Date().toISOString(), "shutting down PointrelClient", this);
        this.stopTimer();
        this.started = false;
    }
    
    
    /*
    createAndSendAddTriplesMessage(topicIdentifier, triples) {
        const change = {
            action: "addTriples",
            triples: triples
        };
        return this.createAndSendChangeMessage(topicIdentifier, "TripleStore", change);
    }
    */
    
    apiRequestSend(apiRequest, timeout_ms, successCallback, errorCallback) {
        const httpRequest = new XMLHttpRequest();
        
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status >= 200 && httpRequest.status < 300) {
                    if (successCallback) {
                        try {
                            const response = JSON.parse(httpRequest.responseText);
                            successCallback(response);
                        } catch(error) {
                            const message = 'Error: Unexpected XMLHttpRequest.responseText (should be JSON format):\n\n' + httpRequest.responseText;
                            console.error(message);
                            alert(message);
                            errorCallback({status: httpRequest.status, message: httpRequest.responseText});
                        }
                    }
                } else {
                    // TODO: Might these sometimes be JSON?
                    if (errorCallback) errorCallback({status: httpRequest.status, message: httpRequest.responseText});
                }
            }
        };
        
        httpRequest.ontimeout = function () {
             errorCallback({status: 0, message: "Timeout"});
        };
        
        const isWordPressAJAX = !!window["ajaxurl"];
           
        let apiURL = this.apiURL;
        const contentType = 'application/json; charset=utf-8';
        const data = JSON.stringify(apiRequest);
        
        if (isWordPressAJAX) {
            apiURL = apiURL + "?action=pointrel20150417";
        }

        httpRequest.open('POST', apiURL, true);

        httpRequest.setRequestHeader('Content-Type', contentType);
        httpRequest.setRequestHeader("Accept", "application/json");
        httpRequest.timeout = timeout_ms;
        
        httpRequest.send(data);
    }
    
    createChangeMessage(topicIdentifier, messageType, change, other): Message {
        const timestamp = this.getCurrentUniqueTimestamp();
        const message: Message = {
            // TODO: Simplify redundancy in timestamps
            _topicIdentifier: topicIdentifier,
            _topicTimestamp: timestamp,
            // messageIdentifier: generateRandomUuid("Message"), // Is this needed, as we have a unique ID from SHA256?
            creator: this.userIdentifier,
            creationTimestamp: timestamp,
            // TODO: createdAfter: something involving incoming records...
            messageType: messageType, 
            change: change
        };
        if (other) {
            for (let key in other) {
                message[key] = other[key];
            }
        }
           
        return message;
    }
    
    createAndSendChangeMessage(topicIdentifier, messageType, change, other, callback) {
        const message = this.createChangeMessage(topicIdentifier, messageType, change, other);
        this.sendMessage(message, callback);
     
        return message;
    }
    
    // Suggested to use createAndSendChangeMessage instead, unless you are doing a special import
    sendMessage(message: Message, callback) {
        if (debugMessaging) console.log("sendMessage", this.areOutgoingMessagesSuspended, message);
        
        // Calculate the sha256AndLength without the pointrel fields
        delete message.__pointrel_sha256AndLength;
        let oldTrace = message.__pointrel_trace;
        delete message.__pointrel_trace;
        message.__pointrel_sha256AndLength = PointrelClient.makeSHA256AndLength(PointrelClient.calculateCanonicalSHA256AndLengthForObject(message));
        // TODO: Maybe should put in local sender information here?
        if (!oldTrace) oldTrace = [];
        message.__pointrel_trace = oldTrace;
        
        // TODO: What should really go in this trace entry if anything???
        const traceEntry = {
            // TODO: Should sentBy be used???
            sentByClient: this.userIdentifier,
            // TODO: Should the journalIdentifier really be split from the URL?
            sentToJournalIdentifier: this.journalIdentifier,
            sentToURL: this.apiURL,
            sentTimestamp: PointrelClient.getCurrentUniqueTimestamp()
        };
        message.__pointrel_trace.push(traceEntry);
        
        const previouslySent = this.sha256AndLengthToMessageMap[message.__pointrel_sha256AndLength];
        if (previouslySent) {
            console.log("A message with the same sha256AndLength was previously received (supplied/existing)", message, previouslySent);
            throw new Error("Trying to send a message with the same sha256AndLength of a message previously received");
        }
    
        // TODO: Extra stringfy/parse is not needed, but makes log messages look nicer so leaving for now
        message = JSON.parse(PointrelClient.stringifyAsCanonicalJSON(message))
        
        // TODO: This field ideally should go in a wrapper object and will be deleted later
        if (callback) message.__pointrel_callback = callback;
        
        this.outgoingMessageQueue.push(message);
        this.sendOutgoingMessage();
    }
    
    suspendOutgoingMessages(suspend) {
        console.log("suspendOutgoingMessages", suspend);
        if (this.areOutgoingMessagesSuspended === suspend) return;
        this.areOutgoingMessagesSuspended = suspend;
        if (!this.areOutgoingMessagesSuspended) {
            this.sendOutgoingMessage();
        }
    }
    
    fetchLatestMessageForTopic(topicIdentifier, callback) {
        const self = this;
        if (this.apiURL === "loopback") {
            callback(null, {
                success: true, 
                statusCode: 200,
                description: "Success",
                detail: "latest",
                timestamp: this.getCurrentUniqueTimestamp(),
                status: 'OK',
                currentTimestamp: this.getCurrentUniqueTimestamp(),
                latestRecord: {
                    messageContents: self.latestMessageForTopic(topicIdentifier),
                    // TODO: Fill these in correctly
                    sha256AndLength: null, 
                    receivedTimestamp: null,
                    topicTimestamp: null
                }
            });
        } else {
            // Send to a real server immediately
    
            const apiRequest = {
                action: "pointrel20150417_queryForLatestMessage",
                journalIdentifier: this.journalIdentifier,
                topicIdentifier: topicIdentifier
            };
            if (debugMessaging) console.log("sending queryForLatestMessage request", apiRequest);
            this.prepareApiRequestForSending(apiRequest);
            
            // Do not set outstandingServerRequestSentAtTimestamp as this is an immediate request that does not block polling
            this.serverStatus("waiting", "requesting latest message " + new Date().toISOString());
            
            this.apiRequestSend(apiRequest, shortTimeout_ms, function(response) {
                if (debugMessaging) console.log("Got latest message for topic response", response);
                if (!response.success) {
                    console.log("ERROR: report queryForLatestMessage failure", response);
                    self.serverStatus("failure", "Report queryForLatestMessage failure: " + response.statusCode + " :: " + response.description);
                    callback(response || "Failed");
                } else {
                    self.okStatus();
                    callback(null, response);
                }
             }, function(error) {
                self.serverStatus("failure", "Problem fetching latest message for topic from server: " + error.message);
                console.log("Got server error when fetching latest message for topic from server", error.message);
                callback(error);
            });
        }        
    }
    
    createJournal(journalIdentifier, callback) {
        if (this.apiURL === "loopback") {
            callback(null, {
                success: true, 
                statusCode: 200,
                description: "Success",
                timestamp: this.getCurrentUniqueTimestamp(),
                status: 'OK',
                version: "PointrelServer-loopback",
                currentUniqueTimestamp: this.getCurrentUniqueTimestamp(),
                journalIdentifier: journalIdentifier
            });
        } else {
            // Send to a real server immediately
    
            const apiRequest = {
                action: "pointrel20150417_createJournal",
                journalIdentifier: journalIdentifier
            };
            if (debugMessaging) console.log("sending createJournal request", apiRequest);
            this.prepareApiRequestForSending(apiRequest);
            
            // Do not set outstandingServerRequestSentAtTimestamp as this is an immediate request that does not block polling
            this.serverStatus("waiting", "requesting createJournal " + new Date().toISOString());
            
            const self = this;
            this.apiRequestSend(apiRequest, shortTimeout_ms, function(response) {
                if (debugMessaging) console.log("Got createJournal response", response);
                if (!response.success) {
                    console.log("ERROR: report createJournal failure", response);
                    self.serverStatus("failure", "Report createJournal failure: " + response.statusCode + " :: " + response.description);
                    callback(response || "Failed");
                } else {
                    self.okStatus();
                    callback(null, response);
                }
             }, function(error) {
                self.serverStatus("failure", "Problem with createJournal from server: " + error.description);
                console.log("Got server error for createJournal", error.message);
                callback(error);
            });
        }
    }

    resetJournal(journalIdentifier, callback) {
        if (this.apiURL === "loopback") {
            callback(null, {
                success: true, 
                statusCode: 200,
                description: "Success",
                timestamp: this.getCurrentUniqueTimestamp(),
                status: 'OK',
                version: "PointrelServer-loopback",
                currentUniqueTimestamp: this.getCurrentUniqueTimestamp(),
                journalIdentifier: journalIdentifier
            });
        } else {
            // Send to a real server immediately
    
            const apiRequest = {
                action: "pointrel20150417_resetJournal",
                journalIdentifier: journalIdentifier
            };
            if (debugMessaging) console.log("sending resetJournal request", apiRequest);
            this.prepareApiRequestForSending(apiRequest);
            
            // Do not set outstandingServerRequestSentAtTimestamp as this is an immediate request that does not block polling
            this.serverStatus("waiting", "requesting resetJournal " + new Date().toISOString());
            
            const self = this;
            this.apiRequestSend(apiRequest, shortTimeout_ms, function(response) {
                if (debugMessaging) console.log("Got resetJournal response", response);
                if (!response.success) {
                    console.log("ERROR: report resetJournal failure", response);
                    self.serverStatus("failure", "Report resetJournal failure: " + response.statusCode + " :: " + response.description);
                    callback(response || "Failed");
                } else {
                    self.okStatus();
                    self.resetJournalContents();
                    callback(null, response);
                }
             }, function(error) {
                self.serverStatus("failure", "Problem with resetJournal from server: " + error.description);
                console.log("Got server error for resetJournal", error.message);
                callback(error);
            });
        }
    }

    hideJournal(journalIdentifier, callback) {
        if (this.apiURL === "loopback") {
            callback(null, {
                success: true, 
                statusCode: 200,
                description: "Success",
                timestamp: this.getCurrentUniqueTimestamp(),
                status: 'OK',
                version: "PointrelServer-loopback",
                currentUniqueTimestamp: this.getCurrentUniqueTimestamp(),
                journalIdentifier: journalIdentifier
            });
        } else {
            // Send to a real server immediately
    
            const apiRequest = {
                action: "pointrel20150417_hideJournal",
                journalIdentifier: journalIdentifier
            };
            if (debugMessaging) console.log("sending hideJournal request", apiRequest);
            this.prepareApiRequestForSending(apiRequest);
            
            // Do not set outstandingServerRequestSentAtTimestamp as this is an immediate request that does not block polling
            this.serverStatus("waiting", "requesting hideJournal " + new Date().toISOString());
            
            const self = this;
            this.apiRequestSend(apiRequest, shortTimeout_ms, function(response) {
                if (debugMessaging) console.log("Got hideJournal response", response);
                if (!response.success) {
                    console.log("ERROR: report hideJournal failure", response);
                    self.serverStatus("failure", "Report hideJournal failure: " + response.statusCode + " :: " + response.description);
                    callback(response || "Failed");
                } else {
                    self.okStatus();
                    //self.resetJournalContents();  don't need this because it is only called from the admin screen
                    callback(null, response);
                }
             }, function(error) {
                self.serverStatus("failure", "Problem with hideJournal from server: " + error.description);
                console.log("Got server error for hideJournal", error.message);
                callback(error);
            });
        }
    }
    
    reportJournalStatus(callback) {
        if (this.apiURL === "loopback") {
            callback(null, {
                success: true, 
                statusCode: 200,
                description: "Success",
                timestamp: this.getCurrentUniqueTimestamp(),
                status: 'OK',
                version: "PointrelServer-loopback",
                currentUniqueTimestamp: this.getCurrentUniqueTimestamp(),
                journalIdentifier: this.journalIdentifier,
                // TODO: need to create earliest and latest record for loopback using messagesSortedByReceivedTimeArray
                journalEarliestRecord: null,
                journalLatestRecord: null,
                journalRecordCount: this.messagesSortedByReceivedTimeArray.length,
                readOnly: false,
                permissions: {
                    read: true,
                    write: true,
                    admin: true,
                    superUser: true
                }
            });
        } else {
            // Send to a real server immediately
    
            const apiRequest = {
                action: "pointrel20150417_reportJournalStatus",
                journalIdentifier: this.journalIdentifier
            };
            if (debugMessaging) console.log("sending reportJournalStatus request", apiRequest);
            this.prepareApiRequestForSending(apiRequest);
            
            // Do not set outstandingServerRequestSentAtTimestamp as this is an immediate request that does not block polling
            this.serverStatus("waiting", "requesting journal status " + new Date().toISOString());
            
            const self = this;
            this.apiRequestSend(apiRequest, shortTimeout_ms, function(response) {
                if (debugMessaging) console.log("Got journal status response", response);
                if (!response.success) {
                    console.log("ERROR: report journal status failure", response);
                    self.serverStatus("failure", "Report journal status failure: " + response.statusCode + " :: " + response.description);
                    callback(response || "Failed");
                } else {
                    self.okStatus();
                    callback(null, response);
                }
             }, function(error) {
                self.serverStatus("failure", "Problem requesting status for journal from server: " + error.message);
                console.log("Got server error for report journal status", error.message);
                callback(error);
            });
        }
    }
    
    getCurrentUserInformation(callback) {
        if (this.apiURL === "loopback") {
            callback(null, {
                success: true, 
                statusCode: 200,
                description: "Success",
                timestamp: this.getCurrentUniqueTimestamp(),
                status: 'OK',
                userIdentifier: this.userIdentifier
            });
        } else {
            // Send to a real server immediately
    
            const apiRequest = {
                action: "pointrel20150417_currentUserInformation"
            };
            if (debugMessaging) console.log("sending currentUserInformation request", apiRequest);
            // Do not send credentials: this.prepareApiRequestForSending(apiRequest);
            
            // Do not set outstandingServerRequestSentAtTimestamp as this is an immediate request that does not block polling
            this.serverStatus("waiting", "requesting current user information " + new Date().toISOString());
            
            const self = this;
            this.apiRequestSend(apiRequest, shortTimeout_ms, function(response) {
                if (debugMessaging) console.log("Got currentUserInformation response", response);
                if (!response.success) {
                    console.log("ERROR: currentUserInformation request failure", response);
                    self.serverStatus("failure", "Current user information request failure: " + response.statusCode + " :: " + response.description);
                    callback(response || "Failed");
                } else {
                    self.okStatus();
                    callback(null, response);
                }
             }, function(error) {
                self.serverStatus("failure", "Problem requesting current user information from server: " + error.message);
                console.log("Got server error for current user information", error.message);
                callback(error);
            });
        }
    }
    
    latestMessageForTopic(topicIdentifier) {
        // TODO: Inefficient to search all messages; keep sorted message list per topic or just track latest for each topic?
        const messages = this.messagesSortedByReceivedTimeArray;
        for (let i = messages.length - 1; i >= 0; i--) {
            const message = messages[i];
            if (message._topicIdentifier === topicIdentifier) {
                return message;
            }
        }
        return null;
    }
    
    filterMessages(filterFunction): Message[] {
        return this.messagesSortedByReceivedTimeArray.filter(filterFunction);
    }
    
    getCurrentUniqueTimestamp() {
        return PointrelClient.getCurrentUniqueTimestamp();
    }
    
    // TODO: Next few from server code -- should have common routines to avoid duplicate code
    
    // serialize generates canonical JSON and is under Apache License 2.0 copied from:
    // https://github.com/erdtman/canonicalize/blob/master/lib/canonicalize.js
    static serialize(object) {
        if (typeof object === 'number' && isNaN(object)) {
            throw new Error('NaN is not allowed');
        }

        if (typeof object === 'number' && !isFinite(object)) {
            throw new Error('Infinity is not allowed');
        }

        if (object === null || typeof object !== 'object') {
            return JSON.stringify(object);
        }

        if (object.toJSON instanceof Function) {
            return PointrelClient.serialize(object.toJSON());
        }

        if (Array.isArray(object)) {
            const values = object.reduce((t, cv, ci) => {
            const comma = ci === 0 ? '' : ',';
            const value = cv === undefined || typeof cv === 'symbol' ? null : cv;
            return `${t}${comma}${PointrelClient.serialize(value)}`;
            }, '');
            return `[${values}]`;
        }

        const values = Object.keys(object).sort().reduce((t, cv) => {
            if (object[cv] === undefined ||
                typeof object[cv] === 'symbol') {
            return t;
            }
            const comma = t.length === 0 ? '' : ',';
            return `${t}${comma}${PointrelClient.serialize(cv)}:${PointrelClient.serialize(object[cv])}`;
        }, '');
        return `{${values}}`;
    }

    static stringifyAsCanonicalJSON(anObject) {
        return PointrelClient.serialize(anObject);
    }
    
    static makeSHA256AndLength(sha256AndLengthObject) {
        if (!sha256AndLengthObject.sha256 || !sha256AndLengthObject.length) {
            console.log("Problem making sha256AndLength identifier", sha256AndLengthObject);
            throw new Error("Problem making sha256AndLength identifier from: " + JSON.stringify(sha256AndLengthObject));
        }
        return sha256AndLengthObject.sha256 + "_" + sha256AndLengthObject.length;
    }
    
    static calculateCanonicalSHA256AndLengthForObject(someObject) {
        const minimalJSON = PointrelClient.stringifyAsCanonicalJSON(someObject);
        // const buffer = new Buffer(minimalJSON, "utf8");
        // console.log("minimalJSON", minimalJSON);
        
        //let max = 0;
        //for (let i = 0; i < minimalJSON.length; i++) {
        //    const c = minimalJSON.charAt(i);
        //    if (minimalJSON.charCodeAt(i) > 127) console.log("i # c", i, minimalJSON.charCodeAt(i), c);
        //    if (minimalJSON.charCodeAt(i) > max) max = minimalJSON.charCodeAt(i);
        //}
        //console.log("max", max);
        
        const utf8String = stringToUtf8(minimalJSON);
        //console.log("utf8String", utf8String);
        // console.log("match?", minimalJSON === utf8String, "minimal length", minimalJSON.length, "utf8 length", utf8String.length);
        //for (let i = 0; i < minimalJSON.length; i++) {
        //    console.log("char at i", i, minimalJSON[i]);
        //}
        
        /*
        const shaObj = new JS_SHA("SHA-256", "TEXT");
        shaObj.update(minimalJSON);
        // console.log("Without string conversion", shaObj.getHash("HEX"));
        */
        
        const sha256 = PointrelClient.calculateSHA256(minimalJSON);
        const length = utf8String.length;
        const sha256AndLength = "" + sha256 + "_" + length;
        return {sha256: "" + sha256, length: length};
    }
    
    static calculateSHA256(text) {
        // console.log("calculateSHA256", utf8Bytes);
        return "" + sha256.SHA256(text);
    }
    
    // Ensure unique timestamps are always incremented from the next by adding values at end...
    // In theory, if the server were to be stopped and be restarted in the same millisecond, these values could overlap for a millisecond in the new session
    static getCurrentUniqueTimestamp() {
        // TODO: Add random characters at end of number part of timestamp before Z
        let currentTimestamp = new Date().toISOString();
        
        const randomNumber = Math.floor(Math.random() * 1000);
        const randomPadding = (PointrelClient.timestampRandomPadding + randomNumber).slice(-(PointrelClient.timestampRandomPadding.length));
        
        if (PointrelClient.lastTimestamp !== currentTimestamp) {
            PointrelClient.lastTimestamp = currentTimestamp;
            PointrelClient.lastTimestampIncrement = 0;
            return currentTimestamp.replace("Z", PointrelClient.timestampIncrementPadding + randomPadding + "Z");
        }
        // Need to increment timestamp;
        PointrelClient.lastTimestampIncrement++;
        if (PointrelClient.lastTimestampIncrement === 1000) {
            // About to overrun timestamps -- this should probably never be possible in practice
            // on a single thread doing any actual work other than a tight loop for a couple decades (circa 2015).
            // Possible short-term fix is to pad "999999" then add more digits afterwards;
            // long-term fix is to add more zeros to padding string or have better approach
            // Note also that if this condition is reached, ISO timestamp comparisons could be incorrect
            // as the final "Z" interferes with collation
            // Another temporary option would be to introduce a delay in this situation to get
            // to the next millisecond before the timestamp's final text value is determined
            console.log("getCurrentUniqueTimestamp: failure with timestamp padding from fast CPU -- add more timestamp padding");
        }
        const extraDigits = (PointrelClient.timestampIncrementPadding + PointrelClient.lastTimestampIncrement).slice(-(PointrelClient.timestampIncrementPadding.length));
        currentTimestamp = currentTimestamp.replace("Z", extraDigits +  randomPadding + "Z");
        return currentTimestamp;
    }
    
    // End -- from server
    
    // ------------- Internal methods below not meant to be called by users
    
    private sendOutgoingMessage() {
        let callback;
        if (debugMessaging) console.log("sendOutgoingMessage");
        if (this.outgoingMessageQueue.length === 0) return;
        if (debugMessaging) console.log("sendOutgoingMessage proceeding");
        
        const self = this;
        if (this.apiURL === "loopback" || this.areOutgoingMessagesSuspended) {
            // Pretend to send all the outgoing messages we have
            while (this.outgoingMessageQueue.length) {
                const loopbackMessage = this.outgoingMessageQueue.shift();
                callback = loopbackMessage.__pointrel_callback;
                if (callback !== undefined) delete loopbackMessage.__pointrel_callback;
                this.messageSentCount++;
                // Simulating eventual response from server, generally for testing
                this.messageReceived(JSON.parse(PointrelClient.stringifyAsCanonicalJSON(loopbackMessage)));
                if (callback) callback(null, {success: true});
            }
        } else {
            // Send to a real server
            
            // Wait for later if a request is outstanding already, like polling for new messages
            if (this.outstandingServerRequestSentAtTimestamp) return;

            // If this fails, and there is no callback, this will leave message on outgoing queue (unless it was rejected for some reason)
            // If there is a callback, the message will be discarded as presumably the caller will handle resending it
            const message = this.outgoingMessageQueue[0];
            callback = message.__pointrel_callback;
            if (callback !== undefined) delete message.__pointrel_callback;
           
            const apiRequest = {
                action: "pointrel20150417_storeMessage",
                journalIdentifier: this.journalIdentifier,
                message: message
            };
            if (debugMessaging) console.log("sending store message request", apiRequest);
            this.prepareApiRequestForSending(apiRequest);
            
            this.outstandingServerRequestSentAtTimestamp = new Date();
            this.serverStatus("waiting", "storing " + this.outstandingServerRequestSentAtTimestamp);
            
            this.apiRequestSend(apiRequest, shortTimeout_ms, function(response) {
                if (debugMessaging) console.log("Got store response", response);
                self.outstandingServerRequestSentAtTimestamp = null;
                if (!response.success) {
                    console.log("ERROR: Message store failure", response, self.outgoingMessageQueue[0], JSON.stringify(self.outgoingMessageQueue[0]));
                    
                    if (callback) {
                        self.serverStatus("failure", "Message store failure: " + response.statusCode + " :: " + response.description);
                        // Discard the message from the queue as presumably the caller will resend it
                        self.outgoingMessageQueue.shift();
                        callback(response || "Failed");
                        return;
                    }
                    
                    // Need to otherwise decide whether to discard the message based on the nature of the problem
                    // Should leave it in the queue if it is not malformed and it is just a possibly temporary problem with server
                    // If the message we sent was rejected because it was malformed or a duplicate, we should discard it
                    // Do not continue with requests until next poll...
                    
                    // TODO: Should we not discard messages for an internal server error (500)?
                    if (response.statusCode !== "403") {
                        // Discard all problematical messages except for ones that are not authenticated and might succeed if resent after (re)authetication
                        self.outgoingMessageQueue.shift();
                        self.serverStatus("failure-loss", "Data loss from message store failure: " + response.statusCode + " :: " + response.description);
                    }
                    return;
                } else {
                    self.okStatus();
                    self.messageSentCount++;
                    self.outgoingMessageQueue.shift();
                }
    
                // Keep sending outgoing messages if there are any more, or do other task as needed
                // Do this as a timeout so the event loop can finish its cycle first
                // Only do this if polling has been started; otherwis just assume user is sending individual messages
                if (callback) callback(null, response);
                if (self.started) {
                    setTimeout(function () {
                        // Could instead just send outgoing messages and let the timer restart the others, this will cause some extra polls
                        self.sendFetchOrPollIfNeeded();
                    }, 0);
                }
            }, function(error) {
                // TODO: Need to check for rejected status and then remove the message from the outgoing queue
                self.serverStatus("failure", "Problem storing message to server: " + error.message + 
                    "<br>You may need to reload the page to synchronize it with the current state of the server if a message was rejected for some reason.");
                console.log("Got store error", error.message);
                self.outstandingServerRequestSentAtTimestamp = null;
                if (callback) {
                    // Discard the message from the queue as presumably the caller will resend it
                    self.outgoingMessageQueue.shift();
                    callback(error);
                }
            });
        }
    }
    
    private messageReceived(message: Message) {
        // if (debugMessaging) console.log("messageReceived", JSON.stringify(message, null, 2));
        
        if (!message) {
            console.log("ERROR: Problem with server response. No message!");
            return;
        }
        
        this.messageReceivedCount++;
        
        // Ignore the message if we already have it
        if (this.sha256AndLengthToMessageMap[message.__pointrel_sha256AndLength]) {
            // console.log("Message already received", message.__pointrel_sha256AndLength);
            return;
        }
        
        if (!message.__pointrel_trace) message.__pointrel_trace = [];
        
        // TODO: Still unsure about how to implement trace???
        const traceEntry = {
           // TODO: Should receivedBy be used???
            receivedByClient: this.userIdentifier,
            // TODO: Should the journalIdentifier really be split from the URL?
            receivedFromJournalIdentifier: this.journalIdentifier,
            receivedFromURL: this.apiURL,
            receivedTimestamp: this.getCurrentUniqueTimestamp()
        };
        message.__pointrel_trace.push(traceEntry);
        
        // TODO: Make sure the list stays sorted -- copy code from server
        this.messagesSortedByReceivedTimeArray.push(message);
        this.sha256AndLengthToMessageMap[message.__pointrel_sha256AndLength] = message;
        
        // TODO: Maybe do excepting handling for callback, as otherwise could break incoming message handling?
        if (this.messageReceivedCallback) this.messageReceivedCallback(message);
        
        topic.publish("messageReceived", message);
        if (message.messageType) {
            // console.log("publishing message", message);
            topic.publish(message.messageType, message);
        }
    }
    
    // Start boiler plate for timer management
        
    private startTimer() {
        // Stop the timer in case it was running already
        // TODO: Is stopTimer/clearTimeout safe to call if the timer has already completed?
        this.stopTimer();
        this.timer = window.setTimeout(this.timerSentSignal.bind(this), this.frequencyOfChecks_ms);
    }
    
    private stopTimer() {
        if (this.timer) {
            window.clearTimeout(this.timer);
            this.timer = null;
        }
    }
    
    // In addition to doing polling if there are no other messages to send or recieve,
    // the timer will give everything a kick to get going again shortly after something errors out
    private timerSentSignal() {
        // if (debugMessaging) console.log(new Date().toISOString(), "should do check now for new messages", this);
        this.timer = null;
        
        // catch any exceptions to ensure timer is started again
        try {
            this.sendFetchOrPollIfNeeded();
        } catch (e) {
            console.log("Exception when trying to server for changes", e);
        }
        
        this.startTimer();
    }
    
    private sendFetchOrPollIfNeeded() {
        // TODO: Prioritizing outgoing messages -- might want to revisit this for some applications?
        if (!this.areOutgoingMessagesSuspended && this.outgoingMessageQueue.length) {
            this.sendOutgoingMessage();
        } else if (this.incomingMessageRecords.length) {
            this.fetchIncomingMessage();
        } else {
            this.pollServerForNewMessages();
        }  
    }
    
    // End boilerplate for timer management
    
    private pollServerForNewMessages() {
        // Do not poll if the document is not visible
        if (document.hidden === true) {
            // console.log("pollServerForNewMessages: not polling because not visible");
            return;
        }
        
        if (this.outstandingServerRequestSentAtTimestamp) {
            // TODO: Warn if connection seems to have failed
            console.log("Still waiting on previous server request");
            const waiting_ms = new Date().getTime() - this.outstandingServerRequestSentAtTimestamp.getTime();
            console.log("Have been waiting on server for waiting_ms", waiting_ms);
            if (waiting_ms > 10000) {
                // Should never get here if timeout is 2000ms and timers get the process restarted
                if (!this.serverResponseWarningIssued) {
                    console.log("Server not responding");
                    this.serverStatus("falure", "The server is not responding...");
                    this.serverResponseWarningIssued = true;
                }
            }
            return;
        }
        
        if (debugMessaging) console.log("Polling server for changes...");
        const apiRequest = {
            action: "pointrel20150417_queryForNextMessage",
            journalIdentifier: this.journalIdentifier,
            fromTimestampExclusive: this.lastReceivedTimestampConsidered,
            // The server may return less than this number of message if including message contents and they exceed about 1MB in total
            limitCount: 100,
            includeMessageContents: this.includeMessageContents,
            topicIdentifier: undefined
        };
        if (this.topicIdentifier !== undefined) {
            apiRequest.topicIdentifier = this.topicIdentifier;
        }
        if (debugMessaging) console.log("sending polling request", apiRequest);
        this.prepareApiRequestForSending(apiRequest);
        
        // TODO: What do do if it fails? Leave message on outgoing queue?
        this.outstandingServerRequestSentAtTimestamp = new Date();
        this.serverStatus("waiting", "polling " + this.outstandingServerRequestSentAtTimestamp);
        
        const self = this;
         // Use longer timeout to account for reading multiple records on server
        this.apiRequestSend(apiRequest, longTimeout_ms, function(response) {
            if (debugMessaging) console.log("Got query response", response);
            if (!response.success) {
                console.log("Response was a failure", response);
                self.serverStatus("failure", "Polling response failure: " + response.statusCode + " :: " + response.description);
            } else {
                self.okStatus();
                for (let i = 0; i < response.receivedRecords.length; i++) {
                    const receivedRecord = response.receivedRecords[i];
                    // if (debugMessaging) console.log("New message", receivedRecord);
                    if (receivedRecord.messageContents !== undefined) {
                        /// console.log("got contents directly", receivedRecord);
                        if (receivedRecord.messageContents !== null) {
                            self.messageReceived(receivedRecord.messageContents);
                        } else {
                            // Would be issue with the messages becoming out of order if did not just reject messages
                            //   with null contents when requesting contents with polling result, like if did a retry instead
                            console.log("Message contents not available for message", receivedRecord);
                        }
                        // delete receivedRecord.messageContents;
                    } else {
                        self.incomingMessageRecords.push(receivedRecord);
                    }
                }
                self.lastReceivedTimestampConsidered = response.lastReceivedTimestampConsidered;
            }
            self.outstandingServerRequestSentAtTimestamp = null;
            if (response.receivedRecords && response.receivedRecords.length) {
                // Schedule another request immediately if getting contents
                setTimeout(function () {
                    self.sendFetchOrPollIfNeeded();
                }, 0);
            } else {
                if (self.idleCallback) {
                    const callback = self.idleCallback;
                    self.idleCallback = null;
                    console.log("Doing one-time idle callback");
                    callback();
                }
            }
        }, function(error) {
            console.log("Got query error", error.message);
            self.serverStatus("failure", "Something went wrong talking to the server when querying for new messages: " + error.message);
            // TODO: How to recover?
            self.outstandingServerRequestSentAtTimestamp = null;
        });
    }
    
    private fetchIncomingMessage() {
        if (this.incomingMessageRecords.length === 0) {
            this.serverStatus("waiting", "waiting");
            return;
        }
        if (this.outstandingServerRequestSentAtTimestamp) return;
        if (debugMessaging) console.log("Trying to fetch incoming message");
        const incomingMessageRecord = this.incomingMessageRecords[0];
        
        if (incomingMessageRecord.messageContents) {
            this.incomingMessageRecords.shift();
            this.messageReceived(incomingMessageRecord.messageContents);
            this.sendFetchOrPollIfNeeded();
            return;
        }
        
        if (debugMessaging) console.log("Retrieving new message...");
        
        const apiRequest = {
            action: "pointrel20150417_loadMessage",
            journalIdentifier: this.journalIdentifier,
            sha256AndLength: incomingMessageRecord.sha256AndLength,
            topicIdentifier: undefined
        };
        if (this.topicIdentifier !== undefined) {
            // The topicIdentifier is needed in case we only have permission to read within a specific topic
            apiRequest.topicIdentifier = this.topicIdentifier;
        }
        if (debugMessaging) console.log("sending load request", apiRequest);
        this.prepareApiRequestForSending(apiRequest);
        
        this.outstandingServerRequestSentAtTimestamp = new Date();
        this.serverStatus("waiting", "loading " + this.outstandingServerRequestSentAtTimestamp);
        
        const self = this;
        this.apiRequestSend(apiRequest, shortTimeout_ms, function(response) {
            self.okStatus();
            if (debugMessaging) console.log("Got load response", response);
            self.outstandingServerRequestSentAtTimestamp = null;
            self.incomingMessageRecords.shift();
            if (!response.success) {
                console.log("Problem retrieving message; response:", response, "for message record:", incomingMessageRecord);
                // TODO; Is this really a "serverStatus" to display?
                self.serverStatus("failure", "Message retrieval failure: " + response.statusCode + " :: " + response.description);
                // TODO: Just assuming that this was an error that the item is not available, as opposed to authentication error or other
                // TODO: so assuming it is OK to discard it from incomingMessageRecords
                // TODO: maybe also want to move record to an unavalible records list?
            } else {
                self.messageReceived(response.message);
            }
            
            // Keep loading incoming messages if there are any more, or do other task as needed
            // Do this as a timeout so the event loop can finish its cycle first
            setTimeout(function () {
                self.sendFetchOrPollIfNeeded();
            }, 0);
        }, function(error) {
            console.log("Got load error", error.message);
            self.serverStatus("failure", "Something went wrong talking to the server when loading a message: " + error.message);
            self.outstandingServerRequestSentAtTimestamp = null;
        });
    }
    
    // Status should be ok, waiting, or failure
    private serverStatus(status, message) {
        if (this.serverStatusCallback) this.serverStatusCallback(status, message);
    }
    
    private okStatus() {
        this.serverStatus("ok", "OK (sent: " + this.messageSentCount + ", received: " + this.messageReceivedCount + ")");
    }
}

export = PointrelClient;
    