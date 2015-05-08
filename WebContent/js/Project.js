define([
    "js/pointrel20150417/PointrelClient",
    "js/pointrel20150417/TripleStore",
    "js/domain",
    "js/versions",
    "dijit/layout/ContentPane"
], function(
    PointrelClient,
    TripleStore,
    domain,
    versions,
    ContentPane
) {  
    "use strict";
    
    var serverURL = "/api/pointrel20150417";
    
    var Project = function(journalIdentifier, projectIdentifier, userIdentifier, updateServerStatus) {
        this.journalIdentifier = journalIdentifier;
        this.projectIdentifier = projectIdentifier;
        this.userIdentifier = userIdentifier;

        this.pointrelClient = new PointrelClient(serverURL, this.journalIdentifier, this.userIdentifier, receivedMessage, updateServerStatus);
        
        // For now, listen on all topics in the journal
        // TODO: Think about how to move topicIdentifier into pointrelClient initialization
        // var topicIdentifier = "project001";
        // pointrelClient.topicIdentifier = topicIdentifier;
        
        this.tripleStore = new TripleStore(this.pointrelClient, "testing");
        console.log("tripleStore", this.tripleStore);
    };
    
    Project.prototype.startup = function(callback) {
        var self = this;
        this.pointrelClient.reportJournalStatus(function(error, response) {
            console.log("reportJournalStatus response", error, response);
            if (error) {
                console.log("Failed to startup project", error);
                callback(error);
            } else {
                self.pointrelClient.startup();
                callback(null, response);
            }
        });
    };
    
    Project.prototype.getFieldValue = function(fieldName) {
        var triple = this.tripleStore.queryLatest(this.projectIdentifier, fieldName, undefined);
        console.log("getFieldValue: got triple for query", fieldName, triple);
        if (triple) {
            return triple.c;
        }
        return undefined;
    };
    
    Project.prototype.setFieldValue = function(fieldName, newValue, oldValue) {
        // TODO: Need to add support in tripleStore for oldValue
        this.tripleStore.add(this.projectIdentifier, fieldName, newValue, oldValue);
    };
    
    // callback(triple, message)
    // Don't forget to "own" the handle in a component or call remove when done to avoid memory leaks
    Project.prototype.watchFieldValue = function(fieldName, callback) {
        return this.tripleStore.subscribe(this.projectIdentifier, fieldName, undefined, callback);
    };
    
    // TODO: What do do about this function? Especially if want to track chat messages or log messages or undoable changes for project?
    function receivedMessage(message) {
        // console.log("receivedMessage", message);
    }
    
    return Project;
    
});