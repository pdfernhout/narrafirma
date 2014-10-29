// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"questionFormLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"questionForm_title", "type":"text", "isInReport":true, "isGridColumn":false},
        {"id":"questionForm_image", "type":"text", "isInReport":true, "isGridColumn":false},
        {"id":"questionForm_startText", "type":"textarea", "isInReport":true, "isGridColumn":false},
        {"id":"questionForm_endText", "type":"textarea", "isInReport":true, "isGridColumn":false}
    ];

    function addWidgets(builder, contentPane, model) {
        builder.addQuestionWidgets(questions, contentPane, model);
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