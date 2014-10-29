// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"project_interventionRecordsLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_interventionRecordsList", "type":"grid", "isInReport":true, "isGridColumn":false, "options":["page_addInterventionRecord"]}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_recordInterventions",
        "name": "Enter intervention records",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});