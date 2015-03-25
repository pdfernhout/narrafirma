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
        
        currentPageDocumentEnvelope: null,
        
        hasUnsavedChangesForCurrentPage: function() {
            // TODO: Fix this
            if (domain.currentPageDocumentEnvelope) {
                return modelUtility.isModelChanged(domain.currentPageModel, domain.currentPageDocumentEnvelope.content);
            } else if (domain.currentPageModelTemplate) {
                return modelUtility.isModelChanged(domain.currentPageModel, domain.currentPageModelTemplate);
            } else {
                console.log("ERROR: No way to be sure if model changed?");
                return false;
            }
        },
        
        changeCurrentPageModel: function(modelName) {
            var pageModel = new Stateful();
            
            var pageModelTemplate = domain.panelSpecificationCollection.buildModel(modelName);
            if (!pageModelTemplate) {
                // TODO: What is the correct behavior here if the model definition is missing -- to prevent other errors?
                console.log("ERROR: Missing model template for", modelName);
                throw new Error("Missing model template for: " + modelName);
            } else {
                modelUtility.updateModelWithNewValues(pageModel, pageModelTemplate);
            }
            console.log("changeCurrentPageModel", modelName, pageModelTemplate);
            
            domain.currentPageModel = pageModel;
            domain.currentPageModelTemplate = pageModelTemplate;
            domain.currentPageDocumentEnvelope = null;
        },
        
        changeCurrentPageData: function (documentEnvelope) {
            domain.currentPageDocumentEnvelope = documentEnvelope;
            if (domain.currentPageDocumentEnvelope) {
                modelUtility.updateModelWithNewValues(domain.currentPageModel, documentEnvelope.content);
            } else {
                // Reset the model
                if (!domain.currentPageModelTemplate) {
                    console.log("ERROR: Missing currentPageModelTemplate");
                } else {
                    modelUtility.updateModelWithNewValues(domain.currentPageModel, domain.currentPageModelTemplate, "copyOnlyModelFields", "removeOtherFieldsFromModel");
                }
            }
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