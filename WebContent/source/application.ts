/// <reference path="typings/lodash.d.ts"/>
// declare var _: _.LoDashStatic;
import applicationMessages = require("./nls/applicationMessages");
import buttonActions = require("./buttonActions");
import csvImportExport = require("./csvImportExport");
import dialogSupport = require("./panelBuilder/dialogSupport");
import loadAllApplicationWidgets = require("./applicationWidgets/loadAllApplicationWidgets");
import loadAllPanelSpecifications = require("./panelBuilder/loadAllPanelSpecifications");
import navigationPane = require("./navigationPane");
import pageDisplayer = require("./pageDisplayer");
import PanelBuilder = require("./panelBuilder/PanelBuilder");
import PanelSpecificationCollection = require("./panelBuilder/PanelSpecificationCollection");
import PointrelClient = require("./pointrel20150417/PointrelClient");
import Project = require("./Project");
import questionnaireGeneration = require("./questionnaireGeneration");
import surveyCollection = require("./surveyCollection");
import toaster = require("./panelBuilder/toaster");
import translate = require("./panelBuilder/translate");
import m = require("mithril");

"use strict";

var navigationJSONText: string;

// TODO: Add page validation

var narrafirmaProjectPrefix = "NarraFirmaProject-";

// The home page -- should be a constant
var startPage = "page_dashboard";

// Singleton instance variables
var journalIdentifier;
var projectIdentifier;
var userIdentifier;

var project: Project;

var lastServerError = "";

// The runningAfterIdle falg is used to limit redraws for new project messages until after initial set recevied
var runningAfterInitialIdle = false;

// m.route.mode = "hash";

function hash(newValue = null) {
    if (newValue === null) return window.location.hash.substr(1);
    
    if (history.pushState) {
        history.pushState(null, null, "#" + newValue);
    } else {
        location.hash = "#" + newValue;
    }
}

// For this local instance only (not shared with other users or other browser tabs)
var clientState: ClientState = {
    projectIdentifier: null,
    pageIdentifier: null,
    storyCollectionIdentifier: null,
    catalysisReportIdentifier: null,
    debugMode: null,
    serverStatus: "narrafirma-serverstatus-ok",
    serverStatusText: ""
};

var navigationSections = [];

var loadingBase = "lib/text!applicationPanelSpecifications/";

// For building panels based on field specifications
var panelBuilder: PanelBuilder = new PanelBuilder();

// This will hold information about all the panels used
var panelSpecificationCollection = new PanelSpecificationCollection();

// getHashParameters derived from: http://stackoverflow.com/questions/4197591/parsing-url-hash-fragment-identifier-with-javascript
function getHashParameters(hash): any {
    var result = {};
    var match;
    // Regex for replacing addition symbol with a space
    var plusMatcher = /\+/g;
    var parameterSplitter = /([^&;=]+)=?([^&;]*)/g;
    var decode = function (s) { return decodeURIComponent(s.replace(plusMatcher, " ")); };
    while (true) {
        match = parameterSplitter.exec(hash);
        if (!match) break;
        result[decode(match[1])] = decode(match[2]);
    }
    return result;
}
    
function hashStringForClientState() {
    var result = "";
    
    var fields = [
        {id: "projectIdentifier", key: "project"},
        {id: "pageIdentifier", key: "page"},
        {id: "storyCollectionIdentifier", key: "storyCollection"},
        {id: "catalysisReportIdentifier", key: "catalysisReport"},
        {id: "debugMode", key: "debugMode"}
    ];
    
    for (var i = 0; i < fields.length; i++) {
        var field = fields[i];

        var value = clientState[field.id];
        if (!value) continue;
        
        if (field.key === "page" && value) value = value.substring("page_".length);
        
        if (result) result += "&";
        result += field.key + "=" + encodeURIComponent(value);
    }
    
    console.log("hashStringForClientState", result, clientState);
    
    return result;
}

function urlHashFragmentChanged() {
    var newHash = hash();
    console.log("urlHashFragmentChanged", newHash);
    
    console.log("current clientState", clientState);
    
    var hashParameters = getHashParameters(newHash);
    console.log("new hashParameters", hashParameters);
    
    var currentProjectIdentifier = clientState.projectIdentifier;
    if (currentProjectIdentifier) {
        if (hashParameters.project && hashParameters.project !== currentProjectIdentifier) {
            // Force a complete page reload for now, as needs to create a new Pointrel client
            // TODO: Should we shut down the current Pointrel client first?
            alert("About to trigger page reload for changed project");
            location.reload();
            return;
        }
    } else {
        console.log("changing client state for page", clientState.projectIdentifier, hashParameters.project);
        clientState.projectIdentifier = hashParameters.project;
    }
     
    var selectedPage = hashParameters.page;
    if (!selectedPage) {
        selectedPage = startPage;
    } else {
        selectedPage = "page_" + selectedPage;
    }
    if (selectedPage !== clientState.pageIdentifier) {
        console.log("changing client state for page from:", clientState.pageIdentifier, "to:", selectedPage);
        clientState.pageIdentifier = selectedPage;
    }
    
    if (hashParameters.storyCollection && hashParameters.storyCollection !== clientState.storyCollectionIdentifier) {
        console.log("changing client state for storyCollection", clientState.storyCollectionIdentifier, hashParameters.storyCollection);
        clientState.storyCollectionIdentifier = hashParameters.storyCollection;
    }
    
    if (hashParameters.catalysisReport && hashParameters.catalysisReport !== clientState.catalysisReportIdentifier) {
        console.log("changing client state for catalysisReport", clientState.catalysisReportIdentifier, hashParameters.catalysisReport);
        clientState.catalysisReportIdentifier = hashParameters.catalysisReport;
    }
    
    if (hashParameters.debugMode && hashParameters.debugMode !== clientState.debugMode) {
        console.log("changing client state for debugMode", clientState.debugMode, hashParameters.debugMode);
        clientState.debugMode = hashParameters.debugMode;
    }
    
    // Page displayer will handle cases where the hash is not valid and also optimizing out page redraws if staying on same page
    pageDisplayer.showPage(clientState.pageIdentifier);

    console.log("done with urlHashFragmentChanged");
}

var updateHashTimer = null;

function updateHashIfNeededForChangedClientState() {
    var newHash = hashStringForClientState();
    if (newHash !== hash()) hash(newHash);
}
    
function addExtraFieldSpecificationsForPageSpecification(pageID, pageSpecification) {
    // console.log("addExtraFieldSpecificationsForPageSpecification", pageSpecification.section, pageID, pageSpecification);
    
    function addPageChangeButton(newPageID, idExtra, prompt, displayIconClass) {
        // TODO: Translate
        if (displayIconClass !== "homeButtonImage") {
            var sectionPageSpecification = panelSpecificationCollection.getPageSpecificationForPageID(newPageID);
            prompt += ": " + sectionPageSpecification.displayName;
        }
        var iconPosition = "left";
        if (displayIconClass === "rightButtonImage") iconPosition = "right";
        var returnToDashboardButtonSpecification = {
            "id": pageID + idExtra,
            "valueType": "none",
            "displayPrompt": prompt,
            "displayType": "button",
            "displayClass": "narrafirma-page-change-button",
            "displayConfiguration": {
                "action": "guiOpenSection",
                "section": newPageID
            },
            displayIconClass: displayIconClass,
            displayPreventBreak: true,
            displayIconPosition: iconPosition
        };
        panelSpecificationCollection.addFieldSpecificationToPanelSpecification(pageSpecification, returnToDashboardButtonSpecification); 
    }
    
    if (pageSpecification.section !== "dashboard") {
        if (!pageSpecification.isHeader) {
            // TODO: Change the id of this field to have notes or reminder
            // Regular page -- add a footer where the page status can be set
            var statusEntryID = pageID + "_reminders";
            var completionStatusEntryFieldSpecification = {
                id: statusEntryID,
                valueType: "string",
                displayType: "textarea",
                displayName: "Reminders",
                displayClass: "narrafirma-reminder",
                displayPrompt: translate(
                    "#dashboard_status_entry::prompt",
                    "You can enter <strong>reminders</strong> about this page here. They will appear on this section's home page."
                )
        };
            panelSpecificationCollection.addFieldSpecificationToPanelSpecification(pageSpecification, completionStatusEntryFieldSpecification);
        } else {
            // Dashboard page
            // console.log("page dashboard as header", pageSpecification.id, pageSpecification.displayType, pageSpecification);
            // Put in dashboard
            var childPageIDs = panelSpecificationCollection.getChildPageIDListForHeaderID(pageID);
            // console.log("child pages", pageID, childPageIDs);
            if (!childPageIDs) childPageIDs = [];
            // Add a display to this page for each child page in the same section
            for (var childPageIndex = 0; childPageIndex < childPageIDs.length; childPageIndex++) {
                var childPageID = childPageIDs[childPageIndex];
                var statusViewID = childPageID + "_reminders_dashboard";
                var childPageSpecification = panelSpecificationCollection.getPageSpecificationForPageID(childPageID);
                // console.log("childPageID", childPageSpecification, childPageID);
                if (!childPageSpecification) console.log("Error: problem finding page definition for", childPageID);
                if (childPageSpecification && childPageSpecification.displayType === "page") {
                    var prompt = translate(childPageID + "::title", childPageSpecification.displayName);
                    // Wrap the prompt as a link to the page
                    prompt = '<a href="javascript:narrafirma_openPage(\'' + childPageID + '\')">' + prompt + '</a>';
                    // + " " + translate("#dashboard_status_label", "reminders:")
                    prompt = prompt  + " ";
                    // console.log("about to call panelBuilder to add one questionAnswer for child page's status", childPageID);
                    var completionStatusDisplayFieldSpecification = {
                        id: statusViewID,
                        valueType: "none",
                        displayType: "questionAnswer",
                        displayName: prompt,
                        displayPrompt: prompt,
                        displayConfiguration: childPageID + "_reminders"
                    };
                    panelSpecificationCollection.addFieldSpecificationToPanelSpecification(pageSpecification, completionStatusDisplayFieldSpecification);  
                }
            }
        }
    
        // Add button at bottom of each page to move to previous
        if (pageSpecification.previousPageID) {
            // TODO: Translate
            addPageChangeButton(pageSpecification.previousPageID, "_previousPageButton", "Previous", "leftButtonImage");
        } else {
            addPageChangeButton(startPage, "_returnToDashboardButton", "Go to home page", "homeButtonImage");
        }
   
        // Add button at bottom of each page to move forward
        if (pageSpecification.nextPageID) {
            addPageChangeButton(pageSpecification.nextPageID, "_nextPageButton", "Next", "rightButtonImage");
        } else {
            addPageChangeButton(startPage, "_returnToDashboardButton", "Go to home page", "homeButtonImage");
        }
    }
}

function processAllPanels() {
    var panels = panelSpecificationCollection.buildListOfPanels();
    // console.log("processAllPanels", panels);
    
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
                var previousPage = panelSpecificationCollection.getPageSpecificationForPageID(lastPageID);
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

    // TODO: Improve status reporting
    // serverStatusPane = panelBuilder.newContentPane({content: "Server status: unknown"});
    // serverStatusPane.placeAt(pageControlsPane);
    /*
    statusTooltip = new Tooltip({
        connectId: ["narrafirma-name"],
        label: "Server status: unknown",
        position: ["below", "after", "above", "before"]
    });
    */
    
    // updateServerStatus("Server status: unknown");
    
    console.log("createLayout end");
}

// TODO: Think more about how to integrate updatedServerStatus this with Mithril
function updateServerStatus(status, text) {
    // The serverStatusPane may be created only after we start talking to the server
    // if (!serverStatusPane) return;
    
    var nameDiv = document.getElementById("narrafirma-name");
    if (!nameDiv) return;
    
    // TODO: Translate
    
    var statusText = "Project: " + project.journalIdentifier.substring(narrafirmaProjectPrefix.length) + "; Server status: (" + status + ") " + text;

    if (status === "ok") {
        nameDiv.className = "narrafirma-serverstatus-ok";
        //nameDiv.style.color = "green";
        //nameDiv.style.border = "initial";
        lastServerError = "";
    } else if (status === "waiting") {
        //nameDiv.style.color = "yellow";
        if (lastServerError) {
            // TODO: Translate
            nameDiv.className = "narrafirma-serverstatus-waiting-last-error";
            statusText += "\n" + "Last error: " + lastServerError;
        } else {
            nameDiv.className = "narrafirma-serverstatus-waiting";
        }
    } else if (status === "failure" || status === "failure-loss") {
        nameDiv.className = "narrafirma-serverstatus-failure";
        //nameDiv.style.color = "red";
        lastServerError = text;
        //nameDiv.style.border = "thick solid #FF0000";
        console.log("updateServerStatus failure", text);
        if (status === "failure-loss") {
            // Very serious error with data loss -- alert the user
            toaster.toast("Server lost recent change:\n" + text);
        }
    } else {
        console.log("Unexpected server status", status);
        nameDiv.className = "narrafirma-serverstatus-unexpected";
        //nameDiv.style.color = "black";
        console.log("updateServerStatus unexepected", text);
    }
    
    nameDiv.title = statusText;
    clientState.serverStatus = nameDiv.className;
    clientState.serverStatusText = statusText;
    // TODO: Need to make tooltip text ARIA accessible; suggestion in tooltip docs on setting text in tab order
    // statusTooltip.set("label", statusText); 
    
    // serverStatusPane.set("content", statusText);
}

// dispatch the button click
function buttonClicked(panelBuilder: PanelBuilder, model, fieldSpecification, value) {
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
         console.log(message, model, fieldSpecification, value);
         alert(message);
     } else {
         actualFunction(model, fieldSpecification, value);
     }
}

// Panel builder "functionResult" components will get routed through here to calculate their text.
function calculateFunctionResultForGUI(panelBuilder: PanelBuilder, model, fieldSpecification, functionName): any {
    if (functionName === "isStoryCollectingEnabled") {
        return surveyCollection.isStoryCollectingEnabled();
    } else if (functionName === "storeQuestionnaireInStoryCollection") {
        var storyCollectionIdentifier = fieldSpecification.value;
        var questionnaireName = project.tripleStore.queryLatestC(storyCollectionIdentifier, "storyCollection_questionnaireIdentifier");
        var questionnaire = questionnaireGeneration.buildQuestionnaire(project, questionnaireName);
        if (!questionnaire) return ["Questionnaire could not be created for: " + questionnaireName];
        project.tripleStore.addTriple(storyCollectionIdentifier, "questionnaire", questionnaire);
        return null;
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
    
function setupGlobalFunctions() {
    // Set up global function used by section dashboard links
    
    window["narrafirma_openPage"] = function (pageIdentifier) {
        clientState.pageIdentifier = pageIdentifier;
        updateHashIfNeededForChangedClientState();
        // Page displayer will handle cases where the hash is not valid and also optimizing out page redraws if staying on same page
        pageDisplayer.showPage(clientState.pageIdentifier);
    };
    
    window["narrafirma_logoutClicked"] = function () {
        buttonActions.logoutButtonClicked();
    };
    
    window["narrafirma_helpClicked"] = function (pageIdentifier) {
        buttonActions.helpButtonClicked();
    };
}

// The main starting point of the application
export function initialize() {
    console.log("=======", new Date().toISOString(), "application.initialize() called");
    
    // Load these earlier in index.html because TypeScript does not like the Dojo plugins
    navigationJSONText = window["narraFirma_navigationJSONText"];
    // console.log("navigationJSONText", navigationJSONText);
    
    // Cast to silence TypeScript warning about use of translate.configure
    (<any>translate).configure({}, applicationMessages.root);
    
    try {
        navigationSections = JSON.parse(navigationJSONText);
    } catch (e) {
        console.log("problem parsing navigationJSONText", navigationJSONText);
        console.log("Error", e);
        alert('There was a problem parsing the file "navigation.json"; the application can not run.');
        document.getElementById("pleaseWaitDiv").style.display = "none";
        document.body.appendChild(document.createTextNode("Startup failed! Please contact your NarraFirma hosting provider."));
        throw new Error("Unable to start due to malformed navigation.json file");
    }
    
    var fragment = hash();
    console.log("fragment when page first loaded", fragment);
    var initialHashParameters = getHashParameters(fragment);
    if (initialHashParameters["project"]) clientState.projectIdentifier = initialHashParameters["project"];
    if (initialHashParameters["page"]) clientState.pageIdentifier = "page_" + initialHashParameters["page"];
    if (initialHashParameters["storyCollection"]) clientState.storyCollectionIdentifier = initialHashParameters["storyCollection"];
    if (initialHashParameters["catalysisReport"]) clientState.catalysisReportIdentifier = initialHashParameters["catalysisReport"];
    if (initialHashParameters["debugMode"]) clientState.debugMode = initialHashParameters["debugMode"];
        
    // Ensure defaults
    if (!initialHashParameters["page"]) clientState.pageIdentifier = startPage;
    
    setupGlobalFunctions();
    
    // mount Mithril dialog support now, as it may be needed in choosing a project
    dialogSupport.initialize();
    
    // Throwaway single-use pointrel client instance which does not access a specific journal and for which polling is not started
    var singleUsePointrelClient = new PointrelClient("/api/pointrel20150417", "unused", {});
    singleUsePointrelClient.getCurrentUserInformation(function(error, response) {
        if (error) {
            console.log("error", error, response);
            document.getElementById("pleaseWaitDiv").style.display = "none";
            document.getElementById("pageDiv").innerHTML = "Problem talking to server. Please contact your NarraFirma administrator.";
            document.getElementById("pageDiv").style.display = "block";
            alert("Something went wrong determining the current user identifier");
            return;
        }
        console.log("initialize response", response);
        userIdentifier = response.userIdentifier;
        if (userIdentifier === undefined) userIdentifier = "anonymous";
        var projects = [];
        for (var key in response.journalPermissions) {
            if (!_.startsWith(key, narrafirmaProjectPrefix)) continue;
            var permissions = response.journalPermissions[key];
            projects.push({
                id: key,
                name: key.substring(narrafirmaProjectPrefix.length),
                read: permissions.read,
                write: permissions.write,
                admin: permissions.admin
            });
        }
        
        if (!projects.length) {
            document.getElementById("pleaseWaitDiv").style.display = "none";
            var recoveryText = "Please contact your NarraFirma project administrator.";
            var loginText = "";
            if (userIdentifier === "anonymous") {
                recoveryText = "Please try logging in.";
                // TODO: Needs to be different for Wordpress
                loginText = ' <a href="/login">login</a>';
            }
            
            document.body.innerHTML += '<br><b>No projects. The NarraFirma application can not run.</b> ' + recoveryText + loginText;
            alert("There are no projects accessible by the current user (" + userIdentifier + "). " + recoveryText);
            return;
        }
        
        chooseAProjectToOpen(response.userIdentifier, projects);
    });
}

function chooseAProjectToOpen(userIdentifierFromServer, projects) {
    // Initialize toaster
    toaster.createToasterWidget("toasterDiv");
    
    loadAllApplicationWidgets(PanelBuilder);
    
    document.getElementById("pleaseWaitDiv").style.display = "none";
    
    var userCredentials = {
        userIdentifier: userIdentifier
    };
    
    var projectIdentifierSupplied = clientState.projectIdentifier;
    console.log("projectIdentifierSupplied", projectIdentifierSupplied);
    if (projectIdentifierSupplied) {
        // TODO: Could put up project chooser if the supplied project is invalid...
        openProject(userCredentials, narrafirmaProjectPrefix + projectIdentifierSupplied);
    } else {
        // TODO: Translate
        var columns = {name: "Project name", id: "Project journal", write: "Editable"};
        // TODO: Only allow new project button for admins
        var isNewAllowed = true;
        dialogSupport.openListChoiceDialog(null, projects, columns, "Projects", "Select a project to work on", isNewAllowed, function (projectChoice) {
            if (!projectChoice) return;
            
            projectIdentifier = projectChoice.id;
            if (!projectIdentifier) return;
            
            if (projectChoice.isNew) {
                clientState.projectIdentifier = projectIdentifier;
                projectIdentifier = narrafirmaProjectPrefix + projectIdentifier;
                journalIdentifier = projectIdentifier; 
                alert("About to make project: " + projectIdentifier);
                makeNewProject();
                return;     
            } else {
                clientState.projectIdentifier = projectIdentifier.substring(narrafirmaProjectPrefix.length);
            }

            openProject(userCredentials, projectIdentifier);
        });
        
        // Because we are opening a dialog at startup, not caused by a user event, we need to tell Mithril to redraw.
        // Safari 5 seems to sometimes get the event sequence wrong at startup, adding 100ms delay to help ensure the redraw is queued after this event is entirely done
        setTimeout(m.redraw, 100);
    }
}

function makeNewProject() {
    console.log("add-journal", journalIdentifier);
    
    var singleUsePointrelClient = new PointrelClient("/api/pointrel20150417", "unused", {});
    
    singleUsePointrelClient.createJournal(journalIdentifier, function(error, response) {
        if (error || !response.success) {
            console.log("Error creating journal", journalIdentifier, error, response);
            var message = "error";
            if (response) message = response.description;
            if (error) message = error.description;
            toaster.toast("Error: creating journal: " + journalIdentifier + " :: " + message);
            // location.reload();
        } else {
            console.log("Created journal OK", journalIdentifier, response);
            toaster.toast("Created journal OK: " + journalIdentifier);
            // allProjectsModel.projects.push({name: journalIdentifier.substring(narrafirmaProjectPrefix.length)});
            // Need to call redraw as event changing data was triggered by network
            // m.redraw();
            console.log("About to trigger page reload for changed project");
            location.reload();
        }
    });
}

var pendingRedraw = null;
function redrawFromProject() {
    // The tripleStore may not be updated yet, so this redraw needs to get queued for later by the application
    if (runningAfterInitialIdle) {
        if (!pendingRedraw) {
            console.log("queueing redrawFromProject");
            pendingRedraw = setTimeout(function() {
                console.log("redrawFromProject");
                pendingRedraw = null;
                m.redraw();
            }, 0);
        }
    }
}

function openProject(userCredentials, projectIdentifier) {
    document.getElementById("pleaseWaitDiv").style.display = "block";
    
    // TODO: Should this be managed separately?
    journalIdentifier = projectIdentifier; 
    
    project = new Project(journalIdentifier, projectIdentifier, userCredentials, updateServerStatus, redrawFromProject);
    
    console.log("Made project", project);
    
    surveyCollection.setProject(project);
    
    project.startup(function (error) {
        if (error) {
            document.getElementById("pleaseWaitDiv").style.display = "none";
            // TODO: Sanitize journalIdentifier
            document.body.innerHTML += '<br>Problem connecting to project journal on server for: "<b>' + journalIdentifier + '</b>"';
            alert("Problem connecting to project journal on server. Application will not run.");
            return;
        } else {
            loadApplicationDesign();
        }
    });
}

// TODO: For helping create all the models -- temporary
function printModels() {
    console.log("panelSpecificationCollection", panelSpecificationCollection);
    
    console.log("models", panelSpecificationCollection.modelClassToModelFieldSpecificationsMap);
    
    var allModels = JSON.stringify(panelSpecificationCollection.modelClassToModelFieldSpecificationsMap, null, 4);
    
    console.log("models JSON", allModels);
    
    // window.open('data:text/plain;charset=utf-8,' + escape(allModels));
    
    console.log("stop");
}
    
function loadApplicationDesign() {
    // Load the application design
    loadAllPanelSpecifications(panelSpecificationCollection, navigationSections, loadingBase, function() {
        // generateNavigationDataInJSON();
 
        processAllPanels();
        
        // TODO: Only for creating models once
        //printModels();
        //return;

        // Tell the panel builder how to build panels
        panelBuilder.setPanelSpecifications(panelSpecificationCollection);
        panelBuilder.project = project;
        panelBuilder.projectModel = project.projectIdentifier;
        
        // Tell the panelBuilder what do do if a button is clicked
        panelBuilder.setButtonClickedCallback(buttonClicked);
        
        panelBuilder.setCalculateFunctionResultCallback(calculateFunctionResultForGUI);

        panelBuilder.clientState = clientState;
        
        // Initialize different Mithril components which will be mounted using m.mount
        // Note that dialogSupport has already been initialized and that component mounted
        navigationPane.initializeNavigationPane(panelSpecificationCollection, startPage, userIdentifier, panelBuilder);
        pageDisplayer.configurePageDisplayer(panelBuilder, startPage, project, updateHashIfNeededForChangedClientState);

        // Fill out initial hash string if needed
        updateHashIfNeededForChangedClientState();
        
        createLayout();
        
        // TODO: What to do while waiting for data for a project to load from server the first time? Assuming authenticated OK etc.???
        
        // TODO: This assumes we have picked a project, and are actually loading data and have not errored out
        // TODO: Need some kind of progress indicator of messages loaded...
        project.pointrelClient.idleCallback = function () {
            // Now that data is presumably loaded into the Project tripleStore, we can proceed with further initialization
            buttonActions.initialize(project, clientState);
            csvImportExport.initialize(project);
             
            // Ensure the pageDisplayer will display the first page
            urlHashFragmentChanged();
            
            // Update if the URL hash fragment is changed by hand
            window.onhashchange = urlHashFragmentChanged;
            
            // turn off initial "please wait" display
            document.getElementById("pleaseWaitDiv").style.display = "none";
            document.getElementById("navigationDiv").style.display = "block";
            document.getElementById("pageDiv").style.display = "block";
            
            runningAfterInitialIdle = true;
            
            // toaster.toast("Started up!!!");
        };
        
        // From: https://developer.mozilla.org/en-US/docs/Web/Events/beforeunload
        window.addEventListener("beforeunload", function (e) {
            // TODO: IMPORTANT Ensure the current text field if any does the equivalent of a blur to commit its data...
            // TODO: But may not be reliable: http://stackoverflow.com/questions/18718494/will-onblur-event-trigger-when-window-closes
            return null;
            
            /* TODO: Need to check for unsaved changes in any grids
            if (!hasUnsavedChangesForCurrentPage()) return null;
                
            var confirmationMessage = "You have unsaved changes";

            (e || window.event).returnValue = confirmationMessage;     // Gecko and Trident
            return confirmationMessage;  
            */                              // Gecko and WebKit
        });
    });
}
    
/* TODO: Check time? Or ensure topic timestamps are set by server?
// TODO: this is not needed by apps that only use application-specific server APIs directly
function setup() {
    console.log("Using pointrel20141201");
    var currentLocalTimestamp = new Date().toISOString();
    var currentLocalTimestampMinusTenSeconds = new Date(new Date().getTime() - 10000).toISOString();
    pointrel20141201Client.getServerStatus(function (error, serverResponse) {
        if (error) {
            // TODO: translate
            var message = "Problem checking server status so application may not work correctly if server is unavailable: " + error;
            console.log("ERROR", error);
            console.log(message);
            alert(message);
            return;
        }
        console.log("Server response at: " + currentLocalTimestamp + " is: " + JSON.stringify(serverResponse), serverResponse);
        if (serverResponse.currentTimestamp < currentLocalTimestampMinusTenSeconds) {
            // TODO: Translate
            alert("The server unexpectedly responded with a time more than ten seconds earlier than this PC's time when the server's status was requested at " +
                currentLocalTimestamp + ".\nPlease check your PC's clock for accuracy, or contact the server administrator if your PC's clock is accurate.\n" +
                JSON.stringify(serverResponse));
        }
    });
}
*/