// Generated from design
define([], function() {
    "use strict";
    
    var questions = [
        {"id":"project_observationsDisplayList", "type":"grid", "isInReport":true, "isGridColumn":true, "options":["page_createOrEditObservation"]}
    ];
    
    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_interpretObservations",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});