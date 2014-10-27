// Generated from design
"use strict";

define([
    "../widgetBuilder"
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

    var questions = [
        {"id":"project_storyQuestionsLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_storyQuestionsList", "type":"grid", "isInReport":true, "isGridColumn":false},
        {"id":"storyQuestionRecommendations", "type":"recommendationTable", "isInReport":true, "isGridColumn":false},
        {"id":"storyQuestionRecommendationsTable_unfinished", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"mockup_recTable_storyQ", "type":"image", "isInReport":true, "isGridColumn":false}
    ];

    return {
        "id": "page_writeQuestionsAboutStories",
        "name": "Write questions about stories",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});