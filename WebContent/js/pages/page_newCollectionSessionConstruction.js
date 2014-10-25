// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_text(contentPane, model, "collectionSessionRecord_construction_name");
        widgets.add_select(contentPane, model, "collectionSessionRecord_construction_type", ["timeline","landscape","other"]);
        widgets.add_textarea(contentPane, model, "collectionSessionRecord_construction_description");
    }

    return {
        "id": "page_newCollectionSessionConstruction",
        "name": "Story collection construction",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});