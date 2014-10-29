// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"returnIntroLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_generalNotes_return", "type":"textarea", "isInReport":true, "isGridColumn":false}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_return",
        "name": "Return",
        "type": "page",
        "isHeader": true,
        "questions": questions,
        "addWidgets": addWidgets
    };
});