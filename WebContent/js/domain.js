"use strict";

// This supports globals shared by modules

define([
    "js/pages/allPagesSummary",
    "dojo/_base/array",
    "exports",
    "dojo/_base/lang",
    "js/storage",
    "dojo/string",
    "js/translate",
    "dojox/uuid/generateRandomUuid",
    "dojo/Stateful",
    "dojox/mvc/StatefulArray"
], function(
    allPagesSummary,
    array,
    exports,
    lang,
    storage,
    string,
    translate,
    uuid,
    Stateful,
    StatefulArray
) {
    var pageDefinitions = {};
    var questions = {};
    var pagesToGoWithHeaders = {};
    
    var projectData = {};
    
    function countNumberOfVenuesChosen(question) {
        return "countNumberOfVenuesChosen UNFINISHED";
    }
    
    function callDashboardFunction(functionName, question) {
        if (functionName === "countNumberOfVenuesChosen") {
            return countNumberOfVenuesChosen(question);
        } else if (functionName === "totalNumberOfSurveyResults") {
            return "<b>" + projectData.surveyResults.allCompletedSurveys.length + "</b>";
        } else {
            console.log("TODO: callDashboardFunction ", functionName, question);
            return "callDashboardFunction UNFINISHED: " + functionName + " for: " + question.id;
        }
    }
    
    // Store page change callback to prevent circular reference when loading domain and question editor
    var pageChangeCallback = null;
    
    function setPageChangeCallback(pageChangeCallbackNewValue) {
        pageChangeCallback = pageChangeCallbackNewValue;
    }
    
    function copyDraftPNIQuestionVersionsIntoAnswers(contentPane, model, id, questionOptions, value) {
        var finalQuestionIDs = ["project_PNIquestions_goal_final", "project_PNIquestions_relationships_final",
                         "project_PNIquestions_focus_final", "project_PNIquestions_range_final",
                         "project_PNIquestions_scope_final", "project_PNIquestions_emphasis_final"];
        
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
        
        var template = translate("copyDraftPNIQuestion_template");
        var message = template.replace("{{copiedAnswersCount}}", copiedAnswersCount);
        alert(message);
    }
    
    // TODO: This needs to be improved for asking multiple questions, maybe spanning multiple pages
    function collectAllSurveyQuestions() {
        var questions = [];

        // TODO: Title, logo
        // TODO: Improve as should be asking multiple questions and storing the results for each one 
        var elicitingQuestionList = projectData.exportedSurveyQuestions.project_elicitingQuestionsList;
        console.log("elicitingQuestionList", elicitingQuestionList);
        var storySolicitationOuestion = "What happened?";
        if (elicitingQuestionList && elicitingQuestionList.length > 0) storySolicitationOuestion = elicitingQuestionList[0].elicitingQuestion_text;
        
        var startText = projectData.exportedSurveyQuestions.questionForm_startText;
        var endText = projectData.exportedSurveyQuestions.questionForm_endText;
        var storyQuestionList = projectData.exportedSurveyQuestions.project_storyQuestionsList;
        var participantQuestionList = projectData.exportedSurveyQuestions.project_participantQuestionsList;
        
        if (startText) questions.push({storyQuestion_shortName: "startText", storyQuestion_text: startText, storyQuestion_type: "label"});
        questions.push({storyQuestion_shortName: "story", storyQuestion_text: storySolicitationOuestion, storyQuestion_type: "textarea"});
        questions.push({storyQuestion_shortName: "name", storyQuestion_text: "Please give your story a name", storyQuestion_type: "text"});
        if (storyQuestionList) questions = questions.concat(storyQuestionList);
        if (participantQuestionList) questions = questions.concat(participantQuestionList);
        if (endText) questions.push({storyQuestion_shortName: "endText", storyQuestion_text: endText, storyQuestion_type: "label"});
        
        // console.log("all survey questions", questions);
        
        var adjustedQuestions = [];
        
        for (var questionIndex in questions) {
            var question = questions[questionIndex];
            // console.log("question", question);
            var shortName = question.storyQuestion_shortName || question.participantQuestion_shortName;
            // Including prefix for question ID so extra translations going with id will not collide with main application IDs
            // TODO: Maybe should include a survey name here in ID?
            var id = "__survey_" + shortName;
            var type = question.storyQuestion_type || question.participantQuestion_type;
            // TODO: What to set for initial values?
            // TODO: Improve how making model...
            // if (!(type in {label: 1, header: 1})) model.set(id, null);
            var prompt = question.storyQuestion_text || question.participantQuestion_text;
            
            var options = [];
            var optionsString = question.storyQuestion_options || question.participantQuestion_options;
            if (optionsString) {
                var splitOptions = optionsString.split("\n");
                // Make sure options don't have leading or trailing space and are not otherwise blank
                for (var index in splitOptions) {
                    var trimmedOption = splitOptions[index].trim();
                    if (trimmedOption) {
                        options.push(trimmedOption);
                    }
                }
            }
            adjustedQuestions.push({type: type, id: id, options: options, shortName: shortName, prompt: prompt});
        }
        
        return adjustedQuestions;
    }
    
    // TODO: How to save the fact we have exported this in the project? Make a copy??? Or keep original in document somewhere? Versus what is returned from server for surveys?
    function finalizeSurvey() {
        var survey = {};
        survey.project_elicitingQuestionsList = projectData.projectAnswers.get("project_elicitingQuestionsList");
        survey.project_storyQuestionsList = projectData.projectAnswers.get("project_storyQuestionsList");
        survey.project_participantQuestionsList = projectData.projectAnswers.get("project_participantQuestionsList");
        survey.questionForm_title = projectData.projectAnswers.get("questionForm_title");
        survey.questionForm_image = projectData.projectAnswers.get("questionForm_image");
        survey.questionForm_startText = projectData.projectAnswers.get("questionForm_startText");
        survey.questionForm_endText = projectData.projectAnswers.get("questionForm_endText"); 
        
        console.log("survey", survey);
        
        // Ensure we have an entire fresh copy
        projectData.exportedSurveyQuestions = JSON.parse(JSON.stringify(survey));
        
        // Validate the survey ids to prevent duplicates and missing ones; ideally this should be done in GUI somehow
        var questions = [].concat(projectData.exportedSurveyQuestions.project_storyQuestionsList, projectData.exportedSurveyQuestions.project_participantQuestionsList);
        var ids = {};
        var createdIDCount = 0;
        for (var index in questions) {
            var question = questions[index];
            if (!question.id) {
                question.id = "question " + (++createdIDCount);
                console.log("SURVEY DESIGN ERROR: question had missing ID and one was assigned", question);
            }
            while (ids[question.id]) {
                // ID already exists
                console.log("SURVEY DESIGN ERROR: duplicate ID", question.id);
                question.id = "question " + (++createdIDCount);
                console.log("SURVEY DESIGN ERROR: question had duplicate ID and a new one was assigned", question);
            }
            ids[question.id] = true;
        }

        console.log("projectData.exportedSurveyQuestions", projectData.exportedSurveyQuestions);
    }
    
    function printStoryForm(contentPane, model, id, questionOptions, value) {
        console.log("printStoryForm unfinished");
        
        alert("unfinished, but finalizing survey for testing...");
        finalizeSurvey();
        
        var questions = collectAllSurveyQuestions();
        
        // TODO: Fix hardcoded questionnaire ID
        storage.storeQuestionnaireVersion('questionnaire-test-001', questions, function(error) {
            if (error) { return alert("Could not store questionnaire"); }
            alert("Store questionnaire as 'test'");
        });
    }
    
    function replaceArrayContents(destination, source) {
        destination.length = 0;
        destination.push.apply(destination, source);
    }
    
    function loadLatestStoriesFromServer(contentPane, model, id, questionOptions, value) {
        console.log("loadLatestStoriesFromServer called");
        storage.loadLatestSurveyResults(function (allEnvelopes, newEnvelopes) {
            // console.log("load survey result", "all", allEntries, "new", newEntries);
            var newEnvelopeCount = 0;
            for (var index in newEnvelopes) {
                var newEnvelopeReference = newEnvelopes[index];
                var newEnvelope = allEnvelopes[newEnvelopeReference];
                if (newEnvelope) {
                    newEnvelopeCount++;
                    var surveyResult = newEnvelope.content;
                    if (surveyResult) {
                        // TODO: Kludge to remove for working with test data
                        if (!surveyResult.id) {
                            // console.log("UUID issue", newEntries[index], surveyResult);
                            // surveyResult.id = uuid();
                            // Use the identifier for the resource the survey is in
                            surveyResult.id = newEnvelopeReference;
                        }
                        projectData.surveyResults.allCompletedSurveys.push(surveyResult);
                    } else {
                        console.log("ERROR: Missing surveyResult in newEnvelope", newEnvelope);
                    }
                } else {
                    console.log("ERROR: Problem reading resourceContent from newEnvelope", newEnvelopeReference);
                }
            }
            
            // Checking on contentPane being set before put up alert in case loading called when load project document
            if (newEnvelopeCount === 0) {
                // TODO: Translate
                if (contentPane) alert("No new survey results were found.");
                return;
            } else {
                // TODO: Translate
                if (contentPane) alert("" + newEnvelopeCount + " new survey result(s) were found.");
            }
            
            // TODO: Only for debugging; need to think through the seperating of stories and general survey data
            // Preserve existing array -- just replace its contents
            replaceArrayContents(projectData.surveyResults.allStories, projectData.surveyResults.allCompletedSurveys);
            
            // TODO: Update GUI count -- ideally should be more selective in updating
            buttonFunctions.updateQuestionsForPageChangeCallback();
        });
    }
      
    var buttonFunctions = {
        "printStoryForm": printStoryForm,
        "copyDraftPNIQuestionVersionsIntoAnswers": copyDraftPNIQuestionVersionsIntoAnswers,
        "loadLatestStoriesFromServer": loadLatestStoriesFromServer,
        // TODO: This next action is filled in by application in main
        "enterSurveyResult": null,
        
        // TODO: Improve this coarse updating so can just update when one function changes
        // GUI should fill this in, and it is used as a callback when items are changed
        "updateQuestionsForPageChangeCallback": null,
    };
    
    // dispatch the button click
    function buttonClicked(contentPane, model, id, questionOptions, value) {
         console.log("buttonClicked", id, questionOptions);
         
         var functionName = id;
         if (questionOptions) {
             functionName = questionOptions[0];
         }
         
         var actualFunction = buttonFunctions[functionName];
         if (!actualFunction) {
             var message = "Unfinished handling for: " + id + " with functionName: " + functionName;
             console.log(message, contentPane, model, id, questionOptions, value);
             alert(message);
             return;
         } else {
             actualFunction(contentPane, model, id, questionOptions, value);
         }
    }

    function calculate_quizScoreResult(model, dependsOn) {
        // console.log("quiz score result", dependsOn);
        var total = 0;
        for (var dependsOnIndex in dependsOn) {
            var questionID = dependsOn[dependsOnIndex];
            // console.log("projectData", projectData);
            var questionAnswer = model.get(questionID);
            var answerWeight = 0;
            if (questionAnswer) {
                // console.log("questionAnswer", questionAnswer);
                answerWeight = questions[questionID].options.indexOf(questionAnswer) - 1;
                // console.log("answerWeight", answerWeight);
                if (answerWeight < 0) answerWeight = 0;
                total += answerWeight;
            } else {
               // Nothing 
            }
            // console.log("questionAnswer", questionID, questionAnswer, answerWeight, total);
        }
        var possibleTotal = dependsOn.length * 3;
        var percent = Math.round(100 * total / possibleTotal);
        var template = translate("calculate_quizScoreResult_template");
        var response = template.replace("{{total}}", total).replace("{{possibleTotal}}", possibleTotal).replace("{{percent}}", percent);
        return "<b>" + response + "</b>";
    }
    
    function labelForQuestion(question) {
        var shortName = translate(question.id + "::shortName", translate(question.id + "::prompt"));
        var separator = ":";
        var lastQuestionCharacter = shortName[shortName.length - 1];
        if (lastQuestionCharacter === "?" || lastQuestionCharacter == "." || lastQuestionCharacter == ")") {
            separator = "<br>";
        } else if (lastQuestionCharacter === ":") {
            separator = " ";
        }
        return shortName + separator;
    }

    function calculate_report(model, headerPageID) {
        var report = "<br><br>";
        var pageList = pagesToGoWithHeaders[headerPageID];
        for (var pageIndex in pageList) {
            // Skip last report page in a section
            if (pageIndex === pageList.length - 1) break;
            var pageID = pageList[pageIndex];
            var pageDefinition = pageDefinitions[pageID];
            if (pageDefinition.type !== "page") continue;
            report += "<div>";
            report += "<i> *** " + translate(pageID + "::title") + "</i>  ***<br><br>";
            var questionsAnsweredCount = 0;
            var questions = pageDefinition.questions;
            for (var questionIndex in questions) {
                var question = questions[questionIndex];
                var value = projectData.projectAnswers.get(question.id);
                if (question.type === "quizScoreResult") {
                    var dependsOn = question.options;
                    value = calculate_quizScoreResult(projectData.projectAnswers, dependsOn);
                    // Don't count these as answered questions
                    questionsAnsweredCount--;
                }
                if (value && value.length !== 0) {
                    // console.log("value", value, value.length);
                    
                    var valueToDisplay = displayStringForValue(question, value, 4);
                    var label = labelForQuestion(question);
                    report += label + " " + valueToDisplay + "</br><br>";
                    questionsAnsweredCount++;
                }
            }
            
            if (questionsAnsweredCount === 0) report += translate("no_questions_answered_on_page");
            report += "</div><br>";
        }
        return report;
    }
    
    function indent(level) {
        // console.log("indent", level);
        var result = "";
        for (var i = 0; i < level; i++) {
            // result += ".";
            result += "&nbsp;";
        }
        return result;
    }
    
    // Recursively calls itself
    function displayStringForValue(question, value, level) {
        // console.log("displayStringForValue", value, level, question);
        // TODO: Translate -- Should translate some answers for some types... But how to know which when when nested?
        var valueToDisplay = "";
        var item;
        var itemDisplay;
        var indentChars;
        if (value instanceof Array) {
            // console.log("array", value);
            //valueToDisplay += "<br>";
            for (var index in value) {
                item = value[index];
                // if (index !== "0") valueToDisplay += "<br>";
                indentChars = indent(level);
                itemDisplay = displayStringForValue(null, item, level);
                // console.log("itemDisplay", itemDisplay);
                valueToDisplay += "<br>" + indentChars + itemDisplay;
            }
            valueToDisplay += "<br>";
        } else if (value.id) {
            // console.log("value with id", value);
            for (var key in value) {
                if (!value.hasOwnProperty(key)) continue;
                if (key === "watchCallbacks") continue;
                if (key === "id") continue;
                item = value[key];
                // TODO: improve how label is calculated when no question, as underscores may not be used consistently in naming fields
                var label = key;
                if (question === null) {
                    var underscorePosition = label.indexOf("_");
                    if (underscorePosition > -1) {
                        label = label.substring(underscorePosition + 1);
                    }
                    label += ": ";
                } else {
                    label = labelForQuestion(question);
                }
                indentChars = indent(level);
                // console.log("label", label);
                itemDisplay = displayStringForValue(null, item, level + 4);
                // console.log("itemDisplay", itemDisplay);
                valueToDisplay += "<br>" + indentChars + label + itemDisplay;
            }
        } else {
            // console.log("regular", value);
            // TODO: Probably need to translate more types, like checkboxes
            if (question !== null && (question.type === "select" || question.type === "radiobuttons")) value = translate(value);
            valueToDisplay += "<b>" + value + "</b>";
        }
        return valueToDisplay;
    }
    
    function setupDomain() {
        projectData.projectAnswers = new Stateful(lang.clone(allPagesSummary.data));
        projectData.exportedSurveyQuestions = {};
        projectData.surveyResults = {};
        projectData.surveyResults.allCompletedSurveys = [];
        projectData.surveyResults.allStories = [];
        
        pagesToGoWithHeaders = lang.clone(allPagesSummary.pagesToGoWithHeaders);
        
        for (var headerPageID in pagesToGoWithHeaders) {
            var pages = pagesToGoWithHeaders[headerPageID];
            for (var pageIndex in pages) {
                var pageID = pages[pageIndex];
                projectData.projectAnswers[pageID + "_pageStatus"] = null;
            }
        }
        
        /*
        for (var fieldName in projectData.projectAnswers) {
            var fieldValue = projectData.projectAnswers[fieldName];
            if (fieldValue instanceof Array) {
                projectData.projectAnswers[fieldName] = new StatefulArray(fieldValue);
            }
        }
        */
        
        console.log("projectData", projectData);
    }
    
    setupDomain();
    
    var exportedFunctions = {
        // data collected
        "projectData": projectData,
        
        // Supporting GUI
        "pagesToGoWithHeaders": pagesToGoWithHeaders,
        "questions": questions,
        "pageDefinitions": pageDefinitions,
        
        // functions called from page widgets
        "setPageChangeCallback": setPageChangeCallback,
        "callDashboardFunction": callDashboardFunction,
        "buttonClicked": buttonClicked,
        "calculate_report": calculate_report,
        "calculate_quizScoreResult": calculate_quizScoreResult,
        "buttonFunctions": buttonFunctions,
        
        // for testing:
        "finalizeSurvey": finalizeSurvey,
        "collectAllSurveyQuestions": collectAllSurveyQuestions
    };
    
    lang.mixin(exports, exportedFunctions);
});