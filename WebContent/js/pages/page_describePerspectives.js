// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"project_perspectivesLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_perspectivesList", "type":"grid", "isInReport":true, "isGridColumn":false, "options":["page_addPerspective"]}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_describePerspectives",
        "name": "Describe perspectives",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});