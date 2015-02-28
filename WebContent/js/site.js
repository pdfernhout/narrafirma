require([
   "js/toaster",
    "dojo/domReady!"
], function(
    toaster
){
    "use strict";
    
    function startup() {
        console.log("startup called in site.js");
        toaster.createToasterWidget(document.getElementById("startup"));
        
        // turn off startup "please wait" display
        document.getElementById("startup").style.display = "none";
        
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

    startup();
});