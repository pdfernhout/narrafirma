// Generated from design
define([], function() {
    "use strict";
    
    var questions = [
        {"id":"project_returnRequestsLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_returnRequestsList", "type":"grid", "isInReport":true, "isGridColumn":true, "options":["page_addNewReturnRequest"]}
    ];
    
    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_projectRequests",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});