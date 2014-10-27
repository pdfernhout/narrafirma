// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "project_perspectivesLabel");
        widgets.add_grid(contentPane, model, "project_perspectivesList", ["page_addPerspective"]);
    }

    var questions = [
        {"id":"project_perspectivesLabel", "type":"label", "isReportable":false, "isHeader":false},
        {"id":"project_perspectivesList", "type":"grid", "isReportable":true, "isHeader":false}
    ];

    return {
        "id": "page_describePerspectives",
        "name": "Describe perspectives",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});