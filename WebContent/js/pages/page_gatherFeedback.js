// Generated from design
define([], function() {
    "use strict";
    
    var questions = [
        {"id":"project_feedbackLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_feedbackItemsList", "type":"grid", "isInReport":true, "isGridColumn":true, "options":["page_enterFeedbackPiece"]},
        {"id":"feedback_generalNotes", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];
    
    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_gatherFeedback",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});