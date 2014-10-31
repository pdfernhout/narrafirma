// Generated from design
"use strict";

define([], function() {

    var questions = [
        "storyQuestion_text",
        "storyQuestion_type",
        "storyQuestion_shortName",
        "storyQuestion_options",
        "storyQuestion_help",
        "templates_storyQuestions",
        "templates_storyQuestions_unfinished"
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_addStoryQuestion",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});