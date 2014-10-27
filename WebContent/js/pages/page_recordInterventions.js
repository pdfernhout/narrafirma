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

    var questions = [
        {"id":"project_interventionRecordsLabel", "type":"label", "isReportable":false, "isHeader":false},
        {"id":"project_interventionRecordsList", "type":"grid", "isReportable":true, "isHeader":false}
    ];

    return {
        "id": "page_recordInterventions",
        "name": "Enter intervention records",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});