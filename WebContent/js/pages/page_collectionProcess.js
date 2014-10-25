"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "collectionProcessIntro");
        widgets.add_textarea(contentPane, model, "project_generalNotes_collectionProcess");
    }

    return {
        "id": "page_collectionProcess",
        "name": "Collection process",
        "type": "page",
        "isHeader": true,
        "addWidgets": addWidgets
    };
});