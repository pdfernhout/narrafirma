require(["js/application", "dojo/request"], function(application, request) {
    "use strict";
    
    request("/currentUser", {handleAs: "json", preventCache: true}).then(function(data) {
        if (data.success) {
            application.initialize(data.userIdentifier);
        } else {
            alert("Something went wrong determining the current user identifier");
        }
    });
});