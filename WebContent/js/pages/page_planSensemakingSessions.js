// Generated from design
define([], function() {
    "use strict";
    
    var questions = [
        {"id":"project_sensemakingSessionPlansLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"sensemakingSessionRecommendations", "type":"recommendationTable", "isInReport":true, "isGridColumn":false, "options":["sensemakingSessions"]},
        {"id":"project_sensemakingSessionPlansList", "type":"grid", "isInReport":true, "isGridColumn":true, "options":["page_addSensemakingSessionPlan"]}
    ];
    
    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_planSensemakingSessions",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});