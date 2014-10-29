// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"sensemakingSessionRecord_outcome_type", "type":"select", "isInReport":true, "isGridColumn":true, "options":["discovery", "opportunity", "issue", "idea", "recommendation", "perspective", "dilemma", "other"]},
        {"id":"sensemakingSessionRecord_outcome_name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionRecord_outcome_description", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_newSensemakingSessionOutcome",
        "name": "Sensemaking session outcome",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});