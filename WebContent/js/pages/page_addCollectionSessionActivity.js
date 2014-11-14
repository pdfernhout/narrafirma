// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"collectionSessionActivity_name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionActivity_type", "type":"select", "isInReport":true, "isGridColumn":true, "options":["ice-breaker", "sharing stories (no task)", "sharing stories (simple task)", "discussing stories", "twice-told stories exercise", "timeline exercise", "landscape exercise", "my own exercise", "other"]},
        {"id":"collectionSessionActivity_plan", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionActivity_optionalParts", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionActivity_duration", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionActivity_recording", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionActivity_materials", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionActivity_spaces", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionActivity_facilitation", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"SPECIAL_templates_storyCollectionActivities", "type":"templateList", "isInReport":true, "isGridColumn":false, "options":["storyCollectionActivities"]},
        {"id":"SPECIAL_templates_storyCollectionActivities_unfinished", "type":"label", "isInReport":false, "isGridColumn":false}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_addCollectionSessionActivity",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});