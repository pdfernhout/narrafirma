// Generated from design
define([], function() {
    "use strict";
    
    var questions = [
        {"id":"project_collectionRecordsIntroductionLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_collectionSessionRecordsList", "type":"grid", "isInReport":true, "isGridColumn":true, "options":["page_addCollectionSessionRecord"]}
    ];
    
    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_enterCollectionSessionRecords",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});