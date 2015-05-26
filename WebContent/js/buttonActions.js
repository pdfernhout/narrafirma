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
        
        var storyCollectionName = getStoryCollectionNameForSelectedStoryCollection("storyCollectionChoice_enterStories");
        if (!storyCollectionName) return;
        
        var questionnaire = getQuestionnaireForSelectedStoryCollection("storyCollectionChoice_enterStories");
        if (!questionnaire) return;

        var surveyDialog = surveyBuilder.openSurveyDialog(questionnaire, finished);
        
        function finished(status, surveyResult, wizardPane) {
            console.log("surveyResult", status, surveyResult);
            if (status === "submitted") {
                
                // TODO: Move this to a reuseable place
                var surveyResultWrapper  = {
                    projectIdentifier: project.projectIdentifier,
                    storyCollectionIdentifier: storyCollectionName,
                    surveyResult: surveyResult
                };
                
                project.pointrelClient.createAndSendChangeMessage("surveyResults", "surveyResult", surveyResultWrapper, null, function(error, result) {
                    if (error) {
                        console.log("Problem saving survey result", error);
                        // TODO: Translate
                        alert("Problem saving survey result; please try submitting again.");
                        return;
                    }
                    alert("Survey result stored");
                    if (wizardPane) wizardPane.forward();
                });
            }
        }
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

    function getStoryCollectionNameForSelectedStoryCollection(storyCollectionChoiceId) {
        /*
         * TODO: Could check first if any story collections have been defined
        var questionnaires = project.projectModel.get("project_questionnaires");
        
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
        
        var questionnaire = questionnaireGeneration.buildQuestionnaire(project, questionnaireName);
        
        if (!questionnaire) {
            // TODO: translate
            alert("The questionnaire selected in the story collection could not be found.");
            return null;
        }
        
        return questionnaire;
    }

    function printStoryForm(contentPane, model, fieldSpecification, value) {
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
    
    function urlForSurvey(storyCollectionName) {
        var href = window.location.href;
        var baseURL = href.substring(0, href.lastIndexOf("/"));
        // TODO: Duplicated project prefix; should refactor to have it in one place
        var projectName = project.journalIdentifier.substring("NarraFirmaProject-".length);
        return baseURL + "/survey.html#project=" + projectName + "&survey=" + storyCollectionName;
    }
    
    function toggleWebActivationOfSurvey(contentPane, model, fieldSpecification, value) {
        var grid = fieldSpecification.grid;
        var selectedItem = grid.getSelectedItem();
        console.log("toggleWebActivationOfSurvey selectedItem", selectedItem, model, fieldSpecification); 
        
        if (selectedItem.storyCollection_activeOnWeb) {
            selectedItem.storyCollection_activeOnWeb = "";
        } else {
            selectedItem.storyCollection_activeOnWeb = urlForSurvey(selectedItem.storyCollection_shortName);
        }
        // broadcast the change to other clients and force grid refresh by recreating entire object
        var storyCollections = model.get(fieldSpecification.id);
        var recreatedData = JSON.parse(JSON.stringify(storyCollections));
        model.set(fieldSpecification.id, recreatedData);
        
        // TODO: Potential window of vulnerability here because not making both changes as a single transaction
        
        // TODO: Updating *all* questionnaires to latest version, which means if others were changed, unexpected things could happen... Should retrieve other saved questionnaires first and reuse them
        
        // Now publish the questionnaires...
        var change = {};
        for (var i = 0; i < storyCollections.length; i++) {
            var storyCollection = storyCollections[i];
            if (!storyCollection.storyCollection_activeOnWeb) continue;
            var questionnaireName = storyCollection.storyCollection_questionnaireIdentifier;
            var questionnaire = questionnaireGeneration.buildQuestionnaire(project, questionnaireName);
            if (!questionnaire) {
                console.log("Could not find questionnnaire for", questionnaireName);
                continue;
            }
            change[storyCollection.storyCollection_shortName] = questionnaire;
        }
        project.pointrelClient.createAndSendChangeMessage("questionnaires", "questionnairesMessage", change, null, function(error, result) {
            if (error) {
                // TODO: Translate
                alert("Problem activating/deactivating web survey");
                return;
            }
            alert("Web survey status changed");
        });
    }

    return {
        // Call this to set up the project or other needed data
        initialize: initialize,
        
        "printStoryForm": printStoryForm,
        "copyDraftPNIQuestionVersionsIntoAnswers": copyDraftPNIQuestionVersionsIntoAnswers,
        "loadLatestStoriesFromServer": surveyCollection.loadLatestStoriesFromServer,
        "enterSurveyResult": openSurveyDialog,
        "toggleWebActivationOfSurvey": toggleWebActivationOfSurvey,
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