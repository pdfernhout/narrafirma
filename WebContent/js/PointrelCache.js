define([
    "dojo/_base/lang",
    "js/pointrel20141201Client"
], function(
    lang,
    pointrel20141201Client
) {
    "use strict";
    
    // This is intended to track a bunch of documents on the server to see if they change.
    // It also caches the contents of the documents

    // TODO: change this default to 15 seconds
    var defaultCheckFrequency_milliseconds = 3000;
    
    var PointrelCache = function() {
        console.log("constructing a PointrelCache", this);
        this.lastCheckTime = null;
        this.frequencyOfChecks_milliseconds = defaultCheckFrequency_milliseconds;
        this.timer = null;
        
        this.documents = {};
    };
    
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
        // TODO: Is this really safe to do if the timer has already rang?
        this.stopTimer();
        this.timer = window.setTimeout(lang.hitch(this, this.timerRang), this.frequencyOfChecks_milliseconds);
    };
    
    PointrelCache.prototype.stopTimer = function() {
        if (this.timer) {
            window.clearTimeout(this.timer);
            this.timer = null;
        }
    };

    PointrelCache.prototype.timerRang = function() {
        // TODO: Fill this in
        console.log(new Date().toISOString(), "should do check now", this);
        this.startTimer();
    };
  
    PointrelCache.prototype.track = function(documentID) {
        // TODO: Fill this in
        
    };
  
    return PointrelCache;
});