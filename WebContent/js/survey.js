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
    
    function submitSurvey(model, form) {
        var answers = {};
        console.log("submitSurvey pressed");
        
        var surveyResult = getPlainValue(model);
        
        surveyResult._id = uuid();
        
        console.log("answers", surveyResult, model);
        
        /* TODO: Commented out now for testing changeover to multipel stories per survey
        storage.storeSurveyResult(surveyResult, function(error) {
            // TODO: Translate
            // TODO: Cancel clearing of survey if it can't be sent
            if (error) { alert("Could not write new survey result to server:\n" + error);}
            alert("Survey successfully sent to server!");
        });
        */
        
        // Can't push survey into all results at this point or will have duplicates when load them later
        // TODO: Maybe should load latest results from server back at this point? Because will not have new survey...
    }
    
    function buildSurveyForm(questionnaire, doneCallback, includeCancelButton) {  
        console.log("buildSurveyForm questions", questionnaire);
        
        var startQuestions = [];
        if (questionnaire.startText) startQuestions.push({id: "__survey_" + "startText", shortName: "startText", prompt: questionnaire.startText, type: "label", options:[]});

        var endQuestions = [];
        if (questionnaire.endText) endQuestions.push({id: "__survey_" + "endText", shortName: "endText", prompt: questionnaire.endText, type: "label", options:[]});

        // TODO: What about idea of having IDs that go with eliciting questions so store reference to ID not text prompt?
        var elicitingQuestionPrompts = [];
        for (var elicitingQuestionIndex in questionnaire.elicitingQuestions) {
            var elicitingQuestionSpecification = questionnaire.elicitingQuestions[elicitingQuestionIndex];
            elicitingQuestionPrompts.push(elicitingQuestionSpecification.text);
        }
        
        // TODO: What if these IDs for storyText and storyName are not unique?
        questionnaire.storyQuestions.unshift({id: "__survey_" + "storyName", shortName: "storyName", prompt: "Please give your story a name", type: "text", options:[]});
        questionnaire.storyQuestions.unshift({id: "__survey_" + "storyText", shortName: "storyText", prompt: "Please enter your response to the question above in the space below", type: "textarea", options:[]});
        questionnaire.storyQuestions.unshift({id: "__survey_" + "elicitingQuestion", shortName: "elicitingQuestion", prompt: "Please choose a question you would like to respond to", type: "select", options: elicitingQuestionPrompts});
        
        // TODO: Handle other implicit questions
        translate.addExtraTranslationsForQuestions(startQuestions);
        translate.addExtraTranslationsForQuestions(questionnaire.storyQuestions);
        translate.addExtraTranslationsForQuestions(questionnaire.participantQuestions);
        translate.addExtraTranslationsForQuestions(endQuestions);
        
        var form = new Form();
        form.set("style", "width: 800px; height 800px; overflow: auto;");
        
        var surveyModel = new Stateful();
        
        var model = surveyModel;
        var contentPane = form.containerNode;
        
        // TODO: Need to handle multiple stories somehow
        widgetBuilder.addQuestions(startQuestions, contentPane, model);
        widgetBuilder.addQuestions(questionnaire.storyQuestions, contentPane, model);
        widgetBuilder.addQuestions(questionnaire.participantQuestions, contentPane, model);
        widgetBuilder.addQuestions(endQuestions, contentPane, model);
        
        // TODO: Does the dialog itself have to be "destroyed"???
        
        utility.newButton(undefined, "surveySubmit", form, function() {
            console.log("Submit survery");
            submitSurvey(model, form);
            if (doneCallback) doneCallback("submitted");
            // The next line is needed to get rid of duplicate IDs for next time the form is opened:
            form.destroyRecursive();
        });
        
        if (includeCancelButton) {
            utility.newButton(undefined, "surveyCancel", form, function() {
                console.log("Cancel");
                if (doneCallback) doneCallback("cancelled");
                // The next line is needed to get rid of duplicate IDs for next time the form is opened:
                form.destroyRecursive();
            });
        }
        
        form.startup();
        
        return form;
    }

    function takeSurvey(questionnaire) {  
        console.log("takeSurvey questionnaire", questionnaire);
        
        var surveyDialog;
        
        function hideSurveyDialog(status) {
            surveyDialog.hide();
        }

        var form = buildSurveyForm(questionnaire, hideSurveyDialog, true);
   
        surveyDialog = new Dialog({
            title: "Take Survey",
            content: form,
            onCancel: function() {
                // TODO: Confirm closing if have entered data and otherwise don't close...
                // Handles close X in corner or escape
                form.destroyRecursive();
            }
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
        takeSurvey: takeSurvey,
        buildSurveyForm: buildSurveyForm,
        getQuestionnaireFromServer: getQuestionnaireFromServer,
        getStatusFromServer: getStatusFromServer
    };
});