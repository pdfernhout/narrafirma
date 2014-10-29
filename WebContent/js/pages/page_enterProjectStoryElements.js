// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"project_projectStoryElementsList", "type":"grid", "isInReport":true, "isGridColumn":false, "options":["page_addStoryElement"]}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_enterProjectStoryElements",
        "name": "Enter project story elements",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});