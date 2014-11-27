// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"project_reflectLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_reflect_stories", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"project_reflect_facilitation", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"project_reflect_planning", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"project_reflect_ownPNI", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"project_reflect_community", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"project_reflect_personalStrengths", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"project_reflect_teamStrengths", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"project_reflect_newIdeas", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"project_reflect_notes", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_reflectOnProject",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});