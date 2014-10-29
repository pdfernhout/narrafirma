// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"returnReportLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"returnReport", "type":"report", "isInReport":true, "isGridColumn":false, "options":["return"]}
    ];

    function addWidgets(builder, contentPane, model) {
        builder.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_returnReport",
        "name": "Read return report",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});