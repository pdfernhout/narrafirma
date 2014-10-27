// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "catalysisIntro");
        widgets.add_textarea(contentPane, model, "project_generalNotes_catalysis");
    }

    var questions = [
        {"id":"catalysisIntro", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_generalNotes_catalysis", "type":"textarea", "isInReport":true, "isGridColumn":false}
    ];

    return {
        "id": "page_catalysis",
        "name": "Catalysis",
        "type": "page",
        "isHeader": true,
        "addWidgets": addWidgets,
        "questions": questions
    };
});