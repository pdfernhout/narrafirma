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

let project: Project;
let clientState: ClientState;

// Call this to set up the project or other needed data
export function initialize(theProject: Project, theClientState: ClientState) {
    project = theProject;
    clientState = theClientState;
}

export function helpButtonClicked() {
    const pageSpecification = navigationPane.getCurrentPageSpecification();
    if (!pageSpecification) {
        console.log("no pageSpecification for current page");
        return;
    }
    const helpURL = 'help/' + pageSpecification.section + "/help_" + pageSpecification.id + '.html';
    browser.launchApplication(helpURL, 'help');
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// overall - links
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function logoutButtonClicked() {
    // TODO: Warn if have any read-only changes that would be lost
    if (confirm("Are you sure you want to log out?")) {
        const isWordPressAJAX = !!window["ajaxurl"];
        if (isWordPressAJAX) {
            window.location.href = window.location.href.split("wp-content")[0] + "wp-login.php?action=logout";
        } else {
            window.location.href = "/logout";
        }
    }
}

export function loginButtonClicked() {
// TODO: Warn if have any read-only changes that would be lost
    const isWordPressAJAX = !!window["ajaxurl"];
    if (isWordPressAJAX) {
        window.location.href = window.location.href.split("wp-content")[0] + "wp-login.php?action=login";
    } else {
        window.location.href = "/login";
    }
}

export function guiOpenSection(model, fieldSpecification, value) {
    const section = fieldSpecification.displayConfiguration.section;
    
    // Don't queue an extra redraw as one is already queued since this code get called by a button press
    const isRedrawAlreadyQueued = true;
    pageDisplayer.showPage(section, false, isRedrawAlreadyQueued);
    // document.body.scrollTop = 0;
    // document.documentElement.scrollTop = 0;
    window.scrollTo(0, 0);
}

export function showOrHideAdvancedOptions() {
    clientState.showAdvancedOptions(!clientState.showAdvancedOptions());
}

export function showOrHideImportOptions() {
    clientState.showImportOptions(!clientState.showImportOptions());
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// overall - clustering diagram
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function copyClusteringDiagramElements(fromDiagramField: string, fromType: string, toDiagramField: string, toType: string) {
    const fromDiagram: ClusteringDiagramModel = project.getFieldValue(fromDiagramField);
    if (!fromDiagram || !fromDiagram.items.length) return;
    const toDiagram: ClusteringDiagramModel = project.getFieldValue(toDiagramField) || ClusteringDiagram.newDiagramModel();
    let addedItemCount = 0;
    
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
    const list = project.getListForField("project_projectStoriesList");
    const toDiagramField = "project_storyElements_answersClusteringDiagram";
    const toDiagram: ClusteringDiagramModel = project.getFieldValue(toDiagramField) || ClusteringDiagram.newDiagramModel();
    let addedItemCount = 0;
    list.forEach((projectStoryIdentifier) => {
        const projectStory = project.tripleStore.makeObject(projectStoryIdentifier);
        const storyName = projectStory.projectStory_name;
        const storyText = projectStory.projectStory_text;
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
    const finalQuestionIDs = [
        "project_pniQuestions_goal_final",
        "project_pniQuestions_relationships_final",
        "project_pniQuestions_focus_final",
        "project_pniQuestions_range_final",
        "project_pniQuestions_scope_final",
        "project_pniQuestions_emphasis_final"
    ];
    let copiedAnswersCount = 0;
    for (let index in finalQuestionIDs) {
        const finalQuestionID = finalQuestionIDs[index];
        const draftQuestionID = finalQuestionID.replace("_final", "_draft");
        const finalValue = project.tripleStore.queryLatestC(project.projectIdentifier, finalQuestionID);
        if (!finalValue) {
            const draftValue = project.tripleStore.queryLatestC(project.projectIdentifier, draftQuestionID);
            if (draftValue) {
                project.tripleStore.addTriple(project.projectIdentifier, finalQuestionID, draftValue);
                copiedAnswersCount++;
            }
        }
    }
    return copiedAnswersCount;
}

export function copyDraftPNIQuestionVersionsIntoAnswers() {
    const copiedAnswersCount = copyDraftPNIQuestionVersionsIntoAnswers_Basic();
    const template = translate("#copyDraftPNIQuestion_template", "Copied {{copiedAnswersCount}} answers.\n\n(Note that blank draft answers are not copied, and non-blank final answers are not replaced.)");
    const message = template.replace("{{copiedAnswersCount}}", copiedAnswersCount);
    alert(message);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// collection
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Caller should call wizard.forward() on successful save to see the last page, and provide a retry message otherwise
// Caller may also want to call (the returned) surveyDialog.hide() to close the window, or let the user do it.
function openMithrilSurveyDialog(questionnaire, callback, previewModeTitleText = null) {  
    const surveyViewFunction = surveyBuilder.buildSurveyForm(null, questionnaire, callback, {previewMode: !!previewModeTitleText, ignoreTitleChange: true, dataEntry: true});
    const dialogConfiguration = {
        dialogModel: null,
        dialogTitle: "Enter Story" + (previewModeTitleText || ""),
        dialogClass: undefined,
        dialogConstructionFunction: surveyViewFunction,
        dialogOKButtonLabel: "Close",
        dialogOKCallback: function(dialogConfiguration, hideDialogMethod) { hideDialogMethod(); }
    };
    return dialogSupport.openDialog(dialogConfiguration);
}

function openSurveyDialog() {
    const storyCollectionName: string = clientState.storyCollectionName();
    if (!storyCollectionName) {
        // TODO: translate
        alert("Please select a story collection first.");
        return null;
    }
    const questionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionName, true);
    if (!questionnaire) return;
    const surveyDialog = openMithrilSurveyDialog(questionnaire, finished);
    
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

export function previewQuestionForm(model, fieldSpecification) {
    const questionnaire = questionnaireGeneration.buildStoryFormUsingTripleStoreID(model, "");
    window["narraFirma_previewQuestionnaire"] = questionnaire;
    const w = window.open("survey.html#preview=" + (new Date().toISOString()), "_blank");
}

export function checkCSVDataFileWhileEditingStoryForm(model, fieldSpecification) {
    const questionnaire = questionnaireGeneration.buildStoryFormUsingTripleStoreID(model, "");
    csvImportExport.checkCSVStoriesWithStoryForm(questionnaire);
}

export function exportStoryFormWhileEditingIt_NativeFormat(model, fieldSpecification) {
    const questionnaire = questionnaireGeneration.buildStoryFormUsingTripleStoreID(model, "");
    csvImportExport.exportQuestionnaire(questionnaire);
}

export function exportStoryFormWhileEditingIt_ExternalFormat(model, fieldSpecification) {
    const questionnaire = questionnaireGeneration.buildStoryFormUsingTripleStoreID(model, "");
    csvImportExport.exportQuestionnaireForImport(questionnaire);
}

export function setQuestionnaireForStoryCollection(storyCollectionIdentifier): boolean {
    if (!storyCollectionIdentifier) return false;
    const questionnaireName = project.tripleStore.queryLatestC(storyCollectionIdentifier, "storyCollection_questionnaireIdentifier");
    const questionnaire = questionnaireGeneration.buildStoryForm(questionnaireName);
    if (!questionnaire) return false;
    project.tripleStore.addTriple(storyCollectionIdentifier, "questionnaire", questionnaire);
    return true;
}

export function updateQuestionnaireForStoryCollection(storyCollectionIdentifier) {
    if (!storyCollectionIdentifier) {
        alert("Problem: No storyCollectionIdentifier");
        return;
    }
    const storyCollectionName = project.tripleStore.queryLatestC(storyCollectionIdentifier, "storyCollection_shortName");
    if (!storyCollectionName) {
        alert("Problem: No storyCollectionName");
        return;
    }
    // TODO: Translate
    const confirmResult = confirm('Update story form for story collection "' + storyCollectionName + '"?"\n(Updating is not recommended once data collection has begun.)');
    if (!confirmResult) return;

    const updateResult = setQuestionnaireForStoryCollection(storyCollectionIdentifier);
    if (!updateResult) {
        alert("Problem: No questionnaire could be created");
        return;
    }
    
    toaster.toast("Updated story form");
    
    return;
}

export function showStoryAsJSONData(model, fieldSpecification) {
    // don't show questionnaire 
    function replacer(key, value) {
        if (key === "questionnaire") {
            return undefined;
        } 
        return value;
    }
    var text = JSON.stringify(model, replacer, 4); // 4 is the number of pretty-print nesting indentation spaces
    dialogSupport.openTextEditorDialog(text, "Story", "Close", closeShowDialogClicked, false, true);
}

function closeShowDialogClicked(text, hideDialogMethod) {     
    hideDialogMethod();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// catalysis
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function copyInterpretationsToClusteringDiagram() {
    const shortName = clientState.catalysisReportName();
    if (!shortName) {
        alert("Please pick a catalysis report to work with.");
        return;
    }
    
    const catalysisReportIdentifier = project.findCatalysisReport(shortName);
    if (!catalysisReportIdentifier) {
        alert("Problem finding catalysis report identifier.");
        return;
    }
    
    const allInterpretations = [];
    const observationSetIdentifier = project.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_observations");
    if (!observationSetIdentifier) {
        alert("No observations have been made on the Explore Patterns page.");
        return;
    }
    const observationIDs = project.tripleStore.getListForSetIdentifier(observationSetIdentifier);
    const observations = project.tripleStore.queryAllLatestBCForA(observationSetIdentifier);
    
    for (let key in observations) {
        const observationIdentifier = observations[key];
        const interpretationsSetIdentifier = project.tripleStore.queryLatestC(observationIdentifier, "observationInterpretations");
        if (interpretationsSetIdentifier) {
            const interpretations = project.tripleStore.getListForSetIdentifier(interpretationsSetIdentifier);
            for (let i = 0; i < interpretations.length; i++) {
                const interpretationIdentifier = interpretations[i];
                const interpretationName = project.tripleStore.queryLatestC(interpretationIdentifier, "interpretation_name");
                const interpretationText = project.tripleStore.queryLatestC(interpretationIdentifier, "interpretation_text");
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
        return;
    }
    
    let clusteringDiagram: ClusteringDiagramModel = project.tripleStore.queryLatestC(catalysisReportIdentifier, "interpretationsClusteringDiagram");
    if (!clusteringDiagram) {
        clusteringDiagram = ClusteringDiagram.newDiagramModel();
    }

    function findUUIDForInterpretationName(name: string) {
        for (let index = 0; index < allInterpretations.length; index++) {
            const interpretation = allInterpretations[index];
            if (interpretation.name === name) {
                return interpretation.id;
            }
        }
        return null;
    }

    function findObservationForInterpretation(observationIDs, id, name) {
        for (let i = 0; i < observationIDs.length; i++) {
            const observationID = observationIDs[i];
            const interpretationsListIdentifier = project.tripleStore.queryLatestC(observationID, "observationInterpretations");
            const interpretationsList = project.tripleStore.getListForSetIdentifier(interpretationsListIdentifier);
            for (let j = 0; j < interpretationsList.length; j++) {
                if (id) {
                    if (interpretationsList[j] === id) {
                        return observationID;
                    }
                } else {
                    const interpretation = project.tripleStore.makeObject(interpretationsList[j], true);
                    if (name === interpretation.interpretation_name) {
                        return observationID;
                    }
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

    let updatedItemCount = 0;
    clusteringDiagram.items.forEach((item) => {
        if (item.type === "item") {
            if (item.referenceUUID) {
                let itemChanged = false;
                let newName = project.tripleStore.queryLatestC(item.referenceUUID, "interpretation_name") || "";
                let newNotes = project.tripleStore.queryLatestC(item.referenceUUID, "interpretation_text") || "";
                const observationID = findObservationForInterpretation(observationIDs, item.referenceUUID, item.name);
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
                    itemChanged = true;
                }
                // recalculate item color even if strength is unchanged, because unassigned-strength color was changed in NF 1.5.2
                // in older versions the color was too dark (not enough contrast)
                ClusteringDiagram.setItemColorBasedOnStrength(item, item.strength);
                if (item.notesExtra === undefined || newNotesExtra === null || newNotesExtra != item.notesExtra) {
                    item.notesExtra = newNotesExtra;
                    itemChanged = true;
                }
                
                if (itemChanged) updatedItemCount++;
            }
        }
    });

    // add items for interpretations not represented in the space
    let addedItemCount = 0;
    allInterpretations.forEach((interpretation) => {
        if (!existingReferenceUUIDs[interpretation.id]) {
            // check that this interpretation is attached to an observation; if not, it should not be added to the diagram
            const observationID = findObservationForInterpretation(observationIDs, interpretation.id, interpretation.name);
            if (observationID) {
                // if the user creates an observation and adds interpretations to it,
                // and then deletes the name and text of the observation, 
                // the observation will still exist in the system,
                // and the interpretations will still exist, and they will still link to the observation,
                // but they should be hidden from the clustering diagram and the report.
                const observationName = project.tripleStore.queryLatestC(observationID, "observationTitle");
                const observationDescription = project.tripleStore.queryLatestC(observationID, "observationDescription");
                const observationStrength = project.tripleStore.queryLatestC(observationID, "observationStrength");
                if (observationName || observationDescription) {
                    addedItemCount++;
                    const item = ClusteringDiagram.addNewItemToDiagram(clusteringDiagram, "item", interpretation.name, interpretation.text);
                    item.referenceUUID = interpretation.id;
                    item.strength = observationStrength;
                    ClusteringDiagram.setItemColorBasedOnStrength(item, observationStrength);
                }
            }
        }
    });

    project.tripleStore.addTriple(catalysisReportIdentifier, "interpretationsClusteringDiagram", clusteringDiagram);
    if (addedItemCount === 0 && updatedItemCount === 0) {
        toaster.toast("The clustering space is up to date.");
    } else {
        toaster.toast("Added " + addedItemCount + " interpretations and updated " + updatedItemCount +  " interpretations in the clustering surface.");
    }
}

export function copyObservationsToClusteringDiagram() {
    const shortName = clientState.catalysisReportName();
    if (!shortName) {
        alert("Please pick a catalysis report to work with.");
        return;
    }
    
    const catalysisReportIdentifier = project.findCatalysisReport(shortName);
    if (!catalysisReportIdentifier) {
        alert("Problem finding catalysis report identifier.");
        return;
    }
    
    const observationSetIdentifier = project.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_observations");
    if (!observationSetIdentifier) {
        alert("No observations have been made on the Explore Patterns page.");
        return;
    }
    const observationIDs = project.tripleStore.getListForSetIdentifier(observationSetIdentifier);

    if (observationIDs.length === 0) {
        alert("No observations have been found for this catalysis report.");
        return;
    }
    
    let clusteringDiagram: ClusteringDiagramModel = project.tripleStore.queryLatestC(catalysisReportIdentifier, "observationsClusteringDiagram");
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
                let newName = project.tripleStore.queryLatestC(item.referenceUUID, "observationTitle") || "";
                let newNotes = project.tripleStore.queryLatestC(item.referenceUUID, "observationDescription") || "";
                let newStrength = project.tripleStore.queryLatestC(item.referenceUUID, "observationStrength") || "";

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
                    itemChanged = true;
                }
                // recalculate item color even if strength is unchanged, because unassigned-strength color was changed in NF 1.5.2
                // in older versions the color was too dark (not enough contrast)
                ClusteringDiagram.setItemColorBasedOnStrength(item, item.strength);
                if (itemChanged) updatedItemCount++;
            }
        }
    });

    // add items for observations not represented in the space
    let addedItemCount = 0;
    observationIDs.forEach((id) => {
        if (!existingReferenceUUIDs[id]) {
                const observationName = project.tripleStore.queryLatestC(id, "observationTitle");
                const observationDescription = project.tripleStore.queryLatestC(id, "observationDescription");
                const observationStrength = project.tripleStore.queryLatestC(id, "observationStrength") || "";
                if (observationName || observationDescription) {
                    addedItemCount++;
                    const item = ClusteringDiagram.addNewItemToDiagram(clusteringDiagram, "item", observationName, observationDescription);
                    item.referenceUUID = id;
                    item.strength = observationStrength;
                    ClusteringDiagram.setItemColorBasedOnStrength(item, observationStrength);
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// project administration
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function showListOfRemovedStoryCollections() {
    const removedCollections = projectImportExport.listOfRemovedStoryCollections();
    let message = "";
    if (!removedCollections.length) {
        message = "There are no stories in the project connected to deleted story collections.";
    } else {
        message = "These story collections have been removed from the project, but ";
        message += "the stories associated with them have not been removed. ";
        message += "You can access any of these collections ";
        message += "by creating a new story collection with the same name.\n\n";
        for (let i = 0; i < removedCollections.length; i++) {
            message += removedCollections[i] + "\n";
        }
    }
    alert(message);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// button actions in other places
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const enterSurveyResult = openSurveyDialog;
export const toggleWebActivationOfSurvey = surveyCollection.toggleWebActivationOfSurvey;
export const storyCollectionStop = surveyCollection.storyCollectionStop;

export const importCSVQuestionnaire = csvImportExport.importCSVQuestionnaire;
export const importCSVStories = csvImportExport.importCSVStories;
export const checkCSVStories = csvImportExport.checkCSVStories;
export const exportQuestionnaire = csvImportExport.exportQuestionnaire;
export const exportQuestionnaireForImport = csvImportExport.exportQuestionnaireForImport;
export const exportStoryCollection = csvImportExport.exportStoryCollection;
export const autoFillStoryForm = csvImportExport.autoFillStoryForm;

export const exportProject = projectImportExport.exportProject;
export const importProject = projectImportExport.importProject;
export const resetProject = projectImportExport.resetProject;
export const exportEntireProject = projectImportExport.exportEntireProject;

export const showStoryAsJSON = showStoryAsJSONData;

export const printStoryForm = printing.printStoryForm;
export const printStoryCards = printing.printStoryCards;
export const printCatalysisReport = printing.printCatalysisReport;
export const importCatalysisReportElements = csvImportExport.importCSVCatalysisElements;
export const exportCatalysisReportElements = csvImportExport.exportCatalysisReportElements;
export const exportPresentationOutline = printing.exportPresentationOutline;
export const exportCollectionSessionAgenda = printing.exportCollectionSessionAgenda;
export const printSensemakingSessionAgenda = printing.printSensemakingSessionAgenda;

export const printProjectReport = printing.printProjectReport;
