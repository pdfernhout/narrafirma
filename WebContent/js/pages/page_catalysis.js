// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"catalysisIntro", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_generalNotes_catalysis", "type":"textarea", "isInReport":true, "isGridColumn":false}
    ];

    function addWidgets(builder, contentPane, model) {
        builder.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_catalysis",
        "name": "Catalysis",
        "type": "page",
        "isHeader": true,
        "questions": questions,
        "addWidgets": addWidgets
    };
});