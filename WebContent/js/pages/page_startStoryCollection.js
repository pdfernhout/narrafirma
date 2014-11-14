// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"webStoryCollection_startCollectionLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"webStoryCollection_enableStoryCollectionButton", "type":"button", "isInReport":false, "isGridColumn":false, "options":["storyCollectionStart"]},
        {"id":"webStoryCollection_enabledTracker", "type":"function", "isInReport":true, "isGridColumn":false, "options":["isStoryCollectingEnabled"]},
        {"id":"webStoryCollection_copyStoryFormURLButton", "type":"button", "isInReport":false, "isGridColumn":false, "options":["copyStoryFormURL"]},
        {"id":"webStoryCollection_stopCollectionLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"webStoryCollection_disableStoryCollectionButton", "type":"button", "isInReport":false, "isGridColumn":false, "options":["storyCollectionStop"]}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_startStoryCollection",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});