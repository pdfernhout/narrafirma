// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"webStoryCollection_stopCollectionLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"webStoryCollection_disableWebStoryFormAfterStoryCollectionButton", "type":"button", "isInReport":false, "isGridColumn":true},
        {"id":"webStoryCollection_enabledTracker", "type":"questionAnswer", "isInReport":true, "isGridColumn":false, "options":["webStoryCollection_enableDisableButton"]}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_stopStoryCollection",
        "name": "Stop story collection",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});