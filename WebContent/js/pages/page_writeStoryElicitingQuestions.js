// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"project_elicitingQuestionsLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_elicitingQuestionsList", "type":"grid", "isInReport":true, "isGridColumn":true, "options":["page_addElicitingQuestion"]},
        {"id":"SPECIAL_elicitingQuestionRecommendations", "type":"recommendationTable", "isInReport":true, "isGridColumn":false, "options":["Eliciting questions"]}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_writeStoryElicitingQuestions",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});