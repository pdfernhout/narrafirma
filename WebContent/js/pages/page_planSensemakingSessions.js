// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"project_sensemakingSessionPlansLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"sensemakingSessionRecommendations", "type":"recommendationTable", "isInReport":true, "isGridColumn":false, "options":["sensemakingSessions"]},
        {"id":"sensemakingRecommendationsTable_unfinished", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"mockup_recTable_sensemaking", "type":"image", "isInReport":true, "isGridColumn":false, "options":["images/mockups/mockupRecTable.png"]},
        {"id":"project_sensemakingSessionPlansList", "type":"grid", "isInReport":true, "isGridColumn":false, "options":["page_addSensemakingSessionPlan"]}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_planSensemakingSessions",
        "name": "Plan sensemaking sessions",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});