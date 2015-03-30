define([
    "dojo/i18n!js/nls/applicationMessages",
    "js/buttonActions",
    "js/domain",
    "dojo/hash",
    "js/applicationWidgets/loadAllApplicationWidgets",
    "js/panelBuilder/loadAllPanelSpecifications",
    "js/modelUtility",
    "js/navigationPane",
    "dojo/text!js/applicationPanelSpecifications/navigation.json",
    "js/pageDisplayer",
    "js/panelBuilder/PanelBuilder",
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
    modelUtility,
    navigationPane,
    navigationJSONText,
    pageDisplayer,
    PanelBuilder,
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

    // For building panels based on field specifications
    var panelBuilder = new PanelBuilder();

    function urlHashFragmentChanged(newHash) {
        console.log("urlHashFragmentChanged", newHash);
        // Page displayer will handle cases where the hash is not valid
        pageDisplayer.showPage(newHash);
    }
    
    function addExtraFieldSpecificationsForPageSpecification(pageID, pageSpecification) {
        // console.log("addExtraFieldSpecificationsForPageSpecification", pageSpecification.section, pageID, pageSpecification);
        if (pageSpecification.section !== "dashboard") {
            if (!pageSpecification.isHeader) {
                // TODO: Change the id of this field to have notes or reminder
                // Regular page -- add a footer where the page status can be set
                var statusEntryID = pageID + "_reminders";
                var completionStatusEntryFieldSpecification = {
                    id: statusEntryID,
                    dataType: "string",
                    displayType: "textarea",
                    displayName: "Reminders",
                    displayPrompt: translate("#dashboard_status_entry::prompt", "You can enter reminders about this page here which will appear on this section's dashboard:")
                };
                domain.panelSpecificationCollection.addFieldSpecificationToPanelSpecification(pageSpecification, completionStatusEntryFieldSpecification);
            } else {
                // Dashboard page
                // console.log("page dashboard as header", pageSpecification.id, pageSpecification.displayType, pageSpecification);
                // Put in dashboard
                var childPageIDs = domain.panelSpecificationCollection.getChildPageIDListForHeaderID(pageID);
                // console.log("child pages", pageID, childPageIDs);
                if (!childPageIDs) childPageIDs = [];
                // Add a display to this page for each child page in the same section
                for (var childPageIndex = 0; childPageIndex < childPageIDs.length; childPageIndex++) {
                    var childPageID = childPageIDs[childPageIndex];
                    var statusViewID = childPageID + "_reminders_dashboard";
                    var childPageSpecification = domain.getPageSpecification(childPageID);
                    // console.log("childPageID", childPageSpecification, childPageID);
                    if (!childPageSpecification) console.log("Error: problem finding page definition for", childPageID);
                    if (childPageSpecification && childPageSpecification.displayType === "page") {
                        var prompt = translate(childPageID + "::title", childPageSpecification.displayName);
                        // Wrap the prompt as a link to the page
                        prompt = '<a href="#' + childPageID + '">' + prompt + '</a>';
                        // + " " + translate("#dashboard_status_label", "reminders:")
                        prompt = prompt  + " ";
                        // console.log("about to call panelBuilder to add one questionAnswer for child page's status", childPageID);
                        var completionStatusDisplayFieldSpecification = {
                            id: statusViewID,
                            dataType: "none",
                            displayType: "questionAnswer",
                            displayName: prompt,
                            displayPrompt: prompt,
                            displayConfiguration: childPageID + "_reminders"
                        };
                        domain.panelSpecificationCollection.addFieldSpecificationToPanelSpecification(pageSpecification, completionStatusDisplayFieldSpecification);  
                    }
                }
            }
            // Add button at bottom of each page to move forward
            if (pageSpecification.nextPageID) {
                // TODO: Translate
                var buttonPrompt = "Next";
                if (!pageSpecification.previousPageID) buttonPrompt = "Next";
                var nextPageButtonSpecification = {
                    "id": pageID + "_nextPageButton",
                    "dataType": "none",
                    "displayPrompt": buttonPrompt,
                    "displayType": "button",
                    "displayConfiguration": {
                        "action": "guiOpenSection",
                        "section": pageSpecification.nextPageID
                    },
                    displayIconClass: "rightButtonImage"
                };
                domain.panelSpecificationCollection.addFieldSpecificationToPanelSpecification(pageSpecification, nextPageButtonSpecification); 
            } else {
                // TODO: Translate
                var returnToDashboardButtonSpecification = {
                    "id": pageID + "_returnToDashboardButton",
                    "dataType": "none",
                    "displayPrompt": "Go to project home page",
                    "displayType": "button",
                    "displayConfiguration": {
                        "action": "guiOpenSection",
                        "section": domain.startPage
                    },
                    displayIconClass: "homeButtonImage"
                };
                domain.panelSpecificationCollection.addFieldSpecificationToPanelSpecification(pageSpecification, returnToDashboardButtonSpecification); 
            }
        }
    }

    function processAllPanels() {
        var panels = domain.panelSpecificationCollection.buildListOfPanels();
        console.log("processAllPanels", panels);
        
        var lastPageID = null;
        var panelIndex;
        var panel;
        
        // Loop to setup navigation
        for (panelIndex = 0; panelIndex < panels.length; panelIndex++) {
            panel = panels[panelIndex];
            
            // console.log("defining navigatation for panel", panel.id);

            // For panels that are a "page", add to top level pages choices and set up navigation
            if (panel.displayType === "page") {
                // console.log("pushing page", panel);
                // Make it easy to lookup previous and next pages from a page
                if (!panel.isHeader) {
                    var previousPage = domain.getPageSpecification(lastPageID);
                    previousPage.nextPageID = panel.id;
                    panel.previousPageID = lastPageID;
                }
                lastPageID = panel.id;
            }
        }
        
        var lastHeader = null;
        var lastSection = null;
        
        // A separate loop is needed here to ensure page navigation links have been set up when determining additional buttons for pages
        for (panelIndex = 0; panelIndex < panels.length; panelIndex++) {
            panel = panels[panelIndex];
            
            if (panel.isHeader) {
                lastHeader = panel.id;
                lastSection = panel.section;
            }
            
            // console.log("defining panel extra fields and help", panel.id);

            // For panels that are a "page", add extra buttons
            if (panel.displayType === "page") {
                addExtraFieldSpecificationsForPageSpecification(panel.id, panel);
            }
            
            panel.helpSection = lastSection;
            panel.helpPage = panel.id;
            panel.sectionHeaderPageID = lastHeader;
            
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

        var pageControlsPane = navigationPane.createNavigationPane(pageDisplayer);

        var saveButton = widgetSupport.newButton(pageControlsPane, "#button_save|Save", buttonActions.saveClicked);
        var helpButton = widgetSupport.newButton(pageControlsPane, "#button_help|Help", buttonActions.helpButtonClicked);
        // var debugButton = widgetSupport.newButton(pageControlsPane, "#button_debug|Debug", buttonActions.debugButtonClicked);

        // Setup the first page
        var fragment = hash();
        console.log("fragment when page first loaded", fragment);
        if (fragment) {
            urlHashFragmentChanged(fragment);
        } else {
            urlHashFragmentChanged(domain.startPage);
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
            return domain.allCompletedSurveys.length;
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
        var allPanels = domain.panelSpecificationCollection.buildListOfPanels();
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
    
    // The main starting point of the application
    function initialize() {
        console.log("=======", new Date().toISOString(), "application.initialize() called");
        
        translate.configure({}, applicationMessages);
        
        // Initialize toaster
        toaster.createToasterWidget("navigationDiv");
        
        loadAllApplicationWidgets(PanelBuilder);
        
        // Load the application design
        loadAllPanelSpecifications(domain.panelSpecificationCollection, navigationSections, loadingBase, function() {
            // generateNavigationDataInJSON();
     
            processAllPanels();

            // Tell the panel builder how to build panels
            panelBuilder.setPanelSpecifications(domain.panelSpecificationCollection);
            
            // Tell the panelBuilder what do do if a button is clicked
            panelBuilder.setButtonClickedCallback(buttonClicked);
            
            panelBuilder.setCalculateFunctionResultCallback(calculateFunctionResultForGUI);

            pageDisplayer.configurePageDisplayer(panelBuilder);

            createLayout();
            
            // Update if the URL hash fragment changes
            topic.subscribe("/dojo/hashchange", urlHashFragmentChanged); 
            
            topic.subscribe("loadLatestStoriesFromServer", loadedMoreSurveyResults);
            
            // TODO: What happens when questionnaire is loaded after story browser, themer, or graph page is built?
            // Synchronizes the state of the domain questionnaire with what is on server
            surveyCollection.loadCurrentQuestionnaire();
            
            // Synchronizes the state of the domain for one status flag with what is on server
            surveyCollection.determineStatusOfCurrentQuestionnaire();
            
            // Load all the latest stories
            surveyCollection.loadLatestStoriesFromServer();
            
            // The latest data for just the current page will be loaded when the page is created
            
            // turn off initial "please wait" display
            document.getElementById("pleaseWaitDiv").style.display = "none";
            document.getElementById("navigationDiv").style.display = "block";
            
            // From: https://developer.mozilla.org/en-US/docs/Web/Events/beforeunload
            window.addEventListener("beforeunload", function (e) {
                if (!domain.hasUnsavedChangesForCurrentPage()) return null;
                    
                var confirmationMessage = "You have unsaved changes";

                (e || window.event).returnValue = confirmationMessage;     // Gecko and Trident
                return confirmationMessage;                                // Gecko and WebKit
            });
        });
    }
    
    return {
        initialize: initialize
    };
});