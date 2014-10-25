"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "webStoryCollection_startCollectionLabel");
        widgets.add_toggleButton(contentPane, model, "webStoryCollection_enableDisableButton");
        widgets.add_button(contentPane, model, "webStoryCollection_copyStoryFormURLButton");
    }

    return {
        "id": "page_startStoryCollection",
        "name": "Start story collection",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});