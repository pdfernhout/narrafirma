// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "interventionIntroLabel");
        widgets.add_textarea(contentPane, model, "project_generalNotes_intervention");
    }

    var questions = [
        {"id":"interventionIntroLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_generalNotes_intervention", "type":"textarea", "isInReport":true, "isGridColumn":false}
    ];

    return {
        "id": "page_intervention",
        "name": "Intervention",
        "type": "page",
        "isHeader": true,
        "addWidgets": addWidgets,
        "questions": questions
    };
});