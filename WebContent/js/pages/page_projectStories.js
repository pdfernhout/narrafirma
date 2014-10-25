// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_grid(contentPane, model, "project_projectStoriesList", ["page_projectStory"]);
    }

    return {
        "id": "page_projectStories",
        "name": "Tell project stories",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});