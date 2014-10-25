"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "project_draftQuestionsLabel");
        widgets.add_textarea(contentPane, model, "project_PNIquestions_goal_draft");
        widgets.add_textarea(contentPane, model, "project_PNIquestions_relationships_draft");
        widgets.add_textarea(contentPane, model, "project_PNIquestions_focus_draft");
        widgets.add_textarea(contentPane, model, "project_PNIquestions_range_draft");
        widgets.add_textarea(contentPane, model, "project_PNIquestions_scope_draft");
        widgets.add_textarea(contentPane, model, "project_PNIquestions_emphasis_draft");
    }

    return {
        "id": "page_planningQuestionsDraft",
        "name": "Answer PNI Planning questions",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});