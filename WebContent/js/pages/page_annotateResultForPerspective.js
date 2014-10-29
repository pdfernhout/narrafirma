// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"perspective_resultLinkageNotes", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];

    function addWidgets(builder, contentPane, model) {
        builder.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_annotateResultForPerspective",
        "name": "Annotate result for perspective",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});