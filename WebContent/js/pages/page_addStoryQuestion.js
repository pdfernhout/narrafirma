// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"storyQuestion_text", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"storyQuestion_type", "type":"select", "isInReport":true, "isGridColumn":true, "options":["boolean", "label", "header", "checkbox", "checkBoxes", "text", "textarea", "select", "radio", "slider"]},
        {"id":"storyQuestion_shortName", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"storyQuestion_options", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"storyQuestion_help", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"templates_storyQuestions", "type":"templateList", "isInReport":true, "isGridColumn":false, "options":["storyQuestions"]},
        {"id":"templates_storyQuestions_unfinished", "type":"label", "isInReport":false, "isGridColumn":false}
    ];

    function addWidgets(builder, contentPane, model) {
        builder.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_addStoryQuestion",
        "name": "Add story question",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});