import PointrelClient = require("./pointrel20150417/PointrelClient");
import surveyCollection = require("./surveyCollection");
import TripleStore = require("./pointrel20150417/TripleStore");

"use strict";

var serverURL = "/api/pointrel20150417";

// TODO: Rethink this as a more general way to watch models within the project (so, with arbitrary object IDs, not just the project ID)

class Project {
    journalIdentifier: string;
    projectIdentifier: string;
    userIdentifier: any;
    subscriptions = [];
    projectModel: any = {};
    activeQuestionnaires = {};
    pointrelClient: PointrelClient;
    tripleStore: TripleStore;
    
    constructor(journalIdentifier, projectIdentifier, userIdentifier, updateServerStatus) {
        this.journalIdentifier = journalIdentifier;
        this.projectIdentifier = projectIdentifier;
        this.userIdentifier = userIdentifier;
    
        this.pointrelClient = new PointrelClient(serverURL, this.journalIdentifier, this.userIdentifier, this.receivedMessage.bind(this), updateServerStatus);
        
        // For now, listen on all topics in the journal
        // TODO: Think about how to move topicIdentifier into pointrelClient initialization
        // var topicIdentifier = "project001";
        // pointrelClient.topicIdentifier = topicIdentifier;
        
        // TODO: Change the hardcoded topic here from "testing".
        this.tripleStore = new TripleStore(this.pointrelClient, "testing");
        console.log("tripleStore", this.tripleStore);
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
        var triple = this.tripleStore.queryLatest(this.projectIdentifier, fieldName, undefined);
        // console.log("getFieldValue: got triple for query", fieldName, triple);
        if (triple) {
            return triple.c;
        }
        return undefined;
    }
    
    setFieldValue(fieldName, newValue, oldValue = undefined) {
        // TODO: Need to add support in tripleStore for oldValue; note callback is the fourth parameter
        this.tripleStore.add(this.projectIdentifier, fieldName, newValue);
    }
    
    // callback(triple, message)
    // Don't forget to "own" the handle in a component or call remove when done to avoid memory leaks
    watchFieldValue(fieldName, callback) {
        return this.tripleStore.subscribe(this.projectIdentifier, fieldName, undefined, callback);
    }
    
    // TODO: What do do about this function? Especially if want to track chat messages or log messages or undoable changes for project?
    receivedMessage(message) {
        // console.log("receivedMessage", message);
        if (message.messageType === "questionnairesMessage") {
            // console.log("Project receivedMessage questionnairesMessage", message);
            surveyCollection.updateActiveQuestionnaires(message.change, false);
        }
    }
    
    disconnectProjectModel() {
        this.subscriptions.forEach(function (subscription) {
            subscription.remove();
        });
        this.subscriptions = [];
    }
    
    // Use all the page specifications to set up the model with current values and start tracking changes in journal
    initializeProjectModel(panelSpecificationCollection) {
        // loop through all page specifications and get current value (if available) or default/initial for each field
    
        var allPages = panelSpecificationCollection.buildListOfPages();
        for (var i = 0; i < allPages.length; i++) {
            var page = allPages[i];
            var fieldSpecifications = page.panelFields;
            panelSpecificationCollection.addFieldsToModel(this.projectModel, fieldSpecifications);
        }
        
        for (var fieldName in this.projectModel) {
            // console.log("model fieldName", fieldName);
            var value = this.getFieldValue(fieldName);
            // console.log("got value for query", fieldName, value);
            if (value !== undefined && value !== null) {
                this.projectModel[fieldName] = value;
            }
        }
    }
}

export = Project;
