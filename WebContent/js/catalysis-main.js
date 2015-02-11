"use strict";

require([
    "dijit/layout/ContentPane",
    "dojo/dom",
    "lib/simple_statistics",
    "js/test-data",
    "dojo/domReady!"
], function(
    ContentPane,
    dom,
    simpleStatistics,
    testData
){
    console.log("simpleStatistics", simpleStatistics);
    
    var mainContentPane;
    
    function addBreak() {
        mainContentPane.domNode.appendChild(document.createElement('br'));
    }
    
    function addText(text) {
        mainContentPane.domNode.appendChild(document.createTextNode(text));
    }
    
    function addHTML(htmlText) {
        var childContentPane = new ContentPane({
            content: htmlText
        });
        
       childContentPane.placeAt(mainContentPane);
       return childContentPane;
    }
    
    function createLayout() {
        console.log("createLayout");
        
        console.log("test data", testData);
          
        var mainDiv = dom.byId("mainDiv");
        
        mainContentPane = new ContentPane({
        });
        
        mainContentPane.placeAt(mainDiv);
        // mainDiv.appendChild(mainContentPane.domNode);
        mainContentPane.startup();
        
        addHTML("<b>Work in progress on Catalysis subsystem</b>");
        addBreak();
        addBreak();

        // turn off startup "please wait" display
        document.getElementById("startup").style.display = "none";
    }
    
    function startup() {
        createLayout();
    }
    
    startup();
});