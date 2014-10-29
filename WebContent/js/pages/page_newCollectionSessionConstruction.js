// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"collectionSessionRecord_construction_name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionRecord_construction_type", "type":"select", "isInReport":true, "isGridColumn":true, "options":["timeline", "landscape", "other"]},
        {"id":"collectionSessionRecord_construction_description", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];

    function addWidgets(builder, contentPane, model) {
        builder.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_newCollectionSessionConstruction",
        "name": "Story collection construction",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});