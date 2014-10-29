// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"projectStory_scenario", "type":"select", "isInReport":true, "isGridColumn":true, "options":["ask me anything", "magic ears", "fly on the wall", "project aspects", "my own scenario type"]},
        {"id":"projectStory_outcome", "type":"select", "isInReport":true, "isGridColumn":true, "options":["colossal success", "miserable failure", "acceptable outcome", "my own outcome"]},
        {"id":"projectStory_text", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"projectStory_name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"projectStory_feelAbout", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"projectStory_surprise", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"projectStory_dangers", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_projectStory",
        "name": "Project story",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});