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

    return {
        "id": "page_sensemaking",
        "name": "Sensemaking",
        "type": "page",
        "isHeader": true,
        "addWidgets": addWidgets
    };
});