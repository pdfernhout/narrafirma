"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "collectedStoriesDuringCollectionLabel");
        widgets.add_storyBrowser(contentPane, model, "collectedStoriesDuringCollection");
    }

    return {
        "id": "page_reviewIncomingStories",
        "name": "Review incoming stories",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});