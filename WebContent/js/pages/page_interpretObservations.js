// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"project_observationsDisplayList", "type":"grid", "isInReport":true, "isGridColumn":false, "options":["page_createOrEditObservation"]}
    ];

    function addWidgets(builder, contentPane, model) {
        builder.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_interpretObservations",
        "name": "Review and interpret observations",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});