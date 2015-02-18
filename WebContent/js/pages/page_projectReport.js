// Generated from design
define([], function() {
    "use strict";
    
    var questions = [
        {"id":"wholeProjectReportLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"projectReport", "type":"report", "isInReport":true, "isGridColumn":false, "options":["project"]}
    ];
    
    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_projectReport",
        "type": "page",
        "isHeader": true,
        "questions": questions,
        "buildPage": buildPage
    };
});