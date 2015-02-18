// Generated from design
define([], function() {
    "use strict";
    
    var questions = [
        {"id":"project_presentationLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_presentationElementsList", "type":"grid", "isInReport":true, "isGridColumn":true, "options":["page_addPresentationElement"]},
        {"id":"projectPresentation_presentationLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"projectPresentation_exportPresentationOutlineButton", "type":"button", "isInReport":false, "isGridColumn":false}
    ];
    
    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_prepareProjectPresentation",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});