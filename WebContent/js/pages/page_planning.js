// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "project_projectPlanningLabel");
        widgets.add_textarea(contentPane, model, "project_generalNotes_planning");
    }

    var questions = [
        {"id":"project_projectPlanningLabel", "type":"label", "isReportable":false, "isHeader":false},
        {"id":"project_generalNotes_planning", "type":"textarea", "isReportable":true, "isHeader":true}
    ];

    return {
        "id": "page_planning",
        "name": "Planning",
        "type": "page",
        "isHeader": true,
        "addWidgets": addWidgets,
        "questions": questions
    };
});