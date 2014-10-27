// Generated from design
"use strict";

define([
    "../widgetBuilder"
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

    var questions = [
        {"id":"project_draftQuestionsLabel", "type":"label", "isReportable":false, "isHeader":false},
        {"id":"project_PNIquestions_goal_draft", "type":"textarea", "isReportable":true, "isHeader":false},
        {"id":"project_PNIquestions_relationships_draft", "type":"textarea", "isReportable":true, "isHeader":false},
        {"id":"project_PNIquestions_focus_draft", "type":"textarea", "isReportable":true, "isHeader":false},
        {"id":"project_PNIquestions_range_draft", "type":"textarea", "isReportable":true, "isHeader":false},
        {"id":"project_PNIquestions_scope_draft", "type":"textarea", "isReportable":true, "isHeader":false},
        {"id":"project_PNIquestions_emphasis_draft", "type":"textarea", "isReportable":true, "isHeader":false}
    ];

    return {
        "id": "page_planningQuestionsDraft",
        "name": "Answer PNI Planning questions",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});