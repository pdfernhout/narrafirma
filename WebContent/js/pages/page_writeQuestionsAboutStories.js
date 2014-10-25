"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "project_storyQuestionsLabel");
        widgets.add_grid(contentPane, model, "project_storyQuestionsList", ["page_addStoryQuestion"]);
        widgets.add_recommendationTable(contentPane, model, "storyQuestionRecommendations", ["storyQuestions"]);
        widgets.add_label(contentPane, model, "storyQuestionRecommendationsTable_unfinished");
        widgets.add_image(contentPane, model, "mockup_recTable_storyQ", ["images/mockups/mockupRecTable.png"]);
    }

    return {
        "id": "page_writeQuestionsAboutStories",
        "name": "Write questions about stories",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});