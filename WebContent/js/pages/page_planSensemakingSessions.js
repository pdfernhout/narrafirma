// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"project_sensemakingSessionPlansLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"sensemakingSessionRecommendations", "type":"recommendationTable", "isInReport":true, "isGridColumn":false, "options":["sensemakingSessions"]},
        {"id":"sensemakingRecommendationsTable_unfinished", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"mockup_recTable_sensemaking", "type":"image", "isInReport":true, "isGridColumn":false, "options":["images/mockups/mockupRecTable.png"]},
        {"id":"project_sensemakingSessionPlansList", "type":"grid", "isInReport":true, "isGridColumn":false, "options":["page_addSensemakingSessionPlan"]}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_planSensemakingSessions",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});