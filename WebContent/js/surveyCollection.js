define([
    "dojo/_base/array",
    "dojo/_base/lang",
    "js/questionnaireGeneration",
    "dojo/topic",
    "js/panelBuilder/translate"
], function(
    array,
    lang,
    questionnaireGeneration,
    topic,
    translate
) {
   "use strict";
   
   var project;
   
   function setProject(theProject) {
       project = theProject;
   }
   
   function getStoriesForStoryCollection(storyCollectionIdentifier) {
       var result = [];
       var surveyMessages = project.pointrelClient.filterMessages(function (message) {
           var match = (message._topicIdentifier === "surveyResults" &&
               message.messageType === "surveyResult" &&
               message.change.projectIdentifier === project.projectIdentifier &&
               message.change.storyCollectionIdentifier === storyCollectionIdentifier);
           // console.log("message", match, message);
           return match;
       });
       console.log("getStoriesForStoryCollection filter surveyMessages", surveyMessages);
       
       surveyMessages.forEach(function (message) {
           // Now add stories in survey to results, with extra participant information
           try {
               var surveyResult = message.change.surveyResult;
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
                   result.push(story);
               }
           } catch (e) {
               console.log("Problem processing survey result", message, e);
           }
       });
       
       return result;
   }
   
   // TODO: Similar to function in buttonActions except no alerts
   function getQuestionnaireForStoryCollection(storyCollectionIdentifier) {
       var storyCollection = questionnaireGeneration.findStoryCollection(project, storyCollectionIdentifier);
       if (!storyCollection) return null;
       
       var questionnaireName = storyCollection.storyCollection_questionnaireIdentifier;
       if (!questionnaireName) return null;

       var questionnaire = questionnaireGeneration.buildQuestionnaire(project, questionnaireName);
       return questionnaire;
   }
   
   // TODO: Find all users of loadLatestStoriesFromServer and fix them
   // TODO: Fix users of: topic.publish("loadLatestStoriesFromServer", newEnvelopeCount, domain.allStories);
   // TODO: Fix users of: topic.publish("totalNumberOfSurveyResults", allEnvelopes.length);
   
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
       // return domain.questionnaireStatus.active;
       // TODO: Fix!
       return true;
   }
   
   function collectQuestionsForQuestionnaire(questionnaire) {
       console.log("questionnaire", questionnaire);
       
       if (!questionnaire) return [];
       
       var storyQuestions = questionnaire.storyQuestions;
       
       // TODO: What about idea of having IDs that go with eliciting questions so store reference to ID not text prompt?
       var elicitingQuestionPrompts = [];
       for (var elicitingQuestionIndex = 0; elicitingQuestionIndex < questionnaire.elicitingQuestions.length; elicitingQuestionIndex++) {
           var elicitingQuestionSpecification = questionnaire.elicitingQuestions[elicitingQuestionIndex];
           elicitingQuestionPrompts.push(elicitingQuestionSpecification.text);
       }
       
       // TODO: Remove redundancy
       var leadingStoryQuestions = [];
       leadingStoryQuestions.unshift({id: "__survey_" + "storyName", displayName: "Story Name", displayPrompt: "Please give your story a name", displayType: "text", valueOptions:[]});
       leadingStoryQuestions.unshift({id: "__survey_" + "storyText", displayName: "Story Text", displayPrompt: "Please enter your response to the question above in the space below", displayType: "textarea", valueOptions:[]});
       leadingStoryQuestions.unshift({id: "__survey_" + "elicitingQuestion", displayName: "Eliciting Question", displayPrompt: "Please choose a question you would like to respond to", displayType: "select", valueOptions: elicitingQuestionPrompts});

       // console.log("DEBUG questions used by story browser", questions);
              
       var questions = [].concat(leadingStoryQuestions, storyQuestions);
       questions.push({id: "__survey_" + "participantData", displayName: "Participant Data", displayPrompt: "---- participant data below ----", displayType: "header", valueOptions:[]});

       // TODO: add more participant and survey info, like timestamps and participant ID
       
       // Participant data has elsewhere been copied into story, so these questions can access it directly
       questions = questions.concat(questionnaire.participantQuestions);
       
       return questions;
   }
   
   // Types of questions that have data associated with them for filters and graphs
   var filterableQuestionTypes = ["select", "slider", "boolean", "text", "checkbox", "checkboxes", "radiobuttons"];

   // function updateFilterPaneForCurrentQuestions(questions) {
   function optionsForAllQuestions(questions, excludeTextQuestionsFlag) {
       var questionOptions = [];
       array.forEach(questions, function (question) {
           if (array.indexOf(filterableQuestionTypes, question.displayType) !== -1) {
               if (!excludeTextQuestionsFlag || question.displayType !== "text") {
                   var defaultText = question.displayName;
                   if (!defaultText) defaultText = question.displayPrompt;
                   questionOptions.push({label: translate(question.id + "::shortName", defaultText), value: question.id});
               }
           }
       });
       return questionOptions;
   }
   
   return {
       
       setProject: setProject,
       getStoriesForStoryCollection: getStoriesForStoryCollection,
       getQuestionnaireForStoryCollection: getQuestionnaireForStoryCollection,
       
       storyCollectionStop: storyCollectionStop,

       isStoryCollectingEnabled: isStoryCollectingEnabled,
       
       collectQuestionsForQuestionnaire: collectQuestionsForQuestionnaire,
       
       optionsForAllQuestions: optionsForAllQuestions
   };
});