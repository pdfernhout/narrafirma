define([
    "dojo/_base/lang",
    "js/pointrel20141201Client"
], function(
    lang,
    pointrel20141201Client
) {
    "use strict";
    
    // This is intended to track a bunch of documents on the server to see if they change.
    // It also caches the contents of the documents.
    
    // TODO: when to clear out cache entries? Never?

    // TODO: change this default to 15 seconds - shorter now for initial development
    var defaultCheckFrequency_ms = 3000;
    
    /* Example cache entry
    {
        type: "PointrelCacheEntry",
        documentID: "???",
        lastFetchedResourceID: "???",
        lastFetchedTimestamp_ms: "???",
        lastCheckedTimestamp_ms: "???",
        lastRequestedTimestamp_ms: "???",
        versionEnvelopesByResourceID: {}
    }
    */
    
    var PointrelCache = function() {
        console.log("constructing a PointrelCache", this);
        this.lastCheckTime = null;
        this.frequencyOfChecks_ms = defaultCheckFrequency_ms;
        this.timer = null;
        
        this.documentCache = {};
    };
    
    // ------------- External API to be used by callers
    
    // TODO: Make variant of this method which accepts multiple documentIDs
    PointrelCache.prototype.getLatestDocumentVersionEnvelope = function(documentID, timeTolerance_ms, callback) {
        var now_ms = new Date().getTime();
        if (timeTolerance_ms !== 0 && !timeTolerance_ms) timeTolerance_ms = this.frequencyOfChecks_ms;
        console.log("====================== getLatestDocumentVersionEnvelope", documentID, now_ms, timeTolerance_ms);
        var self = this;
        if (!documentID) throw new Error("PointrelCache.getCurrentDocumentVersion documentID should not be empty");
        
        var cacheEntry = this.documentCache[documentID];
        
        if (cacheEntry) {
            var durationSinceLastChecked_ms = now_ms - cacheEntry.lastCheckedTimestamp_ms;
            console.log("found cache entry", now_ms, durationSinceLastChecked_ms, documentID, cacheEntry);
            if (timeTolerance_ms !== 0 && durationSinceLastChecked_ms < timeTolerance_ms) {
                console.log("cache entry version is within tolerance", documentID);
                // The latest version we know about is within the time tolerance
                // However, we still might never have retrieved it
                var documentVersionEnvelope = cacheEntry.versionEnvelopesByResourceID[cacheEntry.lastFetchedResourceID];
                if (documentVersionEnvelope) {
                    cacheEntry.lastRequestedTimestamp_ms = now_ms;
                    console.log("-------------- PointrelCache: Returning existing cache entry", now_ms, cacheEntry);
                    callback(null, cacheEntry.versionEnvelopesByResourceID[cacheEntry.lastFetchedResourceID]);
                    return;
                }
                console.log("cache entry version needs to be loaded");
                // We know there is a later version, but we don't have it, so we will have to load it
            } else {
                // Based on what the user requested with timeTolerence_ms,
                // we need to check on the server to see if there is a later version (even though we might none-the-less already have the latest version)
                // TODO: Could optimize just asking the server for the resourceID of the latest, since we may have something stored already
                // console.log("TODO: Could check here if server has later version without pulling down data");
            }
        }
        
        // Need to request the latest document version and contents from the server
        console.log("-------------- PointrelCache: Fetching latest version of document", now_ms, documentID, cacheEntry);
        pointrel20141201Client.loadLatestEnvelopeForID(documentID, function(error, envelope) {
            if (error) {
                if (error === "No items found for id") error = "No stored versions could be loaded -- have any project versions been saved?";
                callback(error);
                return;
            }
            self.addDocumentVersionEnvelopeToCache(documentID, envelope, now_ms);
            callback(null, envelope);
        });
    };
    
    PointrelCache.prototype.track = function(documentID) {
        // TODO: Fill this in
    };
    
    // ------------- Internal methods below not meant to be called by users
    
    // Start boiler plate for timer management
    
    PointrelCache.prototype.startup = function() {
        console.log(new Date().toISOString(), "starting up PointrelCache", this);
        this.startTimer();
    };
    
    PointrelCache.prototype.shutdown = function() {
        console.log(new Date().toISOString(), "shutting down PointrelCache", this);
        this.stopTimer();
    };
        
    PointrelCache.prototype.startTimer = function() {
        // Stop the timer in case it was running already
        // TODO: Is stopTimer/clearTimeout safe to call if the timer has already completed?
        this.stopTimer();
        this.timer = window.setTimeout(lang.hitch(this, this.timerSentSignal), this.frequencyOfChecks_ms);
    };
    
    PointrelCache.prototype.stopTimer = function() {
        if (this.timer) {
            window.clearTimeout(this.timer);
            this.timer = null;
        }
    };
    
    PointrelCache.prototype.timerSentSignal = function() {
        console.log(new Date().toISOString(), "should do check now", this);
        this.timer = null;
        
        // catch any exceptions to ensure timer is started again
        try {
            this.pollServerForChanges();
        } catch (e) {
            console.log("Exception when trying to poll server for changes", e);
        }
        
        this.startTimer();
    };
    
    // End boilerplate for timer management
    
    PointrelCache.prototype.pollServerForChanges = function() {
        // TODO: Fill this in
    };
    
    PointrelCache.prototype.addDocumentVersionEnvelopeToCache = function(documentID, envelope, timestamp) {
        // TODO: Could verify envelope more?
        if (envelope.id !== documentID) {
            console.log("documentID mismatch", documentID, "envelope", envelope);
            throw new Error("document ID does not match one in envelope");
        }
        var resourceID = envelope.__sha256HashAndLength;
        if (!resourceID) {
            console.log("resourceID missing", envelope);
            throw new Error("resource ID is missing in envelope");
        }
        var cacheEntry = this.documentCache[documentID];
        if (!cacheEntry) {
            cacheEntry = {
                type: "PointrelCacheEntry",
                documentID: documentID,
                lastFetchedResourceID: null,
                lastFetchedTimestamp_ms: null,
                lastCheckedTimestamp_ms: null,
                versionEnvelopesByResourceID: {}
            };
            this.documentCache[documentID] = cacheEntry;
        }
        cacheEntry.lastFetchedResourceID = resourceID;
        cacheEntry.lastFetchedTimestamp_ms = timestamp;
        cacheEntry.lastCheckedTimestamp_ms = timestamp;
        cacheEntry.lastRequestedTimestamp_ms = timestamp;
        cacheEntry.versionEnvelopesByResourceID[resourceID] = envelope;
    };
  
    return PointrelCache;
});