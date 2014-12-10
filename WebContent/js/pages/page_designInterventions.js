// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"project_interventionLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"interventionRecommendations", "type":"recommendationTable", "isInReport":true, "isGridColumn":false, "options":["interventions"]},
        {"id":"project_interventionPlansList", "type":"grid", "isInReport":true, "isGridColumn":true, "options":["page_addIntervention"]}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_designInterventions",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});