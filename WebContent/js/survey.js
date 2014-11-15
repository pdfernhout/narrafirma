"use strict";

define([
    "js/domain",
    "dojo/dom-construct",
    "dojox/mvc/getPlainValue",
    "dojo/_base/lang",
    "js/utility",
    "js/widgetBuilder",
    "dijit/layout/ContentPane",
    "dijit/Dialog",
    "dijit/form/Form",
    "dojo/Stateful"
], function(
    domain,
    domConstruct,
    getPlainValue,
    lang,
    utility,
    widgetBuilder,
    ContentPane,
    Dialog,
    Form,
    Stateful
){
    function submitSurvey(archiver, userID, model, form) {
        var answers = {};
        console.log("submitSurvey pressed");
        
        var surveyResult = getPlainValue(model);
        
        console.log("answers", surveyResult, model);
        domain.projectData.surveyResults.allCompletedSurveys.push(surveyResult);
        
        // Store the result
        var timestamp = new Date().toISOString();
        var hyperdocumentID = "Test-PNIWorkbook-001-Surveys";
        var version = {"_pointrelIndexing": [hyperdocumentID], "timestamp": timestamp, "userID": userID, "surveyResult": surveyResult};
        console.log("version:", version);
        var versionAsString = JSON.stringify(version, null, 4);
        console.log("versionAsString:", versionAsString);
        
        var newVersionURI = archiver.resource_add(versionAsString, "PNIWorkbookSurveyResult.pce.json", function(error, status) {
            if (error) { alert("could not write new survey result: " + JSON.stringify(status)); return; }
            console.log("wrote surveyResult as newVersionURI:", newVersionURI);
        });
        
        // var surveyResultsDiv = document.getElementById("surveyResultsDiv");
        // surveyResultsDiv.innerHTML = JSON.stringify(domain.surveyResults);
    }
    
    function takeSurvey(archiver, userID) {
        // TODO: Remove this -- ONLY FOR TESTING
        domain.finalizeSurvey();
        
        var surveyDialog = null;
        
        var form = new Form();
        form.set("style", "width: 800px; height 800px; overflow: auto;");
        
        // question_editor.insertQuestionsIntoDiv(domain.exportedSurveyQuestions, form.containerNode);
        var surveyModel = new Stateful();
        
        var model = surveyModel;
        var contentPane = form.containerNode;
        
        console.log("domain.projectData", domain.projectData);
        var questions = domain.collectAllSurveyQuestions();
        
        widgetBuilder.addQuestions(questions, contentPane, model);
        
        // TODO: Does the dialog itself have to be "destroyed"???
        
        utility.newButton(undefined, "surveySubmit", form, function() {
            console.log("Submit survery");
            surveyDialog.hide();
            submitSurvey(archiver, userID, model, form);
            // The next line is needed to get rid of duplicate IDs for next time the form is opened:
            form.destroyRecursive();
        });
        
        utility.newButton(undefined, "surveyCancel", form, function() {
            console.log("Cancel");
            surveyDialog.hide();
            // The next line is needed to get rid of duplicate IDs for next time the form is opened:
            form.destroyRecursive();
        });

        surveyDialog = new Dialog({
            title: "Take Survey",
            content: form,
            onCancel: function() {
                // Handles close X in corner or escape
                form.destroyRecursive();
            }
        });
        
        form.startup();
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
        takeSurvey: takeSurvey
    };
});