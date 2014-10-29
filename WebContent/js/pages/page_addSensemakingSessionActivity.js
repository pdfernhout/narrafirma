// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"sensemakingSessionPlan_activity_name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionPlan_activity_type", "type":"select", "isInReport":true, "isGridColumn":true, "options":["ice-breaker", "encountering stories (no task)", "encountering stories (simple task)", "discussing stories", "twice-told stories exercise", "timeline exercise", "landscape exercise", "story elements exercise", "composite stories exercise", "my own exercise", "other"]},
        {"id":"sensemakingSessionPlan_activity_plan", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionPlan_activity_optionalParts", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionPlan_activity_duration", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionPlan_activity_recording", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionPlan_activity_materials", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionPlan_activity_spaces", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionPlan_activity_facilitation", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"templates_sensemakingActivities", "type":"templateList", "isInReport":true, "isGridColumn":false, "options":["sensemakingActivities"]},
        {"id":"templates_sensemakingActivities_unfinished", "type":"label", "isInReport":false, "isGridColumn":false}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_addSensemakingSessionActivity",
        "name": "Add sensemaking session activity",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});