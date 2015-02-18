// Generated from design
define([], function() {
    "use strict";
    
    var questions = [
        {"id":"project_synopsis", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];
    
    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_writeProjectSynopsis",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});