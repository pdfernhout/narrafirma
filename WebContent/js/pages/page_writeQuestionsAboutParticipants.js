// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"project_participantQuestionsLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_participantQuestionsList", "type":"grid", "isInReport":true, "isGridColumn":true, "options":["page_addParticipantQuestion"]},
        {"id":"SPECIAL_participantQuestionRecommendations", "type":"recommendationTable", "isInReport":true, "isGridColumn":false, "options":["participantQuestions"]}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_writeQuestionsAboutParticipants",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});