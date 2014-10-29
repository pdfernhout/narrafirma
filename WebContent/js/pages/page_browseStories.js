// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"collectedStoriesAfterCollectionLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"collectedStoriesAfterCollection", "type":"storyBrowser", "isInReport":true, "isGridColumn":false, "options":["addToObservation:\"page_addToObservation\"", "addToExcerpt:\"page_addToExcerpt\""]}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_browseStories",
        "name": "Browse stories",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});