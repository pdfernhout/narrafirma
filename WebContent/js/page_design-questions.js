"use strict";

define([
    "dojo/dom-construct",
    "narracoach/question_editor",
    "narracoach/translate",
    "narracoach/widgets",
    "dijit/layout/ContentPane"
], function(
    domConstruct,
    question_editor,
    translate,
    widgets,
    ContentPane
){
    var questionIndex = 1;
    
    function addQuestion() {
        var questionsDiv = document.getElementById("questionsDiv");
        var question = {index: questionIndex, id: "Q" + questionIndex, type: "text", text: "Question text " + questionIndex, help: 'Question help ' + questionIndex};
        questionIndex += 1;
        question_editor.insertQuestionEditorDivIntoDiv(question, questionsDiv);
    }
    
    function createPage(tabContainer) {
        // Design questions pane

        var designQuestionsPane = new ContentPane({
             title: "Design questions"
        });
        
        var pane = designQuestionsPane.containerNode;
        pane.appendChild(domConstruct.toDom("<b>NarraCoach</b>"));
        pane.appendChild(domConstruct.toDom("<br>"));
        pane.appendChild(domConstruct.toDom("Survey Design"));
        pane.appendChild(domConstruct.toDom("<br>"));
        pane.appendChild(domConstruct.toDom('<div id="questionsDiv"/>'));
        var addQuestionButton = widgets.newButton("Add question", pane, addQuestion);
        pane.appendChild(document.createElement("br"));
    
        tabContainer.addChild(designQuestionsPane);
        designQuestionsPane.startup();
    }

    return createPage;
    
});