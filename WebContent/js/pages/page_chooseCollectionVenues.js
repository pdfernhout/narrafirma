// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"project_venuesIntro", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"SPECIAL_venueRecommendations", "type":"recommendationTable", "isInReport":true, "isGridColumn":false, "options":["Venues"]},
        {"id":"project_venuesList", "type":"grid", "isInReport":true, "isGridColumn":true, "options":["page_addVenue"]}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_chooseCollectionVenues",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});