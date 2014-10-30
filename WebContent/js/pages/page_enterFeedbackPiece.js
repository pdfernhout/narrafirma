// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"feedback_text", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"feedback_name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"feedback_type", "type":"select", "isInReport":true, "isGridColumn":true, "options":["a story", "a reference to something that came up in the project", "a wish about the future", "an opinion", "a complaint", "an action", "other"]},
        {"id":"feedback_who", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"feedback_prompt", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"feedback_response", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"feedback_notes", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_enterFeedbackPiece",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});