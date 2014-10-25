"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "aboutParticipantGroups");
        widgets.add_grid(contentPane, model, "project_participantGroupsList", ["page_addParticipantGroup"]);
    }

    return {
        "id": "page_participantGroups",
        "name": "Describe participant groups",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});