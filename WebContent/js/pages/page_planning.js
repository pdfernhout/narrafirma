// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"project_projectPlanningLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_generalNotes_planning", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];

    function addWidgets(builder, contentPane, model) {
        builder.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_planning",
        "name": "Planning",
        "type": "page",
        "isHeader": true,
        "questions": questions,
        "addWidgets": addWidgets
    };
});