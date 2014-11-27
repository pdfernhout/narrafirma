// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"project_aboutParticipantGroups", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_participantGroupsList", "type":"grid", "isInReport":true, "isGridColumn":true, "options":["page_addParticipantGroup"]}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_participantGroups",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});