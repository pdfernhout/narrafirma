"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_text(contentPane, model, "collectionSessionPlan_name");
        widgets.add_text(contentPane, model, "collectionSessionPlan_repetitions");
        widgets.add_text(contentPane, model, "collectionSessionPlan_duration");
        widgets.add_text(contentPane, model, "collectionSessionPlan_times");
        widgets.add_text(contentPane, model, "collectionSessionPlan_location");
        widgets.add_text(contentPane, model, "collectionSessionPlan_numPeople");
        widgets.add_text(contentPane, model, "collectionSessionPlan_groups");
        widgets.add_textarea(contentPane, model, "collectionSessionPlan_materials");
        widgets.add_textarea(contentPane, model, "collectionSessionPlan_details");
        widgets.add_grid(contentPane, model, "collectionSessionPlan_activitiesList", ["page_addCollectionSessionActivity"]);
        widgets.add_button(contentPane, model, "collectionSessionPlan_printCollectionSessionAgendaButton");
    }

    return {
        "id": "page_addStoryCollectionSession",
        "name": "Design story collection session",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});