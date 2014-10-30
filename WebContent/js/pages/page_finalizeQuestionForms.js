// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"printQuestionsForm_introduction", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"printQuestionsForm_printFormButton", "type":"button", "isInReport":false, "isGridColumn":false}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_finalizeQuestionForms",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});