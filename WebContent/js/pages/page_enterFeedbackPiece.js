// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_textarea(contentPane, model, "feedback_text");
        widgets.add_text(contentPane, model, "feedback_name");
        widgets.add_select(contentPane, model, "feedback_type", ["a story","a reference to something that came up in the project","a wish about the future","an opinion","a complaint","an action","other"]);
        widgets.add_text(contentPane, model, "feedback_who");
        widgets.add_text(contentPane, model, "feedback_prompt");
        widgets.add_text(contentPane, model, "feedback_response");
        widgets.add_textarea(contentPane, model, "feedback_notes");
    }

    var questions = [
        {"id":"feedback_text", "type":"textarea", "isReportable":true, "isHeader":true},
        {"id":"feedback_name", "type":"text", "isReportable":true, "isHeader":true},
        {"id":"feedback_type", "type":"select", "isReportable":true, "isHeader":true},
        {"id":"feedback_who", "type":"text", "isReportable":true, "isHeader":true},
        {"id":"feedback_prompt", "type":"text", "isReportable":true, "isHeader":true},
        {"id":"feedback_response", "type":"text", "isReportable":true, "isHeader":true},
        {"id":"feedback_notes", "type":"textarea", "isReportable":true, "isHeader":true}
    ];

    return {
        "id": "page_enterFeedbackPiece",
        "name": "Enter piece of feedback on project",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});