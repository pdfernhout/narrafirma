// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"project_collectionRecordsIntroductionLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_collectionSessionRecordsList", "type":"grid", "isInReport":true, "isGridColumn":false, "options":["page_addCollectionSessionRecord"]}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_enterCollectionSessionRecords",
        "name": "Enter story collection session records",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});