// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_select(contentPane, model, "projectStory_scenario", ["ask me anything","magic ears","fly on the wall","project aspects","my own scenario type"]);
        widgets.add_select(contentPane, model, "projectStory_outcome", ["colossal success","miserable failure","acceptable outcome","my own outcome"]);
        widgets.add_textarea(contentPane, model, "projectStory_text");
        widgets.add_text(contentPane, model, "projectStory_name");
        widgets.add_textarea(contentPane, model, "projectStory_feelAbout");
        widgets.add_textarea(contentPane, model, "projectStory_surprise");
        widgets.add_textarea(contentPane, model, "projectStory_dangers");
    }

    return {
        "id": "page_projectStory",
        "name": "Project story",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});