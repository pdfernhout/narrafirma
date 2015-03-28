define([
    "js/domain",
    "dojo/_base/lang",
    "js/questionnaireGeneration",
    "js/storage",
    "dojo/topic"
], function(
    domain,
    lang,
    questionnaireGeneration,
    storage,
    topic
) {
   "use strict";
   
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
                       domain.allCompletedSurveys.push(surveyResult);
                       
                       // Now add stories in survey to allStories, with extra participant information
                       var stories = surveyResult.stories;
                       for (var storyIndex in stories) {
                           var story = stories[storyIndex];
                           // console.log("=== story", story);
                           
                           // Add participant info for story
                           var participantData = surveyResult.participantData;
                           for (var key in participantData) {
                               if (key !== "__type") {
                                   story[key] = participantData[key];
                               }
                           }
                           domain.allStories.push(story);
                       }
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
           
           console.log("===== All stories", domain.allStories);
           
           if (callback) callback(newEnvelopeCount);
           
           // Tell any listeners like story browsers that there are more stories
           topic.publish("loadLatestStoriesFromServer", newEnvelopeCount, domain.allStories);
           topic.publish("totalNumberOfSurveyResults", allEnvelopes.length);
       });
   }
   
   function getParticipantDataForParticipantID(participantID) {
       // TODO: Maybe optimize as a lookup map maintained when read in survey results
       for (var responseIndex in domain.allCompletedSurveys) {
           var response = domain.allCompletedSurveys[responseIndex];
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
       
       var questionnaire = questionnaireGeneration.generateQuestionnaire();
       var questionnaireID = domain.currentQuestionnaireID;
       
       questionnaire.questionnaireID = questionnaireID;
       
       questionnaireGeneration.ensureAtLeastOneElicitingQuestion(questionnaire);
       
       domain.currentQuestionnaire = questionnaire;
       
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
       var questionnaireID = domain.currentQuestionnaireID;
       var status = {questionnaireID: questionnaireID, active: false};
       storage.storeQuestionnaireStatus(questionnaireID, status, function(error) {
           console.log("Deactivated questionnaire", questionnaireID);
           domain.questionnaireStatus = {questionnaireID: questionnaireID, active: false};
           topic.publish("isStoryCollectingEnabled", domain.questionnaireStatus);
       });
   }
   
   function isStoryCollectingEnabled(question) {
       return domain.questionnaireStatus.active;
   }
   
   function loadCurrentQuestionnaire() {
       // TODO: Fix hardcoded questionnaire ID
       storage.loadLatestQuestionnaireVersion(domain.currentQuestionnaireID, function(error, questionnaire) {
           if (error) {
               // Don't alert, because it is possible nothing has been saved
               console.log("Problem loading latest questionnaire version", error);
           } else {
               domain.currentQuestionnaire = questionnaire;
               topic.publish("currentQuestionnaire", domain.currentQuestionnaire);
           }
       });
   }
   
   function determineStatusOfCurrentQuestionnaire() {
       storage.loadLatestQuestionnaireStatus(domain.currentQuestionnaireID, function(error, status, envelope) {
           if (error) {return console.log("Could not determine questionnaire status; assuming inactive", domain.currentQuestionnaireID);}
           console.log("got questionnaire status", status);
           domain.questionnaireStatus = status;
           topic.publish("isStoryCollectingEnabled", domain.questionnaireStatus);
       });
   }
   
   function getQuestionnaireFromServer(questionnaireID, callback) {
       storage.loadLatestQuestionnaireVersion(questionnaireID, callback);
   }
   
   return {
       storyCollectionStart: storyCollectionStart,
       storyCollectionStop: storyCollectionStop,
       
       loadLatestStoriesFromServer: loadLatestStoriesFromServer,
       
       isStoryCollectingEnabled: isStoryCollectingEnabled,
       
       loadCurrentQuestionnaire: loadCurrentQuestionnaire,
       
       // Application using storyCollection need to call this at start to have current status of questionnaire
       determineStatusOfCurrentQuestionnaire: determineStatusOfCurrentQuestionnaire,
       
       getParticipantDataForParticipantID: getParticipantDataForParticipantID
   };
});