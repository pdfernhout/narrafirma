// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"sensemakingReportLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"sensemakingReport", "type":"report", "isInReport":true, "isGridColumn":false, "options":["sensemaking"]}
    ];

    function addWidgets(builder, contentPane, model) {
        builder.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_readSensemakingReport",
        "name": "Read sensemaking report",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});