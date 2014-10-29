// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"themeStoriesLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"themeStories", "type":"storyThemer", "isInReport":true, "isGridColumn":false},
        {"id":"mockupThemingLabel_unfinished", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"mockup_theming", "type":"image", "isInReport":true, "isGridColumn":false, "options":["images/mockups/mockupTheming.png"]}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_themeStories",
        "name": "Theme stories",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});