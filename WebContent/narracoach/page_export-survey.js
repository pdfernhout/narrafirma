"use strict";

define([
    "narracoach/domain",
    "dojo/dom-construct",
    "dojo/query",
    "narracoach/translate",
    "narracoach/widgets",
    "dijit/layout/ContentPane"
], function(
    domain,
    domConstruct,
    query,
    translate,
    widgets,
    ContentPane
){

    var surveyItemPrefix = "survey_";
    
    function exportSurveyQuestions() {
        var questions = [];
        var nodes = query(".narracoachQuestionEditor", "questionsDiv");
        // console.log("nodes", nodes);
        nodes.forEach(function(node) {
            // console.log("Node", node);
            var questionText = node.getAttribute("data-narracoach-question");
            var question = JSON.parse(questionText);
            question.id = surveyItemPrefix + question.id;
            questions.push(question);
        });
        console.log("questions", JSON.stringify(questions));
        var surveyDiv = document.getElementById("surveyDiv");
        surveyDiv.innerHTML = JSON.stringify(questions);
        domain.exportedSurveyQuestions = questions;
        // question_editor.insertQuestionsIntoDiv(questions, surveyDiv);
        // var submitSurveyButton = widgets.newButton("Submit survey", "surveyDiv", submitSurvey);
    }

    function createPage(tabContainer) {
        // Export survey pane
        
        var exportSurveyPane = new ContentPane({
            title: "Export survey"
        });
        
        var pane = exportSurveyPane.containerNode;
        var exportSurveyQuestionsButton = widgets.newButton("Export survey questions", pane, exportSurveyQuestions);
        pane.appendChild(document.createElement("br"));
        pane.appendChild(domConstruct.toDom('Survey Definition<br><div id="surveyDiv"></div>'));
        
        tabContainer.addChild(exportSurveyPane);
        exportSurveyPane.startup();
    }

    return createPage;

});