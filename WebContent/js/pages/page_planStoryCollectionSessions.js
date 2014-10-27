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
        {"id":"collectionSessionsLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"collectionSessionRecommendations", "type":"recommendationTable", "isInReport":true, "isGridColumn":false},
        {"id":"collectionRecommendationsTable_unfinished", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"mockup_recTable_collection", "type":"image", "isInReport":true, "isGridColumn":false},
        {"id":"project_collectionSessionPlansList", "type":"grid", "isInReport":true, "isGridColumn":false}
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