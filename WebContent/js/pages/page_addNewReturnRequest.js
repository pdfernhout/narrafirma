// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"returnRequest_text", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"returnRequest_type", "type":"select", "isInReport":true, "isGridColumn":true, "options":["help with their own projects", "help with sustaining story exchange", "help with examining this project's stories and results", "help learning about story work", "other"]},
        {"id":"returnRequest_isMet", "type":"boolean", "isInReport":true, "isGridColumn":true},
        {"id":"returnRequest_whatHappened", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"returnRequest_notes", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_addNewReturnRequest",
        "name": "Enter project request",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});