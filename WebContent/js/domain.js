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
            
        // TODO: Fix credentials
        userID: "anonymous",
        
        // savedVersions: [],
        
        // TODO: Fix hardcoded projectAnswersDocumentID
        projectAnswersDocumentID: "Test-PNIWorkbook-003",
        
        // TODO: Fix hardcoded surveyResultHyperdocumentID
        surveyResultHyperdocumentID: "Test-PNIWorkbook-003-Surveys",

        // The home page -- should be a constant
        startPage: "page_dashboard",
        
        // This will hold information about all the panels used
        panelSpecificationCollection: new PanelSpecificationCollection(),
        
        // The page specification for the current page, which provides the page ID and section
        currentPageSpecification: null,

        // The Stateful model holding the data used by the current page
        currentPageModel: new Stateful(),
        
        // A template of default values for the current model -- used also to check if it has changed
        currentPageModelTemplate: null,
        
        // The data loaded for the current page -- used also to check if it has changed
        currentPageDocumentEnvelope: null,
        
        /////////////// API calls below
        
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
        
        changeCurrentPageModel: function(pageSpecification, modelName) {
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
            
            domain.currentPageSpecification = pageSpecification;
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
        
        // Convenience method for most common case of finding page specification
        getPageSpecification: function(pageID) {
            // For now, any "page" defined in the panelSpecificationCollection is available
            return domain.panelSpecificationCollection.getPageSpecificationForPageID(pageID);
        }
    };
    
    return domain;
});