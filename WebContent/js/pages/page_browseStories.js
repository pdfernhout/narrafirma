// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"browseStories_collectedStoriesAfterCollectionLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"browseStories_loadLatestStoriesFromServer", "type":"button", "isInReport":false, "isGridColumn":false, "options":["loadLatestStoriesFromServer"]},
        {"id":"browseStories_totalResults", "type":"function", "isInReport":true, "isGridColumn":false, "options":["totalNumberOfSurveyResults"]},
        {"id":"browseStories_collectedStoriesAfterCollection", "type":"storyBrowser", "isInReport":true, "isGridColumn":false, "options":["addToObservation:\"page_addToObservation\"", "addToExcerpt:\"page_addToExcerpt\""]}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_browseStories",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});