// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"project_storyElementsInstructions", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_projectStoryElementsConceptMap", "type":"conceptMap", "isInReport":true, "isGridColumn":false, "options":["answersMap"]}
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