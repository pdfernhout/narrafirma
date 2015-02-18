// Generated from design
define([], function() {
    "use strict";
    
    var questions = [
        {"id":"projectPresentationElement_name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"projectPresentationElement_statement", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"projectPresentationElement_evidence", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"projectPresentationElement_QA", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"projectPresentationElement_notes", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];
    
    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_addPresentationElement",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});