// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"collectionProcessIntro", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_generalNotes_collectionProcess", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_collectionProcess",
        "type": "page",
        "isHeader": true,
        "questions": questions,
        "buildPage": buildPage
    };
});