// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "collectionSessionsLabel");
        widgets.add_recommendationTable(contentPane, model, "collectionSessionRecommendations", ["collectionSessions"]);
        widgets.add_label(contentPane, model, "collectionRecommendationsTable_unfinished");
        widgets.add_image(contentPane, model, "mockup_recTable_collection", ["images/mockups/mockupRecTable.png"]);
        widgets.add_grid(contentPane, model, "project_collectionSessionPlansList", ["page_addStoryCollectionSession"]);
    }

    var questions = [
        {"id":"collectionSessionsLabel", "type":"label", "isReportable":false, "isHeader":false},
        {"id":"collectionSessionRecommendations", "type":"recommendationTable", "isReportable":true, "isHeader":false},
        {"id":"collectionRecommendationsTable_unfinished", "type":"label", "isReportable":false, "isHeader":false},
        {"id":"mockup_recTable_collection", "type":"image", "isReportable":true, "isHeader":false},
        {"id":"project_collectionSessionPlansList", "type":"grid", "isReportable":true, "isHeader":false}
    ];

    return {
        "id": "page_planStoryCollectionSessions",
        "name": "Plan story collection sessions",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});