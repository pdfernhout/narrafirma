// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"elicitingQuestion_text", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"elicitingQuestion_type", "type":"checkboxes", "isInReport":true, "isGridColumn":true, "options":["what happened", "directed question", "undirected questions", "point in time", "event", "extreme", "surprise", "people, places, things", "fictional scenario", "other"]},
        {"id":"SPECIAL_templates_elicitingQuestions", "type":"templateList", "isInReport":true, "isGridColumn":false, "options":["elicitingQuestions"]},
        {"id":"SPECIAL_templates_elicitingQuestions_unfinished", "type":"label", "isInReport":false, "isGridColumn":false}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_addElicitingQuestion",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});