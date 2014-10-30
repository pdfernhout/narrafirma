// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"outcomesTable", "type":"questionsTable", "isInReport":true, "isGridColumn":false, "options":["page_outcomesTable", "participants_firstGroupName", "participants_secondGroupName", "participants_thirdGroupName"]}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_projectOutcomesForIntervention",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});