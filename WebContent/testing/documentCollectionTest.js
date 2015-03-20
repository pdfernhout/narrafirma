require([
    "js/pointrel20141201DocumentCollection",
    "dojo/domReady!"
], function(
    DocumentCollection
){
    "use strict";
    
    console.log("documentCollectionTest.js");
    console.log("will run for one minute");

    var documentCollection = new DocumentCollection();
    
    documentCollection.startup();
    
    window.setInterval(function() {
        console.log("shutting down test after one minute");
        documentCollection.shutdown();
    }, 60000);
});