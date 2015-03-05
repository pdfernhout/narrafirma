require([
   "js/toaster",
    "dojo/domReady!"
], function(
    toaster
){
    "use strict";
    
    function initialize() {
        console.log("initialize called in site.js");
        toaster.createToasterWidget(document.getElementById("pleaseWaitDiv"));
        
        // turn off initial "please wait" display
        document.getElementById("pleaseWaitDiv").style.display = "none";
        
        toaster.toast("test");
        
        var SiteModel = declare(Model, {
            schema: {
                siteName: 'string'
            },
            additionalProperties: false
        });
        
        var mySite = new SiteModel({siteName: "NarraFirma site"});
        
        console.log("mySite siteName", mySite.get("siteName"), mySite.siteName);
        
    }

    initialize();
});