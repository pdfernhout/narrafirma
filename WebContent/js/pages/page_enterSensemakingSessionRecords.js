// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "project_sensemakingSessionRecordsLabel");
        widgets.add_grid(contentPane, model, "project_sensemakingSessionRecordsList", ["page_addSensemakingSessionRecord"]);
    }

    var questions = [
        {"id":"project_sensemakingSessionRecordsLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_sensemakingSessionRecordsList", "type":"grid", "isInReport":true, "isGridColumn":false}
    ];

    return {
        "id": "page_enterSensemakingSessionRecords",
        "name": "Enter sensemaking session records",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});