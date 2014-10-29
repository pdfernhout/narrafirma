// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"selectExcerpt_excerptsListDisplay", "type":"excerptsList", "isInReport":true, "isGridColumn":false},
        {"id":"selectExcerpt_addExcerptToInterpretationButton", "type":"button", "isInReport":false, "isGridColumn":false}
    ];

    function addWidgets(builder, contentPane, model) {
        builder.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_selectExcerpt",
        "name": "Add excerpt to interpretation",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});