// Generated from design
define([], function() {
    "use strict";
    
    var questions = [
        {"id":"interventionReportLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"interventionReport", "type":"report", "isInReport":true, "isGridColumn":false, "options":["intervention"]}
    ];
    
    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_interventionReport",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});