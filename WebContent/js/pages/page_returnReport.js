// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "returnReportLabel");
        widgets.add_report(contentPane, model, "returnReport", ["return"]);
    }

    var questions = [
        {"id":"returnReportLabel", "type":"label", "isReportable":false, "isHeader":false},
        {"id":"returnReport", "type":"report", "isReportable":true, "isHeader":false}
    ];

    return {
        "id": "page_returnReport",
        "name": "Read return report",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});