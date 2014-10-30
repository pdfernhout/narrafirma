// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"sensemakingReportLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"sensemakingReport", "type":"report", "isInReport":true, "isGridColumn":false, "options":["sensemaking"]}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_readSensemakingReport",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});