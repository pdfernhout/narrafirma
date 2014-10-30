// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"catalysisReport_introductionLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"catalysisReport", "type":"report", "isInReport":true, "isGridColumn":false, "options":["catalysis"]}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_readCatalysisReport",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});