"use strict";

define([
    "dojo/_base/array",
    "dojo/dom-construct",
    'dojo/dom-style',
    "dojox/mvc/getPlainValue",
    "dojo/_base/lang",
    "js/storage",
    "js/translate",
    "js/utility",
    "dojox/uuid/generateRandomUuid",
    "js/widgetBuilder",
    "dijit/layout/ContentPane",
    "dijit/Dialog",
    "dijit/form/Form",
    "dijit/layout/StackContainer",
    "dojo/Stateful",
], function(
    array,
    domConstruct,
    domStyle,
    getPlainValue,
    lang,
    storage,
    translate,
    utility,
    uuid,
    widgetBuilder,
    ContentPane,
    Dialog,
    Form,
    StackContainer,
    Stateful
){
    // TODO: Replace use of storage with direct calls to server to get questionnaire and submit survey
    
    var timestampStart;
    
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
                alert("Please try to submit the survery result later;\nCould not write new survey result to server:\n" + error);
            } else {
                alert("Survey successfully sent to server!");
                if (wizardPane) wizardPane.forward();
                if (doneCallback) doneCallback("submitted");
            }
        });
        
        // For editor app, can't push survey into all results at this point or will have duplicates when load them later
        // TODO: For editor app, maybe should load latest results from server back at this point? Because will not have new survey...
    }
    
   function newStoryEntry(wizardPane, allStoryQuestions, participantID, surveyResultsWithModels, addIndex) {
        
        var surveyPane = new ContentPane();
        
        // TODO: Translate
        allStoryQuestions[0].prompt = "Story #" + addIndex;
        translate.addExtraTranslationsForQuestions([allStoryQuestions[0]]);
        
        var storyQuestionsModel = new Stateful();
        storyQuestionsModel.set("__type", "org.workingwithstories.Story");
        storyQuestionsModel.set("_storyID", uuid());
        storyQuestionsModel.set("_participantID", participantID);
        surveyResultsWithModels.stories.push(storyQuestionsModel);
        
        widgetBuilder.addQuestions(allStoryQuestions, surveyPane, storyQuestionsModel);
        
        utility.newButton(undefined, "button_previousPage", surveyPane, function() {
            console.log("button_previousPage");
            wizardPane.back();
        });
        
        var tellAnotherStoryButton = utility.newButton(undefined, "button_tellAnotherStory", surveyPane, function() {
            console.log("button_tellAnotherStory");
            var children = wizardPane.getChildren();
            var indexForNewStoryPage = array.indexOf(children, wizardPane.selectedChildWidget) + 1;
            newStoryEntry(wizardPane, allStoryQuestions, participantID, surveyResultsWithModels, indexForNewStoryPage);
            domStyle.set(tellAnotherStoryButton.domNode, 'display', 'none');
            domStyle.set(dontTellAnotherStoryButton.domNode, 'display', 'none');
            domStyle.set(nextPageButton.domNode, 'display', 'inline');
            wizardPane.forward();
        });
        
        var dontTellAnotherStoryButton = utility.newButton(undefined, "button_dontTellAnotherStory", surveyPane, function() {
            console.log("button_dontTellAnotherStory");
            wizardPane.forward();
        });
        
        /*
        utility.newButton(undefined, "button_deleteThisStory", surveyPane, function() {
            console.log("button_nextPage");
            wizardPane.forward();
        });
        */
        
        var nextPageButton = utility.newButton(undefined, "button_nextPage", surveyPane, function() {
            console.log("button_nextPage");
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
            startQuestions.push({id: "__survey-local_" + "title", shortName: "title", prompt: questionnaire.title, type: "header", options:[]});
            document.title = questionnaire.title;
        }
        
        startQuestions.push({id: "__survey-local_" + "startText", shortName: "startText", prompt: startText, type: "label", options:[]});

        var endText = questionnaire.endText;
         // TODO: Translate
        if (!endText) endText = "Thank you for taking the survey.";
            
        var endQuestions = [];
        endQuestions.push({id: "__survey-local_" + "endText", shortName: "endText", prompt: endText, type: "label", options:[]});

        // TODO: What about idea of having IDs that go with eliciting questions so store reference to ID not text prompt?
        var elicitingQuestionPrompts = [];
        for (var elicitingQuestionIndex in questionnaire.elicitingQuestions) {
            var elicitingQuestionSpecification = questionnaire.elicitingQuestions[elicitingQuestionIndex];
            elicitingQuestionPrompts.push(elicitingQuestionSpecification.text);
        }
        
        // TODO: What if these IDs for storyText and storyName are not unique?
        var initialStoryQuestions = [];
        initialStoryQuestions.push({id: "__survey_" + "questionHeader", shortName: "questionHeader", prompt: "Story", type: "header", options: []});
        initialStoryQuestions.push({id: "__survey_" + "elicitingQuestion", shortName: "elicitingQuestion", prompt: "Please choose a question to which you would like to respond:", type: "radiobuttons", options: elicitingQuestionPrompts});
        initialStoryQuestions.push({id: "__survey_" + "storyText", shortName: "storyText", prompt: "Please enter your response in the box below:", type: "textarea", options:[]});
        initialStoryQuestions.push({id: "__survey_" + "storyName", shortName: "storyName", prompt: "Please give your story a name", type: "text", options:[]});
        
        var allStoryQuestions = initialStoryQuestions.concat(questionnaire.storyQuestions);
        
        questionnaire.participantQuestions.unshift({id: "__survey_" + "prticipantHeader", shortName: "participantHeader", prompt: "About you", type: "header", options: []});
        
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
            responseID: uuid(), 
            stories: [],
            participantData: null,
            timestampStart: "" + timestampStart.toISOString()
        };
        
        var participantID = uuid();
        var participantDataModel = new Stateful();
        participantDataModel.set("__type", "org.workingwithstories.ParticipantData");
        participantDataModel.set("_participantID", participantID);
        surveyResultsWithModels.participantData = participantDataModel;

        var startPane = new ContentPane();
        
        widgetBuilder.addQuestions(startQuestions, startPane.containerNode, participantDataModel);
        
        utility.newButton(undefined, "button_nextPage", startPane, function() {
            console.log("button_nextPage");
            wizardPane.forward();
        });
        
        wizardPane.addChild(startPane);
        
        // TODO: Need to handle multiple stories somehow
        
        newStoryEntry(wizardPane, allStoryQuestions, participantID, surveyResultsWithModels, 1) ;
        //newStoryEntry(wizardPane, allStoryQuestions, participantID, surveyResultsWithModels) ;
        //newStoryEntry(wizardPane, allStoryQuestions, participantID, surveyResultsWithModels) ;
        //newStoryEntry(wizardPane, allStoryQuestions, participantID, surveyResultsWithModels) ;
        
        var participantPane = new ContentPane();
        
        widgetBuilder.addQuestions(questionnaire.participantQuestions, participantPane.containerNode, participantDataModel);
        
        utility.newButton(undefined, "button_previousPage", participantPane, function() {
            console.log("button_previousPage");
            wizardPane.back();
        });
        
        utility.newButton(undefined, "surveySubmit", participantPane, function() {
            console.log("Submit survey");
            submitSurvey(surveyResultsWithModels, wizardPane, doneCallback);
        });
        
        wizardPane.addChild(participantPane);
        
        var endPane = new ContentPane();
        widgetBuilder.addQuestions(endQuestions, endPane.containerNode, participantDataModel);
        
        if (includeCancelButton) {
            utility.newButton(undefined, "surveyCancel", wizardPane, function() {
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
                
        surveyDialog.startup();
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