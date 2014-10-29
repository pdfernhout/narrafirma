// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"perspective_excerptLinkageNotes", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
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