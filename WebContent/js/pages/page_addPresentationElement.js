// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_text(contentPane, model, "projectPresentationElement_name");
        widgets.add_textarea(contentPane, model, "projectPresentationElement_statement");
        widgets.add_textarea(contentPane, model, "projectPresentationElement_evidence");
        widgets.add_textarea(contentPane, model, "projectPresentationElement_QA");
        widgets.add_textarea(contentPane, model, "projectPresentationElement_notes");
    }

    var questions = [
        {"id":"projectPresentationElement_name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"projectPresentationElement_statement", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"projectPresentationElement_evidence", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"projectPresentationElement_QA", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"projectPresentationElement_notes", "type":"textarea", "isInReport":true, "isGridColumn":true}
    ];

    return {
        "id": "page_addPresentationElement",
        "name": "Add element to project presentation outline",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});