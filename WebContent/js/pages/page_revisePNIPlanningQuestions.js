// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "improvePlanningDrafts");
        widgets.add_button(contentPane, model, "project_PNIquestions_copyDraftsButton");
        widgets.add_textarea(contentPane, model, "project_PNIquestions_goal_final");
        widgets.add_textarea(contentPane, model, "project_PNIquestions_relationships_final");
        widgets.add_textarea(contentPane, model, "project_PNIquestions_focus_final");
        widgets.add_textarea(contentPane, model, "project_PNIquestions_range_final");
        widgets.add_textarea(contentPane, model, "project_PNIquestions_scope_final");
        widgets.add_textarea(contentPane, model, "project_PNIquestions_emphasis_final");
    }

    return {
        "id": "page_revisePNIPlanningQuestions",
        "name": "Revise PNI Planning questions",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});