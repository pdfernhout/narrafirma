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
   
   function fetchValuePromise(entity, attribute) {
       var deferred = new Deferred();
       // TODO: Ignoring entity for now, change this if make more general
       storage.loadLatestValueForProjectField(attribute, function(value) {
           console.log("Got value", entity, attribute, value);
           deferred.resolve(value);
       });
       return deferred.promise;
   }
   
   function requestValues(entity, attributes, callback) {
       var promises = {};
       
       for (var index = 0; index < attributes.length; index++) {
           var attribute = attributes[index];
           promises[attribute] = fetchValuePromise(entity, attribute);
       }
       
       all(promises).then(function(values) {
           callback(null, values);
       });  
   }
   
   // TODO: How to save the fact we have exported this in the project? Make a copy??? Or keep original in document somewhere? Versus what is returned from server for surveys?
   // TODO: This needs to be improved for asking multiple questions, maybe spanning multiple pages
   function generateQuestionnaire(callback) {
       var usedIDs = {};
       usedIDs.__createdIDCount = 0;

       // TODO: Title, logo
       // TODO: Improve as should be asking multiple questions and storing the results for each one 
       var questionnaire = {
               __type: "org.workingwithstories.Questionnaire"
       };
       
       requestValues(domain.projectID, [
           "questionForm_image",
           "questionForm_startText",
           "questionForm_endText",
           "project_elicitingQuestionsList",
           "project_storyQuestionsList",
           "project_participantQuestionsList"
       ], function (error, dataFromServer) {
           if (error) callback(null);
           
           questionnaire.title = dataFromServer["questionForm_title"];
           questionnaire.image = dataFromServer["questionForm_image"];
           questionnaire.startText = dataFromServer["questionForm_startText"];
           questionnaire.endText = dataFromServer["questionForm_endText"]; 
    
           var elicitingQuestions = dataFromServer["project_elicitingQuestionsList"];
           console.log("elicitingQuestions", elicitingQuestions);
           
           var storyQuestions = dataFromServer["project_storyQuestionsList"];
           ensureUniqueQuestionIDs(usedIDs, storyQuestions);
           
           var participantQuestions = dataFromServer["project_participantQuestionsList"];
           ensureUniqueQuestionIDs(usedIDs, participantQuestions);
           
           // console.log("survey", survey);
               
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
              
           console.log("generateQuestionnaire result", questionnaire);
           callback(questionnaire);
       });
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
       generateQuestionnaire: generateQuestionnaire,
       ensureAtLeastOneElicitingQuestion: ensureAtLeastOneElicitingQuestion
   };
});