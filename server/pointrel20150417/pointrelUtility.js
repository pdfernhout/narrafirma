/*jslint node: true */
"use strict";

var crypto = require('crypto');

//--- Logging 

function log() {
    return console.log.apply(console, ['[' + new Date().toISOString() + ']'].concat(Array.prototype.slice.call(arguments)));
}

//--- Comparing

// serialize generates canonical JSON and is under Apache License 2.0 copied from:
// https://github.com/erdtman/canonicalize/blob/master/lib/canonicalize.js
function serialize(object) {
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
        return serialize(object.toJSON());
    }

    if (Array.isArray(object)) {
        const values = object.reduce((t, cv, ci) => {
            const comma = ci === 0 ? '' : ',';
            const value = cv === undefined || typeof cv === 'symbol' ? null : cv;
            return `${t}${comma}${serialize(value)}`;
        }, '');
        return `[${values}]`;
    }

    const values = Object.keys(object).sort().reduce((t, cv) => {
        if (object[cv] === undefined ||
            typeof object[cv] === 'symbol') {
            return t;
        }
        const comma = t.length === 0 ? '' : ',';
        return `${t}${comma}${serialize(cv)}:${serialize(object[cv])}`;
    }, '');
    return `{${values}}`;
}

function stringifyAsCanonicalJSON(anObject) {
    return serialize(anObject);
}

function addItemToSortedArray(sortedArray, item, compareFunction) {
    // console.log("addItemToSortedArray", item);
    // Most of the time, we will be adding items to the end of an already sorted list.
    // So, this simple optimization prevents extra sorting by checking if the new item comes after the last item in the existing list
    var isSortingNeeded = false;
    var itemCount = sortedArray.length;
    if (itemCount > 0) {
        var latestStoredItem = sortedArray[itemCount - 1];
        var compareResult = compareFunction(latestStoredItem, item);
        if (compareResult === 0) {
            var errorMessage = "New item compares the same as last one previously added to sorted index: " + JSON.stringify(item);
            log(errorMessage);
            // TODO: Might not really want to throw this error in production? Mainly for developer checking right now
            throw new Error(errorMessage);
        }
        if (compareResult > 0) isSortingNeeded = true;
    }
    sortedArray.push(item);
    if (isSortingNeeded) {
        log("addItemToSortedArray: Sorting needed; item count", itemCount + 1);
        sortedArray.sort(compareFunction);
    }
}

//--- String testing

function startsWith(str, prefix) {
    return str.indexOf(prefix) === 0;
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

//--- Hashing

function calculateSHA256(bufferOrString) {
    var hash = crypto.createHash('sha256');
    // 'utf8' is ignored if passed a buffer and not a string
    hash.update(bufferOrString, 'utf8');
    return hash.digest('hex');
}

function makeSHA256AndLength(sha256AndLengthObject) {
    if (!sha256AndLengthObject.sha256 || !sha256AndLengthObject.length) {
        log("Problem making sha256AndLength identifier", sha256AndLengthObject);
        throw new Error("Problem making sha256AndLength identifier from: " + JSON.stringify(sha256AndLengthObject));
    }
    return sha256AndLengthObject.sha256 + "_" + sha256AndLengthObject.length;
}

function calculateCanonicalSHA256ForObject(someObject) {
    var minimalJSON = stringifyAsCanonicalJSON(someObject);
    var buffer = Buffer.from(minimalJSON, "utf8");
    var sha256 = calculateSHA256(buffer);
    return sha256;
}

function calculateCanonicalSHA256AndLengthForObject(someObject) {
    var minimalJSON = stringifyAsCanonicalJSON(someObject);
    var buffer = Buffer.from(minimalJSON, "utf8");
    var sha256 = calculateSHA256(buffer);
    var sha256AndLength = "" + sha256 + "_" + buffer.length;
    return {sha256: "" + sha256, length: buffer.length};
}

//-- Sanitizing

function sanitizeFileName(fileName) {
	// replace with underscore: 
	//		space
	//		two or more dots
	//		anything that is not (an alphanumeric character or underscore or dot or dash)
	// 		forward slash
    return fileName.replace(/\s/g, "_").replace(/\.[\.]+/g, "_").replace(/[^\w_\.\-]/g, "_").replace(/\//g, "_");
}

//--- Responding

function makeResponse(success, statusCode, description, extra) {
    var response = {
        success: success, 
        statusCode: statusCode,
        description: description,
        timestamp: getCurrentUniqueTimestamp()
    };
    if (extra) {
        for (var key in extra) {
            response[key] = extra[key];
        }
    }
    
    return response;
}

function makeSuccessResponse(statusCode, description, extra) {
    var response = makeResponse(true, statusCode, description, extra);
    // log("makeSuccessResponse", message);
    return response;
}

function makeFailureResponse(statusCode, description, extra) {
    var response = makeResponse(false, statusCode, description, extra);
    log("makeFailureResponse", response);
    return response;
}

/*
function sendFailureResponse(response, statusCode, description, extra) {
    var sending = makeFailureResponse(statusCode, description, extra);
    
    response.status(statusCode).send(JSON.stringify(sending));
    return false;
}

*/

//--- Timestamping

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
        log("getCurrentUniqueTimestamp: failure with timestamp padding from fast CPU -- add more timestamp padding");
    }
    var extraDigits = (timestampIncrementPadding + lastTimestampIncrement).slice(-(timestampIncrementPadding.length));
    currentTimestamp = currentTimestamp.replace("Z", extraDigits +  randomPadding + "Z");
    return currentTimestamp;
}

function calculateMaximumAllowedTimestamp(maximumTimeDriftAllowed_ms) {
    var currentTime = new Date();
    var futureTime = new Date(currentTime.getTime() + maximumTimeDriftAllowed_ms);
    return futureTime.toISOString();
}

// To use: var maximumAllowedTimestamp = calculateMaximumAllowedTimestamp();
function isTimestampInFuture(timestamp, maximumAllowedTimestamp) {
    if (!timestamp) return false;
    // TODO: Could check timestamp format
    var isRequestTimestampIsInFuture = timestamp > maximumAllowedTimestamp;
    // console.log("Checking timestamp request: %s maximumAllowedTimestamp: %s isRequestTimestampIsInFuture: %s",  timestamp, maximumAllowedTimestamp,  isRequestTimestampIsInFuture);
    return isRequestTimestampIsInFuture;
}

//Ensure a too short ISO timestamp has exactly length characters by padding zeros before the final Z
function padTimestamp(timestamp, length) {
    // log("padTimestamp", timestamp, length);
    if (timestamp.length >= length) {
        throw new Error("Unexpected request to pad a timestamp that is already at least that long: " + timestamp + " " + length);
    }
    if (timestamp.charAt(timestamp.length - 1) !== "Z") {
        throw new Error("Expected timestamp to end in 'Z': " + timestamp);
    }
    timestamp = timestamp.substring(0, timestamp.length - 1);
    while (timestamp.length < length - 1) {
        timestamp += "0";
    }
    var result = timestamp + "Z";
    // log("padTimestamp result", result);
    return result;
}

function compareISOTimestamps(aTimestamp, bTimestamp) {
    // log("compareISOTimestamps", aTimestamp, bTimestamp);
    
    // TODO: May compare wrong if these are not the same length
    if (aTimestamp.length !== bTimestamp.length) {
        // throw new Error("expected timestamps to be same length: " + aTimestamp + " " + bTimestamp);
        if (aTimestamp.length < bTimestamp.length) {
            aTimestamp = padTimestamp(aTimestamp, bTimestamp.length);
        } else {
            bTimestamp = padTimestamp(bTimestamp, aTimestamp.length);
        }
    }
    
    if (aTimestamp < bTimestamp) return -1;
    if (aTimestamp > bTimestamp) return 1;
    return 0;
}

function compareReceivedRecords(a, b) {
    var timestampComparison = compareISOTimestamps(a.receivedTimestamp, b.receivedTimestamp);
    // log("compareReceivedRecords timestampComparison", timestampComparison);
    if (timestampComparison !== 0) return timestampComparison;
    
    // Timestamps match. Distinguish by SHA256 and length
    if (a.sha256AndLength < b.sha256AndLength) return -1;
    if (a.sha256AndLength > b.sha256AndLength) return 1;
    
    // Should never happen that everything matches...
    throw new Error("compareReceivedRecords: both timestamps and sha256AndLength match unexpectedly. Is this a duplicate receivedRecord entry?");
    // return 0;   
}

function compareReceivedRecordsByTopicTimestamp(a, b) {
    var timestampComparison = compareISOTimestamps(a.topicTimestamp, b.topicTimestamp);
    // log("compareReceivedRecordsByTopicTimestamp timestampComparison", timestampComparison);
    if (timestampComparison !== 0) return timestampComparison;
    
    // Timestamps match. Distinguish by SHA256 and length
    if (a.sha256AndLength < b.sha256AndLength) return -1;
    if (a.sha256AndLength > b.sha256AndLength) return 1;
    
    // Should never happen that everything matches...
    throw new Error("compareReceivedRecordsByTopicTimestamp: both timestamps and sha256AndLength match unexpectedly. Is this a duplicate receivedRecord entry?");
    // return 0;   
}

exports.log = log;

exports.stringifyAsCanonicalJSON = stringifyAsCanonicalJSON;
exports.addItemToSortedArray = addItemToSortedArray;

exports.startsWith = startsWith;
exports.endsWith = endsWith;

exports.calculateSHA256 = calculateSHA256;
exports.makeSHA256AndLength = makeSHA256AndLength;
exports.calculateCanonicalSHA256ForObject = calculateCanonicalSHA256ForObject;
exports.calculateCanonicalSHA256AndLengthForObject = calculateCanonicalSHA256AndLengthForObject;

exports.sanitizeFileName = sanitizeFileName;

exports.makeSuccessResponse = makeSuccessResponse;
exports.makeFailureResponse = makeFailureResponse;
// exports.sendFailureMessage = sendFailureMessage;

exports.getCurrentUniqueTimestamp = getCurrentUniqueTimestamp;
exports.calculateMaximumAllowedTimestamp = calculateMaximumAllowedTimestamp;
exports.isTimestampInFuture = isTimestampInFuture;
exports.padTimestamp = padTimestamp;
exports.compareISOTimestamps = compareISOTimestamps;
exports.compareReceivedRecords = compareReceivedRecords;
exports.compareReceivedRecordsByTopicTimestamp = compareReceivedRecordsByTopicTimestamp;