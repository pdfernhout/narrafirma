// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"interventionReportLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"interventionReport", "type":"report", "isInReport":true, "isGridColumn":false, "options":["intervention"]}
    ];

    function addWidgets(builder, contentPane, model) {
        builder.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_interventionReport",
        "name": "Read intervention report",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});