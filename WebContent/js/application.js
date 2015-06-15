/// <reference path="typings/lodash.d.ts"/>
// declare var _: _.LoDashStatic;
define(["require", "exports", "dojo/i18n!js/nls/applicationMessages", "./buttonActions", "./csvImportExport", "./panelBuilder/dialogSupport", "dojo/dom-construct", "dojo/hash", "./applicationWidgets/loadAllApplicationWidgets", "./panelBuilder/loadAllPanelSpecifications", "./navigationPane", "dojo/text!applicationPanelSpecifications/navigation.json", "./pageDisplayer", "./panelBuilder/PanelBuilder", "./panelBuilder/PanelSpecificationCollection", "./pointrel20150417/PointrelClient", "./Project", "./questionnaireGeneration", "dojo/Stateful", "./surveyCollection", "./panelBuilder/toaster", "dijit/Tooltip", "./pointrel20150417/topic", "./panelBuilder/translate"], function (require, exports, applicationMessages, buttonActions, csvImportExport, dialogSupport, domConstruct, hash, loadAllApplicationWidgets, loadAllPanelSpecifications, navigationPane, navigationJSONText, pageDisplayer, PanelBuilder, PanelSpecificationCollection, PointrelClient, Project, questionnaireGeneration, Stateful, surveyCollection, toaster, Tooltip, topic, translate) {
    "use strict";
    // TODO: Add page validation
    var narrafirmaProjectPrefix = "NarraFirmaProject-";
    // The home page -- should be a constant
    var startPage = "page_dashboard";
    // Singleton instance variables
    var journalIdentifier;
    var projectIdentifier;
    var userIdentifier;
    var project;
    // For this local instance only (not shared with other users or other browser tabs)
    var clientState = new Stateful({
        currentProjectIdentifier: null,
        currentPageIdentifier: null,
        currentStoryCollection: null,
        currentCatalysisReport: null,
        currentDebugMode: null
    });
    // GUI
    // var serverStatusPane;
    var statusTooltip;
    var lastServerError = "";
    var navigationSections = [];
    try {
        navigationSections = JSON.parse(navigationJSONText);
    }
    catch (e) {
        console.log("problem parsing navigationJSONText", navigationJSONText);
        console.log("Error", e);
        alert('There was a problem parsing the file "navigation.json"; the application can not run.');
        document.getElementById("pleaseWaitDiv").style.display = "none";
        document.body.appendChild(document.createTextNode("Startup failed! Please contact your NarraFirma hosting provider."));
        throw new Error("Unable to start due to malformed navigation.json file");
    }
    var loadingBase = "dojo/text!applicationPanelSpecifications/";
    // For building panels based on field specifications
    var panelBuilder = new PanelBuilder();
    // This will hold information about all the panels used
    var panelSpecificationCollection = new PanelSpecificationCollection();
    // getHashParameters derived from: http://stackoverflow.com/questions/4197591/parsing-url-hash-fragment-identifier-with-javascript
    function getHashParameters(hash) {
        var result = {};
        var match;
        // Regex for replacing addition symbol with a space
        var plusMatcher = /\+/g;
        var parameterSplitter = /([^&;=]+)=?([^&;]*)/g;
        var decode = function (s) {
            return decodeURIComponent(s.replace(plusMatcher, " "));
        };
        while (true) {
            match = parameterSplitter.exec(hash);
            if (!match)
                break;
            result[decode(match[1])] = decode(match[2]);
        }
        return result;
    }
    function hashStringForClientState() {
        var result = "";
        var fields = [
            { id: "currentProjectIdentifier", key: "project" },
            { id: "currentPageIdentifier", key: "page" },
            { id: "currentStoryCollection", key: "storyCollection" },
            { id: "currentCatalysisReport", key: "catalysisReport" },
            { id: "currentDebugMode", key: "debugMode" }
        ];
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            var value = clientState.get(field.id);
            if (!value)
                continue;
            if (field.key === "page" && value)
                value = value.substring("page_".length);
            if (result)
                result += "&";
            result += field.key + "=" + encodeURIComponent(value);
        }
        console.log("hashStringForClientState", result, clientState);
        return result;
    }
    function urlHashFragmentChanged(newHash) {
        console.log("urlHashFragmentChanged", newHash);
        var hashParameters = getHashParameters(newHash);
        console.log("hashParameters", hashParameters, clientState);
        var currentProjectIdentifier = clientState.get("currentProjectIdentifier");
        if (currentProjectIdentifier) {
            if (hashParameters.project && hashParameters.project !== currentProjectIdentifier) {
                // Force a complete page reload for now, as needs to create a new Pointrel client
                // TODO: Should we shut down the current Pointrel client first?
                alert("About to trigger page reload for changed project");
                location.reload();
                return;
            }
        }
        else {
            console.log("changing client state for page", clientState.get("currentProjectIdentifier"), hashParameters.project);
            clientState.set("currentProjectIdentifier", hashParameters.project);
        }
        var selectedPage = hashParameters.page;
        if (!selectedPage) {
            selectedPage = startPage;
        }
        else {
            selectedPage = "page_" + selectedPage;
        }
        if (selectedPage !== clientState.get("currentPageIdentifier")) {
            console.log("changing client state for page", clientState.get("currentPageIdentifier"), selectedPage);
            clientState.set("currentPageIdentifier", selectedPage);
        }
        if (hashParameters.storyCollection && hashParameters.storyCollection !== clientState.get("currentStoryCollection")) {
            console.log("changing client state for storyCollection", clientState.get("currentStoryCollection"), hashParameters.storyCollection);
            clientState.set("storyCollection", hashParameters.storyCollection);
        }
        if (hashParameters.catalysisReport && hashParameters.catalysisReport !== clientState.get("currentCatalysisReport")) {
            console.log("changing client state for catalysisReport", clientState.get("currentCatalysisReport"), hashParameters.catalysisReport);
            clientState.set("catalysisReport", hashParameters.catalysisReport);
        }
        if (hashParameters.debugMode && hashParameters.debugMode !== clientState.get("currentDebugMode")) {
            console.log("changing client state for debugMode", clientState.get("currentDebugMode"), hashParameters.debugMode);
            clientState.set("debugMode", hashParameters.debugMode);
        }
        // Page displayer will handle cases where the hash is not valid and also optimizing out page redraws if staying on same page
        pageDisplayer.showPage(clientState.get("currentPageIdentifier"));
    }
    var updateHashTimer = null;
    function updateHashIfNeededForChangedState() {
        var newHash = hashStringForClientState();
        if (newHash !== hash())
            hash(newHash);
    }
    function startTrackingClientStateChanges() {
        // TODO: Should this watch be owned by some component so they can be destroyed when the page closes?
        clientState.watch(function () {
            if (updateHashTimer)
                clearTimeout(updateHashTimer);
            // Delay updating hash in case other clientState fields are also changing
            updateHashTimer = setTimeout(function () {
                updateHashTimer = null;
                try {
                    updateHashIfNeededForChangedState();
                }
                catch (e) {
                    console.log("Problem calling updateHashIfNeededForChangedState", e);
                }
            }, 0);
        });
    }
    function addExtraFieldSpecificationsForPageSpecification(pageID, pageSpecification) {
        // console.log("addExtraFieldSpecificationsForPageSpecification", pageSpecification.section, pageID, pageSpecification);
        function addPageChangeButton(newPageID, idExtra, prompt, displayIconClass) {
            // TODO: Translate
            if (displayIconClass !== "homeButtonImage") {
                var sectionPageSpecification = panelSpecificationCollection.getPageSpecificationForPageID(newPageID);
                prompt += ": " + sectionPageSpecification.displayName;
            }
            var returnToDashboardButtonSpecification = {
                "id": pageID + idExtra,
                "valueType": "none",
                "displayPrompt": prompt,
                "displayType": "button",
                "displayConfiguration": {
                    "action": "guiOpenSection",
                    "section": newPageID
                },
                displayIconClass: displayIconClass,
                displayPreventBreak: true
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
                    displayPrompt: translate("#dashboard_status_entry::prompt", "You can enter <strong>reminders</strong> about this page here. They will appear on this section's home page.")
                };
                panelSpecificationCollection.addFieldSpecificationToPanelSpecification(pageSpecification, completionStatusEntryFieldSpecification);
            }
            else {
                // Dashboard page
                // console.log("page dashboard as header", pageSpecification.id, pageSpecification.displayType, pageSpecification);
                // Put in dashboard
                var childPageIDs = panelSpecificationCollection.getChildPageIDListForHeaderID(pageID);
                // console.log("child pages", pageID, childPageIDs);
                if (!childPageIDs)
                    childPageIDs = [];
                for (var childPageIndex = 0; childPageIndex < childPageIDs.length; childPageIndex++) {
                    var childPageID = childPageIDs[childPageIndex];
                    var statusViewID = childPageID + "_reminders_dashboard";
                    var childPageSpecification = panelSpecificationCollection.getPageSpecificationForPageID(childPageID);
                    // console.log("childPageID", childPageSpecification, childPageID);
                    if (!childPageSpecification)
                        console.log("Error: problem finding page definition for", childPageID);
                    if (childPageSpecification && childPageSpecification.displayType === "page") {
                        var prompt = translate(childPageID + "::title", childPageSpecification.displayName);
                        // Wrap the prompt as a link to the page
                        prompt = '<a href="javascript:narrafirma_openPage(\'' + childPageID + '\')">' + prompt + '</a>';
                        // + " " + translate("#dashboard_status_label", "reminders:")
                        prompt = prompt + " ";
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
            }
            else {
                addPageChangeButton(startPage, "_returnToDashboardButton", "Go to home page", "homeButtonImage");
            }
            // Add button at bottom of each page to move forward
            if (pageSpecification.nextPageID) {
                addPageChangeButton(pageSpecification.nextPageID, "_nextPageButton", "Next", "rightButtonImage");
            }
            else {
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
        var pageControlsPane = navigationPane.createNavigationPane(pageDisplayer, panelSpecificationCollection, startPage);
        domConstruct.place('<a id="narrafirma-logout-link" href="javascript:narrafirma_logoutClicked()">Logout (' + userIdentifier + ')</a>', pageControlsPane.domNode);
        // TODO: Improve status reporting
        // serverStatusPane = panelBuilder.newContentPane({content: "Server status: unknown"});
        // serverStatusPane.placeAt(pageControlsPane);
        statusTooltip = new Tooltip({
            connectId: ["narrafirma-name"],
            label: "Server status: unknown",
            position: ["below", "after", "above", "before"]
        });
        // updateServerStatus("Server status: unknown");
        console.log("createLayout end");
    }
    function updateServerStatus(status, text) {
        // The serverStatusPane may be created only after we start talking to the server
        // if (!serverStatusPane) return;
        var nameDiv = document.getElementById("narrafirma-name");
        if (!nameDiv)
            return;
        // TODO: Translate
        var statusText = "Project: " + project.journalIdentifier.substring(narrafirmaProjectPrefix.length) + "; Server status: (" + status + ") " + text;
        if (status === "ok") {
            nameDiv.className = "narrafirma-serverstatus-ok";
            //nameDiv.style.color = "green";
            //nameDiv.style.border = "initial";
            lastServerError = "";
        }
        else if (status === "waiting") {
            //nameDiv.style.color = "yellow";
            if (lastServerError) {
                // TODO: Translate
                nameDiv.className = "narrafirma-serverstatus-waiting-last-error";
                statusText += "<br>" + "Last error: " + lastServerError;
            }
            else {
                nameDiv.className = "narrafirma-serverstatus-waiting";
            }
        }
        else if (status === "failure") {
            nameDiv.className = "narrafirma-serverstatus-failure";
            //nameDiv.style.color = "red";
            lastServerError = text;
        }
        else {
            console.log("Unexpected server status", status);
            nameDiv.className = "narrafirma-serverstatus-unexpected";
        }
        // nameDiv.title = statusText;
        // TODO: Need to make tooltip text ARIA accessible; suggestion in tooltip docs on setting text in tab order
        statusTooltip.set("label", statusText);
        // serverStatusPane.set("content", statusText);
    }
    // dispatch the button click
    function buttonClicked(panelBuilder, contentPane, model, fieldSpecification, value) {
        console.log("buttonClicked", fieldSpecification);
        var functionName = fieldSpecification.id;
        if (fieldSpecification.displayConfiguration) {
            if (_.isString(fieldSpecification.displayConfiguration)) {
                functionName = fieldSpecification.displayConfiguration;
            }
            else {
                functionName = fieldSpecification.displayConfiguration.action;
            }
        }
        var actualFunction = buttonActions[functionName];
        if (!actualFunction) {
            var message = "Unfinished handling for: " + fieldSpecification.id + " with functionName: " + functionName;
            console.log(message, contentPane, model, fieldSpecification, value);
            alert(message);
        }
        else {
            actualFunction(contentPane, model, fieldSpecification, value);
        }
    }
    // Panel builder "functionResult" components will get routed through here to calculate their text.
    // The application should publish a topic with the same name as these functions when their value changes.
    function calculateFunctionResultForGUI(panelBuilder, contentPane, model, fieldSpecification, functionName) {
        if (functionName === "isStoryCollectingEnabled") {
            return surveyCollection.isStoryCollectingEnabled();
        }
        else if (functionName === "storeQuestionnaireInStoryCollection") {
            var storyCollection = fieldSpecification.value;
            var questionnaireName = storyCollection.storyCollection_questionnaireIdentifier;
            var questionnaire = questionnaireGeneration.buildQuestionnaire(project, questionnaireName);
            if (!questionnaire)
                return ["Questionnaire could not be created for: " + questionnaireName];
            storyCollection.questionnaire = questionnaire;
            return null;
        }
        else {
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
        allPanels.forEach(function (panel) {
            console.log("panel", panel.displayType, panel.id, panel.section, panel.displayName);
            if (panel.isHeader) {
                if (sectionBeingProcessed)
                    sections.push(sectionBeingProcessed);
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
            }
            else {
                if (!pageBeingProcessed.extraPanels)
                    pageBeingProcessed.extraPanels = [];
                pageBeingProcessed.extraPanels.push(navigationInfo);
            }
        });
        console.log("JSON for navigation:");
        console.log(JSON.stringify(sections, null, 4));
    }
    function setupGlobalFunctions() {
        // Set up global function used by section dashboard links
        window["narrafirma_openPage"] = function (pageIdentifier) {
            clientState.set("currentPageIdentifier", pageIdentifier);
        };
        window["narrafirma_logoutClicked"] = function () {
            buttonActions.logoutButtonClicked();
        };
        window["narrafirma_helpClicked"] = function (pageIdentifier) {
            buttonActions.helpButtonClicked();
        };
    }
    // The main starting point of the application
    function initialize() {
        console.log("=======", new Date().toISOString(), "application.initialize() called");
        var fragment = hash();
        console.log("fragment when page first loaded", fragment);
        var initialHashParameters = getHashParameters(fragment);
        if (initialHashParameters["project"])
            clientState.set("currentProjectIdentifier", initialHashParameters["project"]);
        if (initialHashParameters["page"])
            clientState.set("currentPageIdentifier", "page_" + initialHashParameters["page"]);
        if (initialHashParameters["storyCollection"])
            clientState.set("currentStoryCollection", initialHashParameters["storyCollection"]);
        if (initialHashParameters["catalysisReport"])
            clientState.set("currentCatalysisReport", initialHashParameters["catalysisReport"]);
        if (initialHashParameters["debugMode"])
            clientState.set("currentDebugMode", initialHashParameters["debugMode"]);
        // Ensure defaults
        if (!initialHashParameters["page"])
            clientState.set("currentPageIdentifier", startPage);
        setupGlobalFunctions();
        // Throwaway single-use pointrel client instance which does not access a specific journal and for which polling is not started
        var singleUsePointrelClient = new PointrelClient("/api/pointrel20150417", "unused", {});
        singleUsePointrelClient.getCurrentUserInformation(function (error, response) {
            if (error) {
                console.log("error", error, response);
                alert("Something went wrong determining the current user identifier");
                return;
            }
            console.log("initialize response", response);
            userIdentifier = response.userIdentifier;
            if (userIdentifier === undefined)
                userIdentifier = "anonymous";
            var projects = [];
            for (var key in response.journalPermissions) {
                if (!_.startsWith(key, narrafirmaProjectPrefix))
                    continue;
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
    exports.initialize = initialize;
    function chooseAProjectToOpen(userIdentifierFromServer, projects) {
        // Cast to silence TypeScript warning about use of translate.configure
        translate.configure({}, applicationMessages);
        // Initialize toaster
        toaster.createToasterWidget("navigationDiv");
        loadAllApplicationWidgets(PanelBuilder);
        document.getElementById("pleaseWaitDiv").style.display = "none";
        var userCredentials = {
            userIdentifier: userIdentifier
        };
        var projectIdentifierSupplied = clientState.get("currentProjectIdentifier");
        console.log("projectIdentifierSupplied", projectIdentifierSupplied);
        if (projectIdentifierSupplied) {
            // TODO: Could put up project chooser if the supplied project is invalid...
            openProject(userCredentials, narrafirmaProjectPrefix + projectIdentifierSupplied);
        }
        else {
            // TODO: Translate
            var columns = { name: "Project name", id: "Project journal", write: "Editable" };
            dialogSupport.openListChoiceDialog(null, projects, columns, "Projects", "Select a project to work on", function (projectChoice) {
                if (!projectChoice)
                    return;
                projectIdentifier = projectChoice.id;
                if (!projectIdentifier)
                    return;
                clientState.set("currentProjectIdentifier", projectIdentifier.substring(narrafirmaProjectPrefix.length));
                openProject(userCredentials, projectIdentifier);
            });
        }
    }
    function openProject(userCredentials, projectIdentifier) {
        document.getElementById("pleaseWaitDiv").style.display = "block";
        // TODO: Should this be managed separately?
        journalIdentifier = projectIdentifier;
        project = new Project(journalIdentifier, projectIdentifier, userCredentials, updateServerStatus);
        console.log("Made project", project);
        surveyCollection.setProject(project);
        project.startup(function (error) {
            if (error) {
                document.getElementById("pleaseWaitDiv").style.display = "none";
                // TODO: Sanitize journalIdentifier
                document.body.innerHTML += '<br>Problem connecting to project journal on server for: "<b>' + journalIdentifier + '</b>"';
                alert("Problem connecting to project journal on server. Application will not run.");
                return;
            }
            else {
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
        loadAllPanelSpecifications(panelSpecificationCollection, navigationSections, loadingBase, function () {
            // generateNavigationDataInJSON();
            processAllPanels();
            // TODO: Only for creating models once
            //printModels();
            //return;
            // Tell the panel builder how to build panels
            panelBuilder.setPanelSpecifications(panelSpecificationCollection);
            panelBuilder.project = project;
            // Tell the panelBuilder what do do if a button is clicked
            panelBuilder.setButtonClickedCallback(buttonClicked);
            panelBuilder.setCalculateFunctionResultCallback(calculateFunctionResultForGUI);
            pageDisplayer.configurePageDisplayer(panelBuilder, startPage, project);
            // Fill out initial hash string if needed
            updateHashIfNeededForChangedState();
            createLayout();
            // TODO: What to do while waiting for data for a project to load from server the first time? Assuming authenticated OK etc.???
            // TODO: This assumes we have picked a project, and are actually loading data and have not errored out
            // TODO: Need some kind of progress indicator of messages loaded...
            project.pointrelClient.idleCallback = function () {
                // Now that data is presumably loaded, set up the project model to use that data and track ongoing changes to it
                project.initializeProjectModel(panelSpecificationCollection);
                panelBuilder.projectModel = project.projectModel;
                panelBuilder.clientState = clientState;
                buttonActions.initialize(project);
                csvImportExport.initialize(project);
                startTrackingClientStateChanges();
                // Ensure the pageDisplayer will display the first page
                urlHashFragmentChanged(hashStringForClientState());
                // Update if the URL hash fragment is changed by hand
                topic.subscribe("/dojo/hashchange", urlHashFragmentChanged);
                // turn off initial "please wait" display
                document.getElementById("pleaseWaitDiv").style.display = "none";
                document.getElementById("navigationDiv").style.display = "block";
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
                */ // Gecko and WebKit
            });
        });
    }
});
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
            alert("The server unexpectedly responded with a time more than ten seconds earlier than this PC's time when the server's status was requested at " + currentLocalTimestamp + ".\nPlease check your PC's clock for accuracy, or contact the server administrator if your PC's clock is accurate.\n" + JSON.stringify(serverResponse));
        }
    });
}
*/ 
//# sourceMappingURL=application.js.map