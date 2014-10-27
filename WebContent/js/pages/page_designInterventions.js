// Generated from design
"use strict";

define([
    "../widgetBuilder"
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

    var questions = [
        {"id":"project_interventionLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"interventionRecommendations", "type":"recommendationTable", "isInReport":true, "isGridColumn":false, "options":["interventions"]},
        {"id":"interventionRecommendationsTable_unfinished", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"mockup_recTable_intervention", "type":"image", "isInReport":true, "isGridColumn":false, "options":["images/mockups/mockupRecTable.png"]},
        {"id":"project_interventionPlansList", "type":"grid", "isInReport":true, "isGridColumn":false, "options":["page_addIntervention"]}
    ];

    return {
        "id": "page_designInterventions",
        "name": "Design intervention plans",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});