// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"project_improvePlanningDrafts", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_pniQuestions_copyDraftsButton", "type":"button", "isInReport":false, "isGridColumn":false, "options":["copyDraftPNIQuestionVersionsIntoAnswers"]},
        {"id":"project_pniQuestions_goal_final", "type":"textarea", "isInReport":true, "isGridColumn":false},
        {"id":"project_pniQuestions_relationships_final", "type":"textarea", "isInReport":true, "isGridColumn":false},
        {"id":"project_pniQuestions_focus_final", "type":"textarea", "isInReport":true, "isGridColumn":false},
        {"id":"project_pniQuestions_range_final", "type":"textarea", "isInReport":true, "isGridColumn":false},
        {"id":"project_pniQuestions_scope_final", "type":"textarea", "isInReport":true, "isGridColumn":false},
        {"id":"project_pniQuestions_emphasis_final", "type":"textarea", "isInReport":true, "isGridColumn":false}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_revisePNIPlanningQuestions",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});