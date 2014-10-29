// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"collectionSessionPlan_activity_name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionPlan_activity_type", "type":"select", "isInReport":true, "isGridColumn":true, "options":["ice-breaker", "sharing stories (no task)", "sharing stories (simple task)", "discussing stories", "twice-told stories exercise", "timeline exercise", "landscape exercise", "my own exercise", "other"]},
        {"id":"collectionSessionPlan_activity_plan", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionPlan_activity_optionalParts", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionPlan_activity_duration", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionPlan_activity_recording", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionPlan_activity_materials", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionPlan_activity_spaces", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionPlan_activity_facilitation", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"templates_storyCollectionActivities", "type":"templateList", "isInReport":true, "isGridColumn":false, "options":["storyCollectionActivities"]},
        {"id":"templates_storyCollectionActivities_unfinished", "type":"label", "isInReport":false, "isGridColumn":false}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_addCollectionSessionActivity",
        "name": "Add story collection session activity",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});