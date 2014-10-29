// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"aboutParticipantGroups", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_participantGroupsList", "type":"grid", "isInReport":true, "isGridColumn":false, "options":["page_addParticipantGroup"]}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_participantGroups",
        "name": "Describe participant groups",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});