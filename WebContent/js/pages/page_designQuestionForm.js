// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"questionFormLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"questionForm_title", "type":"text", "isInReport":true, "isGridColumn":false},
        {"id":"questionForm_image", "type":"text", "isInReport":true, "isGridColumn":false},
        {"id":"questionForm_startText", "type":"textarea", "isInReport":true, "isGridColumn":false},
        {"id":"questionForm_endText", "type":"textarea", "isInReport":true, "isGridColumn":false}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_designQuestionForm",
        "name": "Design question form",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});