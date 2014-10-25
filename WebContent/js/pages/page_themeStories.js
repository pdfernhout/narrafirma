"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "themeStoriesLabel");
        widgets.add_storyThemer(contentPane, model, "themeStories");
        widgets.add_label(contentPane, model, "mockupThemingLabel_unfinished");
        widgets.add_image(contentPane, model, "mockup_theming", ["images/mockups/mockupTheming.png"]);
    }

    return {
        "id": "page_themeStories",
        "name": "Theme stories",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});