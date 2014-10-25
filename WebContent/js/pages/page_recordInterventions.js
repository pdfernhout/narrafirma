// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "project_interventionRecordsLabel");
        widgets.add_grid(contentPane, model, "project_interventionRecordsList", ["page_addInterventionRecord"]);
    }

    return {
        "id": "page_recordInterventions",
        "name": "Enter intervention records",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});