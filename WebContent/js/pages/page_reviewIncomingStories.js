// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"collectedStoriesDuringCollectionLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"webStoryCollection_loadLatestStoriesFromServer", "type":"button", "isInReport":false, "isGridColumn":false, "options":["loadLatestStoriesFromServer"]},
        {"id":"webStoryCollection_totalResults", "type":"function", "isInReport":true, "isGridColumn":false, "options":["totalNumberOfSurveyResults"]},
        {"id":"webStoryCollection_collectedStoriesDuringCollection", "type":"storyBrowser", "isInReport":true, "isGridColumn":false}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_reviewIncomingStories",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});