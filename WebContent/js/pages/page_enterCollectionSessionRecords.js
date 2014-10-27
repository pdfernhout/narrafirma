// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "project_collectionRecordsIntroductionLabel");
        widgets.add_grid(contentPane, model, "project_collectionSessionRecordsList", ["page_addCollectionSessionRecord"]);
    }

    var questions = [
        {"id":"project_collectionRecordsIntroductionLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_collectionSessionRecordsList", "type":"grid", "isInReport":true, "isGridColumn":false, "options":["page_addCollectionSessionRecord"]}
    ];

    return {
        "id": "page_enterCollectionSessionRecords",
        "name": "Enter story collection session records",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});