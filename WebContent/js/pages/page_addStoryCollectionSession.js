// Generated from design
"use strict";

define([
    "../widgetBuilder"
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

    var questions = [
        {"id":"collectionSessionPlan_name", "type":"text", "isReportable":true, "isHeader":true},
        {"id":"collectionSessionPlan_repetitions", "type":"text", "isReportable":true, "isHeader":true},
        {"id":"collectionSessionPlan_duration", "type":"text", "isReportable":true, "isHeader":true},
        {"id":"collectionSessionPlan_times", "type":"text", "isReportable":true, "isHeader":true},
        {"id":"collectionSessionPlan_location", "type":"text", "isReportable":true, "isHeader":true},
        {"id":"collectionSessionPlan_numPeople", "type":"text", "isReportable":true, "isHeader":true},
        {"id":"collectionSessionPlan_groups", "type":"text", "isReportable":true, "isHeader":true},
        {"id":"collectionSessionPlan_materials", "type":"textarea", "isReportable":true, "isHeader":true},
        {"id":"collectionSessionPlan_details", "type":"textarea", "isReportable":true, "isHeader":true},
        {"id":"collectionSessionPlan_activitiesList", "type":"grid", "isReportable":true, "isHeader":false},
        {"id":"collectionSessionPlan_printCollectionSessionAgendaButton", "type":"button", "isReportable":false, "isHeader":false}
    ];

    return {
        "id": "page_addStoryCollectionSession",
        "name": "Design story collection session",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});