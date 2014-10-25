"use strict";

define([
    "js/widgetBuilder"
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

    return {
        "id": "page_planStoryCollectionSessions",
        "name": "Plan story collection sessions",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});