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
        {"id":"project_storyQuestionsLabel", "type":"label", "isReportable":false, "isHeader":false},
        {"id":"project_storyQuestionsList", "type":"grid", "isReportable":true, "isHeader":false},
        {"id":"storyQuestionRecommendations", "type":"recommendationTable", "isReportable":true, "isHeader":false},
        {"id":"storyQuestionRecommendationsTable_unfinished", "type":"label", "isReportable":false, "isHeader":false},
        {"id":"mockup_recTable_storyQ", "type":"image", "isReportable":true, "isHeader":false}
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