// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "collectedStoriesDuringCollectionLabel");
        widgets.add_storyBrowser(contentPane, model, "collectedStoriesDuringCollection");
    }

    var questions = [
        {"id":"collectedStoriesDuringCollectionLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"collectedStoriesDuringCollection", "type":"storyBrowser", "isInReport":true, "isGridColumn":false}
    ];

    return {
        "id": "page_reviewIncomingStories",
        "name": "Review incoming stories",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});