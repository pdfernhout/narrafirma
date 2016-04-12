import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_prepareProjectPresentation",
    displayName: "Prepare outline of project presentation",
    tooltipText: "Create an outline you can use to present your project to other people.",
    headerAbove: "Support Your Community",
    panelFields: [
        {
            id: "project_presentationLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: "You can use this page to build an outline for a <strong>presentation</strong> about your project to show to others. After you finish building your outline, you can export it, open it in your word processor, format your writing, and add material from NarraFirma's final project report."
        },
        {
            id: "project_presentationElementsList",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: "panel_addPresentationElement",
            displayName: "Statements",
            displayPrompt: "These are the presentation elements you have created so far."
        },
        {
            id: "projectPresentation_exportPresentationOutlineButton",
            valueType: "none",
            displayType: "button",
            displayPrompt: "Export Outline",
            displayConfiguration: "exportPresentationOutline"
        }
    ]
};

export = panel;

