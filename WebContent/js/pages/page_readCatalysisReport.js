// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "catalysisReport_introductionLabel");
        widgets.add_report(contentPane, model, "catalysisReport", ["catalysis"]);
    }

    var questions = [
        {"id":"catalysisReport_introductionLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"catalysisReport", "type":"report", "isInReport":true, "isGridColumn":false}
    ];

    return {
        "id": "page_readCatalysisReport",
        "name": "Read catalysis report",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});