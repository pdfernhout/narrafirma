import toaster = require("./panelBuilder/toaster");
import Globals = require("./Globals");
import dialogSupport = require("./panelBuilder/dialogSupport");
import surveyStorage = require("./surveyStorage");
import saveAs = require("FileSaver");

"use strict";

var allMessagesExportType = "NarraFirma_allMessages";
var allMessagesExportFormat = "0.1.0";

var currentProjectStateExportType = "NarraFirma_currentProjectState";
var currentProjectStateExportFormat = "0.1.1";

// ----------------------------------------------------------------------------------------------------
// IMPORT
// ----------------------------------------------------------------------------------------------------

export function importProject() {
    var project = Globals.project();
    var tripleStore = project.tripleStore;

    if (!project.currentUserHasAdminAccess) {
        alert("You must have administrative permission to import into the project.");
        return;
    }

    // valueOptions: ["project snapshot (with or without stories)", "project history with stories"],
    const importType = tripleStore.queryLatestC(project.projectIdentifier, "importExport_importType");
    if (!importType) {
        alert("Please choose a type of file to import.");
        return;
    }

    // warn user if there are things in the project
    const lookIn = ["project_elicitingQuestionsList", "project_storyQuestionsList", "project_participantQuestionsList",
        "project_annotationQuestionsList", "project_storyForms", "project_storyCollections", "project_catalysisReports", ];
    const sayAbout = ["eliciting questions", "questions about stories", "questions about participants", 
        "annotation questions", "story forms", "story collections", "catalysis reports"]; 
    var foundItemsIn = [];
    for (let i = 0; i < lookIn.length; i++) {
        var ids = Globals.project().getListForField(lookIn[i]);
        if (ids && ids.length) {
            foundItemsIn.push(sayAbout[i]);
        }
    }
    console.log("foundItemsIn", foundItemsIn);
    var importWhat;
    if (importType === "project history with stories") {
        importWhat = "a project history";
    } else {
        importWhat = "a project snapshot";
    }
    var confirmText = "";
    if (foundItemsIn.length) {
        confirmText = "Are you ABSOLUTELY sure you want to import " + importWhat + "?\n\nThis should only be done with an empty project, " +
            "and there are \n\n    " + foundItemsIn.join("\n    ") + "\n\n in this project.";
    } else {
        confirmText = "Are you sure you want to import " + importWhat + "? (This should only be done with an empty project.)";
    }
    if (!confirm(confirmText)) return;

    var tripleStore = project.tripleStore;
    if (importType === "project history with stories") {
        importEntireProject();
    } else {
        importProjectCurrentState();
    }
}

export function importEntireProject() {
    var project = Globals.project();
    
    console.log("importEntireProject");
    chooseProjectFileToImport((contents) => {
        var importObject = JSON.parse(contents);
        // importObject.messages.forEach((message) => {
        //    // if (message._topicIdentifier === "surveyResults")
        //    console.log("message", message._topicIdentifier);
        //});
        
        // TODO: Similar to what is in csvImportExport -- could any duplication be refactored out?
        
        if (importObject.exportType !== allMessagesExportType) {
            alert('Wrong export file type; expected exportType of "' + allMessagesExportType + '" but found: "' + importObject.exportType + '"');
            return;
        }
        
        if (importObject.exportFormat > allMessagesExportFormat) {
            if (!confirm("The file has an export format of: " + importObject.exportFormat + " which is later than this application's of: " + allMessagesExportFormat + "\nTry importing anyway (not recommended)?")) {
                return;
            }
        }
        
        var progressModel = dialogSupport.openProgressDialog("Importing project messages...", "Progress importing project messsages", "Cancel", dialogCancelled);
  
        function dialogCancelled(dialogConfiguration, hideDialogMethod) {
            progressModel.cancelled = true;
            hideDialogMethod();
        }
        
        var messageIndexToSend = 0;
    
        function sendNextMessage() {
            if (progressModel.cancelled) {
                alert("Cancelled after importing " + messageIndexToSend + " messages");
            } else if (messageIndexToSend >= importObject.messages.length) {
                alert("Finished importing " + importObject.messages.length + " messages.");
                progressModel.hideDialogMethod();
                progressModel.redraw();
            } else {
                var message = importObject.messages[messageIndexToSend++];
                
                // Rewrite project references in triples, but not in survey results
                // TODO: The message trace is no longer valid if do rewrite
                if (message.change && message.change.triple && message.change.triple.a === importObject.projectIdentifier) {
                    message.change.triple.a = project.projectIdentifier;
                }
                if (message.change && message.change.projectIdentifier  === importObject.projectIdentifier) {
                    message.change.projectIdentifier = project.projectIdentifier;
                }                
                
                // TODO: Translate
                progressModel.progressText = "Importing " + messageIndexToSend + " of " + importObject.messages.length + " messages";
                progressModel.redraw();
                setTimeout(function() { project.pointrelClient.sendMessage(message, sendNextMessage); }, 0);
            }
        }
        
        // Start sending project messages
        sendNextMessage();
    });
}

export function importProjectCurrentState() {
    var project = Globals.project();
    console.log("importProjectCurrentState");
    chooseProjectFileToImport((contents) => {
        var importObject = JSON.parse(contents);
        // TODO: Similar to what is in csvImportExport -- could any duplication be refactored out?
        
        if (importObject.exportType !== currentProjectStateExportType) {
            alert('Wrong export file type; expected exportType of "' + currentProjectStateExportType + '" but found: "' + importObject.exportType + '"');
            return;
        }
        
        if (importObject.exportFormat > currentProjectStateExportFormat) {
            if (!confirm("The file has an export format of: " + importObject.exportFormat + " which is later than this application's of: " + allMessagesExportFormat + "\nTry importing anyway (not recommended)?")) {
                return;
            }
        }
        
        var progressModel = dialogSupport.openProgressDialog("Importing current project state...", "Progress importing current project state", "Cancel", dialogCancelled);
  
        function dialogCancelled(dialogConfiguration, hideDialogMethod) {
            progressModel.cancelled = true;
            hideDialogMethod();
        }
        
        var messagesToSend = [];
        
        // Prepare triples for adding
        var aKeys = Object.keys(importObject.projectCurrentState);
        for (var aKeyIndex = 0; aKeyIndex < aKeys.length; aKeyIndex++) {
            var aKey = aKeys[aKeyIndex];
            var aKeyObject = JSON.parse(aKey);
            var aObject = importObject.projectCurrentState[aKey];
            // Rewrite project references in triples
            if (aKeyObject === importObject.projectIdentifier) {
                aKeyObject = project.projectIdentifier;
            }
            
            var bKeys = Object.keys(aObject);
            for (var bKeyIndex = 0; bKeyIndex < bKeys.length; bKeyIndex++) {
                var bKey = bKeys[bKeyIndex];
                var bKeyObject = JSON.parse(bKey);
                var cValue = aObject[bKey];
                messagesToSend.push([aKeyObject, bKeyObject, cValue]);
            }
        }
        
        // Prepare activeQuestionnaires for adding
        if (importObject.activeQuestionnaires) {
            var questionnaireMessage = project.pointrelClient.createChangeMessage("questionnaires", "questionnairesMessage", importObject.activeQuestionnaires, null);
            messagesToSend.push(questionnaireMessage);
        }
        
        // Prepare surveyResults for adding
        if (importObject.storyCollections) {
            for (var storyCollectionName in importObject.storyCollections) {
                var surveyResults = importObject.storyCollections[storyCollectionName];
                surveyResults.forEach((surveyResult) => {
                    //var questionnaireMessage = project.pointrelClient.createChangeMessage("questionnaires", "questionnairesMessage", importObject.activeQuestionnaires, null);
                    var surveyResultMessage = surveyStorage.makeSurveyResultMessage(project.pointrelClient, project.projectIdentifier, storyCollectionName, surveyResult);
                    messagesToSend.push(surveyResultMessage);
                });
            }
        }
        
        var messagesSentCount = 0;
        
        function sendNextMessage() {
            if (progressModel.cancelled) {
                alert("Cancelled after adding " + messagesSentCount + " project messages.");
            } else if (messagesSentCount >= messagesToSend.length) {
                alert("Successfully imported " + messagesSentCount + " project messages.");
                progressModel.hideDialogMethod();
                progressModel.redraw();
            } else {
                var message = messagesToSend[messagesSentCount++];
                var triple = null;
                if (Array.isArray(message)) {
                    triple = message;
                }
                
                // TODO: Translate
                progressModel.progressText = "Sending " + messagesSentCount + " of " + messagesToSend.length + " messages";
                progressModel.redraw();
                setTimeout(function() {
                    if (triple) {
                        project.tripleStore.addTriple(triple[0], triple[1], triple[2], sendNextMessage);
                    } else {
                        project.pointrelClient.sendMessage(message, sendNextMessage);
                    }
                }, 0);
            }
        }
        
        // Start sending project messages
        sendNextMessage();
    });
}

function chooseProjectFileToImport(callback) {
    var projectFileUploader = <HTMLInputElement>document.getElementById("projectFileUploader");
    projectFileUploader.onchange = function() {
        var file = projectFileUploader.files[0];
        if (!file) {
            return;
        }
        var reader = new FileReader();
        reader.onload = function(e: Event) {
            var contents = (<FileReader>e.target).result;
            callback(contents);
        };
        reader.readAsText(file);
    };
    projectFileUploader.click();
}

// ----------------------------------------------------------------------------------------------------
// RESET
// ----------------------------------------------------------------------------------------------------

export function resetProject() {
    var project = Globals.project();
    if (!project.currentUserHasAdminAccess) {
        alert("You must have administrative permission to reset the project.");
        return;
    }
    if (confirm("Are you sure you want to reset this project? This action cannot be undone. Make sure you have a project snapshot file ready to restore the project afterwards.")) {
        const journalIdentifier = project.journalIdentifier;
        project.pointrelClient.resetJournal(journalIdentifier, function(error, response) {
            if (error || !response.success) {
                console.log("Error resetting project", journalIdentifier, error, response);
                var message = "error";
                if (response) message = response.description;
                if (error) message = error.description;
                if (error && typeof error.error === "string") message += "\n" + error.error.split("\n")[0];
                toaster.toast("Error resetting project: " + journalIdentifier + " :: " + message);
            } else {
                console.log("Successfully reset project", journalIdentifier, response);
                // Need to call redraw as event changing data was triggered by network
                alert("The project " + project.projectNameAndNickname() + " was successfully reset and is now empty.");
                location.reload();
            }
        });
    }
}

export function listOfRemovedStoryCollections() {
    var result = [];
    var project = Globals.project();
    const storyCollectionsIDsInUse = project.getListForField("project_storyCollections");
    var storyCollectionNamesInUse = [];
    for (let i = 0; i < storyCollectionsIDsInUse.length; i++) {
        storyCollectionNamesInUse.push(project.tripleStore.queryLatestC(storyCollectionsIDsInUse[i], "storyCollection_shortName"));
    }
    var storyCollectionNamesAndCounts = {};
    project.pointrelClient.filterMessages((message) => {
        if (message._topicIdentifier === "surveyResults") {
            const id = message.change.storyCollectionIdentifier;
            if (!storyCollectionNamesAndCounts[id]) {
                storyCollectionNamesAndCounts[id] = 0;
            }
            storyCollectionNamesAndCounts[id] += 1;
        }
    });
    var keys = Object.keys(storyCollectionNamesAndCounts);
    for (let i = 0; i < keys.length; i++) {
        const collectionName = keys[i];
        if (storyCollectionNamesInUse.indexOf(collectionName) < 0 && result.indexOf(collectionName) < 0) {
            result.push(collectionName + ": " + storyCollectionNamesAndCounts[collectionName] + " stories");
        }
    }
    
    return result;
}

// ----------------------------------------------------------------------------------------------------
// EXPORT
// ----------------------------------------------------------------------------------------------------

export function exportProject() {
    var project = Globals.project();
    var tripleStore = project.tripleStore;

    // valueOptions: ["project snapshot without stories", "project snapshot with stories", "project history with stories"],
    const exportType = tripleStore.queryLatestC(project.projectIdentifier, "importExport_exportType");

    if (exportType === "project history with stories") {
        exportEntireProject();
    } else if (exportType === "project snapshot with stories") {
        exportProjectCurrentState(true);
    } else if (exportType === "project snapshot without stories") {
        exportProjectCurrentState(false);
    } else {
        alert("Please choose a type of file to export.");
    }
}

export function exportEntireProject() {
    if (!confirm("Are you sure you want to export a project history with stories?")) return;
    
    var project = Globals.project();
    
    // var json = JSON.stringify(project.tripleStore.tripleMessages, null, 4);
    var exportObject =  {
        projectIdentifier: project.projectIdentifier,
        timestamp: new Date().toISOString(),
        exportType: allMessagesExportType,
        exportFormat: allMessagesExportFormat,
        userIdentifier: project.pointrelClient.userIdentifier,
        messages: project.pointrelClient.messagesSortedByReceivedTimeArray
    };
    
    var json = JSON.stringify(exportObject, null, 4);
    
    // var printItems = m("pre", json);
    // var htmlForPage = generateHTMLForPage("NarraFirma project export for " + project.projectIdentifier + " on " + new Date().toISOString(), null, printItems);
    // printHTML(htmlForPage);
    
    var questionnaireBlob = new Blob([json], {type: "application/json;charset=utf-8"});
    saveAs(questionnaireBlob, exportObject.projectIdentifier + " with history exported at " + exportObject.timestamp + ".json");
}

function exportProjectCurrentState(includeSurveyResults) {
    // TODO: Translate
    var promptMessage = includeSurveyResults ?
        "Are you sure you want to export a project snapshot with stories?" :
        "Are you sure you want to export a project snapshot WITHOUT stories? No stories will be saved.";
    if (!confirm(promptMessage)) return;
    
    var project = Globals.project();
    var tripleStore = project.tripleStore;
    
    var projectCurrentState = {};
    
    var aKeys = Object.keys(tripleStore.indexABC);
    aKeys.sort();
    for (var aKeyIndex = 0; aKeyIndex < aKeys.length; aKeyIndex++) {
        var aKey = aKeys[aKeyIndex];
        var aObject = tripleStore.indexABC[aKey];
        var bResult = {};
        projectCurrentState[aKey] = bResult;
        var bKeys = Object.keys(aObject);
        bKeys.sort();
        for (var bKeyIndex = 0; bKeyIndex < bKeys.length; bKeyIndex++) {
            var bKey = bKeys[bKeyIndex];
            bResult[bKey] = aObject[bKey].latestC;
        }
    }
    
    var activeQuestionnaires = null;
    var storyCollections = null;
  
    if (includeSurveyResults) {
        var questionnaireMessages = project.pointrelClient.filterMessages((message) => {
            return message._topicIdentifier === "questionnaires";
        });

        if (questionnaireMessages.length) activeQuestionnaires = questionnaireMessages[questionnaireMessages.length - 1].change;
    
        const storyCollectionIDsInUse = project.getListForField("project_storyCollections");
        let storyCollectionNamesInuse = [];
        storyCollectionIDsInUse.forEach(function(id) {
            var aName = tripleStore.queryLatestC(id, "storyCollection_shortName");
            storyCollectionNamesInuse.push(aName);
        });

        var surveyResultMessages = project.pointrelClient.filterMessages((message) => {
            var result = false;
            if (message._topicIdentifier === "surveyResults") {
                // message.change.storyCollectionIdentifier is the story collection name
                if (storyCollectionNamesInuse.indexOf(message.change.storyCollectionIdentifier) >= 0) {
                    result = true;
                } else {
                    result = false;
                }
            }
            return result;
        });
        
        storyCollections = {};

        surveyResultMessages.forEach((message) => {
            var storyCollectionName = message.change.storyCollectionIdentifier;
            var storyCollection = storyCollections[storyCollectionName];
            if (!storyCollection) {
                storyCollection = [];
                storyCollections[storyCollectionName] = storyCollection;
            }
            storyCollection.push(message.change.surveyResult);
        });
    }
              
    var exportObject =  {
        projectIdentifier: project.projectIdentifier,
        timestamp: new Date().toISOString(),
        exportType: currentProjectStateExportType,
        exportFormat: currentProjectStateExportFormat,
        userIdentifier: project.pointrelClient.userIdentifier,
        projectCurrentState: projectCurrentState,
        activeQuestionnaires: activeQuestionnaires,
        storyCollections: storyCollections
    };
    
    var json = JSON.stringify(exportObject, null, 4);

    //console.log("json", json);
    
    var questionnaireBlob = new Blob([json], {type: "application/json;charset=utf-8"});
    var withOrWithoutStories = includeSurveyResults ? "with stories" : "without stories";
    saveAs(questionnaireBlob, exportObject.projectIdentifier + " current state " + withOrWithoutStories + " exported at " + exportObject.timestamp + ".json");
}


