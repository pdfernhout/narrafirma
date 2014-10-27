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
        {"id":"returnReportLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"returnReport", "type":"report", "isInReport":true, "isGridColumn":false}
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