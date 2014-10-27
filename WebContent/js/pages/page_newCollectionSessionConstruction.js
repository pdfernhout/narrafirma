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
        {"id":"collectionSessionRecord_construction_name", "type":"text", "isReportable":true, "isHeader":true},
        {"id":"collectionSessionRecord_construction_type", "type":"select", "isReportable":true, "isHeader":true},
        {"id":"collectionSessionRecord_construction_description", "type":"textarea", "isReportable":true, "isHeader":true}
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