// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"project_sensemakingSessionRecordsLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_sensemakingSessionRecordsList", "type":"grid", "isInReport":true, "isGridColumn":false, "options":["page_addSensemakingSessionRecord"]}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_enterSensemakingSessionRecords",
        "name": "Enter sensemaking session records",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});