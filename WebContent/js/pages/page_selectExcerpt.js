// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"selectExcerpt_excerptsListDisplay", "type":"excerptsList", "isInReport":true, "isGridColumn":false},
        {"id":"selectExcerpt_addExcerptToInterpretationButton", "type":"button", "isInReport":false, "isGridColumn":false}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_selectExcerpt",
        "name": "Add excerpt to interpretation",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});