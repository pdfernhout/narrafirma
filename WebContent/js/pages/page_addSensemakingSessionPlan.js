// Generated from design
define([], function() {
    "use strict";
    
    var questions = [
        {"id":"sensemakingSessionPlan_name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionPlan_groups", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionPlan_repetitions", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionPlan_duration", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionPlan_times", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionPlan_location", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionPlan_numPeople", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionPlan_materials", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionPlan_details", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionPlan_activitiesList", "type":"grid", "isInReport":true, "isGridColumn":true, "options":["page_addSensemakingSessionActivity"]},
        {"id":"sensemakingSessionPlan_printSensemakingSessionAgendaButton", "type":"button", "isInReport":false, "isGridColumn":false}
    ];
    
    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_addSensemakingSessionPlan",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});