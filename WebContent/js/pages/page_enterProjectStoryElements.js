// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_grid(contentPane, model, "project_projectStoryElementsList", ["page_addStoryElement"]);
    }

    var questions = [
        {"id":"project_projectStoryElementsList", "type":"grid", "isInReport":true, "isGridColumn":false, "options":["page_addStoryElement"]}
    ];

    return {
        "id": "page_enterProjectStoryElements",
        "name": "Enter project story elements",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});