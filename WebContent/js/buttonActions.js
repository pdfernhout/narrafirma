define([
    "js/panelBuilder/browser",
    "lib/d3/d3",
    "js/panelBuilder/dialogSupport",
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
    d3,
    dialogSupport,
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
        console.log("openSurveyDialog");
        
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
    
    function processCSVContents(contents, callbackForItem) {
        console.log("processCSVContents contents", contents);
        
        var rows = d3.csv.parseRows(contents);
        console.log("rows", rows);
        
        var items = [];
        var header;
        
        for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            var row = rows[rowIndex];
            // Throw away initial blank lines and comment lines
            if (!row.length || !row[0] || row[0].trim().charAt(0) === ";") {
                console.log("comment", row[0]);
            } else {
                if (!header) {
                    header = [];
                    var headerEnded = false;
                    for (var headerIndex = 0; headerIndex < row.length; headerIndex++) {
                        var label = row[headerIndex];
                        if (label) {
                            // Should be an error if header fields are missing but more show up later
                            if (headerEnded) {
                                console.log("ERROR: header has empty field before end");
                                alert("ERROR: header has empty field before end");
                            }
                            header.push(label);
                        } else {
                            headerEnded = true;
                        }
                    }
                } else {
                    var newItem = callbackForItem(header, row);
                    if (newItem) items.push(newItem);
                }
            }
        }
        // console.log("header", header);
        // console.log("items", items);
        return {header: header, items: items};
    }
    
    function processCSVContentsForStories(contents) {
        // Throws away line after header which starts with a blank
        var headerAndItems = processCSVContents(contents, function (header, row) {
            var newItem = {};
            for (var fieldIndex = 0; fieldIndex < header.length; fieldIndex++) {
                var fieldName = header[fieldIndex];
                // TODO: Should the value really be trimmed?
                var value = row[fieldIndex].trim();
                if (newItem[fieldName] === undefined) {
                    newItem[fieldName] = value;
                } else {
                    // Handle case where this is a multiple choice question, which is indicated by multiple columns
                    var data = newItem[fieldName];
                    if (data && typeof data === 'object') {
                        if (value !== "") data[value] = true;
                    } else {
                       var newData = {};
                       if (data !== "") newData[data] = true;
                       if (value !== "") newData[value] = true;
                       newItem[fieldName] = newData;
                    }
                }
            }
            return newItem;
        });
        console.log("processCSVContentsForStories headerAndItems", headerAndItems);
    }
    
    function processCSVContentsForQuestionnaire(contents) {
        var headerAndItems = processCSVContents(contents, function (header, row) {
            console.log("callback", header, row);
            var newItem = {};
            var lastFieldIndex;
            for (var fieldIndex = 0; fieldIndex < row.length; fieldIndex++) {
                var fieldName = header[fieldIndex];
                if (fieldName) {
                    lastFieldIndex = fieldIndex;
                } else {
                    fieldName = header[lastFieldIndex];
                }
                // TODO: Should the value really be trimmed?
                var value = row[fieldIndex].trim();
                console.log("fieldName, value", fieldName, value);
                if (fieldIndex < header.length - 1) {
                    newItem[fieldName] = value;
                } else {
                    // Handle multiple values for last header items
                    var list = newItem[fieldName];
                    console.log("list", list, fieldIndex, fieldName);
                    if (!list) {
                        list = [];
                        newItem[fieldName] = list;
                    }
                    if (value) list.push(value);
                }
            }
            return newItem;
        });
        console.log("processCSVContentsForQuestionnaire headerAndItems", headerAndItems); 
    }
    
    function chooseCSVFileToImport(callback) {
        // console.log("chooseFileToImport");
        var cvsFileUploader = document.getElementById("csvFileLoader");
        // console.log("cvsFileUploader", cvsFileUploader);
        cvsFileUploader.onchange = function() {
            var file = cvsFileUploader.files[0];
            if (!file) {
                return;
            }
            var reader = new FileReader();
            reader.onload = function(e) {
                var contents = e.target.result;
                callback(contents);
            };
            reader.readAsText(file);
        };
        cvsFileUploader.click();
    }
    
    function importCSVStories() {
        chooseCSVFileToImport(processCSVContentsForStories);
    }
    
    function importCSVQuestionnaire() {
        chooseCSVFileToImport(processCSVContentsForQuestionnaire);
    }
    
    function logoutButtonClicked() {
        window.location.href = "/logout";
    }

    return {
        // Call this to set up the project or other needed data
        initialize: initialize,
        
        printStoryForm: printStoryForm,
        copyDraftPNIQuestionVersionsIntoAnswers: copyDraftPNIQuestionVersionsIntoAnswers,
        loadLatestStoriesFromServer: surveyCollection.loadLatestStoriesFromServer,
        enterSurveyResult: openSurveyDialog,
        toggleWebActivationOfSurvey: surveyCollection.toggleWebActivationOfSurvey,
        storyCollectionStop: surveyCollection.storyCollectionStop,
        copyStoryFormURL: copyStoryFormURL,
        guiOpenSection: guiOpenSection,
        importCSVQuestionnaire: importCSVQuestionnaire,
        importCSVStories: importCSVStories,

        // Called directly from application
        importExportOld: importExportClicked,
        helpButtonClicked: helpButtonClicked,
        logoutButtonClicked: logoutButtonClicked
    };
});