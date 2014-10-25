"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "catalysisIntro");
        widgets.add_textarea(contentPane, model, "project_generalNotes_catalysis");
    }

    return {
        "id": "page_catalysis",
        "name": "Catalysis",
        "type": "page",
        "isHeader": true,
        "addWidgets": addWidgets
    };
});