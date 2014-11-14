// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"project_readCollectionDesignReportIntroductionLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_collectionDesignReport", "type":"report", "isInReport":true, "isGridColumn":false, "options":["collectionDesign"]}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_readCollectionDesignReport",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});