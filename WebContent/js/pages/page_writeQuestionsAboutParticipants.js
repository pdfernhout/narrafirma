"use strict";

define([
    "js/widgetBuilder"
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

    return {
        "id": "page_writeQuestionsAboutParticipants",
        "name": "Write questions about participants",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});