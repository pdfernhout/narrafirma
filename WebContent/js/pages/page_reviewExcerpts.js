// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"project_savedExcerptsList", "type":"grid", "isInReport":true, "isGridColumn":false, "options":["page_createNewExcerpt"]}
    ];

    function addWidgets(builder, contentPane, model) {
        builder.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_reviewExcerpts",
        "name": "Review excerpts",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});