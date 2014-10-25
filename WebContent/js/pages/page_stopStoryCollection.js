"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "webStoryCollection_stopCollectionLabel");
        widgets.add_button(contentPane, model, "webStoryCollection_disableWebStoryFormAfterStoryCollectionButton");
        widgets.add_questionAnswer(contentPane, model, "webStoryCollection_enabledTracker", ["webStoryCollection_enableDisableButton"]);
    }

    return {
        "id": "page_stopStoryCollection",
        "name": "Stop story collection",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});