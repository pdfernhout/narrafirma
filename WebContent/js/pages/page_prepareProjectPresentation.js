// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"project_presentationLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_presentationElementsList", "type":"grid", "isInReport":true, "isGridColumn":false, "options":["page_addPresentationElement"]},
        {"id":"projectPresentation_presentationLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"projectPresentation_exportPresentationOutlineButton", "type":"button", "isInReport":false, "isGridColumn":false}
    ];

    function addWidgets(builder, contentPane, model) {
        builder.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_prepareProjectPresentation",
        "name": "Prepare outline of project presentation",
        "type": "page",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});