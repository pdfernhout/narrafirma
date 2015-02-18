// Generated from design
define([], function() {
    "use strict";
    
    var questions = [
        {"id":"project_projectPlanningLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_generalNotes_planning", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];
    
    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_planning",
        "type": "page",
        "isHeader": true,
        "questions": questions,
        "buildPage": buildPage
    };
});