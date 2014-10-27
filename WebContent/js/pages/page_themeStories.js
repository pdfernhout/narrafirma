// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "themeStoriesLabel");
        widgets.add_storyThemer(contentPane, model, "themeStories");
        widgets.add_label(contentPane, model, "mockupThemingLabel_unfinished");
        widgets.add_image(contentPane, model, "mockup_theming", ["images/mockups/mockupTheming.png"]);
    }

    var questions = [
        {"id":"themeStoriesLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"themeStories", "type":"storyThemer", "isInReport":true, "isGridColumn":false},
        {"id":"mockupThemingLabel_unfinished", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"mockup_theming", "type":"image", "isInReport":true, "isGridColumn":false, "options":["images/mockups/mockupTheming.png"]}
    ];

    return {
        "id": "page_themeStories",
        "name": "Theme stories",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});