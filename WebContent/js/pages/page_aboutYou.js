// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"aspects_youHeader", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"aboutYou_experience", "type":"select", "isInReport":true, "isGridColumn":false, "options":["none", "a little", "some", "a lot"]},
        {"id":"aboutYou_help", "type":"select", "isInReport":true, "isGridColumn":false, "options":["none", "a little", "some", "a lot"]},
        {"id":"aboutYou_tech", "type":"select", "isInReport":true, "isGridColumn":false, "options":["none", "a little", "some", "a lot"]}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_aboutYou",
        "name": "About you",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});