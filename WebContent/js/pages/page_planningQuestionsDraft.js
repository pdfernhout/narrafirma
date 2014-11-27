// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"project_draftQuestionsLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_pniQuestions_goal_draft", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"project_pniQuestions_relationships_draft", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"project_pniQuestions_focus_draft", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"project_pniQuestions_range_draft", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"project_pniQuestions_scope_draft", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"project_pniQuestions_emphasis_draft", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_planningQuestionsDraft",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});