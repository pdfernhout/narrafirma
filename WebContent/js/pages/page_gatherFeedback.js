"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "project_feedbackLabel");
        widgets.add_grid(contentPane, model, "project_feedbackItemsList", ["page_enterFeedbackPiece"]);
        widgets.add_textarea(contentPane, model, "feedback_generalNotes");
    }

    return {
        "id": "page_gatherFeedback",
        "name": "Gather feedback",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});