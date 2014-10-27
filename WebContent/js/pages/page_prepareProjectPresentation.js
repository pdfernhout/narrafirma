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
        {"id":"project_presentationLabel", "type":"label", "isReportable":false, "isHeader":false},
        {"id":"project_presentationElementsList", "type":"grid", "isReportable":true, "isHeader":false},
        {"id":"projectPresentation_presentationLabel", "type":"label", "isReportable":false, "isHeader":false},
        {"id":"projectPresentation_exportPresentationOutlineButton", "type":"button", "isReportable":false, "isHeader":false}
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