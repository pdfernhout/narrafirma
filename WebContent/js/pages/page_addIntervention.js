// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_text(contentPane, model, "interventionPlan_name");
        widgets.add_select(contentPane, model, "interventionPlan_type", ["narrative ombudsman","narrative suggestion box","story sharing space","narrative orientation","narrative learning resource","narrative simulation","narrative presentation","dramatic action","sensemaking space","sensemaking pyramid","narrative mentoring program","narrative therapy","participatory theatre","other"]);
        widgets.add_textarea(contentPane, model, "interventionPlan_description");
        widgets.add_text(contentPane, model, "interventionPlan_times");
        widgets.add_text(contentPane, model, "interventionPlan_locations");
        widgets.add_textarea(contentPane, model, "interventionPlan_help");
        widgets.add_textarea(contentPane, model, "interventionPlan_permission");
        widgets.add_textarea(contentPane, model, "interventionPlan_participation");
        widgets.add_textarea(contentPane, model, "interventionPlan_materials");
        widgets.add_textarea(contentPane, model, "interventionPlan_space");
        widgets.add_textarea(contentPane, model, "interventionPlan_techResources");
        widgets.add_textarea(contentPane, model, "interventionPlan_recording");
    }

    return {
        "id": "page_addIntervention",
        "name": "Plan an intervention",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});