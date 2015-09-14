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
import storyCardDisplay = require("./storyCardDisplay");
import generateRandomUuid = require("./pointrel20150417/generateRandomUuid");
import toaster = require("./panelBuilder/toaster");
import ClientState = require("./ClientState");
// import m = require("mithril");

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
    console.log("helpButtonClicked", pageSpecification);
    if (!pageSpecification) {
        console.log("no pageSpecification for current page");
        return;
    }
    
    var helpURL = 'help/' + pageSpecification.section + "/help_" + pageSpecification.id + '.html';
    
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

// Library for saving files, imported by narrafirma.html
declare var saveAs;

function addCSVOutputLine(output, line) {
    console.log("line", line);
    var start = true;
    line.forEach(function (item) {
        console.log("item", item);
        if (start) {
            start = false;
        } else {
            output += ",";
        }
        if (item && item.indexOf(",") !== -1) {
            item = item.replace(/"/g, '""');
            item = '"' + item + '"';
        }
        output += item;
    });
    output += "\n";
    return output;
}

var exportQuestionTypeMap = {
    "checkboxes": "Multiple choice",
    "select": "Single choice",
    "slider": "Scale",
    "boolean": "Boolean",
    "radiobuttons": "Radiobuttons",
    "text": "Text",
    "textarea": "Textarea"
};

export function exportQuestionnaire() {
    var storyCollectionIdentifier = clientState.storyCollectionIdentifier;
    
    console.log("exportStoryCollection", storyCollectionIdentifier);
    var currentQuestionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionIdentifier);
    console.log("exportQuestionnaire", currentQuestionnaire);
    
    // Order Long name   Short name  Type    About   Answers
    var output = "";
    var lineIndex = 1;
    function addOutputLine(line) {
        output = addCSVOutputLine(output, line);
    }
    
    var header = ["Order", "Long name", "Short name", "Type", "About", "Answers"];
    addOutputLine(header);
    
    var elicitingLine = ["1", "Eliciting question", "Eliciting question", "Eliciting question", "eliciting"];
    currentQuestionnaire.elicitingQuestions.forEach(function (elicitingQuestionSpecification) {
        elicitingLine.push(elicitingQuestionSpecification.id + "|" + elicitingQuestionSpecification.text);
    });
    addOutputLine(elicitingLine);
    
    function dataForQuestions(questions, about) {
        for (var i = 0; i < questions.length; i++) {
            var outputLine = [];
            var question = questions[i];
            outputLine.push("" + (++lineIndex));
            outputLine.push(question.displayPrompt);
            outputLine.push(question.displayName);
            var questionType = exportQuestionTypeMap[question.displayType];
            if (!questionType) {
                console.log("EXPORT ERROR: unsupported question type: ", question.displayType);
                questionType = "UNSUPPORTED:" + question.displayType;
            }
            outputLine.push(questionType);
            outputLine.push(about);
            if (question.valueOptions) {
               question.valueOptions.forEach(function(option) {
                   outputLine.push(option);   
               });
            }
            addOutputLine(outputLine);
        }
    }
    
    dataForQuestions(currentQuestionnaire.storyQuestions, "story");
    dataForQuestions(currentQuestionnaire.participantQuestions, "participant");
    
     // Export questionnaire
    var questionnaireBlob = new Blob([output], {type: "text/csv;charset=utf-8"});
    // TODO: This seems to clear the console in FireFox 40; why?
    saveAs(questionnaireBlob, "export_story_form_" + storyCollectionIdentifier + ".csv");
}

export function exportStoryCollection() {
    var storyCollectionIdentifier = clientState.storyCollectionIdentifier;
    
    console.log("exportStoryCollection", storyCollectionIdentifier);
    var currentQuestionnaire = surveyCollection.getQuestionnaireForStoryCollection(storyCollectionIdentifier);
    console.log("currentQuestionnaire", currentQuestionnaire);

    var allStories = surveyCollection.getStoriesForStoryCollection(storyCollectionIdentifier, true);
    console.log("allStories", allStories);
    
    var header1 = [];
    var header2 = [];
      
    function header(contents, secondHeader = "") {
        header1.push(contents);
        header2.push(secondHeader);
    }
    
    // Put initial header
    header("Story title");
    header("Story text");
    header("Eliciting question");
    
    function headersForQuestions(questions) {
        for (var i = 0; i < questions.length; i++) {
            var storyQuestion = questions[i];
            // TODO: Maybe should export ID instead? Or more header lines with ID and prompt?
            if (storyQuestion.valueOptions && storyQuestion.displayType === "checkboxes") {
               storyQuestion.valueOptions.forEach(function(option) {
                   header(storyQuestion.displayName, option);   
               });
            } else {
                header(storyQuestion.displayName);
            }
        }
    }
    
    headersForQuestions(currentQuestionnaire.storyQuestions);
    headersForQuestions(currentQuestionnaire.participantQuestions);
    
    console.log("header1", header1);
    console.log("header2", header2);
    
    var output = "";
    function addOutputLine(line) {
        output = addCSVOutputLine(output, line);
    }
    
    addOutputLine(header1);
    addOutputLine(header2);
    
    function dataForQuestions(questions, story: surveyCollection.Story, outputLine) {
        for (var i = 0; i < questions.length; i++) {
            var question = questions[i];
            var value = story.fieldValue(question.id);
            if (question.valueOptions && question.displayType === "checkboxes") {
               question.valueOptions.forEach(function(option) {
                   outputLine.push(value[option] ? option : "");   
               });
            } else {
                outputLine.push(value);
            }
        }
    }
    
    allStories.forEach(function (story) {
        var outputLine = [];
        outputLine.push(story.storyName());
        outputLine.push(story.storyText());
        outputLine.push(story.elicitingQuestion());
        dataForQuestions(currentQuestionnaire.storyQuestions, story, outputLine);
        dataForQuestions(currentQuestionnaire.participantQuestions, story, outputLine);
        addOutputLine(outputLine);
    }); 
    
    // Testing
    //var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
    //saveAs(blob, "hello world.csv");
    
    // Export story collection
    var storyCollectionBlob = new Blob([output], {type: "text/csv;charset=utf-8"});
    // TODO: This seems to clear the console in FireFox 40; why?
    saveAs(storyCollectionBlob, "export_story_collection_" + storyCollectionIdentifier + ".csv");
}

// Caller should call wizard.forward() on successful save to see the last page, and provide a retry message otherwise
// Caller may also want to call (the returned) surveyDialog.hide() to close the window, or let the user do it.
function openMithrilSurveyDialog(questionnaire, callback, previewModeTitleText = null) {  
    console.log("openSurveyDialog questionnaire", questionnaire);
   
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
    console.log("openSurveyDialog");
    
    var storyCollectionIdentifier: string = clientState.storyCollectionIdentifier();
    
    if (!storyCollectionIdentifier) {
        // TODO: translate
        alert("Please select a story collection first.");
        return null;
    }

    var questionnaire = getQuestionnaireForStoryCollection(storyCollectionIdentifier);
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

export function guiOpenSection(model, fieldSpecification, value) {
    var section = fieldSpecification.displayConfiguration.section;
    console.log("guiOpenSection", section, fieldSpecification);
    
    // Don't queue an extra redraw as one is already queued since this code get called by a button press
    var isRedrawAlreadyQueued = true;
    pageDisplayer.showPage(section, false, isRedrawAlreadyQueued);
}

function generateBoilerplateHTML(title, stylesheet) {
    var output = "";
    output += "<!DOCTYPE html>\n";
    output += "<head>\n";
    output += "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n";
    output += "<title>" + title + "</title>\n";
    output += "<link rel=\"stylesheet\" href=\"" + stylesheet + "\">\n";
    output += "</head>\n\n";
    output += "<body>\n";
    
    return output;
}

function generateHTMLForQuestionnaire(questionnaire) {
     
    // CFK started on this, but it should be finished with the mithril thing so not finishing
    var output = generateBoilerplateHTML(questionnaire.title, "/css/survey.css");
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

function getQuestionnaireForStoryCollection(storyCollectionName: string) {
    var storyCollection = project.findStoryCollection(storyCollectionName);
    
    if (!storyCollection) {
        // TODO: translate
        alert("The selected story collection could not be found.");
        return null;
    }
    
    var questionnaireName = project.tripleStore.queryLatestC(storyCollection, "storyCollection_questionnaireIdentifier");
    
    if (!questionnaireName) {
        // TODO: translate
        alert("The story collection has no selection for a questionnaire.");
        return null;
    }
    
    var questionnaire = project.tripleStore.queryLatestC(storyCollection, "questionnaire");
    
    if (!questionnaire) {
        // TODO: translate
        alert("The questionnaire selected in the story collection could not be found.");
        return null;
    }
    
    return questionnaire;
}

export function printStoryForm(model, fieldSpecification, value) {
    console.log("printStoryForm unfinished");
    
    var storyCollectionIdentifier: string = clientState.storyCollectionIdentifier();
    
    if (!storyCollectionIdentifier) {
        // TODO: translate
        alert("Please select a story collection first.");
        return null;
    }

    var questionnaire = getQuestionnaireForStoryCollection(storyCollectionIdentifier);
    if (!questionnaire) return;
    
    var output = generateHTMLForQuestionnaire(questionnaire);
    
    printHTML(output);
}

function printHTML(htmlToPrint) {
    console.log(printHTML, htmlToPrint);
    var w = window.open();
    w.document.write(htmlToPrint);
    w.document.close();
    // w.print();
    // w.close();
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
    var template = translate("#copyDraftPNIQuestion_template", "Copied {{copiedAnswersCount}} answers\nNote that blank draft answers are not copied; non-blank final answers are not replaced");
    var message = template.replace("{{copiedAnswersCount}}", copiedAnswersCount);
    alert(message);
}

export function logoutButtonClicked() {
    if (confirm("Logout?")) {
        var isWordPressAJAX = !!window["ajaxurl"];
        if (isWordPressAJAX) {
            window.location.href = window.location.href.split("wp-content")[0] + "wp-login.php?action=logout";
        } else {
            window.location.href = "/logout";
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
    console.log("previewQuestionForm", model);
    var questionnaire = questionnaireGeneration.buildQuestionnaireFromTemplate(project, model);
    window["narraFirma_previewQuestionnaire"] = questionnaire;
    
    var w = window.open("survey.html#preview=" + (new Date().toISOString()), "_blank");
}

export function printStoryCards() {
    console.log("printStoryCards");
    
    if (!clientState.storyCollectionIdentifier) {
        alert("Please select a story collection for which to print story cards");
        return;
    }
    
    var allStoriesInStoryCollection = surveyCollection.getStoriesForStoryCollection(clientState.storyCollectionIdentifier);
    console.log("allStoriesInStoryCollection", allStoriesInStoryCollection);
    
    var output = generateBoilerplateHTML("Story cards for: " + clientState.storyCollectionIdentifier, "/css/standard.css");
    
    for (var storyIndex = 0; storyIndex < allStoriesInStoryCollection.length; storyIndex++) {
        var storyModel = allStoriesInStoryCollection[storyIndex];
        var storyContent = storyCardDisplay.generateStoryCardContent(storyModel, storyModel.questionnaire(), {storyTextAtTop: true});
        
        output += '<div class="storyCardForPrinting">';
        output += storyContent;
        output += '</div>';
    }
    
    output += "</body></html>";
    
    printHTML(output);
}

export function printCatalysisReport() {
    var catalysisReportIdentifier = clientState.catalysisReportIdentifier;
    console.log("printCatalysisReport", catalysisReportIdentifier);
    
    if (!catalysisReportIdentifier) {
        alert("Please pick a catalysis report to print.");
        return;
    }
    
    // project_catalysisReports
    // catalysisReport_shortName
}

export function copyInterpretationsToClusteringDiagram() {
    // TODO: Finish this
    var shortName = clientState.catalysisReportIdentifier;
    console.log("copyInterpretationsToClusteringDiagram", shortName);
    
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
    console.log("observationSetIdentifier", observationSetIdentifier);
    
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
    
    console.log("allInterpretations", allInterpretations);
    
    if (!confirm("Copy intepretations for this catalysys report into clustering diagram?")) return;
    
    var clusteringDiagram = project.tripleStore.queryLatestC(shortName, "interpretationsClusteringDiagram");
    
    console.log("clusteringDiagram before", clusteringDiagram);
    
    if (!clusteringDiagram) {
        // TODO: This shoudl be done by clustering diagram library -- redundant code
        clusteringDiagram = {
            surfaceWidthInPixels: 800,
            surfaceHeightInPixels: 500,
            items: [],
            changesCount: 0
        };
    }
    
    var existingItemNames = {};
    
    clusteringDiagram.items.forEach((item) => {
        existingItemNames[item.text] = true;
    });
    
    var addedItemCount = 0;
    var shiftPerItem = 3;
    
    allInterpretations.forEach((interpretation) => {
        if (!existingItemNames[interpretation.name]) {
            addedItemCount++;
            clusteringDiagram.items.push({
                text: interpretation.name,
                "type": "item",
                url: interpretation.text,
                uuid: generateRandomUuid(),
                x: 100 + addedItemCount * shiftPerItem,
                y: 100 + addedItemCount * shiftPerItem
            });
        }
    });

    console.log("clusteringDiagram after", clusteringDiagram);
    
    project.tripleStore.addTriple(shortName, "interpretationsClusteringDiagram", clusteringDiagram);

    toaster.toast("Added " + addedItemCount + " interpretations");
}

export var enterSurveyResult = openSurveyDialog;
export var toggleWebActivationOfSurvey = surveyCollection.toggleWebActivationOfSurvey;
export var storyCollectionStop = surveyCollection.storyCollectionStop;
export var importCSVQuestionnaire = csvImportExport.importCSVQuestionnaire;
export var importCSVStories = csvImportExport.importCSVStories;

// Called directly from application
export var importExportOld = importExportClicked;