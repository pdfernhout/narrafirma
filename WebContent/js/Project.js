define([
    "dojo/_base/lang",
    "js/pointrel20150417/PointrelClient",
    "dojo/Stateful",
    "js/surveyCollection",
    "js/pointrel20150417/TripleStore"
], function(
    lang,
    PointrelClient,
    Stateful,
    surveyCollection,
    TripleStore
) {  
    "use strict";
    
    var serverURL = "/api/pointrel20150417";
    
    // TODO: Rethink this as a more general way to watch models within the project (so, with arbitrary object IDs, not just the project ID)
    
    var Project = function(journalIdentifier, projectIdentifier, userIdentifier, updateServerStatus) {
        this.journalIdentifier = journalIdentifier;
        this.projectIdentifier = projectIdentifier;
        this.userIdentifier = userIdentifier;
        this.subscriptions = [];
        this.projectModel = null;
        this.activeQuestionnaires = {};

        this.pointrelClient = new PointrelClient(serverURL, this.journalIdentifier, this.userIdentifier, lang.hitch(this, this.receivedMessage), updateServerStatus);
        
        // For now, listen on all topics in the journal
        // TODO: Think about how to move topicIdentifier into pointrelClient initialization
        // var topicIdentifier = "project001";
        // pointrelClient.topicIdentifier = topicIdentifier;
        
        // TODO: Change the hardcoded topic here from "testing".
        this.tripleStore = new TripleStore(this.pointrelClient, "testing");
        console.log("tripleStore", this.tripleStore);
    };
    
    Project.prototype.startup = function(callback) {
        var self = this;
        this.pointrelClient.reportJournalStatus(function(error, response) {
            console.log("reportJournalStatus response", error, response);
            if (error) {
                console.log("Failed to startup project", error);
                callback(error);
            } else {
                self.pointrelClient.startup();
                callback(null, response);
            }
        });
    };
    
    Project.prototype.getFieldValue = function(fieldName) {
        var triple = this.tripleStore.queryLatest(this.projectIdentifier, fieldName, undefined);
        // console.log("getFieldValue: got triple for query", fieldName, triple);
        if (triple) {
            return triple.c;
        }
        return undefined;
    };
    
    Project.prototype.setFieldValue = function(fieldName, newValue, oldValue) {
        // TODO: Need to add support in tripleStore for oldValue; note callback is the fourth parameter
        this.tripleStore.add(this.projectIdentifier, fieldName, newValue);
    };
    
    // callback(triple, message)
    // Don't forget to "own" the handle in a component or call remove when done to avoid memory leaks
    Project.prototype.watchFieldValue = function(fieldName, callback) {
        return this.tripleStore.subscribe(this.projectIdentifier, fieldName, undefined, callback);
    };
    
    // TODO: What do do about this function? Especially if want to track chat messages or log messages or undoable changes for project?
    Project.prototype.receivedMessage = function(message) {
        // console.log("receivedMessage", message);
        if (message.messageType === "questionnairesMessage") {
            console.log("Project receivedMessage questionnairesMessage", message);
            surveyCollection.updateActiveQuestionnaires(message.change, false);
        }
    };
    
    Project.prototype.disconnectProjectModel = function() {
        this.subscriptions.forEach(function (subscription) {
            subscription.remove();
        });
        this.subscription = [];
    };
    
    // Use all the page specifications to set up the model with current values and start tracking changes in journal
    Project.prototype.initializeProjectModel = function(panelSpecificationCollection) {
        var model = {};
        
        // loop through all page specifications and get current value (if available) or default/initial for each field and set up dependencies

        var allPages = panelSpecificationCollection.buildListOfPages();
        for (var i = 0; i < allPages.length; i++) {
            var page = allPages[i];
            var fieldSpecifications = page.panelFields;
            panelSpecificationCollection.addFieldsToModel(model, fieldSpecifications);
        }
        this.projectModel = new Stateful(model);
        this.projectModel._saved = {};
        
        for (var fieldName in model) {
            if (model.hasOwnProperty(fieldName)) {
                // console.log("model fieldName", fieldName);
                if (fieldName.charAt(0) === "_") continue;
                var value = this.getFieldValue(fieldName);
                // console.log("got value for query", fieldName, value);
                if (value !== undefined && value !== null) {
                    this.projectModel.set(fieldName, value);
                }
                this._subscribe(fieldName);
                this._watch(fieldName);
            }
        }
    };
    
    // Internal support functions
    
    Project.prototype._subscribe = function(fieldName) {
        var model = this.projectModel;
        // Saving JSON.stringify-ed versions of data in case it is an array or object that might be changed directly
        model._saved[fieldName] = JSON.stringify(model.get(fieldName));
        var subscription = this.watchFieldValue(fieldName, function(triple, message) {
            // console.log(" ---------- updateWhenTripleStoreChanges", triple, message);
            var newValue = triple.c;
            // TODO: Should warn if saved an get differ because going to lose changes
            var editedValue = model.get(fieldName);
            // TODO: User might have cleared the field; need better way to detect initial changes...
            if (editedValue && model._saved[fieldName] !== JSON.stringify(editedValue)) {
                // TODO: Handle data loss better; like logging it to some user-displayable log
                console.log("About to lose user entered data in field", fieldName, "user-edited:", editedValue, "new:", newValue);
            }
            model._saved[fieldName] = JSON.stringify(newValue);
            if (JSON.stringify(editedValue) !== JSON.stringify(newValue)) {
                console.log("notified of changed data in store, so updating field", fieldName, newValue);
                // This will trigger a watch, which would lead to writing out the value except for a check if value has changed
                model.set(fieldName, newValue);
            }
        });
        this.subscriptions.push(subscription);
    };
    
    Project.prototype._watch = function(fieldName) {
        var model = this.projectModel;
        var self = this;
        var subscription = model.watch(fieldName, function(name, oldValue, newValue) {
            console.log("Watch changed", fieldName, oldValue, newValue);
            // Use JSON comparison to handle situation of arrays changing contents but remaining the same array (likewise for objects)
            if (model._saved[fieldName] !== JSON.stringify(newValue)) {
                model._saved[fieldName] = JSON.stringify(newValue);
                console.log("storing new value for field", fieldName, newValue);
                self.setFieldValue(fieldName, newValue, oldValue);
            }
        });
        this.subscriptions.push(subscription);
    };

    return Project;
    
});