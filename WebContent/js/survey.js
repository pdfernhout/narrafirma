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
    "dojo/Stateful",
    "dojox/widget/Wizard",
    "dojox/widget/WizardPane"
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
    Stateful,
    Wizard,
    WizardPane
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
    
   function newStoryEntry(wizardPane, allStoryQuestions, participantID, surveyResultsWithModels) {
        
        var surveyPane = new WizardPane();
        
        var storyQuestionsModel = new Stateful();
        storyQuestionsModel.set("__type", "org.workingwithstories.Story");
        storyQuestionsModel.set("_storyID", uuid());
        storyQuestionsModel.set("_participantID", participantID);
        surveyResultsWithModels.stories.push(storyQuestionsModel);
        
        widgetBuilder.addQuestions(allStoryQuestions, surveyPane, storyQuestionsModel);
        
        wizardPane.addChild(surveyPane);
        surveyPane.startup();
    }
    
    function buildSurveyForm(surveyDiv, questionnaire, doneCallback, includeCancelButton) {  
        console.log("buildSurveyForm questions", questionnaire);
        
        var wizardPane = new Wizard({
            style: "width: 800px; height: 700px;",
            // style: "width: 95%; height: 95%;",
            //nextButtonLabel: "Go on"
        });
        
        surveyDiv.appendChild(wizardPane.domNode);
       
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

        var startPane = new WizardPane();
        widgetBuilder.addQuestions(startQuestions, startPane.containerNode, participantDataModel);
        wizardPane.addChild(startPane);
        startPane.startup();
        
        // TODO: Need to handle multiple stories somehow
        
        newStoryEntry(wizardPane, allStoryQuestions, participantID, surveyResultsWithModels) ;
        newStoryEntry(wizardPane, allStoryQuestions, participantID, surveyResultsWithModels) ;
        newStoryEntry(wizardPane, allStoryQuestions, participantID, surveyResultsWithModels) ;
        newStoryEntry(wizardPane, allStoryQuestions, participantID, surveyResultsWithModels) ;
        
        var participantPane = new WizardPane();
        widgetBuilder.addQuestions(questionnaire.participantQuestions, participantPane.containerNode, participantDataModel);
        wizardPane.addChild(participantPane);
        participantPane.startup();
        
        var endPane = new WizardPane();
        widgetBuilder.addQuestions(endQuestions, endPane.containerNode, participantDataModel);
        
        utility.newButton(undefined, "surveySubmit", endPane, function() {
            console.log("Submit survey");
            submitSurvey(surveyResultsWithModels);
            if (doneCallback) doneCallback("submitted");
        });
        
        if (includeCancelButton) {
            utility.newButton(undefined, "surveyCancel", endPane, function() {
                console.log("Cancel");
                if (doneCallback) doneCallback("cancelled");
            });
        }
        
        wizardPane.addChild(endPane);
        endPane.startup();
        
        // form.startup();
        wizardPane.startup();
        wizardPane.resize();
        
        return wizardPane;
    }

    function openSurveyDialog(questionnaire) {  
        console.log("openSurveyDialog questionnaire", questionnaire);
        
        var surveyDialog;
        var form;
        
        function hideSurveyDialog(status) {
            surveyDialog.hide();
        }
        
        var contentPane = new ContentPane();
        contentPane.startup();

        form = buildSurveyForm(contentPane.containerNode, questionnaire, hideSurveyDialog, true);
   
        surveyDialog = new Dialog({
            title: "Take Survey",
            content: contentPane
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