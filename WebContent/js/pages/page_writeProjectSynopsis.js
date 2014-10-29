// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"project_synopsis", "type":"textarea", "isInReport":true, "isGridColumn":false}
    ];

    function addWidgets(builder, contentPane, model) {
        builder.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_writeProjectSynopsis",
        "name": "Write project synopsis",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});