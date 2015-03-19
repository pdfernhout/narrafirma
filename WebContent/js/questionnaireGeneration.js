define(["js/domain", "js/panelBuilder/translate"], function(domain, translate) {
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
       label: "none",
       image: "none",
       textarea: 'string',
       text: 'string',
       grid: 'array',
       header: "none",
       select: "string",
       clusteringDiagram: 'object',
       quizScoreResult: "none",
       button: "none",
       report: "none",
       recommendationTable: "none",
       checkboxes: 'dictionary',
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
       storiesList: 'none',
       boolean: 'boolean'
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
               } else if (dataOptions.length > 1) {
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
       
       questionnaire.title = domain.projectAnswers.get("questionForm_title");
       questionnaire.image = domain.projectAnswers.get("questionForm_image");
       questionnaire.startText = domain.projectAnswers.get("questionForm_startText");
       questionnaire.endText = domain.projectAnswers.get("questionForm_endText"); 

       var elicitingQuestions = domain.projectAnswers.get("project_elicitingQuestionsList");
       console.log("elicitingQuestions", elicitingQuestions);
       
       var storyQuestions = domain.projectAnswers.get("project_storyQuestionsList");
       ensureUniqueQuestionIDs(usedIDs, storyQuestions);
       
       var participantQuestions = domain.projectAnswers.get("project_participantQuestionsList");
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
   
   return {
       getCurrentQuestionnaire: getCurrentQuestionnaire,
       ensureAtLeastOneElicitingQuestion: ensureAtLeastOneElicitingQuestion
   };
});