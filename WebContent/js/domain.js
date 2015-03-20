// This supports globals shared by modules

define([
    "dojo/Stateful"
], function(
    Stateful
) {
    "use strict";
    
    var domain = {
      // Initialize this here to make testing of domain easier without setupDomain being called
      projectAnswers: new Stateful()
    };

    // Application should call this at startup
    function setupDomain(panelSpecificationCollection) {
        var model = panelSpecificationCollection.buildModel("ProjectModel");
        
        domain.projectAnswers = new Stateful(model);

        var pages = panelSpecificationCollection.buildListOfPages();
        
        for (var pageIndex = 0; pageIndex < pages.length; pageIndex++) {
            var page = pages[pageIndex];
            if (!page.isHeader) {
                var pageID = page.id;
                domain.projectAnswers[pageID + "_pageStatus"] = null;
            }
        }
        
        /*
         Maybe this can be adapted for saving and loading individual pages?
        for (var fieldName in domain.projectAnswers) {
            var fieldValue = domain.projectAnswers[fieldName];
            if (fieldValue instanceof Array) {
                domain.projectAnswers[fieldName] = new StatefulArray(fieldValue);
            }
        }
        */
        
        console.log("setupDomain result: domain", domain);
    }

    return {
        "setupDomain": setupDomain,
            
        // data collected
        "projectAnswers": domain.projectAnswers,
    };
});