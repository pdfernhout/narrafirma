// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"project_feedbackLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_feedbackItemsList", "type":"grid", "isInReport":true, "isGridColumn":false, "options":["page_enterFeedbackPiece"]},
        {"id":"feedback_generalNotes", "type":"textarea", "isInReport":true, "isGridColumn":false}
    ];

    function addWidgets(builder, contentPane, model) {
        builder.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_gatherFeedback",
        "name": "Gather feedback",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});