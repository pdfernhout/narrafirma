// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "project_feedbackLabel");
        widgets.add_grid(contentPane, model, "project_feedbackItemsList", ["page_enterFeedbackPiece"]);
        widgets.add_textarea(contentPane, model, "feedback_generalNotes");
    }

    var questions = [
        {"id":"project_feedbackLabel", "type":"label", "isReportable":false, "isHeader":false},
        {"id":"project_feedbackItemsList", "type":"grid", "isReportable":true, "isHeader":false},
        {"id":"feedback_generalNotes", "type":"textarea", "isReportable":true, "isHeader":false}
    ];

    return {
        "id": "page_gatherFeedback",
        "name": "Gather feedback",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});