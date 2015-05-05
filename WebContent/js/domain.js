// This supports globals shared by modules

define([
    "js/modelUtility",
    "js/panelBuilder/PanelSpecificationCollection",
    "dojo/Stateful",
    "js/project"
], function(
    modelUtility,
    PanelSpecificationCollection,    
    Stateful,
    project
) {
    "use strict";
    
    // TODO: Fix hardcoded questionnaire ID
    var defaultQuestionnaireID = 'questionnaire-test-003';
    
    // Singleton domain object shared across application
    var domain = {
            
        // TODO: Fix credentials
        userID: "anonymous",
        
        // savedVersions: [],
        
        projectID: "Test-PNIWorkbook-004",
        
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
            
            function subscribe(model, fieldName) {
                model._saved[fieldName] = model.get(fieldName);
                var subscription = project.subscribe("test-project", fieldName, undefined, function(triple, message) {
                    // console.log(" ---------- updateWhenTripleStoreChanges", triple, message);
                    var newValue = triple.c;
                    // TODO: Should warn if saved an get differ because going to lose changes
                    var editedValue = model.get(fieldName);
                    // TODO: User might have cleared the field; need better way to detect initial changes...
                    if (editedValue && model._saved[fieldName] !== editedValue) {
                        console.log("About to lose user entered data in field", fieldName, "user-edited:", editedValue, "new:", newValue)
                    }
                    model._saved[fieldName] = newValue;
                    if (editedValue !== newValue) {
                        console.log("notified of changed data in store, so updating field", fieldName, newValue);
                        // TODO: Problem -- this will trigger an watch, which will lead to writing out the value
                        model.set(fieldName, newValue);
                    }
                    // formSaved[fieldName] = newValue;
                });
                domain.subscriptions.push(subscription);
            }
            
            // TODO: Need to unwatch when leave page
            function watch(model, fieldName) {
                var subscription = model.watch(fieldName, function(name, oldValue, newValue) {
                    console.log("Watch changed", fieldName, oldValue, newValue);
                    if (model._saved[fieldName] !== newValue) {
                        model._saved[fieldName] = newValue;
                        console.log("storing new value for field", fieldName, newValue);
                        project.add("test-project", fieldName, newValue);
                    }
                });
                domain.subscriptions.push(subscription);
            }
            
            console.log("project", project);
            
            for (var fieldName in pageModel) {
                if (pageModel.hasOwnProperty(fieldName)) {
                    console.log("pageModel fieldName", fieldName);
                    if (fieldName.charAt(0) === "_") continue;
                    var triple = project.queryLatest("test-project", fieldName, undefined);
                    console.log("got triple for query", fieldName, triple, project);
                    if (triple) {
                        if (fieldName === "project_reportEndText") {
                            console.log("DEBUG problem fieldName");
                        }
                        pageModel.set(fieldName, triple.c);
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
        
        changeCurrentPageData: function (documentEnvelope) {
            domain.currentPageDocumentEnvelope = documentEnvelope;
            if (domain.currentPageDocumentEnvelope) {
                // TODO: Copying only model-defined data for now, which will produce warnings of unsaved changes as migrate test data
                // TODO: Probably want to eventually change this back to copy all data, in order to preserve data from future versions where model has added fields
                // TODO: Changing it back will also avoid unsaved changes warnings if there is new document data added later by other modules
                modelUtility.updateModelWithNewValues(domain.currentPageModel, documentEnvelope.content, "copyOnlyModelFields");
            } else {
                // Reset the model
                if (!domain.currentPageModelTemplate) {
                    console.log("ERROR: Missing currentPageModelTemplate");
                } else {
                    modelUtility.updateModelWithNewValues(domain.currentPageModel, domain.currentPageModelTemplate, "copyOnlyModelFields", "removeOtherFieldsFromModel");
                }
            }
        },
        
        getDocumentIDForCurrentPage: function() {
            if (!domain.currentPageModelName) return null;
            // TODO: May want to make the second section lowercase
            // TODO: Is a dot the best way to seperate these sections/
            // TODO: Improve data storage system so can use JSON for a document ID
            return domain.projectID + "." + domain.currentPageModelName;
        },
        
        // Convenience method for most common case of finding page specification
        getPageSpecification: function(pageID) {
            // For now, any "page" defined in the panelSpecificationCollection is available
            return domain.panelSpecificationCollection.getPageSpecificationForPageID(pageID);
        }
    };
    
    return domain;
});