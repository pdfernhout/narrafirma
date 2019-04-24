import Project = require("./Project");
import browser = require("./panelBuilder/browser");
import csvImportExport = require("./csvImportExport");
import dialogSupport = require("./panelBuilder/dialogSupport");
import navigationPane = require("./navigationPane");
import pageDisplayer = require("./pageDisplayer");
import questionnaireGeneration = require("./questionnaireGeneration");
import surveyBuilder = require("./surveyBuilderMithril");
import surveyCollection = require("./surveyCollection");
import surveyStorage = require("./surveyStorage");
import translate = require("./panelBuilder/translate");
import generateRandomUuid = require("./pointrel20150417/generateRandomUuid");
import toaster = require("./panelBuilder/toaster");
import ClientState = require("./ClientState");
import printing = require("./printing");
import projectImportExport = require("./projectImportExport");
import ClusteringDiagram = require("./applicationWidgets/ClusteringDiagram");

"use strict";

var project: Project;
var clientState: ClientState;

// Call this to set up the project or other needed data
export function initialize(theProject: Project, theClientState: ClientState) {
    project = theProject;
    clientState = theClientState;
}

export function helpButtonClicked() {
    var pageSpecification = navigationPane.getCurrentPageSpecification();
    if (!pageSpecification) {
        console.log("no pageSpecification for current page");
        return;
    }
    
    var helpURL = 'help/' + pageSpecification.section + "/help_" + pageSpecification.id + '.html';
    
    browser.launchApplication(helpURL, 'help');
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// overall - links
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function logoutButtonClicked() {
    // TODO: Warn if have any read-only changes that would be lost
    if (confirm("Are you sure you want to log out?")) {
        var isWordPressAJAX = !!window["ajaxurl"];
        if (isWordPressAJAX) {
            window.location.href = window.location.href.split("wp-content")[0] + "wp-login.php?action=logout";
        } else {
            window.location.href = "/logout";
        }
    }
}

export function loginButtonClicked() {
// TODO: Warn if have any read-only changes that would be lost
    var isWordPressAJAX = !!window["ajaxurl"];
    if (isWordPressAJAX) {
        window.location.href = window.location.href.split("wp-content")[0] + "wp-login.php?action=login";
    } else {
        window.location.href = "/login";
    }
}

export function guiOpenSection(model, fieldSpecification, value) {
    var section = fieldSpecification.displayConfiguration.section;
    
    // Don't queue an extra redraw as one is already queued since this code get called by a button press
    var isRedrawAlreadyQueued = true;
    pageDisplayer.showPage(section, false, isRedrawAlreadyQueued);
    // document.body.scrollTop = 0;
    // document.documentElement.scrollTop = 0;
    window.scrollTo(0, 0);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// overall - clustering diagram
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function copyClusteringDiagramElements(fromDiagramField: string, fromType: string, toDiagramField: string, toType: string) {
    var fromDiagram: ClusteringDiagramModel = project.getFieldValue(fromDiagramField);
    if (!fromDiagram || !fromDiagram.items.length) return;
    var toDiagram: ClusteringDiagramModel = project.getFieldValue(toDiagramField) || ClusteringDiagram.newDiagramModel();
    var addedItemCount = 0;
    
    fromDiagram.items.forEach((item) => {
        if (item.type === fromType) {
            if (!isNamedItemInDiagram(toDiagram, item.name, toType)) {
                ClusteringDiagram.addNewItemToDiagram(toDiagram, toType, item.name, item.notes);
                addedItemCount++;
            }
        }
    });
    
    if (addedItemCount) {
        toaster.toast("Updating clustering surface");
        project.setFieldValue(toDiagramField, toDiagram);
    } else {
        toaster.toast("No changes were needed to clustering surface");
    }
}

export function copyPlanningStoriesToClusteringDiagram(model) {
    var list = project.getListForField("project_projectStoriesList");
    var toDiagramField = "project_storyElements_answersClusteringDiagram";
    var toDiagram: ClusteringDiagramModel = project.getFieldValue(toDiagramField) || ClusteringDiagram.newDiagramModel();
    var addedItemCount = 0;
        
    list.forEach((projectStoryIdentifier) => {
        var projectStory = project.tripleStore.makeObject(projectStoryIdentifier);
        
        var storyName = projectStory.projectStory_name;
        var storyText = projectStory.projectStory_text;
        
        if (!isNamedItemInDiagram(toDiagram, storyName, "cluster")) {
            ClusteringDiagram.addNewItemToDiagram(toDiagram, "cluster", storyName, storyText);
            addedItemCount++;
        }    
    });
    
    if (addedItemCount) {
        toaster.toast("Updating clustering surface");
        project.setFieldValue(toDiagramField, toDiagram);
    } else {
        toaster.toast("No changes were needed to clustering surface");
    }

}

function isNamedItemInDiagram(diagram: ClusteringDiagramModel, name: string, itemType: string = null) {
    // Array.some returns true or false depending on whether there is soem item that tests true 
    return diagram.items.some((item) => {
        if (!itemType || item.type === itemType) {
            if (item.name === name) {
                return true;
            }
        }
        return false;
    });
}

export function copyAnswersToClusteringDiagram(model) {
    copyClusteringDiagramElements("project_storyElements_answersClusteringDiagram", "item", "project_storyElements_answerClustersClusteringDiagram", "item");
}

export function copyAnswerClustersToClusteringDiagram(model) {
    copyClusteringDiagramElements("project_storyElements_answerClustersClusteringDiagram", "cluster", "project_storyElements_attributesClusteringDiagram", "cluster");
}

export function copyAttributesToClusteringDiagram(model) {
    copyClusteringDiagramElements("project_storyElements_attributesClusteringDiagram", "item", "project_storyElements_attributeClustersClusteringDiagram", "item");
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// planning
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function copyDraftPNIQuestionVersionsIntoAnswers_Basic() {
    var finalQuestionIDs = [
        "project_pniQuestions_goal_final",
        "project_pniQuestions_relationships_final",
        "project_pniQuestions_focus_final",
        "project_pniQuestions_range_final",
        "project_pniQuestions_scope_final",
        "project_pniQuestions_emphasis_final"
    ];

    var copiedAnswersCount = 0;

    for (var index in finalQuestionIDs) {
        var finalQuestionID = finalQuestionIDs[index];
        var draftQuestionID = finalQuestionID.replace("_final", "_draft");
        var finalValue = project.tripleStore.queryLatestC(project.projectIdentifier, finalQuestionID);
        if (!finalValue) {
            var draftValue = project.tripleStore.queryLatestC(project.projectIdentifier, draftQuestionID);
            if (draftValue) {
                project.tripleStore.addTriple(project.projectIdentifier, finalQuestionID, draftValue);
                copiedAnswersCount++;
            }
        }
    }

    return copiedAnswersCount;
}

export function copyDraftPNIQuestionVersionsIntoAnswers() {
    var copiedAnswersCount = copyDraftPNIQuestionVersionsIntoAnswers_Basic();
    var template = translate("#copyDraftPNIQuestion_template", "Copied {{copiedAnswersCount}} answers.\n\n(Note that blank draft answers are not copied, and non-blank final answers are not replaced.)");
    var message = template.replace("{{copiedAnswersCount}}", copiedAnswersCount);
    alert(message);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// collection
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Caller should call wizard.forward() on successful save to see the last page, and provide a retry message otherwise
// Caller may also want to call (the returned) surveyDialog.hide() to close the window, or let the user do it.
function openMithrilSurveyDialog(questionnaire, callback, previewModeTitleText = null) {  
    var surveyDiv = document.createElement("div");
    var surveyViewFunction = surveyBuilder.buildSurveyForm(null, questionnaire, callback, {previewMode: !!previewModeTitleText, ignoreTitleChange: true, dataEntry: true});
    
    var dialogConfiguration = {
        dialogModel: null,
        dialogTitle: "Enter Story" + (previewModeTitleText || ""),
        dialogStyle: undefined,
        dialogConstructionFunction: surveyViewFunction,
        dialogOKButtonLabel: "Close",
        dialogOKCallback: function(dialogConfiguration, hideDialogMethod) { hideDialogMethod(); }
    };
    
    return dialogSupport.openDialog(dialogConfiguration);
}

function openSurveyDialog() {
    var storyCollectionName: string = clientState.storyCollectionName();
    
    if (!storyCollectionName) {
        // TODO: translate
        alert("Please select a story collection first.");
        return null;
    }

    var questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionName, true);
    if (!questionnaire) return;

    var surveyDialog = openMithrilSurveyDialog(questionnaire, finished);
    
    function finished(status, surveyResult, wizardPane) {
        console.log("surveyResult", status, surveyResult);
        if (status === "submitted") {
            surveyStorage.storeSurveyResult(project.pointrelClient, project.projectIdentifier, storyCollectionName, surveyResult, wizardPane);
        }
    }
}

export function copyStoryFormURL() {
    alert("Story form URL is: " + "http://localhost:8080/survey.html");
}

/*
function previewQuestionForm(model, fieldSpecification) {
    console.log("previewQuestionForm", model);
    var questionnaire = questionnaireGeneration.buildQuestionnaireFromTemplate(project, model);
    
    var surveyDialog = openMithrilSurveyDialog(questionnaire, finished, true);
    
    function finished(status, surveyResult, wizardPane) {
        console.log("surveyResult", status, surveyResult);
        if (wizardPane) wizardPane.forward();
    }
}
*/

export function previewQuestionForm(model, fieldSpecification) {
    var questionnaire = questionnaireGeneration.buildQuestionnaireFromTemplate(model, "");
    window["narraFirma_previewQuestionnaire"] = questionnaire;
    
    var w = window.open("survey.html#preview=" + (new Date().toISOString()), "_blank");
}

export function checkCSVDataFileWhileEditingStoryForm(model, fieldSpecification) {
    var questionnaire = questionnaireGeneration.buildQuestionnaireFromTemplate(model, "");
    csvImportExport.checkCSVStoriesWithStoryForm(questionnaire);
}

export function exportStoryFormWhileEditingIt_NativeFormat(model, fieldSpecification) {
    var questionnaire = questionnaireGeneration.buildQuestionnaireFromTemplate(model, "");
    csvImportExport.exportQuestionnaire(questionnaire);
}

export function exportStoryFormWhileEditingIt_ExternalFormat(model, fieldSpecification) {
    var questionnaire = questionnaireGeneration.buildQuestionnaireFromTemplate(model, "");
    csvImportExport.exportQuestionnaireForImport(questionnaire);
}

export function setQuestionnaireForStoryCollection(storyCollectionIdentifier): boolean {
    if (!storyCollectionIdentifier) return false;
    var questionnaireName = project.tripleStore.queryLatestC(storyCollectionIdentifier, "storyCollection_questionnaireIdentifier");
    var questionnaire = questionnaireGeneration.buildQuestionnaire(questionnaireName);
    if (!questionnaire) return false;
    project.tripleStore.addTriple(storyCollectionIdentifier, "questionnaire", questionnaire);
    return true;
}

export function updateQuestionnaireForStoryCollection(storyCollectionIdentifier) {
    if (!storyCollectionIdentifier) {
        alert("Problem: No storyCollectionIdentifier");
        return;
    }
    
    var storyCollectionName = project.tripleStore.queryLatestC(storyCollectionIdentifier, "storyCollection_shortName");
    if (!storyCollectionName) {
        alert("Problem: No storyCollectionName");
        return;
    }
    
    // TODO: Translate
    var confirmResult = confirm('Update story form for story collection "' + storyCollectionName + '"?"\n(Updating is not recommended once data collection has begun.)');
    if (!confirmResult) return;
    
    var updateResult = setQuestionnaireForStoryCollection(storyCollectionIdentifier);

    if (!updateResult) {
        alert("Problem: No questionnaire could be created");
        return;
    }
    
    toaster.toast("Updated story form");
    
    return;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// catalysis
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function copyInterpretationsToClusteringDiagram() {
    var shortName = clientState.catalysisReportName();
    if (!shortName) {
        alert("Please pick a catalysis report to work with.");
        return;
    }
    
    var catalysisReportIdentifier = project.findCatalysisReport(shortName);
    if (!catalysisReportIdentifier) {
        alert("Problem finding catalysis report identifier.");
        return;
    }
    
    var allInterpretations = [];
    var observationSetIdentifier = project.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_observations");
    if (!observationSetIdentifier) {
        alert("No observations have been made on the Explore Patterns page.");
        return;
    }
    var observationIDs = project.tripleStore.getListForSetIdentifier(observationSetIdentifier);
    var observations = project.tripleStore.queryAllLatestBCForA(observationSetIdentifier);
    
    for (var key in observations) {
        var observationIdentifier = observations[key];
        var interpretationsSetIdentifier = project.tripleStore.queryLatestC(observationIdentifier, "observationInterpretations");
        if (interpretationsSetIdentifier) {
            var interpretations = project.tripleStore.getListForSetIdentifier(interpretationsSetIdentifier);
            for (var i = 0; i < interpretations.length; i++) {
                var interpretationIdentifier = interpretations[i];
                var interpretationName = project.tripleStore.queryLatestC(interpretationIdentifier, "interpretation_name");
                var interpretationText = project.tripleStore.queryLatestC(interpretationIdentifier, "interpretation_text");
                if (interpretationName) {
                    allInterpretations.push({
                        "type": "Interpretation",
                        id: interpretationIdentifier,
                        name: interpretationName,
                        text: interpretationText
                    });
                }
            }
        }
    }
    
    if (allInterpretations.length === 0) {
        alert("No interpretations have been found for this catalysis report.");
    }
    
    var clusteringDiagram: ClusteringDiagramModel = project.tripleStore.queryLatestC(catalysisReportIdentifier, "interpretationsClusteringDiagram");
    if (!clusteringDiagram) {
        clusteringDiagram = ClusteringDiagram.newDiagramModel();
    }

    function findUUIDForInterpretationName(name: string) {
        for (var index = 0; index < allInterpretations.length; index++) {
            const interpretation = allInterpretations[index];
            if (interpretation.name === name) {
                return interpretation.id;
            }
        }
        return null;
    }

    function findObservationForInterpretation(observationIDs, interpretationName) {
        for (var i = 0; i < observationIDs.length; i++) {
            const observationID = observationIDs[i];
            var interpretationsListIdentifier = project.tripleStore.queryLatestC(observationID, "observationInterpretations");
            var interpretationsList = project.tripleStore.getListForSetIdentifier(interpretationsListIdentifier);
            for (var j = 0; j < interpretationsList.length; j++) {
                const interpretationID = interpretationsList[j];
                var interpretation = project.tripleStore.makeObject(interpretationID, true);
                var name = interpretation.interpretation_name;
                if (name === interpretationName) {
                    return observationID;
                }
            }
        }
        return null;
    }
    
    // Make sure every item has a referenceUUID linking it to an interpretation
    const existingReferenceUUIDs = {};
    clusteringDiagram.items.forEach((item) => {
        if (item.type === "item" && !item.referenceUUID) {
            // If no referenceUUID already set, find interpretation based on name
            const uuid = findUUIDForInterpretationName(item.name);
            // Only allow one item to link to an interpretation
            // if there are two items with the same name, only the first one
            // will be mapped to the correct interpretation
            // the second one will be left unconnected to anything
            if (!uuid) {
                console.log("No UUID found for intepretation name", item.name);
            } else {
                if (existingReferenceUUIDs[uuid]) {
                    console.log("Two interpretations with same name", item.name, uuid);
                } else {
                    item.referenceUUID = uuid
                }
            }
        }
        existingReferenceUUIDs[item.referenceUUID] = true;
    });

    // Update name and notes on existing items

    var updatedItemCount = 0;
    clusteringDiagram.items.forEach((item) => {
        if (item.type === "item") {
            if (item.referenceUUID) {
                let itemChanged = false;
                let newName = project.tripleStore.queryLatestC(item.referenceUUID, "interpretation_name") || "";
                let newNotes = project.tripleStore.queryLatestC(item.referenceUUID, "interpretation_text") || "";
                const observationID = findObservationForInterpretation(observationIDs, newName);
                let newStrength = null;
                let newNotesExtra = null;
                if (observationID) {
                    newStrength = project.tripleStore.queryLatestC(observationID, "observationStrength") || "";
                    const observationTitle = project.tripleStore.queryLatestC(observationID, "observationTitle");
                    const observationDescription = project.tripleStore.queryLatestC(observationID, "observationDescription");
                    let shortenedDescription = observationDescription.slice(0, 200);
                    if (shortenedDescription.length < observationDescription.length) shortenedDescription += " ...";
                    newNotesExtra = observationTitle + " -- " + shortenedDescription;
                }

                // if they filled in only name or text, use it for both
                if (newName === "" || newName === "Deleted interpretation") {
                    newName = newNotes; 
                } else if (newNotes === ""|| newNotes === "Deleted interpretation") {
                    newNotes = newName;
                    itemChanged = true;
                }

                // update clustering item for change to interpretation and/or observation
                if (newName !== item.name) {
                    item.name = newName;
                    itemChanged = true;
                }
                if (newNotes !== item.notes) {
                    item.notes = newNotes;
                }
                if (item.strength === undefined || item.bodyColor === undefined || newStrength != item.strength) {
                    item.strength = newStrength;
                    setItemColorBasedOnStrength(item, newStrength);
                    itemChanged = true;
                }
                if (item.notesExtra === undefined || newNotesExtra === null || newNotesExtra != item.notesExtra) {
                    item.notesExtra = newNotesExtra;
                    itemChanged = true;
                }
                
                if (itemChanged) updatedItemCount++;
            }
        }
    });

    // add items for interpretations not represented in the space
    var addedItemCount = 0;
    allInterpretations.forEach((interpretation) => {
        if (!existingReferenceUUIDs[interpretation.id]) {
            // check that this interpretation is attached to an observation; if not, it should not be added to the diagram
            const observationID = findObservationForInterpretation(observationIDs, interpretation.name);
            if (observationID) {
                // if the user creates an observation and adds interpretations to it,
                // and then deletes the name and text of the observation, 
                // the observation will still exist in the system,
                // and the interpretations will still exist, and they will still link to the observation,
                // but they should be hidden from the clustering diagram and the report.
                var observationName = project.tripleStore.queryLatestC(observationID, "observationTitle");
                var observationDescription = project.tripleStore.queryLatestC(observationID, "observationDescription");
                var observationStrength = project.tripleStore.queryLatestC(observationID, "observationStrength");
                if (observationName || observationDescription) {
                    addedItemCount++;
                    const item = ClusteringDiagram.addNewItemToDiagram(clusteringDiagram, "item", interpretation.name, interpretation.text);
                    item.referenceUUID = interpretation.id;
                    item.strength = observationStrength;
                    setItemColorBasedOnStrength(item, observationStrength);
                }
            }
        }
    });

    project.tripleStore.addTriple(catalysisReportIdentifier, "interpretationsClusteringDiagram", clusteringDiagram);
    if (addedItemCount === 0 && updatedItemCount === 0) {
        toaster.toast("The clustering surface is up to date.");
    } else {
        toaster.toast("Added " + addedItemCount + " interpretations and updated " + updatedItemCount +  " interpretations in the clustering surface.");
    }
}

export function copyObservationsToClusteringDiagram() {
    var shortName = clientState.catalysisReportName();
    if (!shortName) {
        alert("Please pick a catalysis report to work with.");
        return;
    }
    
    var catalysisReportIdentifier = project.findCatalysisReport(shortName);
    if (!catalysisReportIdentifier) {
        alert("Problem finding catalysis report identifier.");
        return;
    }
    
    var observationSetIdentifier = project.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_observations");
    if (!observationSetIdentifier) {
        alert("No observations have been made on the Explore Patterns page.");
        return;
    }
    var observationIDs = project.tripleStore.getListForSetIdentifier(observationSetIdentifier);
    
    var clusteringDiagram: ClusteringDiagramModel = project.tripleStore.queryLatestC(catalysisReportIdentifier, "observationsClusteringDiagram");
    if (!clusteringDiagram) {
        clusteringDiagram = ClusteringDiagram.newDiagramModel();
    }
 
    // Update name and description and strength on existing items
    let existingReferenceUUIDs = {};
    let updatedItemCount = 0;
    clusteringDiagram.items.forEach((item) => {
        if (item.type === "item") {
            if (item.referenceUUID) {
                let itemChanged = false;
                existingReferenceUUIDs[item.referenceUUID] = item;
                var newName = project.tripleStore.queryLatestC(item.referenceUUID, "observationTitle") || "";
                var newNotes = project.tripleStore.queryLatestC(item.referenceUUID, "observationDescription") || "";
                var newStrength = project.tripleStore.queryLatestC(item.referenceUUID, "observationStrength") || "";

                // if they filled only one in, use it for both
                if (newName === "" || newName === "Deleted observation") {
                    newName = newNotes; 
                } else if (newNotes === ""|| newNotes === "Deleted observation") {
                    newNotes = newName;
                }

                // update clustering item for change to observation
                if (newName !== item.name) {
                    item.name = newName;
                    itemChanged = true;
                }
                if (newNotes !== item.notes) {
                    item.notes = newNotes;
                    itemChanged = true;
                }
                if (item.strength === undefined || item.bodyColor === undefined || newStrength != item.strength) {
                    item.strength = newStrength;
                    setItemColorBasedOnStrength(item, newStrength);
                    itemChanged = true;
                }
                if (itemChanged) updatedItemCount++;
            }
        }
    });

    // add items for observations not represented in the space
    var addedItemCount = 0;
    observationIDs.forEach((id) => {
        if (!existingReferenceUUIDs[id]) {
                var observationName = project.tripleStore.queryLatestC(id, "observationTitle");
                var observationDescription = project.tripleStore.queryLatestC(id, "observationDescription");
                var observationStrength = project.tripleStore.queryLatestC(id, "observationStrength") || "";
                if (observationName || observationDescription) {
                    addedItemCount++;
                    const item = ClusteringDiagram.addNewItemToDiagram(clusteringDiagram, "item", observationName, observationDescription);
                    item.referenceUUID = id;
                    item.strength = observationStrength;
                    setItemColorBasedOnStrength(item, observationStrength);
                }
            }
        });
    
    project.tripleStore.addTriple(catalysisReportIdentifier, "observationsClusteringDiagram", clusteringDiagram);
    if (addedItemCount === 0 && updatedItemCount === 0) {
        toaster.toast("The observations clustering diagram is up to date.");
    } else {
        project.tripleStore.addTriple(catalysisReportIdentifier, "observationsClusteringDiagram", clusteringDiagram);
        toaster.toast("Added " + addedItemCount + " observations and updated " + updatedItemCount +  " observations in the clustering surface.");
    }
}

const itemColor_strong = "#ff9138";
const itemColor_medium = "#ffbb84";
const itemColor_weak = "#ffe5d1";
const itemColor_unassigned = "#979696";

function setItemColorBasedOnStrength(item, strength) {
    switch (strength) {
        case "3 (strong)":
            item.bodyColor = itemColor_strong;
            break;
        case "2 (medium)":
            item.bodyColor = itemColor_medium;
            break;
        case "1 (weak)":  
            item.bodyColor = itemColor_weak;
            break;
        default:
            item.bodyColor = itemColor_unassigned;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// project administration
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function showListOfRemovedStoryCollections() {
    const removedCollections = projectImportExport.listOfRemovedStoryCollections();
    var message = "";
    if (!removedCollections.length) {
        message = "There are no stories in the project connected to deleted story collections.";
    } else {
        message = "These story collections have been removed from the project, but ";
        message += "the stories associated with them have not been removed. ";
        message += "You can access any of these collections ";
        message += "by creating a new story collection with the same name.\n\n";
        for (var i = 0; i < removedCollections.length; i++) {
            message += removedCollections[i] + "\n";
        }
    }
    alert(message);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// button actions in other places
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export var enterSurveyResult = openSurveyDialog;
export var toggleWebActivationOfSurvey = surveyCollection.toggleWebActivationOfSurvey;
export var storyCollectionStop = surveyCollection.storyCollectionStop;

export var importCSVQuestionnaire = csvImportExport.importCSVQuestionnaire;
export var importCSVStories = csvImportExport.importCSVStories;
export var checkCSVStories = csvImportExport.checkCSVStories;
export var exportQuestionnaire = csvImportExport.exportQuestionnaire;
export var exportQuestionnaireForImport = csvImportExport.exportQuestionnaireForImport;
export var exportStoryCollection = csvImportExport.exportStoryCollection;
export var autoFillStoryForm = csvImportExport.autoFillStoryForm;

export var exportProject = projectImportExport.exportProject;
export var importProject = projectImportExport.importProject;
export var resetProject = projectImportExport.resetProject;

export var printStoryForm = printing.printStoryForm;
export var printStoryCards = printing.printStoryCards;
export var printCatalysisReport = printing.printCatalysisReport;
export var importCatalysisReportElements = csvImportExport.importCSVCatalysisElements;
export var exportCatalysisReportElements = csvImportExport.exportCatalysisReportElements;
export var exportPresentationOutline = printing.exportPresentationOutline;
export var exportCollectionSessionAgenda = printing.exportCollectionSessionAgenda;
export var printSensemakingSessionAgenda = printing.printSensemakingSessionAgenda;

export var printProjectReport = printing.printProjectReport;
