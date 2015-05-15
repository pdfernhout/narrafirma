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
    
    // TODO: Fix hardcoded questionnaire ID
    var defaultQuestionnaireID = 'questionnaire-test-003';
    
    // Singleton domain object shared across application
    var domain = {
            
        // TODO: Fix credentials
        userID: "anonymous",
        
        // Application will fill this in
        project: null,
        
        // TODO: Fix hardcoded surveyResultHyperdocumentID
        surveyResultHyperdocumentID: "Test-PNIWorkbook-003-Surveys",

        // The home page -- should be a constant
        startPage: "page_dashboard",
        
        // This will hold information about all the panels used
        panelSpecificationCollection: new PanelSpecificationCollection(),
        
        // The page specification for the current page, which provides the page ID and section
        currentPageSpecification: null,
        
        // The type of model currently being stored
        currentPageModelName: null,

        // The Stateful model holding the data used by the current page
        currentPageModel: new Stateful(),
        
        // A template of default values for the current model -- used also to check if it has changed
        currentPageModelTemplate: null,
        
        // The data loaded for the current page -- used also to check if it has changed
        currentPageDocumentEnvelope: null,
        
        // TODO: Fix hardcoded questionnaire ID
        currentQuestionnaireID: defaultQuestionnaireID,

        // TODO: This field should be updated with a heartbeat or by other means to pick up changes to it by other users
        // The most recently loaded (or saved) questionnarie
        currentQuestionnaire: null,
        
        allCompletedSurveys: [],
        
        allStories: [],

        // TODO: When does this get updated?
        questionnaireStatus: {questionnaireID: defaultQuestionnaireID, active: false},
        
        /////////////// API calls below
        
        hasUnsavedChangesForCurrentPage: function() {
            // TODO: Fix
            return false;
            
            if (!domain.currentPageModelName) return false;
            if (domain.currentPageDocumentEnvelope) {
                return modelUtility.isModelChanged(domain.currentPageModel, domain.currentPageDocumentEnvelope.content);
            } else if (domain.currentPageModelTemplate) {
                return modelUtility.isModelChanged(domain.currentPageModel, domain.currentPageModelTemplate);
            } else {
                console.log("ERROR: No way to be sure if model changed?");
                return false;
            }
        },
        
        subscriptions: [],
        
        changeCurrentPageModel: function(pageSpecification, modelName) {
            console.log("changeCurrentPageModel", modelName);
            
            // Remove old subscriptions when move to a new page
            domain.subscriptions.forEach(function (subscription) {
                subscription.remove();
            });
            domain.subscription = [];
            
            var pageModel = new Stateful();
            
            var pageModelTemplate = null;
            if (modelName) {
                pageModelTemplate = domain.panelSpecificationCollection.buildModel(modelName);
                if (!pageModelTemplate) {
                    // TODO: What is the correct behavior here if the model definition is missing -- to prevent other errors?
                    console.log("ERROR: Missing model template for", modelName);
                    throw new Error("Missing model template for: " + modelName);
                } else {
                    modelUtility.updateModelWithNewValues(pageModel, pageModelTemplate);
                }
            }
            console.log("changeCurrentPageModel", modelName, pageModelTemplate);
            
            // Saving JSON.stringify-ed versions of data in case it is an array or object that might be changed directly
            
            function subscribe(model, fieldName) {
                model._saved[fieldName] = JSON.stringify(model.get(fieldName));
                var subscription = domain.project.watchFieldValue(fieldName, function(triple, message) {
                    // console.log(" ---------- updateWhenTripleStoreChanges", triple, message);
                    var newValue = triple.c;
                    // TODO: Should warn if saved an get differ because going to lose changes
                    var editedValue = model.get(fieldName);
                    // TODO: User might have cleared the field; need better way to detect initial changes...
                    if (editedValue && model._saved[fieldName] !== JSON.stringify(editedValue)) {
                        console.log("About to lose user entered data in field", fieldName, "user-edited:", editedValue, "new:", newValue);
                    }
                    model._saved[fieldName] = JSON.stringify(newValue);
                    if (JSON.stringify(editedValue) !== JSON.stringify(newValue)) {
                        console.log("notified of changed data in store, so updating field", fieldName, newValue);
                        // This will trigger a watch, which would lead to writing out the value except for a check if value has changed
                        model.set(fieldName, newValue);
                    }
                    // formSaved[fieldName] = newValue;
                });
                domain.subscriptions.push(subscription);
            }
            
            function watch(model, fieldName) {
                var subscription = model.watch(fieldName, function(name, oldValue, newValue) {
                    console.log("Watch changed", fieldName, oldValue, newValue);
                    // Use JSON comparison to handle situation of arrays changing contents but remaining the same array (likewise for objects)
                    if (model._saved[fieldName] !== JSON.stringify(newValue)) {
                        model._saved[fieldName] = JSON.stringify(newValue);
                        console.log("storing new value for field", fieldName, newValue);
                        domain.project.setFieldValue(fieldName, newValue, oldValue);
                    }
                });
                domain.subscriptions.push(subscription);
            }
            
            console.log("project", domain.project);
            
            for (var fieldName in pageModel) {
                if (pageModel.hasOwnProperty(fieldName)) {
                    console.log("pageModel fieldName", fieldName);
                    if (fieldName.charAt(0) === "_") continue;
                    var value = domain.project.getFieldValue(fieldName);
                    console.log("got value for query", fieldName, value);
                    if (value !== undefined && value !== null) {
                        pageModel.set(fieldName, value);
                    }
                    pageModel._saved = {};
                    subscribe(pageModel, fieldName);
                    watch(pageModel, fieldName);
                }
            }
            
            domain.currentPageSpecification = pageSpecification;
            domain.currentPageModelName = modelName;
            domain.currentPageModel = pageModel;
            domain.currentPageModelTemplate = pageModelTemplate;
            domain.currentPageDocumentEnvelope = null;
        },
        
        // Convenience method for most common case of finding page specification
        getPageSpecification: function(pageID) {
            // For now, any "page" defined in the panelSpecificationCollection is available
            return domain.panelSpecificationCollection.getPageSpecificationForPageID(pageID);
        }
    };
    
    return domain;
});