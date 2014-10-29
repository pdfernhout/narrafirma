// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"storyElementsInstructions", "type":"label", "isInReport":false, "isGridColumn":false}
    ];

    function addWidgets(builder, contentPane, model) {
        builder.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_createProjectStoryElements",
        "name": "Create project story elements",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});