// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"project_participantQuestionsLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_participantQuestionsList", "type":"grid", "isInReport":true, "isGridColumn":false, "options":["page_addParticipantQuestion"]},
        {"id":"participantQuestionRecommendations", "type":"recommendationTable", "isInReport":true, "isGridColumn":false, "options":["participantQuestions"]},
        {"id":"participantQuestionRecommendations_unfinished", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"mockup_recTable_partQ", "type":"image", "isInReport":true, "isGridColumn":false, "options":["images/mockups/mockupRecTable.png"]}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_writeQuestionsAboutParticipants",
        "name": "Write questions about participants",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});