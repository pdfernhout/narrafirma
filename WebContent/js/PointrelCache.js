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
    
    var DocumentCollection = function() {
        console.log("constructing a DocumentCollection", this);
        this.lastCheckTime = null;
        this.frequencyOfChecks_milliseconds = defaultCheckFrequency_milliseconds;
        this.timer = null;
        
        this.documents = {};
    };
    
    DocumentCollection.prototype.startup = function() {
        console.log(new Date().toISOString(), "starting up DocumentCollection", this);
        this.startTimer();
    };
    
    DocumentCollection.prototype.shutdown = function() {
        console.log(new Date().toISOString(), "shutting down DocumentCollection", this);
        this.stopTimer();
    };
        
    DocumentCollection.prototype.startTimer = function() {
        // Stop the timer in case it was running already
        // TODO: Is this really safe to do if the timer has already rang?
        this.stopTimer();
        this.timer = window.setTimeout(lang.hitch(this, this.timerRang), this.frequencyOfChecks_milliseconds);
    };
    
    DocumentCollection.prototype.stopTimer = function() {
        if (this.timer) {
            window.clearTimeout(this.timer);
            this.timer = null;
        }
    };

    DocumentCollection.prototype.timerRang = function() {
        // TODO: Fill this in
        console.log(new Date().toISOString(), "should do check now", this);
        this.startTimer();
    };
  
    DocumentCollection.prototype.track = function(documentID) {
        // TODO: Fill this in
        
    };
  
    return DocumentCollection;
});