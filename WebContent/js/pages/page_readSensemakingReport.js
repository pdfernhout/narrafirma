"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "sensemakingReportLabel");
        widgets.add_report(contentPane, model, "sensemakingReport", ["sensemaking"]);
    }

    return {
        "id": "page_readSensemakingReport",
        "name": "Read sensemaking report",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});