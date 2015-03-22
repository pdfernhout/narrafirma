require([
    "js/pointrel20141201Client",
    "js/PointrelCache",
    "dojo/domReady!"
], function(
    pointrel20141201Client,
    PointrelCache
){
    "use strict";
    
    var pointrelCache = new PointrelCache();

    console.log("PointrelCacheTest.js");
    
    var testDocumentID = "test-PointrelCacheTest-001";
    
    function createTestResource(callback) {
        var content = "Hello, world!";
    
        var metadata = {id: testDocumentID, contentType: "text/plain"};
        
        pointrel20141201Client.storeInNewEnvelope(content, metadata, function(error, result) {
            if (error) { console.log("error", error); return;}
            
            console.log("Stored item", result.sha256AndLength, result);

            if (callback) callback();
            /*
            pointrel20141201Client.fetchEnvelope(result.sha256AndLength, function(error, item) {
                if (error) { console.log("error", error); return;}
                console.log("Got item", item);
            });
            */
        });
    }
    
    function getVersionFromCache() {
        pointrelCache.getLatestDocumentVersionEnvelope(testDocumentID, null, function(error, envelope) {
            console.log("got result", error, envelope);
        });
    }
    
    function test() {
        console.log("test will run for one minute");
        
        pointrelCache.startup();
        
        getVersionFromCache();
        
        // Set timer to check cache
        window.setTimeout(getVersionFromCache, 3000);
        
        // Set timer to check cache
        window.setTimeout(getVersionFromCache, 3500);
        
        // Set timer to create later test resource
        window.setTimeout(createTestResource, 5000);
        
        // Set timer to check cache
        window.setTimeout(getVersionFromCache, 6000);
        
        // Set timer to check cache
        window.setTimeout(getVersionFromCache, 6500);
        
        // Set timer to check cache
        window.setTimeout(getVersionFromCache, 10000);
        
        // Set timer to create even later test resource
        window.setTimeout(createTestResource, 15000);
        
        // Set timer to check cache
        window.setTimeout(getVersionFromCache, 16000);
        
        // Set timer to check cache
        window.setTimeout(getVersionFromCache, 16500);
        
        // Set timer to check cache
        window.setTimeout(getVersionFromCache, 30000);
        
        // Set timer to shutdown test
        window.setTimeout(function() {
            console.log("shutting down test after one minute");
            pointrelCache.shutdown();
        }, 60000);
    }
    
    createTestResource(test);
    
});