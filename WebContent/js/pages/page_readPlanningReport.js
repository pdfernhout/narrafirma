// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"project_readPlanningReportIntroductionLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"planningReport", "type":"report", "isInReport":true, "isGridColumn":false, "options":["planning"]}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_readPlanningReport",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});