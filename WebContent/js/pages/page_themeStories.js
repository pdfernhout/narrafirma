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
        {"id":"themeStoriesLabel", "type":"label", "isReportable":false, "isHeader":false},
        {"id":"themeStories", "type":"storyThemer", "isReportable":true, "isHeader":false},
        {"id":"mockupThemingLabel_unfinished", "type":"label", "isReportable":false, "isHeader":false},
        {"id":"mockup_theming", "type":"image", "isReportable":true, "isHeader":false}
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