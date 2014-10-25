"use strict";

define([
    "js/widgetBuilder"
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

    return {
        "id": "page_projectFacts",
        "name": "Enter project facts",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});