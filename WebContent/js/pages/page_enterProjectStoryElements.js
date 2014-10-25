"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_grid(contentPane, model, "project_projectStoryElementsList", ["page_addStoryElement"]);
    }

    return {
        "id": "page_enterProjectStoryElements",
        "name": "Enter project story elements",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});