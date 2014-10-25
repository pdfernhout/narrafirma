// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "project_elicitingQuestionsLabel");
        widgets.add_grid(contentPane, model, "project_elicitingQuestionsList", ["page_addElicitingQuestion"]);
        widgets.add_recommendationTable(contentPane, model, "elicitingQuestionRecommendations", ["Eliciting questions"]);
        widgets.add_label(contentPane, model, "elicitingRecommendationsTable_unfinished");
        widgets.add_image(contentPane, model, "mockup_recTable_eliciting", ["images/mockups/mockupRecTable.png"]);
    }

    return {
        "id": "page_writeStoryElicitingQuestions",
        "name": "Write story eliciting questions",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});