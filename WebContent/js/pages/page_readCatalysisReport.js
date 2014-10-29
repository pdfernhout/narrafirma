// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"catalysisReport_introductionLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"catalysisReport", "type":"report", "isInReport":true, "isGridColumn":false, "options":["catalysis"]}
    ];

    function addWidgets(builder, contentPane, model) {
        builder.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_readCatalysisReport",
        "name": "Read catalysis report",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});