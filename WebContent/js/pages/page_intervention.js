// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"interventionIntroLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_generalNotes_intervention", "type":"textarea", "isInReport":true, "isGridColumn":false}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_intervention",
        "name": "Intervention",
        "type": "page",
        "isHeader": true,
        "questions": questions,
        "addWidgets": addWidgets
    };
});