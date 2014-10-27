// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "projectFacts");
        widgets.add_text(contentPane, model, "project_title");
        widgets.add_text(contentPane, model, "project_communityOrOrganizationName");
        widgets.add_text(contentPane, model, "project_topic");
        widgets.add_text(contentPane, model, "project_startAndEndDates");
        widgets.add_textarea(contentPane, model, "project_funders");
        widgets.add_textarea(contentPane, model, "project_facilitators");
        widgets.add_textarea(contentPane, model, "project_reportStartText");
        widgets.add_textarea(contentPane, model, "project_reportEndText");
    }

    var questions = [
        {"id":"projectFacts", "type":"label", "isReportable":false, "isHeader":false},
        {"id":"project_title", "type":"text", "isReportable":true, "isHeader":true},
        {"id":"project_communityOrOrganizationName", "type":"text", "isReportable":true, "isHeader":true},
        {"id":"project_topic", "type":"text", "isReportable":true, "isHeader":true},
        {"id":"project_startAndEndDates", "type":"text", "isReportable":true, "isHeader":true},
        {"id":"project_funders", "type":"textarea", "isReportable":true, "isHeader":true},
        {"id":"project_facilitators", "type":"textarea", "isReportable":true, "isHeader":true},
        {"id":"project_reportStartText", "type":"textarea", "isReportable":true, "isHeader":true},
        {"id":"project_reportEndText", "type":"textarea", "isReportable":true, "isHeader":true}
    ];

    return {
        "id": "page_projectFacts",
        "name": "Enter project facts",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});