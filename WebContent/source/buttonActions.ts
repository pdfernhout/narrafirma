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

"use strict";

var project: Project;

// Call this to set up the project or other needed data
export function initialize(theProject: Project) {
    project = theProject;
}

export function helpButtonClicked() {
    var pageSpecification = navigationPane.getCurrentPageSpecification();
    console.log("helpButtonClicked", pageSpecification);
    if (!pageSpecification) {
        console.log("no pageSpecification for current page");
        return;
    }
    
    var helpURL = '/help/' + pageSpecification.section + "/help_" + pageSpecification.id + '.html';
    
    console.log("opening help url", helpURL);
    
    browser.launchApplication(helpURL, 'help');
}

function importButtonClicked(projectDefinitionText, hideDialogMethod) {
    console.log("importButtonClicked", projectDefinitionText);
    
    // TODO: Fix this
    throw new Error("No longer working due to ongoing refactoring for current page model");

    /*
    var updatedProjectAnswers;

    try {
        updatedProjectAnswers = JSON.parse(projectDefinitionText);
    } catch(e) {
        alert("Problem parsing project definition text\n" + e);
        return;
    }

    console.log("parsed projectDefinitionText", updatedProjectAnswers);

    // TODO: Translate
    dialogSupport.confirm("This will overwrite your current project design.\nAny active survey and any previously stored survey results will remain as-is,\nhowever any new project design might have a different survey design.\nAre you sure you want to replace the current project definition?", function() {

        // TODO: Not sure what to do for what is essentially a new currentProjectVersionReference defined here
        // TODO: Needs finishing!!!

        console.log("Updated OK");
        hideDialogMethod();
    });
    */
}

function importExportClicked() {
    console.log("importExportClicked");
    throw new Error("No longer working due to ongoing refactoring for current page model");
    // var projectDefinitionText = JSON.stringify(domain.projectAnswers, null, 2);
    // dialogSupport.openTextEditorDialog(projectDefinitionText, "#projectImportExportDialog_title|Project Import/Export", "#projectImportExportDialog_okButtonText|OK", importButtonClicked);
}

// Caller should call wizard.forward() on successful save to see the last page, and provide a retry message otherwise
// Caller may also want to call (the returned) surveyDialog.hide() to close the window, or let the user do it.
function openMithrilSurveyDialog(questionnaire, callback, previewModeTitleText = null) {  
    console.log("openSurveyDialog questionnaire", questionnaire);
    
    var surveyDiv = document.createElement("div");
    
    surveyBuilder.buildSurveyForm(surveyDiv, questionnaire, callback, previewModeTitleText);
    
    var surveyDialog = new Dialog({
        title: "Take Survey" + (previewModeTitleText || ""),
        content: surveyDiv
        // style: "width: 800px; height: 700px;"
    });
    
    // This will free the dialog when it is closed to avoid a memory leak
    surveyDialog.connect(surveyDialog, "onHide", function(e) {
        console.log("destroying surveyDialog");
        surveyDialog.destroyRecursive();
    });
            
    surveyDialog.show();
    
    return surveyDialog;
}

function openSurveyDialog() {
    console.log("openSurveyDialog");
    
    var storyCollectionIdentifier = getStoryCollectionNameForSelectedStoryCollection("storyCollectionChoice_enterStories");
    if (!storyCollectionIdentifier) return;
    
    var questionnaire = getQuestionnaireForSelectedStoryCollection("storyCollectionChoice_enterStories");
    if (!questionnaire) return;

    var surveyDialog = openMithrilSurveyDialog(questionnaire, finished);
    
    function finished(status, surveyResult, wizardPane) {
        console.log("surveyResult", status, surveyResult);
        if (status === "submitted") {
            surveyStorage.storeSurveyResult(project.pointrelClient, project.projectIdentifier, storyCollectionIdentifier, surveyResult, wizardPane);
        }
    }
}

///////// Button functions

export function copyStoryFormURL() {
    alert("Story form URL is: " + "http://localhost:8080/survey.html");
}

export function guiOpenSection(contentPane, model, fieldSpecification, value) {
    var section = fieldSpecification.displayConfiguration.section;
    console.log("guiOpenSection", section, fieldSpecification);
    pageDisplayer.showPage(section);
}

function generateHTMLForQuestionnaire(questionnaire) {
     
    // CFK started on this, but it should be finished with the mithril thing so not finishing
    var output = "";
    output += "<!DOCTYPE html>\n";
    output += "<head>\n";
    output += "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n";
    output += "<title>" + questionnaire.title + "</title>\n";
    output += "<link rel=\"stylesheet\" href=\"/css/survey.css\">\n";
    output += "</head>\n\n";
    output += "<body>\n";
    output += "<div class=\"narrafirma-survey-print-title\">" + questionnaire.title + "</div>\n";
    output += "<div class=\"narrafirma-survey-print-intro\">" + questionnaire.startText + "</div>\n";
    
    // TODO: Translate
    output += "Please select one of the following questions to answer:<br><br>\n";
    
    questionnaire.elicitingQuestions.forEach(function (elicitingQuestion) {
        output += elicitingQuestion.text + "<br><br>\n";
    });
    
    output += "Please enter your response here:<br><br>\n";
    
    for (var i = 0; i < 7; i++) output += "<br><br>\n";
   
    questionnaire.storyQuestions.forEach(function (storyQuestion) {
        output += storyQuestion.displayPrompt + "<br>\n";
    });
    
    // TODO: Print choices...
   
    questionnaire.participantQuestions.forEach(function (participantQuestion) {
        output += participantQuestion.displayPrompt + "<br>\n";
    });
    
    // TODO: Print choices...
    
    output += "<br><br>";
    
    output += questionnaire.endText;
    
    output += "\n</body>\n</html>";
    
    return output;
}

function getStoryCollectionNameForSelectedStoryCollection(storyCollectionChoiceId) {
    /*
     * TODO: Could check first if any story collections have been defined
    var questionnaires = project.projectModel.project_questionnaires;
    
    if (questionnaires.length === 0) {
        // TODO: Translate
        alert("No questionnaires have been defined");
        return;
    }
    */
    
    var choiceWidget = pageDisplayer.getCurrentPageWidgets()[storyCollectionChoiceId];
    console.log("choiceWidget", choiceWidget);
    
    if (!choiceWidget) {
        alert("Programming error: no widget for: " + storyCollectionChoiceId);
        return null;
    }
    
    var storyCollectionName = choiceWidget.get("value");
    console.log("storyCollectionName", storyCollectionName);
    
    if (!storyCollectionName) {
        // TODO: translate
        alert("Please select a story collection first.");
        return null;
    }
    
    return storyCollectionName;
}

function getQuestionnaireForSelectedStoryCollection(storyCollectionChoiceId) {
    var storyCollectionName = getStoryCollectionNameForSelectedStoryCollection(storyCollectionChoiceId);
    if (!storyCollectionName) return;
    
    var storyCollection = questionnaireGeneration.findStoryCollection(project, storyCollectionName);
    
    if (!storyCollection) {
        // TODO: translate
        alert("The selected story collection could not be found.");
        return null;
    }
    
    var questionnaireName = storyCollection.storyCollection_questionnaireIdentifier;
    
    if (!questionnaireName) {
        // TODO: translate
        alert("The story collection has no selection for a questionnaire.");
        return null;
    }
    
    var questionnaire = storyCollection.questionnaire;
    
    if (!questionnaire) {
        // TODO: translate
        alert("The questionnaire selected in the story collection could not be found.");
        return null;
    }
    
    return questionnaire;
}

export function printStoryForm(contentPane, model, fieldSpecification, value) {
    console.log("printStoryForm unfinished");
    
    var questionnaire = getQuestionnaireForSelectedStoryCollection("storyCollectionChoice_printing");
    if (!questionnaire) return;
    
    var output = generateHTMLForQuestionnaire(questionnaire);
    
    var outputLabel = pageDisplayer.getCurrentPageWidgets()["printQuestionsForm_output"];
    console.log("outputLabel", outputLabel);
    
    // outputLabel.set("content", output);
    printHTML(output);
}

function printHTML(htmlToPrint) {
    var w = window.open();
    w.document.write(htmlToPrint);
    // w.print();
    // w.close();
}

function copyDraftPNIQuestionVersionsIntoAnswers_Basic() {
    var model = project.projectModel;

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
        var finalValue = model[finalQuestionID];
        if (!finalValue) {
            var draftValue = model[draftQuestionID];
            if (draftValue) {
                model[finalQuestionID] = draftValue;
                copiedAnswersCount++;
            }
        }
    }

    return copiedAnswersCount;
}

export function copyDraftPNIQuestionVersionsIntoAnswers() {
    var copiedAnswersCount = copyDraftPNIQuestionVersionsIntoAnswers_Basic();
    var template = translate("#copyDraftPNIQuestion_template", "Copied {{copiedAnswersCount}} answers\nNote that blank draft answers are not copied; non-blank final answers are not replaced");
    var message = template.replace("{{copiedAnswersCount}}", copiedAnswersCount);
    alert(message);
}

export function logoutButtonClicked() {
    window.location.href = "/logout";
}

/*
function previewQuestionForm(contentPane, model, fieldSpecification) {
    console.log("previewQuestionForm", model);
    var questionnaire = questionnaireGeneration.buildQuestionnaireFromTemplate(project, model);
    
    var surveyDialog = openMithrilSurveyDialog(questionnaire, finished, " [PREVIEW -- Results not stored]");
    
    function finished(status, surveyResult, wizardPane) {
        console.log("surveyResult", status, surveyResult);
        if (wizardPane) wizardPane.forward();
    }
}
*/

export function previewQuestionForm(contentPane, model, fieldSpecification) {
    console.log("previewQuestionForm", model);
    var questionnaire = questionnaireGeneration.buildQuestionnaireFromTemplate(project, model);
    window["narraFirma_previewQuestionnaire"] = questionnaire;
    
    var w = window.open("survey.html#preview=" + (new Date().toISOString()), "_blank");
}

export var enterSurveyResult = openSurveyDialog;
export var toggleWebActivationOfSurvey = surveyCollection.toggleWebActivationOfSurvey;
export var storyCollectionStop = surveyCollection.storyCollectionStop;
export var importCSVQuestionnaire = csvImportExport.importCSVQuestionnaire;
export var importCSVStories = csvImportExport.importCSVStories;

// Called directly from application
export var importExportOld = importExportClicked;