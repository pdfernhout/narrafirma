"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_text(contentPane, model, "collectionSessionPlan_activity_name");
        widgets.add_select(contentPane, model, "collectionSessionPlan_activity_type", ["ice-breaker","sharing stories (no task)","sharing stories (simple task)","discussing stories","twice-told stories exercise","timeline exercise","landscape exercise","my own exercise","other"]);
        widgets.add_textarea(contentPane, model, "collectionSessionPlan_activity_plan");
        widgets.add_textarea(contentPane, model, "collectionSessionPlan_activity_optionalParts");
        widgets.add_text(contentPane, model, "collectionSessionPlan_activity_duration");
        widgets.add_textarea(contentPane, model, "collectionSessionPlan_activity_recording");
        widgets.add_textarea(contentPane, model, "collectionSessionPlan_activity_materials");
        widgets.add_textarea(contentPane, model, "collectionSessionPlan_activity_spaces");
        widgets.add_textarea(contentPane, model, "collectionSessionPlan_activity_facilitation");
        widgets.add_templateList(contentPane, model, "templates_storyCollectionActivities", ["storyCollectionActivities"]);
        widgets.add_label(contentPane, model, "templates_storyCollectionActivities_unfinished");
    }

    return {
        "id": "page_addCollectionSessionActivity",
        "name": "Add story collection session activity",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});