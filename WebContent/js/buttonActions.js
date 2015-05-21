define([
    "js/panelBuilder/browser",
    "js/panelBuilder/dialogSupport",
    "js/domain",
    "js/modelUtility",
    "js/navigationPane",
    "js/pageDisplayer",
    "js/questionnaireGeneration",
    "js/surveyBuilder",
    "js/surveyCollection",
    "js/panelBuilder/toaster",
    "js/panelBuilder/translate",
    "dojo/domReady!"
], function(
    browser,
    dialogSupport,
    domain,
    modelUtility,
    navigationPane,
    pageDisplayer,
    questionnaireGeneration,
    surveyBuilder,
    surveyCollection,
    toaster,
    translate
){
    "use strict";
    
    var project;
    
    function initialize(theProject) {
        project = theProject;
    }
 
    function helpButtonClicked() {
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

    function debugButtonClicked() {
        console.log("debug domain surveyCollection", domain, surveyCollection);
    }

    function importButtonClicked(projectDefinitionText, hideDialogMethod) {
        console.log("importButtonClicked", projectDefinitionText);
        
        // TODO: Fix this
        throw new Error("No longer working due to ongoing refactoring for current page model");

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
    }

    function importExportClicked() {
        console.log("importExportClicked");
        throw new Error("No longer working due to ongoing refactoring for current page model");
        var projectDefinitionText = JSON.stringify(domain.projectAnswers, null, 2);
        dialogSupport.openTextEditorDialog(projectDefinitionText, "#projectImportExportDialog_title|Project Import/Export", "#projectImportExportDialog_okButtonText|OK", importButtonClicked);
    }

    function openSurveyDialog() {
        // TODO: What version of questionnaire should be used? Should it really be the latest one? Or the one active on server?
        console.log("openSurveyDialog domain", domain);
        var questionnaire = domain.currentQuestionnaire;
        
        if (!questionnaire) {
            // TODO: Translate
            alert("No current questionnaire has been finalized");
            return;
        }

        surveyBuilder.openSurveyDialog(questionnaire);
    }

    ///////// Button functions

    function copyStoryFormURL() {
        alert("Story form URL is: " + "http://localhost:8080/survey.html");
    }

    function guiOpenSection(contentPane, model, fieldSpecification, value) {
        var section = fieldSpecification.displayConfiguration.section;
        console.log("guiOpenSection", section, fieldSpecification);
        pageDisplayer.showPage(section);
    }
    
    function generateHTMLForQuestionnaire(questionnaire) {
        // var htmlToPrint = "<b>Test</b><br>This is a questionnaire for: <pre>" + JSON.stringify(questionnaire, null, 4) + "</pre>";
        
        var output = "";
        
        // output += htmlToPrint;
        
        output += "<h2>" + questionnaire.title + "</h2>";
        
        output += "<br><br>";
        
        output += questionnaire.startText;
        
        output += "<br><br>";
        
        // TODO: Translate
        
        output += "Please select one for the following questions to answer:<br><br>";
        
        questionnaire.elicitingQuestions.forEach(function (elicitingQuestion) {
            output += elicitingQuestion.text + "<br><br>";
        });
        
        output += "Please enter your response here:<br><br>";
        
        for (var i = 0; i < 7; i++) output += "<br><br>";
       
        questionnaire.storyQuestions.forEach(function (storyQuestion) {
            output += storyQuestion.displayPrompt + "<br>";
        });
        
        // TODO: Print choices...
       
        questionnaire.participantQuestions.forEach(function (participantQuestion) {
            output += participantQuestion.displayPrompt + "<br>";
        });
        
        // TODO: Print choices...
        
        output += "<br><br>";
        
        output += questionnaire.endText;
        
        return output;
    }

    function printStoryForm(contentPane, model, fieldSpecification, value) {
        console.log("printStoryForm unfinished");
        
        var questionnaires = project.projectModel.get("project_questionnaires");
        
        if (questionnaires.length === 0) {
            // TODO: Translate
            alert("No questionnaires have been defined");
            return;
        }
        
        var columns = {questionForm_shortName: "Questionnaire name", questionForm_title: "Title"};
        dialogSupport.openListChoiceDialog(null, questionnaires, columns, "Projects", "Select a questionnaire to print", function (questionnaireTemplate) {
            console.log("chosen questionnaire", questionnaireTemplate);
            
            var questionnaire = questionnaireGeneration.buildQuestionnaire(project, questionnaireTemplate.questionForm_shortName);
            
            var output = generateHTMLForQuestionnaire(questionnaire);
            
            var outputLabel = pageDisplayer.getCurrentPageWidgets()["printQuestionsForm_output"];
            console.log("outputLabel", outputLabel);
            
            outputLabel.set("content", output);
            // contentPane printQuestionsForm_output 
            // printHTML(output);
        });
    }
    
    function printHTML(htmlToPrint) {
        var w = window.open();
        w.document.write(htmlToPrint);
        w.print();
        w.close();
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
            var finalValue = model.get(finalQuestionID);
            if (!finalValue) {
                var draftValue = model.get(draftQuestionID);
                if (draftValue) {
                    model.set(finalQuestionID, draftValue);
                    copiedAnswersCount++;
                }
            }
        }

        return copiedAnswersCount;
    }

    function copyDraftPNIQuestionVersionsIntoAnswers() {
        var copiedAnswersCount = copyDraftPNIQuestionVersionsIntoAnswers_Basic();
        var template = translate("#copyDraftPNIQuestion_template", "Copied {{copiedAnswersCount}} answers\nNote that blank draft answers are not copied; non-blank final answers are not replaced");
        var message = template.replace("{{copiedAnswersCount}}", copiedAnswersCount);
        alert(message);
    }
    
    function logoutButtonClicked() {
        window.location.href = "/logout";
    }

    return {
        // Call this to set up the project or other needed data
        initialize: initialize,
        
        "printStoryForm": printStoryForm,
        "copyDraftPNIQuestionVersionsIntoAnswers": copyDraftPNIQuestionVersionsIntoAnswers,
        "loadLatestStoriesFromServer": surveyCollection.loadLatestStoriesFromServer,
        "enterSurveyResult": openSurveyDialog,
        "storyCollectionStart": surveyCollection.storyCollectionStart,
        "storyCollectionStop": surveyCollection.storyCollectionStop,
        "copyStoryFormURL": copyStoryFormURL,
        "guiOpenSection": guiOpenSection,

        // Called directly from application
        "importExportOld": importExportClicked,
        "helpButtonClicked": helpButtonClicked,
        "debugButtonClicked": debugButtonClicked,
        logoutButtonClicked: logoutButtonClicked
    };
});