// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"sensemakingIntroLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_generalNotes_sensemaking", "type":"textarea", "isInReport":true, "isGridColumn":false}
    ];

    function addWidgets(builder, contentPane, model) {
        builder.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_sensemaking",
        "name": "Sensemaking",
        "type": "page",
        "isHeader": true,
        "questions": questions,
        "addWidgets": addWidgets
    };
});