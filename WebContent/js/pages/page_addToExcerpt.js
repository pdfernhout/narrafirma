// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"addToExcerpt_excerptsListChoose", "type":"excerptsList", "isInReport":true, "isGridColumn":false},
        {"id":"addToExcerpt_addTextToExistingExcerptButton", "type":"button", "isInReport":false, "isGridColumn":false},
        {"id":"addToExcerpt_createNewExcerptWithTextButton", "type":"button", "isInReport":false, "isGridColumn":false, "options":["page_createNewExcerpt"]}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_addToExcerpt",
        "name": "Add text to excerpt",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});