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

    return {
        "id": "page_enterFeedbackPiece",
        "name": "Enter piece of feedback on project",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});