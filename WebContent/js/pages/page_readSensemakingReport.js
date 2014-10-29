// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"sensemakingReportLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"sensemakingReport", "type":"report", "isInReport":true, "isGridColumn":false, "options":["sensemaking"]}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
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