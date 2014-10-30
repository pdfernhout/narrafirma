// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"project_savedExcerptsList", "type":"grid", "isInReport":true, "isGridColumn":false, "options":["page_createNewExcerpt"]}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_reviewExcerpts",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});