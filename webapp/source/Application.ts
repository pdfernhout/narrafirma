import applicationMessages = require("./nls/applicationMessages");
import buttonActions = require("./buttonActions");
import csvImportExport = require("./csvImportExport");
import dialogSupport = require("./panelBuilder/dialogSupport");
import loadAllApplicationWidgets = require("./applicationWidgets/loadAllApplicationWidgets");
import loadAllPanelSpecifications = require("./panelBuilder/loadAllPanelSpecifications");
import navigationPane = require("./navigationPane");
import pageDisplayer = require("./pageDisplayer");
import PanelBuilder = require("./panelBuilder/PanelBuilder");
import PointrelClient = require("./pointrel20150417/PointrelClient");
import Project = require("./Project");
import questionnaireGeneration = require("./questionnaireGeneration");
import surveyCollection = require("./surveyCollection");
import toaster = require("./panelBuilder/toaster");
import translate = require("./panelBuilder/translate");
import m = require("mithril");
import navigationSections = require("./applicationPanelSpecifications/navigation");
import PanelSetup = require("./PanelSetup");
import Globals = require("./Globals");
import versions = require("./versions");
import _ = require("lodash");

"use strict";

// TODO: Add page validation

var narrafirmaProjectPrefix = "NarraFirmaProject-";
var loadingBase = "js/applicationPanelSpecifications/";

class Application {
    // Singleton instance variables
    private journalIdentifier: string;
    private projectIdentifier: string;
    private userIdentifier: string;
    private readOnly: boolean = false;
        
    /*
    export function project() {
        return _project;
    }
    */
    
    private lastServerError: string = "";
    
    // The runningAfterIdle falg is used to limit redraws for new project messages until after initial set recevied
    private runningAfterInitialIdle: boolean = false;
    
    private pendingRedraw = null;
    
    // For building panels based on field specifications
    private panelBuilder: PanelBuilder;
    
    private updateHashTimer = null;
    
    constructor() {
        this.panelBuilder = new PanelBuilder(this);
    }
    
    // Make all of the application pages selectable from the dropdown list and back/next buttons and put them in a TabContainer
    createLayout() {
        // console.log("createLayout start");
    
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
        
        // console.log("createLayout end");
    }
    
    // TODO: Think more about how to integrate updatedServerStatus this with Mithril
    updateServerStatus(status, text) {
        // The serverStatusPane may be created only after we start talking to the server
        // if (!serverStatusPane) return;
        
        var nameDiv = document.getElementById("narrafirma-name");
        if (!nameDiv) return;
        
        // TODO: Translate
        
        var statusText = "Project: " + Globals.project().journalIdentifier.substring(narrafirmaProjectPrefix.length) + "; Server status: (" + status + ") " + text;
    
        if (status === "ok") {
            nameDiv.className = "narrafirma-serverstatus-ok";
            //nameDiv.style.color = "green";
            //nameDiv.style.border = "initial";
            this.lastServerError = "";
        } else if (status === "waiting") {
            //nameDiv.style.color = "yellow";
            if (this.lastServerError) {
                // TODO: Translate
                nameDiv.className = "narrafirma-serverstatus-waiting-last-error";
                statusText += "\n" + "Last error: " + this.lastServerError;
            } else {
                nameDiv.className = "narrafirma-serverstatus-waiting";
            }
        } else if (status === "failure" || status === "failure-loss") {
            nameDiv.className = "narrafirma-serverstatus-failure";
            //nameDiv.style.color = "red";
            this.lastServerError = text;
            //nameDiv.style.border = "thick solid #FF0000";
            console.log("updateServerStatus failure", text);
            if (status === "failure-loss") {
                // Very serious error with data loss -- alert the user
                if (this.readOnly) {
                    // toaster.toast("Project is read only; changes are not being saved.");
                    nameDiv.className = "narrafirma-serverstatus-ok";
                    this.lastServerError = "Read-only OK";
                } else {
                    toaster.toast("Server lost recent change:\n" + text);
                }
            }
        } else {
            console.log("Unexpected server status", status);
            nameDiv.className = "narrafirma-serverstatus-unexpected";
            //nameDiv.style.color = "black";
            console.log("updateServerStatus unexpected", text);
        }
        
        nameDiv.title = statusText;
        Globals.clientState().serverStatus(nameDiv.className);
        Globals.clientState().serverStatusText(statusText);
        // TODO: Need to make tooltip text ARIA accessible; suggestion in tooltip docs on setting text in tab order
        // statusTooltip.set("label", statusText); 
        
        // serverStatusPane.set("content", statusText);
    }
    
    // dispatch the button click
    buttonClicked(panelBuilder: PanelBuilder, model, fieldSpecification, value) {
         // console.log("buttonClicked", fieldSpecification);
         
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
    calculateFunctionResultForGUI(panelBuilder: PanelBuilder, model, fieldSpecification, functionName): any {
        if (functionName === "isStoryCollectingEnabled") {
            return surveyCollection.isStoryCollectingEnabled();
        } else if (functionName === "storeQuestionnaireInStoryCollection") {
            var storyCollectionIdentifier = fieldSpecification.value;
            var success = buttonActions.setQuestionnaireForStoryCollection(storyCollectionIdentifier);
            return success ? null : ["Questionnaire could not be created for story collection"];
        } else {
            console.log("TODO: calculateFunctionResultForGUI ", functionName, fieldSpecification);
            return "calculateFunctionResultForGUI UNFINISHED: " + functionName + " for: " + fieldSpecification.id;
        }
    }
        
    setupGlobalFunctions() {
        // Set up global function used by section dashboard links
        
        window["narrafirma_openPage"] = (pageIdentifier) => {
            // console.log("narrafirma_openPage", pageIdentifier);
            if (!pageIdentifier) return;
            Globals.clientState().pageIdentifier(pageIdentifier);
            Globals.clientState().updateHashIfNeededForChangedClientState();
            // Page displayer will handle cases where the hash is not valid and also optimizing out page redraws if staying on same page
            pageDisplayer.showPage(Globals.clientState().pageIdentifier());
            // document.body.scrollTop = 0;
            // document.documentElement.scrollTop = 0;
            window.scrollTo(0, 0);
        };
        
        window["narrafirma_logoutClicked"] = () => {
            buttonActions.logoutButtonClicked();
        };
        
        window["narrafirma_loginClicked"] = () => {
            buttonActions.loginButtonClicked();
        };
        
        window["narrafirma_helpClicked"] = (pageIdentifier) => {
            buttonActions.helpButtonClicked();
        };
    }
    
    // The main starting point of the application
    public initialize() {
        console.log("=======", new Date().toISOString(), "application.initialize() called");
        
        // TODO: Translate
        document.getElementById("pleaseWaitDiv").innerHTML = "Retrieving user information from server; please wait...";
        
        // Cast to silence TypeScript warning about use of translate.configure
        (<any>translate).configure({}, applicationMessages.root);
        
        Globals.clientState().initialize();
    
        this.setupGlobalFunctions();
        
        // mount Mithril dialog support now, as it may be needed in choosing a project
        dialogSupport.initialize();
        
        // Throwaway single-use pointrel client instance which does not access a specific journal and for which polling is not started
        var singleUsePointrelClient = new PointrelClient("/api/pointrel20150417", "unused", {});
        singleUsePointrelClient.getCurrentUserInformation((error, response) => {
            if (error) {
                console.log("error", error, response);
                document.getElementById("pleaseWaitDiv").style.display = "none";
                document.getElementById("pageDiv").innerHTML = "Problem talking to server. Please contact your NarraFirma administrator.";
                document.getElementById("pageDiv").style.display = "block";
                alert("Something went wrong determining the current user identifier");
                return;
            }
            console.log("initialize response", response);
            var userIdentifier = response.userIdentifier;
            if (userIdentifier === undefined || userIdentifier === null || userIdentifier === false) {
                userIdentifier = "anonymous";
            }  
            this.userIdentifier = userIdentifier;
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
                if (this.userIdentifier === "anonymous") {
                    recoveryText = "Please try logging in.";
                    // TODO: Needs to be different for Wordpress
                    loginText = ' <a href="/login">login</a>';
                }
                
                document.body.innerHTML += '<br><b>No projects. The NarraFirma application can not run.</b> ' + recoveryText + loginText;
                alert("There are no projects accessible by the current user (" + this.userIdentifier + "). " + recoveryText);
                return;
            }
            
            this.chooseAProjectToOpen(response.userIdentifier, projects);
        });
    }
    
    chooseAProjectToOpen(userIdentifierFromServer, projects) {
        // Initialize toaster
        toaster.createToasterWidget("toasterDiv");
        
        loadAllApplicationWidgets(PanelBuilder);
        
        document.getElementById("pleaseWaitDiv").style.display = "none";
        
        var userCredentials = {
            userIdentifier: this.userIdentifier
        };
        
        var projectIdentifierSupplied = Globals.clientState().projectIdentifier();
        console.log("projectIdentifierSupplied", projectIdentifierSupplied);
        
        if (projectIdentifierSupplied) {
            // TODO: Could put up project chooser if the supplied project is invalid...
            this.openProject(userCredentials, narrafirmaProjectPrefix + projectIdentifierSupplied, projects);
        } else {
            // TODO: Translate
            var columns = {name: "Project name", id: "Project journal", write: "Editable"};
            // TODO: Only allow new project button for admins
            var isNewAllowed = false;
            dialogSupport.openListChoiceDialog(null, projects, columns, "Projects", "Select a project to work on", isNewAllowed, (projectChoice) => {
                if (!projectChoice) return;
                
                this.projectIdentifier = projectChoice.id;
                if (!this.projectIdentifier) return;
                
                if (projectChoice.isNew) {
                    Globals.clientState().projectIdentifier(this.projectIdentifier);
                    this.projectIdentifier = narrafirmaProjectPrefix + this.projectIdentifier;
                    this.journalIdentifier = this.projectIdentifier; 
                    alert("About to make project: " + this.projectIdentifier);
                    this.makeNewProject();
                    return;     
                } else {
                    Globals.clientState().projectIdentifier(this.projectIdentifier.substring(narrafirmaProjectPrefix.length));
                }
    
                this.openProject(userCredentials, this.projectIdentifier, projects);
            });
            
            // Because we are opening a dialog at startup, not caused by a user event, we need to tell Mithril to redraw.
            // Safari 5 seems to sometimes get the event sequence wrong at startup, adding 100ms delay to help ensure the redraw is queued after this event is entirely done
            setTimeout(m.redraw, 100);
        }
    }
    
    makeNewProject() {
        console.log("add-journal", this.journalIdentifier);
        
        var singleUsePointrelClient = new PointrelClient("/api/pointrel20150417", "unused", {});
        
        singleUsePointrelClient.createJournal(this.journalIdentifier, (error, response) => {
            if (error || !response.success) {
                console.log("Error creating journal", this.journalIdentifier, error, response);
                var message = "error";
                if (response) message = response.description;
                if (error) message = error.description;
                toaster.toast("Error: creating journal: " + this.journalIdentifier + " :: " + message);
                // location.reload();
            } else {
                console.log("Created journal OK", this.journalIdentifier, response);
                toaster.toast("Created journal OK: " + this.journalIdentifier);
                // allProjectsModel.projects.push({name: this.journalIdentifier.substring(narrafirmaProjectPrefix.length)});
                // Need to call redraw as event changing data was triggered by network
                // m.redraw();
                console.log("About to trigger page reload for changed project");
                location.reload();
            }
        });
    }
    
    redrawFromProject() {
        // The tripleStore may not be updated yet, so this redraw needs to get queued for later by the application
        if (this.runningAfterInitialIdle) {
            if (!this.pendingRedraw) {
                // console.log("queueing redrawFromProject");
                this.pendingRedraw = setTimeout(() => {
                    // console.log("redrawFromProject");
                    this.pendingRedraw = null;
                    m.redraw();
                }, 0);
            }
        }
    }
    
    openProject(userCredentials, projectIdentifier, projects) {            
        document.getElementById("pleaseWaitDiv").style.display = "block";
        
        // TODO: Should this be managed separately?
        this.journalIdentifier = projectIdentifier; 
        
        Globals.project(new Project(this.journalIdentifier, projectIdentifier, userCredentials, this.updateServerStatus.bind(this), this.redrawFromProject.bind(this)));
        
        console.log("openProject", Globals.project());
        
        surveyCollection.setProject(Globals.project());
        
        // TODO: Translate
        document.getElementById("pleaseWaitDiv").innerHTML = "Retrieving project data from server; please wait...";
        
        Globals.project().startup((error) => {
            if (error) {
                document.getElementById("pleaseWaitDiv").style.display = "none";
                // TODO: Sanitize journalIdentifier
                document.body.innerHTML += '<br>Problem connecting to project journal on server for: "<b>' + this.journalIdentifier + '</b>"';
                alert("Problem connecting to project journal on server. Application will not run.");
                return;
            } else {
                projects.forEach((project) => {
                    if (project.id !== projectIdentifier) return;
                    this.readOnly = !project.write;
                    Globals.project().readOnly = this.readOnly;
                    // this.panelBuilder.readOnly = isReadOnly;
                    if (this.readOnly) {
                        toaster.toast("Project is read-only for this user");
                        Globals.project().pointrelClient.suspendOutgoingMessages(true);
                    }
                });
                this.loadApplicationDesign();
            }
        });
    }
    
    loadApplicationDesign() {
        var panelSpecificationCollection = PanelSetup.panelSpecificationCollection();
        Globals.panelSpecificationCollection(panelSpecificationCollection);
        
        // Load the application design
        loadAllPanelSpecifications(panelSpecificationCollection, navigationSections, loadingBase, () => {
            // generateNavigationDataInJSON();
     
            PanelSetup.processAllPanels();
            
            // TODO: Only for creating models once
            //printModels();
            //return;
    
            // Tell the panel builder how to build panels
            this.panelBuilder.setPanelSpecifications(panelSpecificationCollection);
            
            // Tell the panelBuilder what do do if a button is clicked
            this.panelBuilder.setButtonClickedCallback(this.buttonClicked.bind(this));
            
            this.panelBuilder.setCalculateFunctionResultCallback(this.calculateFunctionResultForGUI.bind(this));
    
            // Initialize different Mithril components which will be mounted using m.mount
            // Note that dialogSupport has already been initialized and that component mounted
            navigationPane.initializeNavigationPane(panelSpecificationCollection, this.userIdentifier, this.panelBuilder);
            pageDisplayer.configurePageDisplayer(this.panelBuilder, Globals.project(), Globals.clientState());
    
            // Fill out initial hash string if needed
            Globals.clientState().updateHashIfNeededForChangedClientState();
            
            this.createLayout();
            
            // TODO: What to do while waiting for data for a project to load from server the first time? Assuming authenticated OK etc.???
            
            // TODO: This assumes we have picked a project, and are actually loading data and have not errored out
            // TODO: Need some kind of progress indicator of messages loaded...
            Globals.project().pointrelClient.idleCallback = () => {
                // Now that data is presumably loaded into the Project tripleStore, we can proceed with further initialization
                buttonActions.initialize(Globals.project(), Globals.clientState());
                csvImportExport.initialize(Globals.project());
                 
                // Ensure the pageDisplayer will display the first page
                Globals.clientState().urlHashFragmentChanged(pageDisplayer);
                
                // Update if the URL hash fragment is changed by hand
                window.onhashchange = Globals.clientState().urlHashFragmentChanged.bind(Globals.clientState(), pageDisplayer);
                
                // turn off initial "please wait" display
                document.getElementById("pleaseWaitDiv").style.display = "none";
                document.getElementById("navigationDiv").style.display = "block";
                document.getElementById("pageDiv").style.display = "block";
                
                this.runningAfterInitialIdle = true;
                
                // TODO: Polling for changes by a read-only client should be an option somewhere; hard-coding it for now to reduce server load on NarraFirma.com
                if (this.readOnly) {
                    console.log("Shutting down polling for updates by read-only client");
                    Globals.project().pointrelClient.shutdown();
                    // toaster.toast("Reload the page to see changes for read-only client");
                }
                
                // toaster.toast("Started up!!!");
            };
            
            // From: https://developer.mozilla.org/en-US/docs/Web/Events/beforeunload
            window.addEventListener("beforeunload", (e) => {
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
    setup() {
        console.log("Using pointrel20141201");
        var currentLocalTimestamp = new Date().toISOString();
        var currentLocalTimestampMinusTenSeconds = new Date(new Date().getTime() - 10000).toISOString();
        pointrel20141201Client.getServerStatus((error, serverResponse) => {
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
}

export = Application;