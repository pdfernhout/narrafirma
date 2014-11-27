// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"venue_name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"venue_primary_type", "type":"select", "isInReport":true, "isGridColumn":true, "options":["individual interviews", "group interviews", "peer interviews", "group story sessions", "surveys", "journals", "narrative incident reports", "gleaned stories", "other"]},
        {"id":"venue_participantGroups", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"venue_timeline", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"venue_locations", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"venue_help", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"venue_resources", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"venue_description", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_addVenue",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});