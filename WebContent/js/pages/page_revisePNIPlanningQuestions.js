// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"improvePlanningDrafts", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_PNIquestions_copyDraftsButton", "type":"button", "isInReport":false, "isGridColumn":false},
        {"id":"project_PNIquestions_goal_final", "type":"textarea", "isInReport":true, "isGridColumn":false},
        {"id":"project_PNIquestions_relationships_final", "type":"textarea", "isInReport":true, "isGridColumn":false},
        {"id":"project_PNIquestions_focus_final", "type":"textarea", "isInReport":true, "isGridColumn":false},
        {"id":"project_PNIquestions_range_final", "type":"textarea", "isInReport":true, "isGridColumn":false},
        {"id":"project_PNIquestions_scope_final", "type":"textarea", "isInReport":true, "isGridColumn":false},
        {"id":"project_PNIquestions_emphasis_final", "type":"textarea", "isInReport":true, "isGridColumn":false}
    ];

    function addWidgets(builder, contentPane, model) {
        builder.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_revisePNIPlanningQuestions",
        "name": "Revise PNI Planning questions",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});