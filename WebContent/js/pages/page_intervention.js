"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "interventionIntroLabel");
        widgets.add_textarea(contentPane, model, "project_generalNotes_intervention");
    }

    return {
        "id": "page_intervention",
        "name": "Intervention",
        "type": "page",
        "isHeader": true,
        "addWidgets": addWidgets
    };
});