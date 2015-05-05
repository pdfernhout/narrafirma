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
    
    // TODO: Fix hardcoded values
    
    var contentPane = new ContentPane();
    contentPane.placeAt("navigationDiv");
    contentPane.startup();
    
    var statusPane = new ContentPane({content: "Server status: unknown"});
    contentPane.addChild(statusPane);
    
    // TODO: userID is hardcoded
    var userID = "tester1";
    
    // var topicIdentifier = "project001";
    
    var serverURL = "/api/pointrel20150417";
    
    // TODO: Journal name is hardcoded...
    var pointrelClient = new PointrelClient(serverURL, "testing", userID, receivedMessage, updateServerStatus);
    
    // TODO: Think about how to move this into pointrelClient initialization
    // pointrelClient.topicIdentifier = topicIdentifier;
    
    var tripleStore = new TripleStore(pointrelClient, "testing");
    console.log("tripleStore", tripleStore);
    
    pointrelClient.startup();
    
    function updateServerStatus(text) {
        statusPane.set("content", "Server status: " + text);
    }
    
    function receivedMessage(message) {
        // console.log("receivedMessage", message);
    }
    
    return tripleStore;
    
});