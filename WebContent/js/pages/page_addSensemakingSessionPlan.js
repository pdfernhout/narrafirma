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

    return {
        "id": "page_addSensemakingSessionPlan",
        "name": "Enter sensemaking session plan",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});