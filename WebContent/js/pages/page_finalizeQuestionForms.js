// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"printQuestionsForm_introduction", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"printQuestionsForm_printFormButton", "type":"button", "isInReport":false, "isGridColumn":false}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_finalizeQuestionForms",
        "name": "Print question forms",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});