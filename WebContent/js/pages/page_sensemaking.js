// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "sensemakingIntroLabel");
        widgets.add_textarea(contentPane, model, "project_generalNotes_sensemaking");
    }

    var questions = [
        {"id":"sensemakingIntroLabel", "type":"label", "isReportable":false, "isHeader":false},
        {"id":"project_generalNotes_sensemaking", "type":"textarea", "isReportable":true, "isHeader":false}
    ];

    return {
        "id": "page_sensemaking",
        "name": "Sensemaking",
        "type": "page",
        "isHeader": true,
        "addWidgets": addWidgets,
        "questions": questions
    };
});