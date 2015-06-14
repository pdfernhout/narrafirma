// Pointrel20150417 for NodeJS and WordPress
// The focus is on client getting all messages of interest as they are received by the server and indexing them locally
// Each message needs to have enough easily available metadata for the server and client to do that filtering
define(["require", "exports", "dojox/encoding/digests/_base", "dojox/uuid/generateRandomUuid", "dojox/encoding/digests/SHA256", "dojo/request", "dojo/topic"], function (require, exports, digests, generateRandomUuid, SHA256, request, topic) {
    "use strict";
    // TODO: Have mode where batches requests to load messages from server to reduce round-trip latency
    // TODO: change this default to 15 seconds - shorter now for initial development
    var defaultCheckFrequency_ms = 3000;
    var debugMessaging = false;
    // TODO: Think more deeply about what server status can be, like states it transitions through (perhaps startup, polling, loading, storing, waiting-to-poll, timed-out, recovering, etc.)
    // TODO: Handle the queue of outgoing messages better, and don't allow for possibility one could get dropped if timeout or server failure or such
    // TODO: Add "credentials" somehow
    // TODO: Flag if you don't want to receive incoming messages that you sent if they are in the order sent
    // TODO: (Maybe) Flag if you don't want to recieve any of the messages that you sent...
    // userCredentials have the form {userIdentifier: "some name", userPassword: "some password"}
    // If a string is passed in, it is assumed just the userIdentifier is being supplied
    function PointrelClient(apiURL, journalIdentifier, userCredentials, messageReceivedCallback, serverStatusCallback) {
        if (messageReceivedCallback === void 0) { messageReceivedCallback = null; }
        if (serverStatusCallback === void 0) { serverStatusCallback = null; }
        if (!apiURL)
            throw new Error("No apiURL supplied");
        if (!journalIdentifier)
            throw new Error("No journalIdentifier supplied");
        if (!userCredentials)
            throw new Error("No userCredentials supplied");
        if (typeof userCredentials === "string" || userCredentials instanceof String) {
            userCredentials = {
                userIdentifier: userCredentials
            };
        }
        this.apiURL = apiURL;
        this.journalIdentifier = journalIdentifier;
        this.userIdentifier = userCredentials.userIdentifier;
        // private variable to protect against access by other code; see: http://javascript.crockford.com/private.html
        var _userCredentials = userCredentials;
        // privileged method that can access private variable
        this.prepareApiRequestForSending = function (apiRequest) {
            apiRequest.userCredentials = _userCredentials;
        };
        this.started = false;
        this.frequencyOfChecks_ms = defaultCheckFrequency_ms;
        this.timer = null;
        // By default, includeMessageContents of true will retrieve the message contents when polling to reduce back-and-forth latency to server
        // Clients might want to turn this off if they cache messages locally
        // or if they application selectively downloads big messages like images or other media perhaps depending on the topic they are in
        this.includeMessageContents = true;
        // This field is used to ensure only one request at a time is sent to the server
        this.outstandingServerRequestSentAtTimestamp = null;
        // TODO: This flag may no longer be needed on the client libary side; app should implement something like it somehow?
        this.serverResponseWarningIssued = false;
        this.lastReceivedTimestampConsidered = null;
        this.incomingMessageRecords = [];
        this.messagesSortedByReceivedTimeArray = [];
        this.sha256AndLengthToMessageMap = {};
        this.areOutgoingMessagesSuspended = false;
        this.outgoingMessageQueue = [];
        this.messageReceivedCallback = messageReceivedCallback;
        this.serverStatusCallback = serverStatusCallback;
        this.messageSentCount = 0;
        this.messageReceivedCount = 0;
        this.topicIdentifier = undefined;
        this.idleCallback = null;
    }
    // This should be called to start the polling process to keep a client up-to-date with what is in a Journal
    // You should not start polling though if you just want to get the latest message in a topic
    //  like for an application that selectively loads just a bit of published data
    PointrelClient.prototype.startup = function () {
        console.log(new Date().toISOString(), "starting up PointrelClient", this);
        if (this.apiURL === "loopback") {
            console.log("No polling done on loopback");
        }
        else {
            this.started = true;
            this.startTimer();
            this.pollServerForNewMessages();
        }
    };
    // Call this to shut down polling, like when you destroy a related GUI component
    PointrelClient.prototype.shutdown = function () {
        console.log(new Date().toISOString(), "shutting down PointrelClient", this);
        this.stopTimer();
        this.started = false;
    };
    /*
    PointrelClient.prototype.createAndSendAddTriplesMessage = function(topicIdentifier, triples) {
        var change = {
            action: "addTriples",
            triples: triples
        };
        
        return this.createAndSendChangeMessage(topicIdentifier, "TripleStore", change);
    }
    */
    // TODO: No callback?
    PointrelClient.prototype.createAndSendChangeMessage = function (topicIdentifier, messageType, change, other, callback) {
        var timestamp = this.getCurrentUniqueTimestamp();
        var message = {
            // TODO: Simplify redundancy in timestamps
            _topicIdentifier: topicIdentifier,
            _topicTimestamp: timestamp,
            // messageIdentifier: generateRandomUuid(), // Is this needed, as we have a unique ID from SHA256?
            creator: this.userIdentifier,
            creationTimestamp: timestamp,
            // TODO: createdAfter: something involving incoming records...
            messageType: messageType,
            change: change
        };
        if (other) {
            for (var key in other) {
                message[key] = other[key];
            }
        }
        this.sendMessage(message, callback);
        return message;
    };
    // Deprecated to for client to call directly; use createAndSendMessage
    // TODO: No callback?
    PointrelClient.prototype.sendMessage = function (message, callback) {
        if (debugMessaging)
            console.log("sendMessage", this.areOutgoingMessagesSuspended, message);
        // Calculate the sha256AndLength without the pointrel fields
        delete message.__pointrel_sha256AndLength;
        var oldTrace = message.__pointrel_trace;
        delete message.__pointrel_trace;
        message.__pointrel_sha256AndLength = makeSHA256AndLength(calculateCanonicalSHA256AndLengthForObject(message));
        // TODO: Maybe should put in local sender information here?
        if (!oldTrace)
            oldTrace = [];
        message.__pointrel_trace = oldTrace;
        // TODO: What should really go in this trace entry if anything???
        var traceEntry = {
            // TODO: Should sentBy be used???
            sentByClient: this.userIdentifier,
            // TODO: Should the journalIdentifier really be split from the URL?
            sentToJournalIdentifier: this.journalIdentifier,
            sentToURL: this.apiURL,
            sentTimestamp: getCurrentUniqueTimestamp()
        };
        message.__pointrel_trace.push(traceEntry);
        var previouslySent = this.sha256AndLengthToMessageMap[message.__pointrel_sha256AndLength];
        if (previouslySent) {
            console.log("A message with the same sha256AndLength was previously received (supplied/existing)", message, previouslySent);
            throw new Error("Trying to send a message with the same sha256AndLength of a message previously received");
        }
        // TODO: Extra copyObjectWithSortedKeys is not needed, but makes log messages look nicer so leaving for now
        message = copyObjectWithSortedKeys(message);
        // TODO: This field ideally should go in a wrapper object and will be deleted later
        if (callback)
            message.__pointrel_callback = callback;
        this.outgoingMessageQueue.push(message);
        this.sendOutgoingMessage();
    };
    PointrelClient.prototype.suspendOutgoingMessages = function (suspend) {
        console.log("suspendOutgoingMessages", suspend);
        if (this.areOutgoingMessagesSuspended === suspend)
            return;
        this.areOutgoingMessagesSuspended = suspend;
        if (!this.areOutgoingMessagesSuspended) {
            this.sendOutgoingMessage();
        }
    };
    PointrelClient.prototype.sendOutgoingMessage = function () {
        var callback;
        if (debugMessaging)
            console.log("sendOutgoingMessage");
        if (this.areOutgoingMessagesSuspended)
            return;
        if (this.outgoingMessageQueue.length === 0)
            return;
        if (this.outstandingServerRequestSentAtTimestamp)
            return;
        if (debugMessaging)
            console.log("sendOutgoingMessage proceeding");
        if (this.apiURL === "loopback") {
            while (this.outgoingMessageQueue.length) {
                var loopbackMessage = this.outgoingMessageQueue.shift();
                callback = loopbackMessage.__pointrel_callback;
                if (callback !== undefined)
                    delete loopbackMessage.__pointrel_callback;
                this.messageSendCount++;
                // Simulating eventual response from server, generally for testing
                this.messageReceived(copyObjectWithSortedKeys(loopbackMessage));
                if (callback)
                    callback(null, { success: true });
            }
        }
        else {
            // Send to a real server
            // If this fails, and there is no callback, this will leave message on outgoing queue (unless it was rejected for some reason)
            // If there is a callback, the message will be discarded as presumably the caller will handle resending it
            var message = this.outgoingMessageQueue[0];
            callback = message.__pointrel_callback;
            if (callback !== undefined)
                delete message.__pointrel_callback;
            var apiRequest = {
                action: "pointrel20150417_storeMessage",
                journalIdentifier: this.journalIdentifier,
                message: message
            };
            if (debugMessaging)
                console.log("sending store message request", apiRequest);
            this.prepareApiRequestForSending(apiRequest);
            this.outstandingServerRequestSentAtTimestamp = new Date();
            this.serverStatus("waiting", "storing " + this.outstandingServerRequestSentAtTimestamp);
            var self = this;
            request.post(this.apiURL, {
                data: JSON.stringify(apiRequest),
                // Two second timeout
                timeout: 2000,
                handleAs: "json",
                headers: {
                    "Content-Type": 'application/json; charset=utf-8',
                    "Accept": "application/json"
                }
            }).then(function (response) {
                if (debugMessaging)
                    console.log("Got store response", response);
                self.outstandingServerRequestSentAtTimestamp = null;
                if (!response.success) {
                    console.log("ERROR: Message store failure", response, self.outgoingMessageQueue[0]);
                    self.serverStatus("failure", "Message store failure: " + response.statusCode + " :: " + response.description);
                    if (callback) {
                        // Discard the message from the queue as presumably the caller will resend it
                        self.outgoingMessageQueue.shift();
                        callback(response);
                        return;
                    }
                    // TODO: Need to otherwise decide whether to discard the message based on the nature of the problem
                    // Should leave it in the queue if it is not malformed and it is just a possibly temporary problem with server
                    // TODO: If the message we sent was rejected because it was malformed or a duplicate, we should discard it
                    // Do not continue with requests until next poll...
                    return;
                }
                else {
                    self.okStatus();
                    self.messageSentCount++;
                    self.outgoingMessageQueue.shift();
                }
                // Keep sending outgoing messages if there are any more, or do other task as needed
                // Do this as a timeout so the event loop can finish its cycle first
                // Only do this if polling has been started; otherwis just assume user is sending individual messages
                if (callback)
                    callback(null, response);
                if (self.started) {
                    setTimeout(function () {
                        // Could instead just send outgoing messages and let the timer restart the others, this will cause some extra polls
                        self.sendFetchOrPollIfNeeded();
                    }, 0);
                }
            }, function (error) {
                // TODO: Need to check for rejected status and then remove the message from the outgoing queue
                self.serverStatus("failure", "Problem storing message to server: " + error.message + "<br>You may need to reload the page to synchronize it with the current state of the server if a message was rejected for some reason.");
                console.log("Got store error", error.message);
                self.outstandingServerRequestSentAtTimestamp = null;
                if (callback) {
                    // Discard the message from the queue as presumably the caller will resend it
                    self.outgoingMessageQueue.shift();
                    callback(error);
                }
            });
        }
    };
    PointrelClient.prototype.fetchLatestMessageForTopic = function (topicIdentifier, callback) {
        var self = this;
        if (this.apiURL === "loopback") {
            callback(null, {
                success: true,
                statusCode: 200,
                description: "Success",
                detail: "latest",
                timestamp: getCurrentUniqueTimestamp(),
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
        }
        else {
            // Send to a real server immediately
            var apiRequest = {
                action: "pointrel20150417_queryForLatestMessage",
                journalIdentifier: this.journalIdentifier,
                topicIdentifier: topicIdentifier
            };
            if (debugMessaging)
                console.log("sending queryForLatestMessage request", apiRequest);
            this.prepareApiRequestForSending(apiRequest);
            // Do not set outstandingServerRequestSentAtTimestamp as this is an immediate request that does not block polling
            this.serverStatus("waiting", "requesting latest message " + new Date().toISOString());
            request.post(this.apiURL, {
                data: JSON.stringify(apiRequest),
                // Two second timeout
                timeout: 2000,
                handleAs: "json",
                headers: {
                    "Content-Type": 'application/json; charset=utf-8',
                    "Accept": "application/json"
                }
            }).then(function (response) {
                if (debugMessaging)
                    console.log("Got latest message for topic response", response);
                if (!response.success) {
                    console.log("ERROR: report queryForLatestMessage failure", response);
                    self.serverStatus("failure", "Report queryForLatestMessage failure: " + response.statusCode + " :: " + response.description);
                    callback(response);
                }
                else {
                    self.okStatus();
                    callback(null, response);
                }
            }, function (error) {
                self.serverStatus("failure", "Problem fetching latest message for topic from server: " + error.message);
                console.log("Got server error when fetching latest message for topic from server", error.message);
                callback(error);
            });
        }
    };
    PointrelClient.prototype.reportJournalStatus = function (callback) {
        if (this.apiURL === "loopback") {
            callback({
                success: true,
                statusCode: 200,
                description: "Success",
                timestamp: getCurrentUniqueTimestamp(),
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
                    admin: true
                }
            });
        }
        else {
            // Send to a real server immediately
            var apiRequest = {
                action: "pointrel20150417_reportJournalStatus",
                journalIdentifier: this.journalIdentifier
            };
            if (debugMessaging)
                console.log("sending reportJournalStatus request", apiRequest);
            this.prepareApiRequestForSending(apiRequest);
            // Do not set outstandingServerRequestSentAtTimestamp as this is an immediate request that does not block polling
            this.serverStatus("waiting", "requesting journal status " + new Date().toISOString());
            var self = this;
            request.post(this.apiURL, {
                data: JSON.stringify(apiRequest),
                // Two second timeout
                timeout: 2000,
                handleAs: "json",
                headers: {
                    "Content-Type": 'application/json; charset=utf-8',
                    "Accept": "application/json"
                }
            }).then(function (response) {
                if (debugMessaging)
                    console.log("Got journal status response", response);
                if (!response.success) {
                    console.log("ERROR: report journal status failure", response);
                    self.serverStatus("failure", "Report journal status failure: " + response.statusCode + " :: " + response.description);
                    callback(response);
                }
                else {
                    self.okStatus();
                    callback(null, response);
                }
            }, function (error) {
                self.serverStatus("failure", "Problem requesting status for journal from server: " + error.message);
                console.log("Got server error for report journal status", error.message);
                callback(error);
            });
        }
    };
    PointrelClient.prototype.getCurrentUserInformation = function (callback) {
        if (this.apiURL === "loopback") {
            callback({
                success: true,
                statusCode: 200,
                description: "Success",
                timestamp: getCurrentUniqueTimestamp(),
                status: 'OK',
                userIdentifier: this.userIdentifier
            });
        }
        else {
            // Send to a real server immediately
            var apiRequest = {
                action: "pointrel20150417_currentUserInformation",
            };
            if (debugMessaging)
                console.log("sending currentUserInformation request", apiRequest);
            // Do not send credentials: this.prepareApiRequestForSending(apiRequest);
            // Do not set outstandingServerRequestSentAtTimestamp as this is an immediate request that does not block polling
            this.serverStatus("waiting", "requesting current user information " + new Date().toISOString());
            var self = this;
            request.post(this.apiURL, {
                data: JSON.stringify(apiRequest),
                // Two second timeout
                timeout: 2000,
                handleAs: "json",
                headers: {
                    "Content-Type": 'application/json; charset=utf-8',
                    "Accept": "application/json"
                }
            }).then(function (response) {
                if (debugMessaging)
                    console.log("Got currentUserInformation response", response);
                if (!response.success) {
                    console.log("ERROR: currentUserInformation request failure", response);
                    self.serverStatus("failure", "Current user information request failure: " + response.statusCode + " :: " + response.description);
                    callback(response);
                }
                else {
                    self.okStatus();
                    callback(null, response);
                }
            }, function (error) {
                self.serverStatus("failure", "Problem requesting current user information from server: " + error.message);
                console.log("Got server error for current user information", error.message);
                callback(error);
            });
        }
    };
    PointrelClient.prototype.okStatus = function () {
        this.serverStatus("ok", "OK (sent: " + this.messageSentCount + ", received:" + this.messageReceivedCount + ")");
    };
    PointrelClient.prototype.latestMessageForTopic = function (topicIdentifier) {
        // TODO: Inefficient to search all messages; keep sorted message list per topic or just track latest for each topic?
        var messages = this.messagesSortedByReceivedTimeArray;
        for (var i = messages.length - 1; i >= 0; i--) {
            var message = messages[i];
            if (message._topicIdentifier === topicIdentifier) {
                return message;
            }
        }
        return null;
    };
    PointrelClient.prototype.filterMessages = function (filterFunction) {
        return this.messagesSortedByReceivedTimeArray.filter(filterFunction);
    };
    PointrelClient.prototype.getCurrentUniqueTimestamp = function (filterFunction) {
        return getCurrentUniqueTimestamp();
    };
    // ------------- Internal methods below not meant to be called by users
    // TODO: From server -- should have common routines
    // TODO: Note that this approach depends on object keys maintaining their order, which is not guaranteed by the JS standards but most browsers support it
    // isObject and copyObjectWithSortedKeys are from Mirko Kiefer (with added semicolons):
    // https://raw.githubusercontent.com/mirkokiefer/canonical-json/master/index2.js
    var isObject = function (a) {
        return Object.prototype.toString.call(a) === '[object Object]';
    };
    var copyObjectWithSortedKeys = function (object) {
        if (isObject(object)) {
            var newObj = {};
            var keysSorted = Object.keys(object).sort();
            var key;
            for (var i = 0, len = keysSorted.length; i < len; i++) {
                key = keysSorted[i];
                newObj[key] = copyObjectWithSortedKeys(object[key]);
            }
            return newObj;
        }
        else if (Array.isArray(object)) {
            return object.map(copyObjectWithSortedKeys);
        }
        else {
            return object;
        }
    };
    function makeSHA256AndLength(sha256AndLengthObject) {
        if (!sha256AndLengthObject.sha256 || !sha256AndLengthObject.length) {
            console.log("Problem making sha256AndLength identifier", sha256AndLengthObject);
            throw new Error("Problem making sha256AndLength identifier from: " + JSON.stringify(sha256AndLengthObject));
        }
        return sha256AndLengthObject.sha256 + "_" + sha256AndLengthObject.length;
    }
    function calculateCanonicalSHA256AndLengthForObject(someObject, doNotSortFlag) {
        if (!doNotSortFlag)
            someObject = copyObjectWithSortedKeys(someObject);
        var minimalJSON = JSON.stringify(someObject);
        // var buffer = new Buffer(minimalJSON, "utf8");
        var sha256 = calculateSHA256(digests.stringToUtf8(minimalJSON));
        // TODO: Wasteful to have to calculate this string twice as the SHA25 digest also converts this string to utf8
        var length = digests.stringToUtf8(minimalJSON).length;
        var sha256AndLength = "" + sha256 + "_" + length;
        return { sha256: "" + sha256, length: length };
    }
    function calculateSHA256(text) {
        // console.log("calculateSHA256", text);
        return SHA256(text, digests.outputTypes.Hex);
    }
    var lastTimestamp = null;
    var lastTimestampIncrement = 0;
    // TODO: this padding needs to get longer as computers get faster
    var timestampIncrementPadding = "000";
    var timestampRandomPadding = "000";
    // Ensure unique timestamps are always incremented from the next by adding values at end...
    // In theory, if the server were to be stopped and be restarted in the same millisecond, these values could overlap for a millisecond in the new session
    function getCurrentUniqueTimestamp() {
        // TODO: Add random characters at end of number part of timestamp before Z
        var currentTimestamp = new Date().toISOString();
        var randomNumber = Math.floor(Math.random() * 1000);
        var randomPadding = (timestampRandomPadding + randomNumber).slice(-(timestampRandomPadding.length));
        if (lastTimestamp !== currentTimestamp) {
            lastTimestamp = currentTimestamp;
            lastTimestampIncrement = 0;
            return currentTimestamp.replace("Z", timestampIncrementPadding + randomPadding + "Z");
        }
        // Need to increment timestamp;
        lastTimestampIncrement++;
        if (lastTimestampIncrement === 1000) {
            // About to overrun timestamps -- this should probably never be possible in practice on a single thread doing any actual work other than a tight loop for a couple decades (circa 2015).
            // Possible short-term fix is to pad "999999" then add more digits afterwards; long-term fix is to add more zeros to padding string or have better approach
            // Note also that if this condition is reached, ISO timestamp comparisons could be incorrect as the final "Z" interferes with collation
            // Another temporary option would be to introduce a delay in this situation to get to the next millisecond before the timestamp's final text value is determined
            console.log("getCurrentUniqueTimestamp: failure with timestamp padding from fast CPU -- add more timestamp padding");
        }
        var extraDigits = (timestampIncrementPadding + lastTimestampIncrement).slice(-(timestampIncrementPadding.length));
        currentTimestamp = currentTimestamp.replace("Z", extraDigits + randomPadding + "Z");
        return currentTimestamp;
    }
    // End -- from server
    // Make utility functions available at class and instance levels
    PointrelClient.copyObjectWithSortedKeys = copyObjectWithSortedKeys;
    PointrelClient.prototype.copyObjectWithSortedKeys = copyObjectWithSortedKeys;
    PointrelClient.randomUUID = generateRandomUuid;
    PointrelClient.prototype.randomUUID = generateRandomUuid;
    PointrelClient.calculateCanonicalSHA256AndLengthForObject = calculateCanonicalSHA256AndLengthForObject;
    PointrelClient.prototype.calculateCanonicalSHA256AndLengthForObject = calculateCanonicalSHA256AndLengthForObject;
    PointrelClient.calculateSHA256 = calculateSHA256;
    PointrelClient.prototype.calculateSHA256 = calculateSHA256;
    PointrelClient.getCurrentUniqueTimestamp = getCurrentUniqueTimestamp;
    PointrelClient.prototype.getCurrentUniqueTimestamp = getCurrentUniqueTimestamp;
    PointrelClient.prototype.messageReceived = function (message) {
        // if (debugMessaging) console.log("messageReceived", JSON.stringify(message, null, 2));
        if (!message) {
            console.log("ERROR: Problem with server response. No message!");
            return;
        }
        this.messageReceivedCount++;
        // Ignore the message if we already have it
        if (this.sha256AndLengthToMessageMap[message.__pointrel_sha256AndLength]) {
            console.log("Message already received", message.__pointrel_sha256AndLength);
            return;
        }
        if (!message.__pointrel_trace)
            message.__pointrel_trace = [];
        // TODO: Still unsure about how to implement trace???
        var traceEntry = {
            // TODO: Should receivedBy be used???
            receivedByClient: this.userIdentifier,
            // TODO: Should the journalIdentifier really be split from the URL?
            receivedFromJournalIdentifier: this.journalIdentifier,
            receivedFromURL: this.apiURL,
            receivedTimestamp: getCurrentUniqueTimestamp()
        };
        message.__pointrel_trace.push(traceEntry);
        // TODO: Make sure the list stays sorted -- copy code from server
        this.messagesSortedByReceivedTimeArray.push(message);
        this.sha256AndLengthToMessageMap[message.__pointrel_sha256AndLength] = message;
        // TODO: Maybe do excepting handling for callback, as otherwise could break incoming message handling?
        if (this.messageReceivedCallback)
            this.messageReceivedCallback(message);
        topic.publish("messageReceived", message);
        if (message.messageType) {
            // console.log("publishing message", message);
            topic.publish(JSON.stringify(message.messageType), message);
        }
    };
    // Start boiler plate for timer management
    PointrelClient.prototype.startTimer = function () {
        // Stop the timer in case it was running already
        // TODO: Is stopTimer/clearTimeout safe to call if the timer has already completed?
        this.stopTimer();
        this.timer = window.setTimeout(this.timerSentSignal.bind(this), this.frequencyOfChecks_ms);
    };
    PointrelClient.prototype.stopTimer = function () {
        if (this.timer) {
            window.clearTimeout(this.timer);
            this.timer = null;
        }
    };
    // In addition to doing polling if there are no other messages to send or recieve,
    // the timer will give everything a kick to get going again shortly after something errors out
    PointrelClient.prototype.timerSentSignal = function () {
        // if (debugMessaging) console.log(new Date().toISOString(), "should do check now for new messages", this);
        this.timer = null;
        try {
            this.sendFetchOrPollIfNeeded();
        }
        catch (e) {
            console.log("Exception when trying to server for changes", e);
        }
        this.startTimer();
    };
    PointrelClient.prototype.sendFetchOrPollIfNeeded = function () {
        // TODO: Prioritizing outgoing messages -- might want to revisit this for some applications?
        if (!this.areOutgoingMessagesSuspended && this.outgoingMessageQueue.length) {
            this.sendOutgoingMessage();
        }
        else if (this.incomingMessageRecords.length) {
            this.fetchIncomingMessage();
        }
        else {
            this.pollServerForNewMessages();
        }
    };
    // End boilerplate for timer management
    PointrelClient.prototype.pollServerForNewMessages = function () {
        if (this.outstandingServerRequestSentAtTimestamp) {
            // TODO: Warn if connection seems to have failed
            console.log("Still waiting on previous server request");
            var waiting_ms = new Date().getTime() - this.outstandingServerRequestSentAtTimestamp.getTime();
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
        if (debugMessaging)
            console.log("Polling server for changes...");
        var apiRequest = {
            action: "pointrel20150417_queryForNextMessage",
            journalIdentifier: this.journalIdentifier,
            fromTimestampExclusive: this.lastReceivedTimestampConsidered,
            // The server may return less than this number of message if including message contents and they exceed about 1MB in total
            limitCount: 100,
            includeMessageContents: this.includeMessageContents
        };
        if (this.topicIdentifier !== undefined) {
            apiRequest.topicIdentifier = this.topicIdentifier;
        }
        if (debugMessaging)
            console.log("sending polling request", apiRequest);
        this.prepareApiRequestForSending(apiRequest);
        // TODO: What do do if it fails? Leave message on outgoing queue?
        this.outstandingServerRequestSentAtTimestamp = new Date();
        this.serverStatus("waiting", "polling " + this.outstandingServerRequestSentAtTimestamp);
        var self = this;
        request.post(this.apiURL, {
            data: JSON.stringify(apiRequest),
            // Ten second timeout, longer to account for reading multiple records on server
            timeout: 10000,
            handleAs: "json",
            headers: {
                "Content-Type": 'application/json; charset=utf-8',
                "Accept": "application/json"
            }
        }).then(function (response) {
            if (debugMessaging)
                console.log("Got query response", response);
            if (!response.success) {
                console.log("Response was a failure", response);
                self.serverStatus("failure", "Polling response failure: " + response.statusCode + " :: " + response.description);
            }
            else {
                self.okStatus();
                for (var i = 0; i < response.receivedRecords.length; i++) {
                    var receivedRecord = response.receivedRecords[i];
                    // if (debugMessaging) console.log("New message", receivedRecord);
                    if (receivedRecord.messageContents !== undefined) {
                        /// console.log("got contents directly", receivedRecord);
                        if (receivedRecord.messageContents !== null) {
                            self.messageReceived(receivedRecord.messageContents);
                        }
                        else {
                            // Would be issue with the messages becoming out of order if did not just reject messages
                            //   with null contents when requesting contents with polling result, like if did a retry instead
                            console.log("Message contents not available for message", receivedRecord);
                        }
                    }
                    else {
                        self.incomingMessageRecords.push(receivedRecord);
                    }
                }
                self.lastReceivedTimestampConsidered = response.lastReceivedTimestampConsidered;
            }
            self.outstandingServerRequestSentAtTimestamp = null;
            if (response.receivedRecords && response.receivedRecords.length) {
                // Schedule another request immediately if getting contents..
                setTimeout(function () {
                    self.sendFetchOrPollIfNeeded();
                }, 0);
            }
            else {
                if (self.idleCallback) {
                    var callback = self.idleCallback;
                    self.idleCallback = null;
                    console.log("Doing one-time idle callback");
                    callback();
                }
            }
        }, function (error) {
            console.log("Got query error", error.message);
            self.serverStatus("failure", "Something went wrong talking to the server when querying for new messages: " + error.message);
            // TODO: How to recover?
            self.outstandingServerRequestSentAtTimestamp = null;
        });
    };
    PointrelClient.prototype.fetchIncomingMessage = function () {
        if (this.incomingMessageRecords.length === 0) {
            this.serverStatus("waiting", "waiting");
            return;
        }
        if (this.outstandingServerRequestSentAtTimestamp)
            return;
        if (debugMessaging)
            console.log("Trying to fetch incoming message");
        var incomingMessageRecord = this.incomingMessageRecords[0];
        if (incomingMessageRecord.messageContents) {
            this.incomingMessageRecords.shift();
            this.messageReceived(incomingMessageRecord.messageContents);
            this.sendFetchOrPollIfNeeded();
            return;
        }
        if (debugMessaging)
            console.log("Retrieving new message...");
        var apiRequest = {
            action: "pointrel20150417_loadMessage",
            journalIdentifier: this.journalIdentifier,
            sha256AndLength: incomingMessageRecord.sha256AndLength,
        };
        if (this.topicIdentifier !== undefined) {
            // The topicIdentifier is needed in case we only have permission to read within a specific topic
            apiRequest.topicIdentifier = this.topicIdentifier;
        }
        if (debugMessaging)
            console.log("sending load request", apiRequest);
        this.prepareApiRequestForSending(apiRequest);
        this.outstandingServerRequestSentAtTimestamp = new Date();
        this.serverStatus("waiting", "loading " + this.outstandingServerRequestSentAtTimestamp);
        var self = this;
        request.post(this.apiURL, {
            data: JSON.stringify(apiRequest),
            // Two second timeout
            timeout: 2000,
            handleAs: "json",
            headers: {
                "Content-Type": 'application/json; charset=utf-8',
                "Accept": "application/json"
            }
        }).then(function (response) {
            self.okStatus();
            if (debugMessaging)
                console.log("Got load response", response);
            self.outstandingServerRequestSentAtTimestamp = null;
            self.incomingMessageRecords.shift();
            if (!response.success) {
                console.log("Problem retrieving message; response:", response, "for message record:", incomingMessageRecord);
                // TODO; Is this really a "serverStatus" to display?
                self.serverStatus("failure", "Message retrieval failure: " + response.statusCode + " :: " + response.description);
            }
            else {
                self.messageReceived(response.message);
            }
            // Keep loading incoming messages if there are any more, or do other task as needed
            // Do this as a timeout so the event loop can finish its cycle first
            setTimeout(function () {
                self.sendFetchOrPollIfNeeded();
            }, 0);
        }, function (error) {
            console.log("Got load error", error.message);
            self.serverStatus("failure", "Something went wrong talking to the server when loading a message: " + error.message);
            self.outstandingServerRequestSentAtTimestamp = null;
        });
    };
    // Status should be ok, waiting, or failure
    PointrelClient.prototype.serverStatus = function (status, message) {
        // console.log("PointrelClient serverStatus", status, message);
        if (this.serverStatusCallback)
            this.serverStatusCallback(status, message);
    };
    return PointrelClient;
});
