// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "project_sensemakingSessionPlansLabel");
        widgets.add_recommendationTable(contentPane, model, "sensemakingSessionRecommendations", ["sensemakingSessions"]);
        widgets.add_label(contentPane, model, "sensemakingRecommendationsTable_unfinished");
        widgets.add_image(contentPane, model, "mockup_recTable_sensemaking", ["images/mockups/mockupRecTable.png"]);
        widgets.add_grid(contentPane, model, "project_sensemakingSessionPlansList", ["page_addSensemakingSessionPlan"]);
    }

    var questions = [
        {"id":"project_sensemakingSessionPlansLabel", "type":"label", "isReportable":false, "isHeader":false},
        {"id":"sensemakingSessionRecommendations", "type":"recommendationTable", "isReportable":true, "isHeader":false},
        {"id":"sensemakingRecommendationsTable_unfinished", "type":"label", "isReportable":false, "isHeader":false},
        {"id":"mockup_recTable_sensemaking", "type":"image", "isReportable":true, "isHeader":false},
        {"id":"project_sensemakingSessionPlansList", "type":"grid", "isReportable":true, "isHeader":false}
    ];

    return {
        "id": "page_planSensemakingSessions",
        "name": "Plan sensemaking sessions",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});