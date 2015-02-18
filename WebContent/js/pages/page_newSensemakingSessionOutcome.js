// Generated from design
define([], function() {
    "use strict";
    
    var questions = [
        {"id":"sensemakingSessionRecord_outcome_type", "type":"select", "isInReport":true, "isGridColumn":true, "options":["discovery", "opportunity", "issue", "idea", "recommendation", "perspective", "dilemma", "other"]},
        {"id":"sensemakingSessionRecord_outcome_name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"sensemakingSessionRecord_outcome_description", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];
    
    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_newSensemakingSessionOutcome",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});