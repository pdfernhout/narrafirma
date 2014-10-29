// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"wholeProjectReportLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"projectReport", "type":"report", "isInReport":true, "isGridColumn":false, "options":["project"]}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
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