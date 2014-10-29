// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"excerpt_name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"excerpt_text", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"excerpt_notes", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];

    function addWidgets(builder, contentPane, model) {
        builder.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_createNewExcerpt",
        "name": "Create new excerpt",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});