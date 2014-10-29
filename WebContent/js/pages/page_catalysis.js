// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"catalysisIntro", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_generalNotes_catalysis", "type":"textarea", "isInReport":true, "isGridColumn":false}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_catalysis",
        "name": "Catalysis",
        "type": "page",
        "isHeader": true,
        "questions": questions,
        "buildPage": buildPage
    };
});