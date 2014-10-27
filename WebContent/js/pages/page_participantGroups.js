// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "aboutParticipantGroups");
        widgets.add_grid(contentPane, model, "project_participantGroupsList", ["page_addParticipantGroup"]);
    }

    var questions = [
        {"id":"aboutParticipantGroups", "type":"label", "isReportable":false, "isHeader":false},
        {"id":"project_participantGroupsList", "type":"grid", "isReportable":true, "isHeader":false}
    ];

    return {
        "id": "page_participantGroups",
        "name": "Describe participant groups",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});