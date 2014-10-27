// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_label(contentPane, model, "project_presentationLabel");
        widgets.add_grid(contentPane, model, "project_presentationElementsList", ["page_addPresentationElement"]);
        widgets.add_label(contentPane, model, "projectPresentation_presentationLabel");
        widgets.add_button(contentPane, model, "projectPresentation_exportPresentationOutlineButton");
    }

    var questions = [
        {"id":"project_presentationLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"project_presentationElementsList", "type":"grid", "isInReport":true, "isGridColumn":false, "options":["page_addPresentationElement"]},
        {"id":"projectPresentation_presentationLabel", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"projectPresentation_exportPresentationOutlineButton", "type":"button", "isInReport":false, "isGridColumn":false}
    ];

    return {
        "id": "page_prepareProjectPresentation",
        "name": "Prepare outline of project presentation",
        "type": "page",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});