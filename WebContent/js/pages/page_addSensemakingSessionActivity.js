// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_text(contentPane, model, "sensemakingSessionPlan_activity_name");
        widgets.add_select(contentPane, model, "sensemakingSessionPlan_activity_type", ["ice-breaker","encountering stories (no task)","encountering stories (simple task)","discussing stories","twice-told stories exercise","timeline exercise","landscape exercise","story elements exercise","composite stories exercise","my own exercise","other"]);
        widgets.add_textarea(contentPane, model, "sensemakingSessionPlan_activity_plan");
        widgets.add_textarea(contentPane, model, "sensemakingSessionPlan_activity_optionalParts");
        widgets.add_text(contentPane, model, "sensemakingSessionPlan_activity_duration");
        widgets.add_textarea(contentPane, model, "sensemakingSessionPlan_activity_recording");
        widgets.add_textarea(contentPane, model, "sensemakingSessionPlan_activity_materials");
        widgets.add_textarea(contentPane, model, "sensemakingSessionPlan_activity_spaces");
        widgets.add_textarea(contentPane, model, "sensemakingSessionPlan_activity_facilitation");
        widgets.add_templateList(contentPane, model, "templates_sensemakingActivities", ["sensemakingActivities"]);
        widgets.add_label(contentPane, model, "templates_sensemakingActivities_unfinished");
    }

    return {
        "id": "page_addSensemakingSessionActivity",
        "name": "Add sensemaking session activity",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});