require([
    "js/PointrelCache",
    "dojo/domReady!"
], function(
    PointrelCache
){
    "use strict";
    
    console.log("PointrelCacheTest.js");
    console.log("will run for one minute");

    var pointrelCache = new PointrelCache();
    
    pointrelCache.startup();
    
    window.setInterval(function() {
        console.log("shutting down test after one minute");
        pointrelCache.shutdown();
    }, 60000);
});