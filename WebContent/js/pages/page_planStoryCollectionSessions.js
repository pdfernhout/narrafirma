// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"project_collectionSessionsLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"SPECIAL_collectionSessionRecommendations", "type":"recommendationTable", "isInReport":true, "isGridColumn":false, "options":["collectionSessions"]},
        {"id":"SPECIAL_collectionRecommendationsTable_unfinished", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"SPECIAL_mockup_recTable_collection", "type":"image", "isInReport":true, "isGridColumn":false, "options":["images/mockups/mockupRecTable.png"]},
        {"id":"project_collectionSessionPlansList", "type":"grid", "isInReport":true, "isGridColumn":true, "options":["page_addStoryCollectionSession"]}
    ];

    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_planStoryCollectionSessions",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});