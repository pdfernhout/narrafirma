// This supports globals shared by modules

define([
    "js/modelUtility",
    "js/panelBuilder/PanelSpecificationCollection",
    "dojo/Stateful"
], function(
    modelUtility,
    PanelSpecificationCollection,    
    Stateful
) {
    "use strict";
    
    // Singleton domain object shared across application
    var domain = {

        startPage: "page_dashboard",
            
        currentPageModel: new Stateful(),
        currentPageModelTemplate: null,
        
        hasUnsavedChangesForCurrentPage: function() {
            // TODO: Fix this
            return true;
        },
        
        changePageModel: function(modelName) {
            var pageModel = new Stateful();
            
            var pageModelTemplate = domain.panelSpecificationCollection.buildModel(modelName);
            if (!pageModelTemplate) {
                // TODO: What is the correct behavior here if the model definition is missing -- to prevent other errors?
                console.log("Missing model template for", modelName);
                throw new Error("Missing model template for: " + modelName);
            } else {
                modelUtility.updateModelWithNewValues(pageModel, pageModelTemplate);
            }
            
            domain.currentPageModel = pageModel;
            domain.currentPageModelTemplate = pageModelTemplate; 
        },
        
        // This will hold information about all the panels used
        panelSpecificationCollection: new PanelSpecificationCollection(),
    
        // Convenience method for most common case of finding page specification
        getPageSpecification: function(pageID) {
            // For now, any "page" defined in the panelSpecificationCollection is available
            return domain.panelSpecificationCollection.getPageSpecificationForPageID(pageID);
        }
    };
    
    return domain;
});