"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "project_collectionDesignStartLabel");
        widgets.add_textarea(contentPane, model, "project_generalNotes_collectionDesign");
    }

    return {
        "id": "page_collectionDesign",
        "name": "Collection design",
        "type": "page",
        "isHeader": true,
        "addWidgets": addWidgets
    };
});