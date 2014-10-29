// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"sensemakingSessionPlan_name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionPlan_repetitions", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionPlan_duration", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionPlan_times", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionPlan_location", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionPlan_numPeople", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionPlan_groups", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionPlan_materials", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionPlan_details", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionPlan_activitiesList", "type":"grid", "isInReport":true, "isGridColumn":false, "options":["page_addSensemakingSessionActivity"]},
        {"id":"sensemakingSessionPlan_printSensemakingSessionAgendaButton", "type":"button", "isInReport":false, "isGridColumn":false}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_addSensemakingSessionPlan",
        "name": "Enter sensemaking session plan",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});