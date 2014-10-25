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

    return {
        "id": "page_planning",
        "name": "Planning",
        "type": "page",
        "isHeader": true,
        "addWidgets": addWidgets
    };
});