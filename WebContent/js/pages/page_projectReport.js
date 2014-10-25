// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "wholeProjectReportLabel");
        widgets.add_report(contentPane, model, "projectReport", ["project"]);
    }

    return {
        "id": "page_projectReport",
        "name": "Project report",
        "type": "page",
        "isHeader": true,
        "addWidgets": addWidgets
    };
});