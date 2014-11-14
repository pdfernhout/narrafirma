// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"printQuestionsForm_enterStories", "type":"button", "isInReport":false, "isGridColumn":false, "options":["enterSurveyResult"]}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_enterStories",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});