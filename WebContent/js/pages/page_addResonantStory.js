// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"storiesListChoose", "type":"storiesList", "isInReport":true, "isGridColumn":false},
        {"id":"sensemakingSessionRecord_resonantStory_type", "type":"select", "isInReport":true, "isGridColumn":true, "options":["pivot", "voice", "discovery", "other"]},
        {"id":"sensemakingSessionRecord_resonantStory_reason", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionRecord_resonantStory_groups", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionRecord_resonantStory_notes", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_addResonantStory",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});