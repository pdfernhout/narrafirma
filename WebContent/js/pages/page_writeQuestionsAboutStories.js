// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"project_storyQuestionsLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_storyQuestionsList", "type":"grid", "isInReport":true, "isGridColumn":false, "options":["page_addStoryQuestion"]},
        {"id":"storyQuestionRecommendations", "type":"recommendationTable", "isInReport":true, "isGridColumn":false, "options":["storyQuestions"]},
        {"id":"storyQuestionRecommendationsTable_unfinished", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"mockup_recTable_storyQ", "type":"image", "isInReport":true, "isGridColumn":false, "options":["images/mockups/mockupRecTable.png"]}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_writeQuestionsAboutStories",
        "name": "Write questions about stories",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});