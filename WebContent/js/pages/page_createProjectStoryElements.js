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

    var questions = [
        {"id":"storyElementsInstructions", "type":"label", "isReportable":false, "isHeader":false}
    ];

    return {
        "id": "page_createProjectStoryElements",
        "name": "Create project story elements",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});