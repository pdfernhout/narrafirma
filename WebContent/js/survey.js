"use strict";

define([
    "dojo/dom-construct",
    "dojox/mvc/getPlainValue",
    "dojo/_base/lang",
    "js/storage",
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
    utility,
    uuid,
    widgetBuilder,
    ContentPane,
    Dialog,
    Form,
    Stateful
){
    function submitSurvey(model, form) {
        var answers = {};
        console.log("submitSurvey pressed");
        
        var surveyResult = getPlainValue(model);
        
        surveyResult._id = uuid();
        
        console.log("answers", surveyResult, model);
        
        storage.storeSurveyResult(surveyResult);
        
        // Can't push survey into all results at this point or will have duplicates when load them later
        // TODO: Maybe should load latest results from server back at this point? Because will not have new survey...
    }
    
    function buildSurveyForm(questions, doneCallback, includeCancelButton) {  
        console.log("buildSurveyForm questions", questions);
        
        var form = new Form();
        form.set("style", "width: 800px; height 800px; overflow: auto;");
        
        var surveyModel = new Stateful();
        
        var model = surveyModel;
        var contentPane = form.containerNode;
        
        widgetBuilder.addQuestions(questions, contentPane, model);
        
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

    
    function takeSurvey(questions) {  
        console.log("takeSurvey questions", questions);
        
        var surveyDialog;
        
        function hideSurveyDialog(status) {
            surveyDialog.hide();
        }

        var form = buildSurveyForm(questions, hideSurveyDialog, true);
   
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
    
//    function createPage(tabContainer) {
//        // Take survey pane
//        
//        var takeSurveyPane = new ContentPane({
//            title: "Take survey"
//        });
//        
//        var pane = takeSurveyPane.containerNode;
//        var takeSurveyButton = widgets.newButton("Take survey", pane, takeSurvey);
//        pane.appendChild(document.createElement("br"));
//        pane.appendChild(domConstruct.toDom('Survey Results<br><div id="surveyResultsDiv"></div>'));
//        
//        tabContainer.addChild(takeSurveyPane);
//        takeSurveyPane.startup();
//    }

    return {
        takeSurvey: takeSurvey,
        buildSurveyForm: buildSurveyForm
    };
});