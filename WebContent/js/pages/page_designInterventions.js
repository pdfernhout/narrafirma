// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"project_interventionLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"interventionRecommendations", "type":"recommendationTable", "isInReport":true, "isGridColumn":false, "options":["interventions"]},
        {"id":"interventionRecommendationsTable_unfinished", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"mockup_recTable_intervention", "type":"image", "isInReport":true, "isGridColumn":false, "options":["images/mockups/mockupRecTable.png"]},
        {"id":"project_interventionPlansList", "type":"grid", "isInReport":true, "isGridColumn":false, "options":["page_addIntervention"]}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_designInterventions",
        "name": "Design intervention plans",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});