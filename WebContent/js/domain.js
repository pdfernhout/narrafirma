// This supports globals shared by modules

define([
    "exports",
    "dojo/_base/lang",
    "js/questionnaireGeneration",
    "dojo/Stateful",
    "js/storage",
    "dojo/topic",
    "js/panelBuilder/translate"
], function(
    exports,
    lang,
    questionnaireGeneration,
    Stateful,
    storage,
    topic,
    translate
) {
    "use strict";
    
    // TODO: Fix hardcoded questionnaire ID
    var defaultQuestionnaireID = 'questionnaire-test-003';
    
    var domain = {
      panelSpecificationCollection: null,

      // Initialize this here to make testing of domain easier without setupDomain being called
      projectData: {
          projectAnswers: new Stateful(),
          exportedSurveyQuestions: {},
          surveyResults: {
              allCompletedSurveys: [],
              allStories: []
          }
      },

      questionnaireID: defaultQuestionnaireID,
    
      // TODO: When does this get updated?
      questionnaireStatus: {questionnaireID: defaultQuestionnaireID, active: false}
    };
    
    // Panel builder "functionResult" components will get routed through here to calculate their text.
    // The domain should publish a topic with the same name as these functions when their value changes.
    function calculateFunctionResultForGUI(functionName, question) {
        if (functionName === "totalNumberOfSurveyResults") {
            return domain.projectData.surveyResults.allCompletedSurveys.length;
        } else if (functionName === "isStoryCollectingEnabled") {
            return isStoryCollectingEnabled(question);
        } else {
            console.log("TODO: calculateFunctionResultForGUI ", functionName, question);
            return "calculateFunctionResultForGUI UNFINISHED: " + functionName + " for: " + question.id;
        }
    }
    
    function copyDraftPNIQuestionVersionsIntoAnswers() {
        var model = domain.projectData.projectAnswers;
            
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
                        domain.projectData.surveyResults.allCompletedSurveys.push(surveyResult);
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
            var allStories = domain.projectData.surveyResults.allStories;
            while (allStories.length > 0) {
                allStories.pop();
            }
            for (var responseIndex in domain.projectData.surveyResults.allCompletedSurveys) {
                var response = domain.projectData.surveyResults.allCompletedSurveys[responseIndex];
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
        for (var responseIndex in domain.projectData.surveyResults.allCompletedSurveys) {
            var response = domain.projectData.surveyResults.allCompletedSurveys[responseIndex];
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
        
        var questionnaire = questionnaireGeneration.getCurrentQuestionnaire();
        var questionnaireID = domain.questionnaireID;
        questionnaire.questionnaireID = questionnaireID;
        
        questionnaireGeneration.ensureAtLeastOneElicitingQuestion(questionnaire);
        
        storage.storeQuestionnaireVersion(questionnaireID, questionnaire, function(error) {
            if (error) { return alert("Could not store questionnaire"); }
            alert("Store questionnaire as:" + questionnaireID);
        });
        
        var status = {questionnaireID: questionnaireID, active: true};
        storage.storeQuestionnaireStatus(questionnaireID, status, function(error) {
            console.log("Activated questionnaire", questionnaireID);
            domain.questionnaireStatus = {questionnaireID: questionnaireID, active: true};
            topic.publish("isStoryCollectingEnabled", domain.questionnaireStatus);
        });
    }
    
    function storyCollectionStop() {
        var status = {questionnaireID: domain.questionnaireID, active: false};
        storage.storeQuestionnaireStatus(domain.questionnaireID, status, function(error) {
            console.log("Deactivated questionnaire", domain.questionnaireID);
            domain.questionnaireStatus = {questionnaireID: domain.questionnaireID, active: false};
            topic.publish("isStoryCollectingEnabled", domain.questionnaireStatus);
        });
    }
    
    function isStoryCollectingEnabled(question) {
        return domain.questionnaireStatus.active;
    }
    
    function calculate_quizScoreResult(model, dependsOn) {
        // console.log("quiz score result", dependsOn);
        if (!domain.panelSpecificationCollection) return "ERROR: domain.panelSpecificationCollection is not set";
        var total = 0;
        for (var dependsOnIndex = 0; dependsOnIndex < dependsOn.length; dependsOnIndex++) {
            var questionID = dependsOn[dependsOnIndex];
            // console.log("projectData", projectData);
            var questionAnswer = model.get(questionID);
            var answerWeight = 0;
            if (questionAnswer) {
                // console.log("questionAnswer", questionAnswer);
                var choices = domain.panelSpecificationCollection.getFieldSpecificationForFieldID(questionID).dataOptions;
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
        var template = translate("#calculate_quizScoreResult_template", "{{total}} of a possible {{possibleTotal}} ({{percent}}%)");
        var response = template.replace("{{total}}", total).replace("{{possibleTotal}}", possibleTotal).replace("{{percent}}", "" + percent);
        return "<b>" + response + "</b>";
    }

    // Application should call this at startup
    function setupDomain(panelSpecificationCollection) {
        domain.panelSpecificationCollection = panelSpecificationCollection;
        
        var model = panelSpecificationCollection.buildModel("ProjectModel");
        
        var projectData = domain.projectData;
        
        projectData.projectAnswers = new Stateful(model);
        projectData.exportedSurveyQuestions = {};
        projectData.surveyResults = {};
        projectData.surveyResults.allCompletedSurveys = [];
        projectData.surveyResults.allStories = [];
        
        var pages = panelSpecificationCollection.buildListOfPages();
        
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
        storage.loadLatestQuestionnaireStatus(domain.questionnaireID, function(error, status, envelope) {
            if (error) {return console.log("Could not determine questionnaire status; assuming inactive", domain.questionnaireID);}
            console.log("got questionnaire status", status);
            domain.questionnaireStatus = status;
            topic.publish("isStoryCollectingEnabled", domain.questionnaireStatus);
        });
    }
    
    function getPanelSpecificationCollection() {
        return domain.panelSpecificationCollection;
    }
    
    var exportedFunctions = {
        "setupDomain": setupDomain,
            
        // data collected
        "projectData": domain.projectData,
        
        // Supporting GUI
        "getPanelSpecificationCollection": getPanelSpecificationCollection,
        
        // functions called from page widgets
        "calculateFunctionResultForGUI": calculateFunctionResultForGUI,
        "calculate_quizScoreResult": calculate_quizScoreResult,
        
        "copyDraftPNIQuestionVersionsIntoAnswers": copyDraftPNIQuestionVersionsIntoAnswers,
        
        "storyCollectionStart": storyCollectionStart,
        "storyCollectionStop": storyCollectionStop,
        "loadLatestStoriesFromServer": loadLatestStoriesFromServer,
        
        // Application using domain need to call this at start...
        "determineStatusOfCurrentQuestionnaire": determineStatusOfCurrentQuestionnaire,
        "getParticipantDataForParticipantID": getParticipantDataForParticipantID
    };
    
    lang.mixin(exports, exportedFunctions);
});