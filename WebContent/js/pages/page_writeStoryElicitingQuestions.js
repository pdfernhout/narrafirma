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

    var questions = [
        {"id":"project_elicitingQuestionsLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_elicitingQuestionsList", "type":"grid", "isInReport":true, "isGridColumn":false},
        {"id":"elicitingQuestionRecommendations", "type":"recommendationTable", "isInReport":true, "isGridColumn":false},
        {"id":"elicitingRecommendationsTable_unfinished", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"mockup_recTable_eliciting", "type":"image", "isInReport":true, "isGridColumn":false}
    ];

    return {
        "id": "page_writeStoryElicitingQuestions",
        "name": "Write story eliciting questions",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});