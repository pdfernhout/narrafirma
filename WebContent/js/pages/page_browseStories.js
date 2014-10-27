// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "collectedStoriesAfterCollectionLabel");
        widgets.add_storyBrowser(contentPane, model, "collectedStoriesAfterCollection", ["addToObservation:\"page_addToObservation\"","addToExcerpt:\"page_addToExcerpt\""]);
    }

    var questions = [
        {"id":"collectedStoriesAfterCollectionLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"collectedStoriesAfterCollection", "type":"storyBrowser", "isInReport":true, "isGridColumn":false, "options":["addToObservation:\"page_addToObservation\"", "addToExcerpt:\"page_addToExcerpt\""]}
    ];

    return {
        "id": "page_browseStories",
        "name": "Browse stories",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});