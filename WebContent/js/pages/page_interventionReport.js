// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "interventionReportLabel");
        widgets.add_report(contentPane, model, "interventionReport", ["intervention"]);
    }

    return {
        "id": "page_interventionReport",
        "name": "Read intervention report",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});