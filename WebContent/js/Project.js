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
    
    var Project = function(updateServerStatus) {
        // TODO: Fix hardcoded values
        
        this.projectIdentifier = "test-project";
        
        // TODO: userID is hardcoded
        var userID = "tester1";
        
        // var topicIdentifier = "project001";
        
        var serverURL = "/api/pointrel20150417";
        
        // TODO: Journal name is hardcoded...
        this.pointrelClient = new PointrelClient(serverURL, "testing", userID, receivedMessage, updateServerStatus);
        
        // TODO: Think about how to move this into pointrelClient initialization
        // pointrelClient.topicIdentifier = topicIdentifier;
        
        this.tripleStore = new TripleStore(this.pointrelClient, "testing");
        console.log("tripleStore", this.tripleStore);
        
        this.pointrelClient.startup();
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