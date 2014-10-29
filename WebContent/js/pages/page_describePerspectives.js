// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"project_perspectivesLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_perspectivesList", "type":"grid", "isInReport":true, "isGridColumn":false, "options":["page_addPerspective"]}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_describePerspectives",
        "name": "Describe perspectives",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});