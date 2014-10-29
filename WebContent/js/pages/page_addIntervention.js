// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"interventionPlan_name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"interventionPlan_type", "type":"select", "isInReport":true, "isGridColumn":true, "options":["narrative ombudsman", "narrative suggestion box", "story sharing space", "narrative orientation", "narrative learning resource", "narrative simulation", "narrative presentation", "dramatic action", "sensemaking space", "sensemaking pyramid", "narrative mentoring program", "narrative therapy", "participatory theatre", "other"]},
        {"id":"interventionPlan_description", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"interventionPlan_times", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"interventionPlan_locations", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"interventionPlan_help", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"interventionPlan_permission", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"interventionPlan_participation", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"interventionPlan_materials", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"interventionPlan_space", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"interventionPlan_techResources", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"interventionPlan_recording", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];

    function addWidgets(builder, contentPane, model) {
        builder.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_addIntervention",
        "name": "Plan an intervention",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});