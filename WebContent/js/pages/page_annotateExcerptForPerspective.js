// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"perspective_excerptLinkageNotes", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];

    function addWidgets(builder, contentPane, model) {
        builder.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_annotateExcerptForPerspective",
        "name": "Annotate excerpt for perspective",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});