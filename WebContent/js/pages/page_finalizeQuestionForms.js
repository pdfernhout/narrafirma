// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "printQuestionsForm_introduction");
        widgets.add_button(contentPane, model, "printQuestionsForm_printFormButton");
    }

    var questions = [
        {"id":"printQuestionsForm_introduction", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"printQuestionsForm_printFormButton", "type":"button", "isInReport":false, "isGridColumn":false}
    ];

    return {
        "id": "page_finalizeQuestionForms",
        "name": "Print question forms",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});