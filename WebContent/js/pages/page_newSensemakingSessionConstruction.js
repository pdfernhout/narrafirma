// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"sensemakingSessionRecord_construction_name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionRecord_construction_type", "type":"select", "isInReport":true, "isGridColumn":true, "options":["timeline", "landscape", "story elements", "composite story", "other"]},
        {"id":"sensemakingSessionRecord_construction_description", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_newSensemakingSessionConstruction",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});