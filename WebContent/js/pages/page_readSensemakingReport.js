// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "sensemakingReportLabel");
        widgets.add_report(contentPane, model, "sensemakingReport", ["sensemaking"]);
    }

    var questions = [
        {"id":"sensemakingReportLabel", "type":"label", "isReportable":false, "isHeader":false},
        {"id":"sensemakingReport", "type":"report", "isReportable":true, "isHeader":false}
    ];

    return {
        "id": "page_readSensemakingReport",
        "name": "Read sensemaking report",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});