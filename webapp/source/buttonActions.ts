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
    // console.log("helpButtonClicked", pageSpecification);
    if (!pageSpecification) {
        console.log("no pageSpecification for current page");
        return;
    }
    
    var helpURL = 'help/' + pageSpecification.section + "/help_" + pageSpecification.id + '.html';
    
    // console.log("opening help url", helpURL);
    
    browser.launchApplication(helpURL, 'help');
}

// Caller should call wizard.forward() on successful save to see the last page, and provide a retry message otherwise
// Caller may also want to call (the returned) surveyDialog.hide() to close the window, or let the user do it.
function openMithrilSurveyDialog(questionnaire, callback, previewModeTitleText = null) {  
    // console.log("openSurveyDialog questionnaire", questionnaire);
   
    var surveyDiv = document.createElement("div");
    var surveyViewFunction = surveyBuilder.buildSurveyForm(null, questionnaire, callback, {previewMode: !!previewModeTitleText, ignoreTitleChange: true});
    
    var dialogConfiguration = {
        dialogModel: null,
        dialogTitle: "Take Survey" + (previewModeTitleText || ""),
        dialogStyle: undefined,
        dialogConstructionFunction: surveyViewFunction,
        dialogOKButtonLabel: "Close",
        dialogOKCallback: function(dialogConfiguration, hideDialogMethod) { hideDialogMethod(); }
    };
    
    return dialogSupport.openDialog(dialogConfiguration);
}

function openSurveyDialog() {
    // console.log("openSurveyDialog");
    
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

///////// Button functions

export function copyStoryFormURL() {
    alert("Story form URL is: " + "http://localhost:8080/survey.html");
}

export function guiOpenSection(model, fieldSpecification, value) {
    var section = fieldSpecification.displayConfiguration.section;
    // console.log("guiOpenSection", section, fieldSpecification);
    
    // Don't queue an extra redraw as one is already queued since this code get called by a button press
    var isRedrawAlreadyQueued = true;
    pageDisplayer.showPage(section, false, isRedrawAlreadyQueued);
    // document.body.scrollTop = 0;
    // document.documentElement.scrollTop = 0;
    window.scrollTo(0, 0);
}

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
        // console.log("finalQuestionID/draftQuestionID", finalQuestionID, draftQuestionID);
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

export function logoutButtonClicked() {
    // TODO: Warn if have any read-only changes that would be lost
    if (confirm("Logout?")) {
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
    if (confirm("Login?")) {
        var isWordPressAJAX = !!window["ajaxurl"];
        if (isWordPressAJAX) {
            window.location.href = window.location.href.split("wp-content")[0] + "wp-login.php?action=login";
        } else {
            window.location.href = "/login";
        }
    }
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
    // console.log("previewQuestionForm", model);
    var questionnaire = questionnaireGeneration.buildQuestionnaireFromTemplate(model);
    window["narraFirma_previewQuestionnaire"] = questionnaire;
    
    var w = window.open("survey.html#preview=" + (new Date().toISOString()), "_blank");
}

export function copyInterpretationsToClusteringDiagram() {
    var shortName = clientState.catalysisReportName();
    // console.log("copyInterpretationsToClusteringDiagram", shortName);
    
    if (!shortName) {
        alert("Please pick a catalysis report to work with.");
        return;
    }
    
    var catalysisReportIdentifier = project.findCatalysisReport(shortName);
    if (!catalysisReportIdentifier) {
        alert("Problem finding catalysisReportIdentifier");
        return;
    }
    
    // Collect all interpretations
    var allInterpretations = [];
        
    var observationSetIdentifier = project.tripleStore.queryLatestC(catalysisReportIdentifier, "catalysisReport_observations");
    // console.log("observationSetIdentifier", observationSetIdentifier);
    
    if (!observationSetIdentifier) {
        alert("No observations have been made yet in the Pattern Browser");
        return;
    }
    
    var observations = project.tripleStore.queryAllLatestBCForA(observationSetIdentifier);
    
    // console.log("observations", observations);
    
    for (var key in observations) {
        var observationIdentifier = observations[key];
        // console.log("observationIdentifier", key, observationIdentifier);
        
        var interpretationsSetIdentifier = project.tripleStore.queryLatestC(observationIdentifier, "observationInterpretations");
        // console.log("interpretationsSetIdentifier", key, observationIdentifier, interpretationsSetIdentifier);
        
        if (interpretationsSetIdentifier) {
            var interpretations = project.tripleStore.getListForSetIdentifier(interpretationsSetIdentifier);
            // console.log("interpretations", interpretations);
            
            for (var i = 0; i < interpretations.length; i++) {
                var interpretationIdentifier = interpretations[i];
                // "interpretation_name", "interpretation_text"
                var interpretationName = project.tripleStore.queryLatestC(interpretationIdentifier, "interpretation_name");
                var interpretationText = project.tripleStore.queryLatestC(interpretationIdentifier, "interpretation_text");
                // console.log("interpretationIdentifier", interpretationIdentifier, interpretationName, interpretationText);
                allInterpretations.push({
                    "type": "Interpretation",
                    id: interpretationIdentifier,
                    name: interpretationName,
                    text: interpretationText
                });
            }
        }
    }
    
    if (allInterpretations.length === 0) {
        alert("No interpretations have been found for this catalysis report");
    }
    
    // console.log("allInterpretations", allInterpretations);
    
    if (!confirm("Copy intepretations for this catalysys report into clustering diagram?")) return;
    
    var clusteringDiagram: ClusteringDiagramModel = project.tripleStore.queryLatestC(catalysisReportIdentifier, "interpretationsClusteringDiagram");
    
    // console.log("clusteringDiagram before", clusteringDiagram);
    
    if (!clusteringDiagram) {
        clusteringDiagram = ClusteringDiagram.newDiagramModel();
    }
    
    var existingItemNames = {};
    
    clusteringDiagram.items.forEach((item) => {
        existingItemNames[item.name] = true;
    });
    
    var addedItemCount = 0;
    var shiftPerItem = 3;
    
    allInterpretations.forEach((interpretation) => {
        if (!existingItemNames[interpretation.name]) {
            addedItemCount++;
            ClusteringDiagram.addNewItemToDiagram(clusteringDiagram, "item", interpretation.name, interpretation.text);
        }
    });

    // console.log("clusteringDiagram after", clusteringDiagram);
    
    project.tripleStore.addTriple(catalysisReportIdentifier, "interpretationsClusteringDiagram", clusteringDiagram);

    toaster.toast("Added " + addedItemCount + " interpretations");
}

export function setQuestionnaireForStoryCollection(storyCollectionIdentifier): boolean {
    // console.log("setQuestionnaireForStoryCollection", storyCollectionIdentifier);
    
    if (!storyCollectionIdentifier) return false;
    var questionnaireName = project.tripleStore.queryLatestC(storyCollectionIdentifier, "storyCollection_questionnaireIdentifier");
    var questionnaire = questionnaireGeneration.buildQuestionnaire(questionnaireName);
    if (!questionnaire) return false;
    project.tripleStore.addTriple(storyCollectionIdentifier, "questionnaire", questionnaire);
    return true;
}

export function updateQuestionnaireForStoryCollection(storyCollectionIdentifier) {
    // console.log("updateQuestionnaireForStoryCollection", storyCollectionIdentifier);
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

function copyClusteringDiagramElements(fromDiagramField: string, fromType: string, toDiagramField: string, toType: string) {
    // console.log("copyClusteringDagramElements", fromDiagramField, fromType, toDiagramField, toType);

    var fromDiagram: ClusteringDiagramModel = project.getFieldValue(fromDiagramField);
    // console.log("fromDiagram", fromDiagram);
    if (!fromDiagram || !fromDiagram.items.length) return;
    
    var toDiagram: ClusteringDiagramModel = project.getFieldValue(toDiagramField) || ClusteringDiagram.newDiagramModel();
    // console.log("toDiagram", toDiagram);
    
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
        toaster.toast("Updating diagram");
        project.setFieldValue(toDiagramField, toDiagram);
    } else {
        toaster.toast("No changes were needed to diagram");
    }
}

export function copyPlanningStoriesToClusteringDiagram(model) {
    // console.log("copyPlanningStoriesToClusteringDiagram", model);
    
    var list = project.getListForField("project_projectStoriesList");
    // console.log("copyPlanningStoriesToClusteringDiagram", list);
    
    var toDiagramField = "project_storyElements_answersClusteringDiagram";
    
    var toDiagram: ClusteringDiagramModel = project.getFieldValue(toDiagramField) || ClusteringDiagram.newDiagramModel();
    // console.log("toDiagram", toDiagram);

    var addedItemCount = 0;
        
    list.forEach((projectStoryIdentifier) => {
        var projectStory = project.tripleStore.makeObject(projectStoryIdentifier);
        // console.log("projectStory", projectStory);
        
        var storyName = projectStory.projectStory_name;
        var storyText = projectStory.projectStory_text;
        
        if (!isNamedItemInDiagram(toDiagram, storyName, "cluster")) {
            ClusteringDiagram.addNewItemToDiagram(toDiagram, "cluster", storyName, storyText);
            addedItemCount++;
        }    
    });
    
    if (addedItemCount) {
        toaster.toast("Updating diagram");
        project.setFieldValue(toDiagramField, toDiagram);
    } else {
        toaster.toast("No changes were needed to diagram");
    }

}

export function copyAnswersToClusteringDiagram(model) {
    // console.log("copyAnswersToClusteringDiagram", model);
    copyClusteringDiagramElements("project_storyElements_answersClusteringDiagram", "item", "project_storyElements_answerClustersClusteringDiagram", "item");
}

export function copyAnswerClustersToClusteringDiagram(model) {
    // console.log("copyAnswerClustersToClusteringDiagram", model);
    copyClusteringDiagramElements("project_storyElements_answerClustersClusteringDiagram", "cluster", "project_storyElements_attributesClusteringDiagram", "cluster");
}

export function copyAttributesToClusteringDiagram(model) {
    // console.log("copyAttributesToClusteringDiagram", model);
    copyClusteringDiagramElements("project_storyElements_attributesClusteringDiagram", "item", "project_storyElements_attributeClustersClusteringDiagram", "item");
}

export var enterSurveyResult = openSurveyDialog;
export var toggleWebActivationOfSurvey = surveyCollection.toggleWebActivationOfSurvey;
export var storyCollectionStop = surveyCollection.storyCollectionStop;

export var importCSVQuestionnaire = csvImportExport.importCSVQuestionnaire;
export var importCSVStories = csvImportExport.importCSVStories;
export var exportQuestionnaire = csvImportExport.exportQuestionnaire;
export var exportStoryCollection = csvImportExport.exportStoryCollection;

export var exportEntireProject = projectImportExport.exportEntireProject;
export var importEntireProject = projectImportExport.importEntireProject;
export var exportProjectCurrentStateWithSurveyResults = projectImportExport.exportProjectCurrentStateWithSurveyResults;
export var exportProjectCurrentStateWithoutSurveyResults = projectImportExport.exportProjectCurrentStateWithoutSurveyResults;
export var importProjectCurrentState = projectImportExport.importProjectCurrentState;

export var printStoryForm = printing.printStoryForm;
export var printStoryCards = printing.printStoryCards;
export var printCatalysisReport = printing.printCatalysisReport;
export var exportPresentationOutline = printing.exportPresentationOutline;
export var exportCollectionSessionAgenda = printing.exportCollectionSessionAgenda;
export var printSensemakingSessionAgenda = printing.printSensemakingSessionAgenda;
