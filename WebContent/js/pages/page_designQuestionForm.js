// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"questionFormLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"questionForm_title", "type":"text", "isInReport":true, "isGridColumn":false},
        {"id":"questionForm_image", "type":"text", "isInReport":true, "isGridColumn":false},
        {"id":"questionForm_startText", "type":"textarea", "isInReport":true, "isGridColumn":false},
        {"id":"questionForm_endText", "type":"textarea", "isInReport":true, "isGridColumn":false}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_designQuestionForm",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});