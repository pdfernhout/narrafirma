"use strict";

require([
    "dojo/dom",
    "dojo/domReady!"
], function(
    dom
){

    function createLayout() {
        console.log("createLayout");
            
        var mainDiv = dom.byId("mainDiv");

        // turn off startup "please wait" display
        document.getElementById("startup").style.display = "none";
    }
    
    function startup() {
        createLayout();
    }
    
    startup();
});