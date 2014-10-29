// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"wholeProjectReportLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"projectReport", "type":"report", "isInReport":true, "isGridColumn":false, "options":["project"]}
    ];

    function addWidgets(builder, contentPane, model) {
        builder.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_projectReport",
        "name": "Project report",
        "type": "page",
        "isHeader": true,
        "questions": questions,
        "addWidgets": addWidgets
    };
});