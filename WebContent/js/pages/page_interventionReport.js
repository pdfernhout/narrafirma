// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"interventionReportLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"interventionReport", "type":"report", "isInReport":true, "isGridColumn":false, "options":["intervention"]}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
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