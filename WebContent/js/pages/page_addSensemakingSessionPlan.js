// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_text(contentPane, model, "sensemakingSessionPlan_name");
        widgets.add_text(contentPane, model, "sensemakingSessionPlan_repetitions");
        widgets.add_text(contentPane, model, "sensemakingSessionPlan_duration");
        widgets.add_text(contentPane, model, "sensemakingSessionPlan_times");
        widgets.add_text(contentPane, model, "sensemakingSessionPlan_location");
        widgets.add_text(contentPane, model, "sensemakingSessionPlan_numPeople");
        widgets.add_text(contentPane, model, "sensemakingSessionPlan_groups");
        widgets.add_textarea(contentPane, model, "sensemakingSessionPlan_materials");
        widgets.add_textarea(contentPane, model, "sensemakingSessionPlan_details");
        widgets.add_grid(contentPane, model, "sensemakingSessionPlan_activitiesList", ["page_addSensemakingSessionActivity"]);
        widgets.add_button(contentPane, model, "sensemakingSessionPlan_printSensemakingSessionAgendaButton");
    }

    var questions = [
        {"id":"sensemakingSessionPlan_name", "type":"text", "isReportable":true, "isHeader":true},
        {"id":"sensemakingSessionPlan_repetitions", "type":"text", "isReportable":true, "isHeader":true},
        {"id":"sensemakingSessionPlan_duration", "type":"text", "isReportable":true, "isHeader":true},
        {"id":"sensemakingSessionPlan_times", "type":"text", "isReportable":true, "isHeader":true},
        {"id":"sensemakingSessionPlan_location", "type":"text", "isReportable":true, "isHeader":true},
        {"id":"sensemakingSessionPlan_numPeople", "type":"text", "isReportable":true, "isHeader":true},
        {"id":"sensemakingSessionPlan_groups", "type":"text", "isReportable":true, "isHeader":true},
        {"id":"sensemakingSessionPlan_materials", "type":"textarea", "isReportable":true, "isHeader":true},
        {"id":"sensemakingSessionPlan_details", "type":"textarea", "isReportable":true, "isHeader":true},
        {"id":"sensemakingSessionPlan_activitiesList", "type":"grid", "isReportable":true, "isHeader":false},
        {"id":"sensemakingSessionPlan_printSensemakingSessionAgendaButton", "type":"button", "isReportable":false, "isHeader":false}
    ];

    return {
        "id": "page_addSensemakingSessionPlan",
        "name": "Enter sensemaking session plan",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});