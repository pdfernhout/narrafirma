// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"projectFacts", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_title", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"project_communityOrOrganizationName", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"project_topic", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"project_startAndEndDates", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"project_funders", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"project_facilitators", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"project_reportStartText", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"project_reportEndText", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];

    function addWidgets(builder, contentPane, model) {
        builder.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_projectFacts",
        "name": "Enter project facts",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});