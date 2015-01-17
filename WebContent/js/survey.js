"use strict";

define([
    "dojo/dom-construct",
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
    "dojo/Stateful"
], function(
    domConstruct,
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
    Stateful
){
    // TODO: Replace use of storage with direct calls to server to get questionnaire and submit survey
    
    var timestampStart;
    
    function submitSurvey(surveyResultsWithModels) {
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
            if (error) { alert("Could not write new survey result to server:\n" + error);}
            alert("Survey successfully sent to server!");
        });
        
        // For editor app, can't push survey into all results at this point or will have duplicates when load them later
        // TODO: For editor app, maybe should load latest results from server back at this point? Because will not have new survey...
    }
    
    function buildSurveyForm(questionnaire, doneCallback, includeCancelButton) {  
        console.log("buildSurveyForm questions", questionnaire);
        
        var startQuestions = [];
        if (questionnaire.title) startQuestions.push({id: "__survey-local_" + "title", shortName: "title", prompt: questionnaire.title, type: "header", options:[]});
        if (questionnaire.startText) startQuestions.push({id: "__survey-local_" + "startText", shortName: "startText", prompt: questionnaire.startText, type: "label", options:[]});

        var endQuestions = [];
        if (questionnaire.endText) endQuestions.push({id: "__survey-local_" + "endText", shortName: "endText", prompt: questionnaire.endText, type: "label", options:[]});

        // TODO: What about idea of having IDs that go with eliciting questions so store reference to ID not text prompt?
        var elicitingQuestionPrompts = [];
        for (var elicitingQuestionIndex in questionnaire.elicitingQuestions) {
            var elicitingQuestionSpecification = questionnaire.elicitingQuestions[elicitingQuestionIndex];
            elicitingQuestionPrompts.push(elicitingQuestionSpecification.text);
        }
        
        // TODO: What if these IDs for storyText and storyName are not unique?
        var initialStoryQuestions = [];
        initialStoryQuestions.push({id: "__survey_" + "elicitingQuestion", shortName: "elicitingQuestion", prompt: "Please choose a question you would like to respond to", type: "select", options: elicitingQuestionPrompts});
        initialStoryQuestions.push({id: "__survey_" + "storyText", shortName: "storyText", prompt: "Please enter your response to the question above in the space below", type: "textarea", options:[]});
        initialStoryQuestions.push({id: "__survey_" + "storyName", shortName: "storyName", prompt: "Please give your story a name", type: "text", options:[]});
        
        var allStoryQuestions = initialStoryQuestions.concat(questionnaire.storyQuestions);
        
        // TODO: Handle other implicit questions
        translate.addExtraTranslationsForQuestions(startQuestions);
        translate.addExtraTranslationsForQuestions(allStoryQuestions);
        translate.addExtraTranslationsForQuestions(questionnaire.participantQuestions);
        translate.addExtraTranslationsForQuestions(endQuestions);
        
        var form = new Form();
        form.set("style", "width: 800px; height 800px; overflow: auto;");
        
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
        
        var storyQuestionsModel = new Stateful();
        storyQuestionsModel.set("__type", "org.workingwithstories.Story");
        storyQuestionsModel.set("_storyID", uuid());
        storyQuestionsModel.set("_participantID", participantID);
        surveyResultsWithModels.stories.push(storyQuestionsModel);

        var contentPane = form.containerNode;
        
        // TODO: Need to handle multiple stories somehow
        widgetBuilder.addQuestions(startQuestions, contentPane, participantDataModel);
        widgetBuilder.addQuestions(allStoryQuestions, contentPane, storyQuestionsModel);
        widgetBuilder.addQuestions(questionnaire.participantQuestions, contentPane, participantDataModel);
        widgetBuilder.addQuestions(endQuestions, contentPane, participantDataModel);
        
        utility.newButton(undefined, "surveySubmit", form, function() {
            console.log("Submit survey");
            submitSurvey(surveyResultsWithModels, form);
            if (doneCallback) doneCallback("submitted");
        });
        
        if (includeCancelButton) {
            utility.newButton(undefined, "surveyCancel", form, function() {
                console.log("Cancel");
                if (doneCallback) doneCallback("cancelled");
            });
        }
        
        form.startup();
        
        return form;
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