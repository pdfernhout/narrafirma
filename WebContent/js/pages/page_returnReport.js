"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "returnReportLabel");
        widgets.add_report(contentPane, model, "returnReport", ["return"]);
    }

    return {
        "id": "page_returnReport",
        "name": "Read return report",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});