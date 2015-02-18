// Generated from design
define([], function() {
    "use strict";
    
    var questions = [
        {"id":"catalysisIntro", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_generalNotes_catalysis", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];
    
    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_catalysis",
        "type": "page",
        "isHeader": true,
        "questions": questions,
        "buildPage": buildPage
    };
});