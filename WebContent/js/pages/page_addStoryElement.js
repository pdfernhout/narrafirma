"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_text(contentPane, model, "storyElement_name");
        widgets.add_select(contentPane, model, "storyElement_type", ["character","situation","value","theme","relationship","motivation","belief","conflict"]);
        widgets.add_textarea(contentPane, model, "storyElement_description");
    }

    return {
        "id": "page_addStoryElement",
        "name": "Add story element",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});