// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"project_projectStoryElementsList", "type":"grid", "isInReport":true, "isGridColumn":false, "options":["page_addStoryElement"]}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_enterProjectStoryElements",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});