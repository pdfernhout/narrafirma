define([
   "dojo/promise/all",
   "dojo/Deferred",
   "js/domain",
   "js/storage"
], function(
   all,
   Deferred,
   domain,
   storage
) {
   "use strict";
   
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
   
   var displayTypeToDataTypeMap = {
       // Used in questionnaire and other parts of the application
       boolean: 'boolean',
       label: "none",
       header: "none",
       checkbox: 'boolean',
       checkboxes: 'dictionary',
       text: 'string',
       textarea: 'string',
       select: "string",
       radiobuttons: "string",
       slider: "number",
       
       // Used only in other parts of the application
       image: "none",
       grid: 'array',
       clusteringDiagram: 'object',
       quizScoreResult: "none",
       button: "none",
       report: "none",
       recommendationTable: "none",
       templateList: "none",
       "function": "none",
       storyBrowser: 'none',
       storyThemer: 'none',
       graphBrowser: 'none',
       trendsReport: 'none',
       observationsList: 'none',
       accumulatedItemsGrid: 'none',
       excerptsList: 'none',
       annotationsGrid: 'none',
       storiesList: 'none'
   };
   
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
           // TODO: dataType might be a number or boolean sometimes
           var dataType = displayTypeToDataTypeMap[type];
           if (!dataType) console.log("ERROR: Could not resolve dataType for ", question);
           var dataOptions;
           var displayConfiguration;
           if (type === "select" || type === "checkboxes" || type === "radiobuttons") {
               dataOptions = options;
           } else {
               if (options.length === 1) {
                   displayConfiguration = options[1];
               } else if (options.length > 1) {
                   displayConfiguration = options;
               }
           }
           adjustedQuestions.push({
               dataType: dataType,
               displayType: type,
               id: id, 
               dataOptions: dataOptions, 
               displayName: shortName, 
               displayPrompt: prompt,
               displayConfiguration: displayConfiguration
           });
       }
       
       return adjustedQuestions;
   }
   
   function buildIdToItemMap(itemList, idField) {
       var result = {};
       itemList.forEach(function (item) {
           result[item[idField]] = item;
       });
       return result;
   }
   
   function buildItemListFromIdList(idToItemMap, idItemList, idField) {
       var result = [];
       idItemList.forEach(function (idItem) {
           var item = idToItemMap[idItem[idField]];
           if (item) {
               result.push(item);
           } else {
               console.log("Editing error: Missing question definition for", idItem);
           }
       });
       return result;
   }
   
   // Are names just hints as to purpose of code? Can never convey all aspects of interrelationships?
   
   function findQuestionnaireTemplate(project, shortName) {
       var questionnaires = project.projectModel.get("project_questionnaires");
       for (var i = 0; i < questionnaires.length; i++) {
           if (questionnaires[i].questionForm_shortName === shortName) {
               return questionnaires[i];
           }
       }
       return null;
   }

   // TODO: How to save the fact we have exported this in the project? Make a copy??? Or keep original in document somewhere? Versus what is returned from server for surveys?
   function buildQuestionnaire(project, shortName) {
       var usedIDs = {};
       usedIDs.__createdIDCount = 0;
       
       // TODO: Redo for if questionnaire template is made of triples
       
       var questionnaire = {
               __type: "org.workingwithstories.Questionnaire"
       };
       
       var questionnaireTemplate = findQuestionnaireTemplate(project, shortName);
       if (!questionnaireTemplate) return null;
       
       console.log("questionnaireTemplate", questionnaireTemplate);
 
       questionnaire.title = questionnaireTemplate["questionForm_title"];
       questionnaire.image = questionnaireTemplate["questionForm_image"];
       questionnaire.startText = questionnaireTemplate["questionForm_startText"];
       questionnaire.endText = questionnaireTemplate["questionForm_endText"]; 
       
       // TODO: Should maybe ensure unique IDs for eliciting questions?
       var allElicitingQuestions = buildIdToItemMap(project.projectModel.get("project_elicitingQuestionsList"), "elicitingQuestion_shortName");
       var elicitingQuestions = buildItemListFromIdList(allElicitingQuestions, questionnaireTemplate["questionForm_elicitingQuestions"], "elicitingQuestion");       
       console.log("elicitingQuestions", elicitingQuestions);
       
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
       ensureAtLeastOneElicitingQuestion(questionnaire);
       
       var allStoryQuestions = buildIdToItemMap(project.projectModel.get("project_storyQuestionsList"), "storyQuestion_shortName");
       var storyQuestions = buildItemListFromIdList(allStoryQuestions, questionnaireTemplate["questionForm_storyQuestions"], "storyQuestion");       
       ensureUniqueQuestionIDs(usedIDs, storyQuestions);
       questionnaire.storyQuestions = convertEditorQuestions(storyQuestions);
       
       var allParticipantQuestions = buildIdToItemMap(project.projectModel.get("project_participantQuestionsList"), "participantQuestion_shortName");
       var participantQuestions = buildItemListFromIdList(allParticipantQuestions, questionnaireTemplate["questionForm_participantQuestions"], "participantQuestion");       
       ensureUniqueQuestionIDs(usedIDs, participantQuestions);      
       questionnaire.participantQuestions = convertEditorQuestions(participantQuestions);
       
       console.log("buildQuestionnaire result", questionnaire);
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
   
   return {
       buildQuestionnaire: buildQuestionnaire,
       ensureAtLeastOneElicitingQuestion: ensureAtLeastOneElicitingQuestion
   };
});