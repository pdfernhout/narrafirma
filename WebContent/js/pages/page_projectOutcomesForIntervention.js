// Generated from design
define([], function() {
    "use strict";
    
    var questions = [
        {"id":"project_outcomesList", "type":"grid", "isInReport":true, "isGridColumn":true, "options":["page_projectOutcome"]}
    ];
    
    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_projectOutcomesForIntervention",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});