// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"collectionSessionRecord_construction_name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionRecord_construction_type", "type":"select", "isInReport":true, "isGridColumn":true, "options":["timeline", "landscape", "other"]},
        {"id":"collectionSessionRecord_construction_description", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_newCollectionSessionConstruction",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});