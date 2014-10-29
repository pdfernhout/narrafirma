// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"collectedStoriesAfterCollectionLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"collectedStoriesAfterCollection", "type":"storyBrowser", "isInReport":true, "isGridColumn":false, "options":["addToObservation:\"page_addToObservation\"", "addToExcerpt:\"page_addToExcerpt\""]}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_browseStories",
        "name": "Browse stories",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});