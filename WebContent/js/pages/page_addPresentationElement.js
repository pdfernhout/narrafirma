// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"projectPresentationElement_name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"projectPresentationElement_statement", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"projectPresentationElement_evidence", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"projectPresentationElement_QA", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"projectPresentationElement_notes", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_addPresentationElement",
        "name": "Add element to project presentation outline",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});