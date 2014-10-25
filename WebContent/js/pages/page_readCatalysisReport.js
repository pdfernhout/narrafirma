"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "catalysisReport_introductionLabel");
        widgets.add_report(contentPane, model, "catalysisReport", ["catalysis"]);
    }

    return {
        "id": "page_readCatalysisReport",
        "name": "Read catalysis report",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});