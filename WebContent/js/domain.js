// This supports globals shared by modules

define([
    "exports",
    "dojo/_base/lang",
    "dojo/Stateful",
    "js/storage",
    "dojo/topic",
    "js/panelBuilder/translate"
], function(
    exports,
    lang,
    Stateful,
    storage,
    topic,
    translate
) {
    "use strict";
    
    // TODO: panelDefinitions probably should not be in domain
    var panelDefinitions = {};
    var questions = {};
    var childPageIDListForHeaderID = {};
    
    var projectData = {};
    
    // TODO: Fix hardcoded questionnaire ID
    var questionnaireID = 'questionnaire-test-003';
    
    // TODO: When does this get updated?
    var questionnaireStatus = {questionnaireID: questionnaireID, active: false};
    
    // Panel builder "functionResult" components will get routed through here to calculate their text.
    // The domain should publish a topic with the same name as these functions when their value changes.
    function calculateFunctionResultForGUI(functionName, question) {
        if (functionName === "totalNumberOfSurveyResults") {
            return projectData.surveyResults.allCompletedSurveys.length;
        } else if (functionName === "isStoryCollectingEnabled") {
            return isStoryCollectingEnabled(question);
        } else {
            console.log("TODO: calculateFunctionResultForGUI ", functionName, question);
            return "calculateFunctionResultForGUI UNFINISHED: " + functionName + " for: " + question.id;
        }
    }
    
    function copyDraftPNIQuestionVersionsIntoAnswers() {
        var model = projectData.projectAnswers;
            
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
    
    function ensureUniqueQuestionIDs(usedIDs, editorQuestions) {
        // Validate the survey ids to prevent duplicates and missing ones; ideally this should be done in GUI somehow
        for (var index in editorQuestions) {
            var editorQuestion = editorQuestions[index];
            if (!editorQuestion.id) {
                editorQuestion.id = "question " + (++(usedIDs.__createdIDCount));
                console.log("SURVEY DESIGN ERROR: question had missing ID and one was assigned", editorQuestion);
            }
            while (usedIDs[editorQuestion.id]) {
                // ID already exists
                console.log("SURVEY DESIGN ERROR: duplicate ID", editorQuestion.id);
                editorQuestion.id = "question " + (++(usedIDs.__createdIDCount));
                console.log("SURVEY DESIGN ERROR: question had duplicate ID and a new one was assigned", editorQuestion);
            }
            usedIDs[editorQuestion.id] = true;
        }
    }
    
    function convertEditorQuestions(editorQuestions) {
        var adjustedQuestions = [];
        
        for (var questionIndex in editorQuestions) {
            var question = editorQuestions[questionIndex];
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
            adjustedQuestions.push({type: type, id: id, dataOptions: options, displayName: shortName, displayPrompt: prompt});
        }
        
        return adjustedQuestions;
    }
    
    // TODO: How to save the fact we have exported this in the project? Make a copy??? Or keep original in document somewhere? Versus what is returned from server for surveys?
    // TODO: This needs to be improved for asking multiple questions, maybe spanning multiple pages
    function getCurrentQuestionnaire() {
        var usedIDs = {};
        usedIDs.__createdIDCount = 0;

        // TODO: Title, logo
        // TODO: Improve as should be asking multiple questions and storing the results for each one 
        var questionnaire = {
                __type: "org.workingwithstories.Questionnaire"
        };
        
        questionnaire.title = projectData.projectAnswers.get("questionForm_title");
        questionnaire.image = projectData.projectAnswers.get("questionForm_image");
        questionnaire.startText = projectData.projectAnswers.get("questionForm_startText");
        questionnaire.endText = projectData.projectAnswers.get("questionForm_endText"); 

        var elicitingQuestions = projectData.projectAnswers.get("project_elicitingQuestionsList");
        console.log("elicitingQuestions", elicitingQuestions);
        
        var storyQuestions = projectData.projectAnswers.get("project_storyQuestionsList");
        ensureUniqueQuestionIDs(usedIDs, storyQuestions);
        
        var participantQuestions = projectData.projectAnswers.get("project_participantQuestionsList");
        ensureUniqueQuestionIDs(usedIDs, participantQuestions);
        
        // console.log("survey", survey);
        
        // Ensure we have an entire fresh copy
        // projectData.exportedSurveyQuestions = JSON.parse(JSON.stringify(survey));
        // console.log("projectData.exportedSurveyQuestions", projectData.exportedSurveyQuestions);
            
        questionnaire.elicitingQuestions = [];
        for (var elicitingQuestionIndex in elicitingQuestions) {
            var storySolicitationQuestionText = elicitingQuestions[elicitingQuestionIndex].elicitingQuestion_text;
            // TODO: var storySolicitationQuestionShortName = elicitingQuestions[elicitingQuestionIndex].elicitingQuestion_shortName;
            var storySolicitationQuestionType = elicitingQuestions[elicitingQuestionIndex].elicitingQuestion_type;
            var elicitingQuestionInfo = {
                text: storySolicitationQuestionText,
                // TODO: id: storySolicitationQuestionShortName,
                type: storySolicitationQuestionType
            };
            questionnaire.elicitingQuestions.push(elicitingQuestionInfo);
        }
        
        /*
        if (startText) questions.push({storyQuestion_shortName: "startText", storyQuestion_text: startText, storyQuestion_type: "label"});
        questions.push({storyQuestion_shortName: "story", storyQuestion_text: storySolicitationQuestion, storyQuestion_type: "textarea"});
        questions.push({storyQuestion_shortName: "name", storyQuestion_text: "Please give your story a name", storyQuestion_type: "text"});
        if (storyQuestionList) questions = questions.concat(storyQuestionList);
        if (participantQuestionList) questions = questions.concat(participantQuestionList);
        if (endText) questions.push({storyQuestion_shortName: "endText", storyQuestion_text: endText, storyQuestion_type: "label"});
        */
        
        // console.log("all survey questions", questions);
        
        questionnaire.storyQuestions = convertEditorQuestions(storyQuestions);
        questionnaire.participantQuestions = convertEditorQuestions(participantQuestions);
           
        console.log("getCurrentQuestionnaire result", questionnaire);
        return questionnaire;
    }
    
    function ensureAtLeastOneElicitingQuestion(questionnaire) {
        // TODO: How to prevent this potential problem of no eliciting questions during questionnaire design in GUI?
        if (questionnaire.elicitingQuestions.length === 0) {
            // TODO: Translate
            var message = "No eliciting questions were defined! Adding one with 'What happened?' for testing.";
            console.log("PROBLEM", message);
            console.log("Adding an eliciting question for testing", message);
            var testElicitingQuestionInfo = {
                text: "What happened?",
                id: "what happened",
                type: {"what happened": true}
            };
            questionnaire.elicitingQuestions.push(testElicitingQuestionInfo);
        }
    }
    
    // Can also just pass in callback as first arg, rest are unused and are for compatibility with GUI calling system
    function loadLatestStoriesFromServer(contentPane, model, fieldSpecification, value, callback) {
        console.log("loadLatestStoriesFromServer called");
        if (lang.isFunction(contentPane)) callback = contentPane;
        
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
            
            if (newEnvelopeCount === 0) {
                console.log("loadLatestStoriesFromServer: No new survey results were found.");
                topic.publish("loadLatestStoriesFromServer", newEnvelopeCount, null);
                return;
            } else {
                console.log("loadLatestStoriesFromServer: There were " + newEnvelopeCount + " new survey result(s) found.");
            }
            
            // TODO: Only for debugging; need to think through the separating of stories and general survey data
            // Preserve existing array -- just replace its contents
            var allStories = projectData.surveyResults.allStories;
            while (allStories.length > 0) {
                allStories.pop();
            }
            for (var responseIndex in projectData.surveyResults.allCompletedSurveys) {
                var response = projectData.surveyResults.allCompletedSurveys[responseIndex];
                for (var storyIndex in response.stories) {
                    var story = response.stories[storyIndex];
                    console.log("=== story", story);
                    allStories.push(story);
                }
            }
            
            console.log("===== All stories", allStories);
            
            if (callback) callback(newEnvelopeCount);
            
            // Tell any listeners like story browsers that there are more stories
            topic.publish("loadLatestStoriesFromServer", newEnvelopeCount, allStories);
            topic.publish("totalNumberOfSurveyResults", allEnvelopes.length);
        });
    }
    
    function getParticipantDataForParticipantID(participantID) {
        // TODO: Maybe optimize as a lookup map maintained when read in survey results
        for (var responseIndex in projectData.surveyResults.allCompletedSurveys) {
            var response = projectData.surveyResults.allCompletedSurveys[responseIndex];
            if (response.participantData._participantID === participantID) {
                console.log("getParticipantDataForParticipantID", participantID, response.participantData);
                return response.participantData;
            }
        }
        
        console.log("ERROR getParticipantDataForParticipantID: participantID not found", participantID);
        return {};
    }
        
    function storyCollectionStart() {
        alert("also finalizing survey for testing...");
        
        var questionnaire = getCurrentQuestionnaire();
        questionnaire.questionnaireID = questionnaireID;
        
        ensureAtLeastOneElicitingQuestion(questionnaire);
        
        storage.storeQuestionnaireVersion(questionnaireID, questionnaire, function(error) {
            if (error) { return alert("Could not store questionnaire"); }
            alert("Store questionnaire as:" + questionnaireID);
        });
        
        var status = {questionnaireID: questionnaireID, active: true};
        storage.storeQuestionnaireStatus(questionnaireID, status, function(error) {
            console.log("Activated questionnaire", questionnaireID);
            questionnaireStatus = {questionnaireID: questionnaireID, active: true};
            topic.publish("isStoryCollectingEnabled", questionnaireStatus);
        });
    }
    
    function storyCollectionStop() {
        var status = {questionnaireID: questionnaireID, active: false};
        storage.storeQuestionnaireStatus(questionnaireID, status, function(error) {
            console.log("Deactivated questionnaire", questionnaireID);
            questionnaireStatus = {questionnaireID: questionnaireID, active: false};
            topic.publish("isStoryCollectingEnabled", questionnaireStatus);
        });
    }
    
    function isStoryCollectingEnabled(question) {
        return questionnaireStatus.active;
    }
    
    function calculate_quizScoreResult(model, dependsOn) {
        // console.log("quiz score result", dependsOn);
        var total = 0;
        for (var dependsOnIndex = 0; dependsOnIndex < dependsOn.length; dependsOnIndex++) {
            var questionID = dependsOn[dependsOnIndex];
            // console.log("projectData", projectData);
            var questionAnswer = model.get(questionID);
            var answerWeight = 0;
            if (questionAnswer) {
                // console.log("questionAnswer", questionAnswer);
                var choices = questions[questionID].dataOptions;
                answerWeight = choices.indexOf(questionAnswer) - 1;
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
        var template = translate("#calculate_quizScoreResult_template");
        var response = template.replace("{{total}}", total).replace("{{possibleTotal}}", possibleTotal).replace("{{percent}}", "" + percent);
        return "<b>" + response + "</b>";
    }
    
    function labelForQuestion(question) {
        var shortName = translate(question.id + "::shortName", "");
        if (!shortName) shortName = translate(question.id + "::prompt", "");
        if (!shortName) shortName = question.displayName;
        if (!shortName) shortName = question.displayPrompt;
        if (!shortName) {
            console.log("Missing translation of label for question", question.id, question);
            shortName = question.id;
        }
        var separator = ":";
        var lastQuestionCharacter = shortName[shortName.length - 1];
        if (lastQuestionCharacter === "?" || lastQuestionCharacter === "." || lastQuestionCharacter === ")") {
            separator = "<br>";
        } else if (lastQuestionCharacter === ":") {
            separator = " ";
        }
        return shortName + separator;
    }

    function calculate_report(model, headerPageID) {
        // console.log("domain calculate_report", model, headerPageID);
        var report = "<br><br>";
        var pageList = childPageIDListForHeaderID[headerPageID];
        // console.log("page list", pageList, headerPageID, childPageIDListForHeaderID);
        for (var pageIndex in pageList) {
            // Skip last report page in a section
            if (pageIndex === pageList.length - 1) break;
            var pageID = pageList[pageIndex];
            var panelDefinition = panelDefinitions[pageID];
            if (!panelDefinition) {
                console.log("ERROR: Missing panelDefinition for pageID:", pageID);
                continue;
            }
            if (panelDefinition.displayType !== "page") continue;
            report += "<div>";
            report += "<i> *** " + translate(pageID + "::title", panelDefinition.displayName) + "</i>  ***<br><br>";
            var questionsAnsweredCount = 0;
            var questions = panelDefinition.questions;
            for (var questionIndex in questions) {
                var question = questions[questionIndex];
                var value = projectData.projectAnswers.get(question.id);
                if (question.displayType === "quizScoreResult") {
                    var dependsOn = question.displayConfiguration;
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
            
            if (questionsAnsweredCount === 0) report += translate("#no_questions_answered_on_page");
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
            if (question !== null && (question.displayType === "select" || question.displayType === "radiobuttons")) value = translate(value, value);
            valueToDisplay += "<b>" + value + "</b>";
        }
        return valueToDisplay;
    }
    
    // Application should call this at startup
    function setupDomain(fieldSpecificationCollection) {
        var model = fieldSpecificationCollection.buildModel("ProjectModel");
        projectData.projectAnswers = new Stateful(model);
        projectData.exportedSurveyQuestions = {};
        projectData.surveyResults = {};
        projectData.surveyResults.allCompletedSurveys = [];
        projectData.surveyResults.allStories = [];
        
        var pages = fieldSpecificationCollection.buildListOfPages();
        
        for (var pageIndex = 0; pageIndex < pages.length; pageIndex++) {
            var page = pages[pageIndex];
            if (!page.isHeader) {
                var pageID = page.id;
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
    
    function determineStatusOfCurrentQuestionnaire() {
        storage.loadLatestQuestionnaireStatus(questionnaireID, function(error, status, envelope) {
            if (error) {return console.log("Could not determine questionnaire status; assuming inactive", questionnaireID);}
            console.log("got questionnaire status", status);
            questionnaireStatus = status;
            topic.publish("isStoryCollectingEnabled", questionnaireStatus);
        });
    }
    
    var exportedFunctions = {
        "setupDomain": setupDomain,
            
        // data collected
        "projectData": projectData,
        
        // Supporting GUI
        "childPageIDListForHeaderID": childPageIDListForHeaderID,
        "questions": questions,
        "panelDefinitions": panelDefinitions,
        
        // functions called from page widgets
        "calculateFunctionResultForGUI": calculateFunctionResultForGUI,
        "calculate_report": calculate_report,
        "calculate_quizScoreResult": calculate_quizScoreResult,
        
        "copyDraftPNIQuestionVersionsIntoAnswers": copyDraftPNIQuestionVersionsIntoAnswers,
        "storyCollectionStart": storyCollectionStart,
        "storyCollectionStop": storyCollectionStop,
        "loadLatestStoriesFromServer": loadLatestStoriesFromServer,
        
        "getCurrentQuestionnaire": getCurrentQuestionnaire,
        
        // Application using domain need to call this at start...
        "determineStatusOfCurrentQuestionnaire": determineStatusOfCurrentQuestionnaire,
        "getParticipantDataForParticipantID": getParticipantDataForParticipantID
    };
    
    lang.mixin(exports, exportedFunctions);
});