"use strict";

define([
    "js/domain",
    "dojo/dom-construct",
    "dojo/query",
    "js/question_editor",
    "dijit/registry",
    "js/translate",
    "js/widgets",
    "dijit/layout/ContentPane",
    "dijit/Dialog",
    "dijit/form/Form"
], function(
    domain,
    domConstruct,
    query,
    question_editor,
    registry,
    translate,
    widgets,
    ContentPane,
    Dialog,
    Form
){
    function submitSurvey(form) {
        var answers = {};
        console.log("submitSurvey pressed");
        var nodes = query(".question", form.containerNode);
        // console.log("nodes", nodes);
        nodes.forEach(function(questionDiv) {
            console.log("submitSurvey question Node", questionDiv);
            var questionID = questionDiv.getAttribute("data-js-question-id");
            var valueNode = registry.byId(questionID);
            var questionValue;
            if (valueNode) questionValue = valueNode.get("value");
            console.log("answer", questionDiv, questionID, valueNode, questionValue);
            // trim off "survey_" part of id
            // var questionID = questionID.substring(surveyItemPrefix.length);
            answers[questionID] = questionValue;
        });
        
        console.log("answers", JSON.stringify(answers));
        domain.surveyResults.push(answers);
        
        var surveyResultsDiv = document.getElementById("surveyResultsDiv");
        surveyResultsDiv.innerHTML = JSON.stringify(domain.surveyResults);
    }
    
    function takeSurvey() {
        var surveyDialog = null;
        
        var form = new Form();
        form.set("style", "width: 800px; height 800px; overflow: auto;");
        
        question_editor.insertQuestionsIntoDiv(domain.exportedSurveyQuestions, form.containerNode);
        
        // TODO: Does the dialog itself have to be "destroyed"???
        
        widgets.newButton("Submit survey", form, function() {
            console.log("Submit survery");
            surveyDialog.hide();
            submitSurvey(form);
            // The next line is needed to get rid of duplicate IDs for next time the form is opened:
            form.destroyRecursive();
        });
        
        widgets.newButton("Cancel", form, function() {
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
    
    function createPage(tabContainer) {
        // Take survey pane
        
        var takeSurveyPane = new ContentPane({
            title: "Take survey"
        });
        
        var pane = takeSurveyPane.containerNode;
        var takeSurveyButton = widgets.newButton("Take survey", pane, takeSurvey);
        pane.appendChild(document.createElement("br"));
        pane.appendChild(domConstruct.toDom('Survey Results<br><div id="surveyResultsDiv"></div>'));
        
        tabContainer.addChild(takeSurveyPane);
        takeSurveyPane.startup();
    }

    return createPage;
    
});