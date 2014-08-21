"use strict";

define([
    "dojo/dom-construct",
    "dojo/query",
    "narracoach/question_editor",
    "dijit/registry",
    "narracoach/translate",
    "narracoach/widgets",
    "dijit/layout/ContentPane",
    "dijit/Dialog",
    "dijit/form/Form"
], function(
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
        var nodes = query(".narracoachQuestion", form.domNode);
        // console.log("nodes", nodes);
        nodes.forEach(function(questionDiv) {
            console.log("submitSurvey question Node", questionDiv);
            var questionID = questionDiv.getAttribute("data-narracoach-question-id");
            var valueNode = registry.byId(questionID);
            var questionValue = undefined;
            if (valueNode) questionValue = valueNode.get("value");
            console.log("answer", questionDiv, questionID, valueNode, questionValue);
            // trim off "survey_" part of id
            // var questionID = questionID.substring(surveyItemPrefix.length);
            answers[questionID] = questionValue;
        });
        
        console.log("answers", JSON.stringify(answers));
        surveyResults.push(answers);
        
        var surveyResultsDiv = document.getElementById("surveyResultsDiv");
        surveyResultsDiv.innerHTML = JSON.stringify(surveyResults);
    }
	
    function takeSurvey() {
        var surveyDialog;
        
        var form = new Form();
        
        question_editor.insertQuestionsIntoDiv(exportedSurveyQuestions, form.domNode);
        
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
            style: "width: 600px",
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