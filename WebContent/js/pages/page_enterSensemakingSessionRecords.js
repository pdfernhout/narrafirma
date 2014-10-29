// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"project_sensemakingSessionRecordsLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_sensemakingSessionRecordsList", "type":"grid", "isInReport":true, "isGridColumn":false, "options":["page_addSensemakingSessionRecord"]}
    ];

    function addWidgets(builder, contentPane, model) {
        builder.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_enterSensemakingSessionRecords",
        "name": "Enter sensemaking session records",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});