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
        {"id":"project_interventionLabel", "type":"label", "isReportable":false, "isHeader":false},
        {"id":"interventionRecommendations", "type":"recommendationTable", "isReportable":true, "isHeader":false},
        {"id":"interventionRecommendationsTable_unfinished", "type":"label", "isReportable":false, "isHeader":false},
        {"id":"mockup_recTable_intervention", "type":"image", "isReportable":true, "isHeader":false},
        {"id":"project_interventionPlansList", "type":"grid", "isReportable":true, "isHeader":false}
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