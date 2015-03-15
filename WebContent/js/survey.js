define([
    "dojo/_base/array",
    'dojo/dom-style',
    "dojox/mvc/getPlainValue",
    "js/storage",
    "js/panelBuilder/translate",
    "dojox/uuid/generateRandomUuid",
    "js/PanelBuilder/PanelBuilder",
    "dijit/layout/ContentPane",
    "dijit/Dialog",
    "dijit/layout/StackContainer",
    "dojo/Stateful",
    "js/panelBuilder/widgetSupport"
], function(
    array,
    domStyle,
    getPlainValue,
    storage,
    translate,
    generateRandomUuid,
    PanelBuilder,
    ContentPane,
    Dialog,
    StackContainer,
    Stateful,
    widgetSupport
){
    "use strict";

    // TODO: Replace use of storage with direct calls to server to get questionnaire and submit survey
    
    var timestampStart;
    
    // Panel builder needs to be configured further if buttons or grids are used
    var panelBuilder = new PanelBuilder();
    
    function submitSurvey(surveyResultsWithModels, wizardPane, doneCallback) {
        var answers = {};
        console.log("submitSurvey pressed");
        
        var timestampEnd = new Date();
        
        surveyResultsWithModels.timestampEnd = timestampEnd.toISOString();
        surveyResultsWithModels.timeDuration_ms = timestampEnd.getTime() - timestampStart.getTime(); 
        
        var surveyResult = getPlainValue(surveyResultsWithModels);
           
        console.log("answers", surveyResult);
        
        storage.storeSurveyResult(surveyResult, function(error) {
            // TODO: Translate
            // TODO: Cancel clearing of survey if it can't be sent
            if (error) {
                alert("Please try to submit the survey result later;\nCould not write new survey result to server:\n" + error);
            } else {
                alert("Survey successfully sent to server!");
                if (wizardPane) wizardPane.forward();
                if (doneCallback) doneCallback("submitted");
            }
        });
        
        // For editor app, can't push survey into all results at this point or will have duplicates when load them later
        // TODO: For editor app, maybe should load latest results from server back at this point? Because will not have new survey...
    }

   function validateStoryQuestionsModel(storyQuestionsModel, allowEmptyBypass) {
       // TODO: Translate
       var elicitingQuestion = storyQuestionsModel.get("__survey_elicitingQuestion");
       var storyName = storyQuestionsModel.get("__survey_storyName");
       var storyText = storyQuestionsModel.get("__survey_storyText");
       
       // Until support deleting stories, allow progress with out entering anything...
       if (allowEmptyBypass && !storyText && !storyName) {
           // alert("It looks like you don't want to tell a story right now for this page; that's OK");
           return true;
       }
       
       if (!elicitingQuestion) {
           alert("Please select a question before proceeding");
           return false;
       }
       
       var bypassText = "\n(or clear both the story name field and the story response field if you don't want to enter a story on this page)";
       if (!allowEmptyBypass) bypassText = "";
       
       if (!storyText) {
           alert("Please enter some text in the story response field before proceeding" + bypassText);
           return false;
       }
       
       if (!storyName) {
           alert("Please give your story a name before proceeding" + bypassText);
           return false;
       }
       
       return true;
   }
   
   function newStoryEntry(wizardPane, allStoryQuestions, participantID, surveyResultsWithModels, addIndex, singlePrompt) {
        
        var surveyPane = new ContentPane();
        
        // TODO: Translate
        allStoryQuestions[0].displayPrompt = "Story #" + addIndex;
        translate.addExtraTranslationsForQuestions([allStoryQuestions[0]]);
        
        var storyQuestionsModel = new Stateful();
        storyQuestionsModel.set("__type", "org.workingwithstories.Story");
        storyQuestionsModel.set("_storyID", generateRandomUuid());
        storyQuestionsModel.set("_participantID", participantID);
        if (singlePrompt) storyQuestionsModel.set("elicitingQuestion", singlePrompt);
        surveyResultsWithModels.stories.push(storyQuestionsModel);
        
        panelBuilder.buildFields(allStoryQuestions, surveyPane, storyQuestionsModel);
        
        widgetSupport.newButton(surveyPane, "#button_previousPage", function() {
            console.log("button_previousPage");
            wizardPane.back();
        });
        
        var tellAnotherStoryButton = widgetSupport.newButton(surveyPane, "#button_tellAnotherStory", function() {
            console.log("button_tellAnotherStory");
            if (!validateStoryQuestionsModel(storyQuestionsModel)) return;
            var children = wizardPane.getChildren();
            var indexForNewStoryPage = array.indexOf(children, wizardPane.selectedChildWidget) + 1;
            newStoryEntry(wizardPane, allStoryQuestions, participantID, surveyResultsWithModels, indexForNewStoryPage, singlePrompt);
            domStyle.set(tellAnotherStoryButton.domNode, 'display', 'none');
            domStyle.set(dontTellAnotherStoryButton.domNode, 'display', 'none');
            domStyle.set(nextPageButton.domNode, 'display', 'inline');
            wizardPane.forward();
        });
        
        var dontTellAnotherStoryButton = widgetSupport.newButton(surveyPane, "#button_dontTellAnotherStory", function() {
            console.log("button_dontTellAnotherStory");
            var canProceedIfNoStory = addIndex !== 1;
            if (!validateStoryQuestionsModel(storyQuestionsModel, canProceedIfNoStory)) return;
            wizardPane.forward();
        });
        
        /*
        widgetSupport.newButton(surveyPane, "#button_deleteThisStory", function() {
            console.log("button_nextPage");
            wizardPane.forward();
        });
        */
        
        var nextPageButton = widgetSupport.newButton(surveyPane, "#button_nextPage", function() {
            console.log("button_nextPage");
            // TODO: Need to somehow require at least one story... But this allows previous stories to be deleted. Kludge for now that first story can't be blank.
            var canProceedIfNoStory = addIndex !== 1;
            if (!validateStoryQuestionsModel(storyQuestionsModel, canProceedIfNoStory)) return;
            wizardPane.forward();
        });
        domStyle.set(nextPageButton.domNode, 'display', 'none');
        
        wizardPane.addChild(surveyPane, addIndex);
    }
    
    function buildSurveyForm(questionnaire, doneCallback, includeCancelButton) {  
        console.log("buildSurveyForm questions", questionnaire);
        
        var wizardPane = new StackContainer({
            // style: "width: 800px; height: 700px;",
            style: "width: 100%; height: 100%;",
            doLayout: false
        });

        var startText = questionnaire.startText;
        // TODO: Translate
        if (!startText) startText = 'Please help by taking a short survey. The data you enter will be sent to the server only at the end when you press the "submit survey" button.';
        
        var startQuestions = [];
        if (questionnaire.title) {
            startQuestions.push({id: "__survey-local_" + "title", displayName: "title", displayPrompt: questionnaire.title, displayType: "header", dataOptions:[]});
            document.title = questionnaire.title;
        }
        
        startQuestions.push({id: "__survey-local_" + "startText", displayName: "startText", displayPrompt: startText, displayType: "label", dataOptions:[]});

        var endText = questionnaire.endText;
         // TODO: Translate
        if (!endText) endText = "Thank you for taking the survey.";
            
        var endQuestions = [];
        endQuestions.push({id: "__survey-local_" + "endText", displayName: "endText", displayPrompt: endText, displayType: "label", dataOptions:[]});

        // TODO: What about idea of having IDs that go with eliciting questions so store reference to ID not text prompt?
        var elicitingQuestionPrompts = [];
        for (var elicitingQuestionIndex in questionnaire.elicitingQuestions) {
            var elicitingQuestionSpecification = questionnaire.elicitingQuestions[elicitingQuestionIndex];
            elicitingQuestionPrompts.push(elicitingQuestionSpecification.text);
        }
        
        // TODO: What if these IDs for storyText and storyName are not unique?
        var initialStoryQuestions = [];
        var singlePrompt = null;
        initialStoryQuestions.push({id: "__survey_" + "questionHeader", displayName: "questionHeader", displayPrompt: "Story", displayType: "header", dataOptions: []});
        if (elicitingQuestionPrompts.length !== 1) {
            initialStoryQuestions.push({id: "__survey_" + "elicitingQuestion", displayName: "elicitingQuestion", displayPrompt: "Please choose a question to which you would like to respond:", displayType: "radiobuttons", dataOptions: elicitingQuestionPrompts});
            initialStoryQuestions.push({id: "__survey_" + "storyText", displayName: "storyText", displayPrompt: "Please enter your response in the box below:", displayType: "textarea", dataOptions:[]});
        } else {
            singlePrompt = elicitingQuestionPrompts[0];
            initialStoryQuestions.push({id: "__survey_" + "storyText", displayName: "storyText", displayPrompt: singlePrompt, displayType: "textarea", dataOptions:[]});
        }
        initialStoryQuestions.push({id: "__survey_" + "storyName", displayName: "storyName", displayPrompt: "Please give your story a name", displayType: "text", dataOptions:[]});
        
        var allStoryQuestions = initialStoryQuestions.concat(questionnaire.storyQuestions);
        
        questionnaire.participantQuestions.unshift({id: "__survey_" + "participantHeader", displayName: "participantHeader", displayPrompt: "About you", displayType: "header", dataOptions: []});
        
        // TODO: Handle other implicit questions
        translate.addExtraTranslationsForQuestions(startQuestions);
        translate.addExtraTranslationsForQuestions(allStoryQuestions);
        translate.addExtraTranslationsForQuestions(questionnaire.participantQuestions);
        translate.addExtraTranslationsForQuestions(endQuestions);
        
        //var form = new Form();
        //form.set("style", "width: 800px; height 800px; overflow: auto;");
        
        timestampStart = new Date();
        
        var surveyResultsWithModels = {
            __type: "org.workingwithstories.QuestionnaireResponse",
            questionnaire: questionnaire,
            responseID: generateRandomUuid(),
            stories: [],
            participantData: null,
            timestampStart: "" + timestampStart.toISOString()
        };
        
        var participantID = generateRandomUuid();
        var participantDataModel = new Stateful();
        participantDataModel.set("__type", "org.workingwithstories.ParticipantData");
        participantDataModel.set("_participantID", participantID);
        surveyResultsWithModels.participantData = participantDataModel;

        var startPane = new ContentPane();
        
        panelBuilder.buildFields(startQuestions, startPane.containerNode, participantDataModel);
        
        widgetSupport.newButton(startPane, "button_nextPage", function() {
            console.log("button_nextPage");
            wizardPane.forward();
        });
        
        wizardPane.addChild(startPane);
        
        // TODO: Need to handle multiple stories somehow
        
        newStoryEntry(wizardPane, allStoryQuestions, participantID, surveyResultsWithModels, 1, singlePrompt) ;
        //newStoryEntry(wizardPane, allStoryQuestions, participantID, surveyResultsWithModels) ;
        //newStoryEntry(wizardPane, allStoryQuestions, participantID, surveyResultsWithModels) ;
        //newStoryEntry(wizardPane, allStoryQuestions, participantID, surveyResultsWithModels) ;
        
        var participantPane = new ContentPane();
        
        panelBuilder.buildFields(questionnaire.participantQuestions, participantPane.containerNode, participantDataModel);
        
        widgetSupport.newButton(participantPane, "#button_previousPage", function() {
            console.log("button_previousPage");
            wizardPane.back();
        });
        
        widgetSupport.newButton(participantPane, "#surveySubmit", function() {
            console.log("Submit survey");
            submitSurvey(surveyResultsWithModels, wizardPane, doneCallback);
        });
        
        wizardPane.addChild(participantPane);
        
        var endPane = new ContentPane();
        panelBuilder.buildFields(endQuestions, endPane.containerNode, participantDataModel);
        
        if (includeCancelButton) {
            widgetSupport.newButton(wizardPane, "#surveyCancel", function() {
                console.log("Cancel");
                if (doneCallback) doneCallback("cancelled");
            });
        }
        
        wizardPane.addChild(endPane);
        
        return wizardPane;
    }

    function openSurveyDialog(questionnaire) {  
        console.log("openSurveyDialog questionnaire", questionnaire);
        
        var surveyDialog;
        var form;
        
        function hideSurveyDialog(status) {
            surveyDialog.hide();
        }
        
        form = buildSurveyForm(questionnaire, hideSurveyDialog, true);
   
        surveyDialog = new Dialog({
            title: "Take Survey",
            content: form
            // style: "width: 800px; height: 700px;"
        });
        
        // This will free the dialog when we are done with it whether from OK or Cancel to avoid a memory leak
        surveyDialog.connect(surveyDialog, "onHide", function(e) {
            console.log("destroying surveyDialog");
            surveyDialog.destroyRecursive();
        });
                
        surveyDialog.show();
    }
    
    function getStatusFromServer(questionnaireID, callback) {
        storage.loadLatestQuestionnaireStatus(questionnaireID, callback);
    }
    
    function getQuestionnaireFromServer(questionnaireID, callback) {
        storage.loadLatestQuestionnaireVersion(questionnaireID, callback);
    }

    return {
        openSurveyDialog: openSurveyDialog,
        buildSurveyForm: buildSurveyForm,
        getQuestionnaireFromServer: getQuestionnaireFromServer,
        getStatusFromServer: getStatusFromServer
    };
});