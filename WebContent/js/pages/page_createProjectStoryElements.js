// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "storyElementsInstructions");
    }

    return {
        "id": "page_createProjectStoryElements",
        "name": "Create project story elements",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});