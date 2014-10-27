// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "project_participantQuestionsLabel");
        widgets.add_grid(contentPane, model, "project_participantQuestionsList", ["page_addParticipantQuestion"]);
        widgets.add_recommendationTable(contentPane, model, "participantQuestionRecommendations", ["participantQuestions"]);
        widgets.add_label(contentPane, model, "participantQuestionRecommendations_unfinished");
        widgets.add_image(contentPane, model, "mockup_recTable_partQ", ["images/mockups/mockupRecTable.png"]);
    }

    var questions = [
        {"id":"project_participantQuestionsLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_participantQuestionsList", "type":"grid", "isInReport":true, "isGridColumn":false},
        {"id":"participantQuestionRecommendations", "type":"recommendationTable", "isInReport":true, "isGridColumn":false},
        {"id":"participantQuestionRecommendations_unfinished", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"mockup_recTable_partQ", "type":"image", "isInReport":true, "isGridColumn":false}
    ];

    return {
        "id": "page_writeQuestionsAboutParticipants",
        "name": "Write questions about participants",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});