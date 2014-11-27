// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"collectionSessionPlan_name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionPlan_groups", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionPlan_repetitions", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionPlan_duration", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionPlan_times", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionPlan_location", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionPlan_numPeople", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionPlan_materials", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionPlan_details", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"collectionSessionPlan_activitiesList", "type":"grid", "isInReport":true, "isGridColumn":true, "options":["page_addCollectionSessionActivity"]},
        {"id":"collectionSessionPlan_printCollectionSessionAgendaButton", "type":"button", "isInReport":false, "isGridColumn":false}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_addStoryCollectionSession",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});