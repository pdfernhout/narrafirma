// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"storyElementsInstructions", "type":"label", "isInReport":false, "isGridColumn":false}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_createProjectStoryElements",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});