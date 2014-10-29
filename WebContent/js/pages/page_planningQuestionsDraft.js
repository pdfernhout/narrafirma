// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"project_draftQuestionsLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_PNIquestions_goal_draft", "type":"textarea", "isInReport":true, "isGridColumn":false},
        {"id":"project_PNIquestions_relationships_draft", "type":"textarea", "isInReport":true, "isGridColumn":false},
        {"id":"project_PNIquestions_focus_draft", "type":"textarea", "isInReport":true, "isGridColumn":false},
        {"id":"project_PNIquestions_range_draft", "type":"textarea", "isInReport":true, "isGridColumn":false},
        {"id":"project_PNIquestions_scope_draft", "type":"textarea", "isInReport":true, "isGridColumn":false},
        {"id":"project_PNIquestions_emphasis_draft", "type":"textarea", "isInReport":true, "isGridColumn":false}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_planningQuestionsDraft",
        "name": "Answer PNI Planning questions",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});