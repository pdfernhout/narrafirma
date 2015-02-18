// Generated from design
define([], function() {
    "use strict";
    
    var questions = [
        {"id":"project_interventionRecordsLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_interventionRecordsList", "type":"grid", "isInReport":true, "isGridColumn":true, "options":["page_addInterventionRecord"]}
    ];
    
    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_recordInterventions",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});