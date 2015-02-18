// Generated from design
define([], function() {
    "use strict";
    
    var questions = [
        {"id":"project_collectionProcessReportLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_collectionProcessReport", "type":"report", "isInReport":true, "isGridColumn":false, "options":["collectionProcess"]}
    ];
    
    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_readCollectionProcessReport",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});