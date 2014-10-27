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

    var questions = [
        {"id":"collectionSessionRecord_construction_name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionRecord_construction_type", "type":"select", "isInReport":true, "isGridColumn":true, "options":["timeline", "landscape", "other"]},
        {"id":"collectionSessionRecord_construction_description", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];

    return {
        "id": "page_newCollectionSessionConstruction",
        "name": "Story collection construction",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});