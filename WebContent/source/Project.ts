import PointrelClient = require("./pointrel20150417/PointrelClient");
import surveyCollection = require("./surveyCollection");
import TripleStore = require("./pointrel20150417/TripleStore");
import PanelSpecificationCollection = require("./panelBuilder/PanelSpecificationCollection");

"use strict";

var serverURL = "/api/pointrel20150417";

// TODO: Rethink this as a more general way to watch models within the project (so, with arbitrary object IDs, not just the project ID)

class Project {
    journalIdentifier: string;
    projectIdentifier: string;
    userIdentifier: any;
    subscriptions = [];
    activeQuestionnaires = {};
    pointrelClient: PointrelClient;
    tripleStore: TripleStore;
    redrawCallback: Function;
    
    constructor(journalIdentifier, projectIdentifier, userIdentifier, updateServerStatus, redrawCallback) {
        this.journalIdentifier = journalIdentifier;
        this.projectIdentifier = projectIdentifier;
        this.userIdentifier = userIdentifier;
        this.redrawCallback = redrawCallback;
    
        this.pointrelClient = new PointrelClient(serverURL, this.journalIdentifier, this.userIdentifier, this.receivedMessage.bind(this), updateServerStatus);
        
        // For now, listen on all topics in the journal
        // TODO: Think about how to move topicIdentifier into pointrelClient initialization
        // var topicIdentifier = "project001";
        // pointrelClient.topicIdentifier = topicIdentifier;
        
        // TODO: Change the hardcoded topic here from "testing".
        this.tripleStore = new TripleStore(this.pointrelClient, "testing");
        console.log("tripleStore", this.tripleStore);
        
        // Redraw on any new tripleStore message (however, the ones we send will not get callbacks)
        this.tripleStore.subscribe(undefined, undefined, undefined, this.redrawCallback.bind(this));
    }

    startup(callback) {
        this.pointrelClient.reportJournalStatus((error, response) => {
            console.log("reportJournalStatus response", error, response);
            if (error) {
                console.log("Failed to startup project", error);
                callback(error);
            } else {
                this.pointrelClient.startup();
                callback(null, response);
            }
        });
    }
    
    getFieldValue(fieldName) {
        return this.tripleStore.queryLatestC(this.projectIdentifier, fieldName);
    }
    
    setFieldValue(fieldName, newValue, oldValue = undefined) {
        // TODO: Need to add support in tripleStore for oldValue; note callback is the fourth parameter
        this.tripleStore.addTriple(this.projectIdentifier, fieldName, newValue);
    }
    
    // TODO: What do do about this function? Especially if want to track chat messages or log messages or undoable changes for project?
    receivedMessage(message) {
        console.log("Project receivedMessage", message);
        
        if (message.change && message.change.action === "addTriple") {
            // Ignore addTriple messages as we handle only the ones we did not send via a subscription
            console.log("Ignoring tripleStore message", message);
            return;
        }
        
        if (message.messageType === "questionnairesMessage") {
            // console.log("Project receivedMessage questionnairesMessage", message);
            surveyCollection.updateActiveQuestionnaires(message.change, false);
        }

        // Since this event came from the network, queue a Mithril redraw
        // The tripleStore may not be updated yet, so this redraw needs to get queued for later by the application
        if (this.redrawCallback) {
            console.log("project calling redrawCallback");
            this.redrawCallback();
        }
    }
    
    disconnectProjectModel() {
        this.subscriptions.forEach(function (subscription) {
            subscription.remove();
        });
        this.subscriptions = [];
    }
}

export = Project;
