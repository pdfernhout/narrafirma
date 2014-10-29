// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"project_observationsDisplayList", "type":"grid", "isInReport":true, "isGridColumn":false, "options":["page_createOrEditObservation"]}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_interpretObservations",
        "name": "Review and interpret observations",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});