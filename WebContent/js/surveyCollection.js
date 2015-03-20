define([
    "dojo/_base/lang",
    "js/questionnaireGeneration",
    "js/storage",
    "dojo/topic"
], function(
   lang,
   questionnaireGeneration,
   storage,
   topic
) {
   "use strict";
   
   // TODO: Fix hardcoded questionnaire ID
   var defaultQuestionnaireID = 'questionnaire-test-003';
   
   var allCompletedSurveys = [];
   var allStories = [];
   
   var currentQuestionnaireID = defaultQuestionnaireID;
   
   // TODO: When does this get updated?
   var questionnaireStatus = {questionnaireID: defaultQuestionnaireID, active: false};
   
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
                       allCompletedSurveys.push(surveyResult);
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
           while (allStories.length > 0) {
               allStories.pop();
           }
           for (var responseIndex in allCompletedSurveys) {
               var response = allCompletedSurveys[responseIndex];
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
       for (var responseIndex in allCompletedSurveys) {
           var response = allCompletedSurveys[responseIndex];
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
       var questionnaireID = currentQuestionnaireID;
       
       questionnaire.questionnaireID = questionnaireID;
       
       questionnaireGeneration.ensureAtLeastOneElicitingQuestion(questionnaire);
       
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
       var questionnaireID = currentQuestionnaireID;
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
   
   
   function determineStatusOfCurrentQuestionnaire() {
       storage.loadLatestQuestionnaireStatus(currentQuestionnaireID, function(error, status, envelope) {
           if (error) {return console.log("Could not determine questionnaire status; assuming inactive", currentQuestionnaireID);}
           console.log("got questionnaire status", status);
           questionnaireStatus = status;
           topic.publish("isStoryCollectingEnabled", questionnaireStatus);
       });
   }
   
   return {
       allCompletedSurveys: allCompletedSurveys,
       allStories: allStories,
       
       storyCollectionStart: storyCollectionStart,
       storyCollectionStop: storyCollectionStop,
       
       loadLatestStoriesFromServer: loadLatestStoriesFromServer,
       
       isStoryCollectingEnabled: isStoryCollectingEnabled,
       
       // Application using storyCollection need to call this at start to have current status of questionnaire
       determineStatusOfCurrentQuestionnaire: determineStatusOfCurrentQuestionnaire,
       
       getParticipantDataForParticipantID: getParticipantDataForParticipantID
   };
});