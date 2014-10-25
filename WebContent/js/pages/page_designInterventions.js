"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "project_interventionLabel");
        widgets.add_recommendationTable(contentPane, model, "interventionRecommendations", ["interventions"]);
        widgets.add_label(contentPane, model, "interventionRecommendationsTable_unfinished");
        widgets.add_image(contentPane, model, "mockup_recTable_intervention", ["images/mockups/mockupRecTable.png"]);
        widgets.add_grid(contentPane, model, "project_interventionPlansList", ["page_addIntervention"]);
    }

    return {
        "id": "page_designInterventions",
        "name": "Design intervention plans",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});