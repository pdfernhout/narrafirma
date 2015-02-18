// Generated from design
define([], function() {
    "use strict";
    
    var questions = [
        {"id":"project_collectionSessionsLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"SPECIAL_collectionSessionRecommendations", "type":"recommendationTable", "isInReport":true, "isGridColumn":false, "options":["collectionSessions"]},
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