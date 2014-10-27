// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "project_reflectLabel");
        widgets.add_textarea(contentPane, model, "project_reflect_stories");
        widgets.add_textarea(contentPane, model, "project_reflect_facilitation");
        widgets.add_textarea(contentPane, model, "project_reflect_planning");
        widgets.add_textarea(contentPane, model, "project_reflect_ownPNI");
        widgets.add_textarea(contentPane, model, "project_reflect_community");
        widgets.add_textarea(contentPane, model, "project_reflect_personalStrengths");
        widgets.add_textarea(contentPane, model, "project_reflect_teamStrengths");
        widgets.add_textarea(contentPane, model, "project_reflect_newIdeas");
        widgets.add_textarea(contentPane, model, "project_reflect_notes");
    }

    var questions = [
        {"id":"project_reflectLabel", "type":"label", "isReportable":false, "isHeader":false},
        {"id":"project_reflect_stories", "type":"textarea", "isReportable":true, "isHeader":false},
        {"id":"project_reflect_facilitation", "type":"textarea", "isReportable":true, "isHeader":false},
        {"id":"project_reflect_planning", "type":"textarea", "isReportable":true, "isHeader":false},
        {"id":"project_reflect_ownPNI", "type":"textarea", "isReportable":true, "isHeader":false},
        {"id":"project_reflect_community", "type":"textarea", "isReportable":true, "isHeader":false},
        {"id":"project_reflect_personalStrengths", "type":"textarea", "isReportable":true, "isHeader":false},
        {"id":"project_reflect_teamStrengths", "type":"textarea", "isReportable":true, "isHeader":false},
        {"id":"project_reflect_newIdeas", "type":"textarea", "isReportable":true, "isHeader":false},
        {"id":"project_reflect_notes", "type":"textarea", "isReportable":true, "isHeader":false}
    ];

    return {
        "id": "page_reflectOnProject",
        "name": "Reflect on the project",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});