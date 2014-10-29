// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"project_projectStoryElementsList", "type":"grid", "isInReport":true, "isGridColumn":false, "options":["page_addStoryElement"]}
    ];

    function addWidgets(builder, contentPane, model) {
        builder.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_enterProjectStoryElements",
        "name": "Enter project story elements",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});