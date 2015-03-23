define([
    "dojo/i18n!js/nls/applicationMessages",
    "js/buttonActions",
    "js/domain",
    "dojo/hash",
    "js/applicationWidgets/loadAllApplicationWidgets",
    "js/panelBuilder/loadAllPanelSpecifications",
    "js/navigationPane",
    "dojo/text!js/applicationPanelSpecifications/navigation.json",
    "js/pageDisplayer",
    "js/panelBuilder/PanelBuilder",
    "js/panelBuilder/PanelSpecificationCollection",
    "js/surveyCollection",
    "js/panelBuilder/toaster",
    "dojo/topic",
    "js/panelBuilder/translate",
    "js/panelBuilder/widgetSupport",
    "dojo/domReady!"
], function(
    applicationMessages,
    buttonActions,
    domain,
    hash,
    loadAllApplicationWidgets,
    loadAllPanelSpecifications,
    navigationPane,
    navigationJSONText,
    pageDisplayer,
    PanelBuilder,
    PanelSpecificationCollection,
    surveyCollection,
    toaster,
    topic,
    translate,
    widgetSupport
){
    "use strict";

    // TODO: Add page validation

    var navigationSections = JSON.parse(navigationJSONText);
    var loadingBase = "dojo/text!js/applicationPanelSpecifications/";

    var panelSpecificationCollection = new PanelSpecificationCollection();

    // For building panels based on field specifications
    var panelBuilder = new PanelBuilder();

    var startPage = "page_dashboard";
    
    function urlHashFragmentChanged(newHash) {
        console.log("urlHashFragmentChanged", newHash);
        if (pageDisplayer.getCurrentPageID() !== newHash) {
            var pageSpecification = pageDisplayer.getPageSpecification(newHash);
            if (pageSpecification && pageSpecification.displayType === "page") {
                pageDisplayer.showPage(newHash);
            } else {
                console.log("unsupported url hash fragment", newHash);
                alert("A page was not found for: " + newHash);
                if (newHash !== startPage) urlHashFragmentChanged(startPage);
            }
        }
    }
    
    var completionStatusOptions = ["intentionally skipped", "partially done", "completely finished"];

    function addExtraFieldSpecificationsForPageSpecification(pageID, pageSpecification) {
        console.log("addExtraFieldSpecificationsForPageSpecification", pageID, pageSpecification);
        if (pageSpecification.section !== "dashboard") {
            if (!pageSpecification.isHeader) {
                var statusEntryID = pageID + "_pageStatus";
                var completionStatusEntryFieldSpecification = {
                    id: statusEntryID,
                    displayType: "select",
                    displayName: "Completion status",
                    displayPrompt: translate("#dashboard_status_entry::prompt", "The dashboard status of this page is:"),
                    dataOptions: completionStatusOptions
                };
                pageSpecification.panelFields.push(completionStatusEntryFieldSpecification);
            } else {
                console.log("page dashboard as header", pageSpecification.id, pageSpecification.displayType, pageSpecification);
                // Put in dashboard
                var childPageIDs = panelSpecificationCollection.getChildPageIDListForHeaderID(pageID);
                console.log("child pages", pageID, childPageIDs);
                if (!childPageIDs) childPageIDs = [];
                for (var childPageIndex = 0; childPageIndex < childPageIDs.length; childPageIndex++) {
                    var childPageID = childPageIDs[childPageIndex];
                    var statusViewID = childPageID + "_pageStatus_dashboard";
                    var childPageSpecification = panelSpecificationCollection.getPageSpecificationForPageID(childPageID);
                    console.log("childPageID", childPageSpecification, childPageID);
                    if (!childPageSpecification) console.log("Error: problem finding page definition for", childPageID);
                    if (childPageSpecification && childPageSpecification.displayType === "page") {
                        var prompt = translate(childPageID + "::title", childPageSpecification.displayName) + " " + translate("#dashboard_status_label", "status:") + " ";
                        console.log("about to call panelBuilder to add one questionAnswer for child page's status", childPageID);
                        var completionStatusDisplayFieldSpecification = {
                            id: statusViewID,
                            displayType: "questionAnswer",
                            displayName: prompt,
                            displayPrompt: prompt,
                            displayConfiguration: [childPageID + "_pageStatus"]
                        };
                        pageSpecification.panelFields.push(completionStatusDisplayFieldSpecification);
                    }
                }
            }
        }

        /*
         var nextPageButtonQuestion = {
         "id": pageID + "_nextPageButton",
         "displayPrompt": "Mark page complete and proceed to next page",
         "displayType": "button"
         };

         questionEditor.insertQuestionIntoDiv(nextPageButtonQuestion, pagePane);
         */
    }

    function processAllPanels() {
        var panels = panelSpecificationCollection.buildListOfPanels();
        console.log("processAllPanels", panels);
        
        var lastPageID = null;
        var lastHeader = null;
        var lastSection = null;
        
        for (var panelIndex = 0; panelIndex < panels.length; panelIndex++) {
            var panel = panels[panelIndex];
            
            // console.log("defining panel", panel.id);

            // For panels that are a "page", add to top level pages choices and set up navigation
            if (panel.displayType === "page") {
                var pageID = panel.id;
                // console.log("pushing page", panel);
                // Make it easy to lookup previous and next pages from a page
                if (!panel.isHeader) {
                    var previousPage = panelSpecificationCollection.getPageSpecificationForPageID(lastPageID);
                    previousPage.nextPageID = pageID;
                    panel.previousPageID = lastPageID;
                }
                lastPageID = pageID;

                // Put in a dynamic question (incomplete for options) to be used to lookup page status.
                // This is needed so add_questionAnswer can check the field is a "select" to translate the options if needed
                panelSpecificationCollection.addFieldSpecification({id: pageID + "_pageStatus", displayType: "select"});
                
                if (panel.isHeader) {
                    lastHeader = pageID;
                    lastSection = panel.section;
                }
                
                addExtraFieldSpecificationsForPageSpecification(pageID, panel);
            }
            
            panel.helpSection = lastSection;
            panel.helpPage = panel.id;
            // TODO: Think about what "section" should really mean -- conceptual section (e.g. "catalysis") versus section header page ID (e.g. "page_catalysis");
            panel.section = lastHeader;
            
            for (var fieldIndex = 0; fieldIndex < panel.panelFields.length; fieldIndex++) {
                var fieldSpec = panel.panelFields[fieldIndex];
                fieldSpec.helpSection = lastSection;
                fieldSpec.helpPage = panel.id;
            }
        }
    }

    // Make all of the application pages selectable from the dropdown list and back/next buttons and put them in a TabContainer
    function createLayout() {
        console.log("createLayout start");

        var pageControlsPane = navigationPane.createNavigationPane(pageDisplayer, startPage);

        var saveButton = widgetSupport.newButton(pageControlsPane, "#button_save|Save", buttonActions.saveClicked);
        var debugButton = widgetSupport.newButton(pageControlsPane, "#button_debug|Debug", buttonActions.debugButtonClicked);

        // Setup the first page
        var fragment = hash();
        console.log("fragment when page first loaded", fragment);
        if (fragment) {
            urlHashFragmentChanged(fragment);
        } else {
            urlHashFragmentChanged(startPage);
        }

        console.log("createLayout end");
    }
    
    function loadedMoreSurveyResults(newEnvelopeCount) {
        if (newEnvelopeCount === 0) {
            // TODO: Translate
            toaster.toast("No new survey results were found.");
        } else {
            // TODO: Translate
            toaster.toast("" + newEnvelopeCount + " new survey result(s) were found.");
        }
    }
    
    // dispatch the button click
    function buttonClicked(panelBuilder, contentPane, model, fieldSpecification, value) {
         console.log("buttonClicked", fieldSpecification);
         
         var functionName = fieldSpecification.id;
         if (fieldSpecification.displayConfiguration) {
             if (_.isString(fieldSpecification.displayConfiguration)) {
                 functionName = fieldSpecification.displayConfiguration;
             } else {
                 functionName = fieldSpecification.displayConfiguration.action;
             }
         }
         
         var actualFunction = buttonActions[functionName];
         if (!actualFunction) {
             var message = "Unfinished handling for: " + fieldSpecification.id + " with functionName: " + functionName;
             console.log(message, contentPane, model, fieldSpecification, value);
             alert(message);
         } else {
             actualFunction(contentPane, model, fieldSpecification, value);
         }
    }
    
    // Panel builder "functionResult" components will get routed through here to calculate their text.
    // The application should publish a topic with the same name as these functions when their value changes.
    function calculateFunctionResultForGUI(panelBuilder, contentPane, model, fieldSpecification, functionName) {
        if (functionName === "totalNumberOfSurveyResults") {
            return surveyCollection.allCompletedSurveys.length;
        } else if (functionName === "isStoryCollectingEnabled") {
            return surveyCollection.isStoryCollectingEnabled(fieldSpecification);
        } else {
            console.log("TODO: calculateFunctionResultForGUI ", functionName, fieldSpecification);
            return "calculateFunctionResultForGUI UNFINISHED: " + functionName + " for: " + fieldSpecification.id;
        }
    }
    
    // TODO: Temporary for generating JSON navigation data from AMD module
    function generateNavigationDataInJSON() {
        var sections = [];
        var sectionBeingProcessed;
        var pageBeingProcessed;
        var allPanels = panelSpecificationCollection.buildListOfPanels();
        allPanels.forEach(function(panel) {
            console.log("panel", panel.displayType, panel.id, panel.section, panel.displayName);
            if (panel.isHeader) {
                if (sectionBeingProcessed) sections.push(sectionBeingProcessed);
                sectionBeingProcessed = {
                    section: panel.section,
                    sectionName: panel.displayName,
                    pages: []
                };
            }
            var navigationInfo = {
                panelID: panel.id,
                panelName: panel.displayName
            };
            if (panel.displayType === "page") {
                sectionBeingProcessed.pages.push(navigationInfo);
                pageBeingProcessed = navigationInfo;
            } else {
                if (!pageBeingProcessed.extraPanels) pageBeingProcessed.extraPanels = [];
                pageBeingProcessed.extraPanels.push(navigationInfo);
            }
        });
        
        console.log("JSON for navigation:");
        console.log(JSON.stringify(sections, null, 4));
    }
   
    function setupDomain() {
        var modelTemplate = panelSpecificationCollection.buildModel("ProjectModel");
        
        domain.updateModelWithNewValues(domain.projectAnswers, modelTemplate);

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
    
    // The main starting point of the application
    function initialize() {
        console.log("=======", new Date().toISOString(), "application.initialize() called");
        
        translate.configure({}, applicationMessages);
        
        // Initialize toaster
        toaster.createToasterWidget("navigationDiv");
        
        loadAllApplicationWidgets(PanelBuilder);
        
        // Load the application design
        loadAllPanelSpecifications(panelSpecificationCollection, navigationSections, loadingBase, function() {
            // generateNavigationDataInJSON();
            
            // Setup the domain with the base model defined by field specifications
            setupDomain();
     
            processAllPanels();
            
            // Tell the panel builder how to build panels
            panelBuilder.setPanelSpecifications(panelSpecificationCollection);
            
            // Tell the panelBuilder what do do if a button is clicked
            panelBuilder.setButtonClickedCallback(buttonClicked);
            
            panelBuilder.setCalculateFunctionResultCallback(calculateFunctionResultForGUI);

            pageDisplayer.configure(panelSpecificationCollection, panelBuilder);

            createLayout();
            
            // Update if the URL hash fragment changes
            topic.subscribe("/dojo/hashchange", urlHashFragmentChanged); 
            
            topic.subscribe("loadLatestStoriesFromServer", loadedMoreSurveyResults);
            
            // Synchronizes the state of the domain for one status flag with what is on server
            surveyCollection.determineStatusOfCurrentQuestionnaire();
            
            // Get the latest project data
            buttonActions.loadLatest();
            
            // turn off initial "please wait" display
            document.getElementById("pleaseWaitDiv").style.display = "none";
        });
    }
    
    return {
        initialize: initialize
    };
});