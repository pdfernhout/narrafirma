// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"returnReportLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"returnReport", "type":"report", "isInReport":true, "isGridColumn":false, "options":["return"]}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_returnReport",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});