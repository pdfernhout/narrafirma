import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_prepareProjectPresentation",
    displayName: "Prepare outline of project presentation",
    pageExplanation: "Create a simple outline you can use to tell people the story of your project.",
    pageCategories: "record",
    headerAbove: "Explain",
    panelFields: [
        {
            id: "project_presentationLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: `This is a simple page you can use to build a simple outline for a <strong>presentation</strong> about your project. 
                You could also build this outline in a word processor. Writing it here keeps the outline
                bundled with the rest of your project, so it's easier to look back on later.`
        },
        {
            id: "project_presentationElementsList",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: "panel_addPresentationElement",
            displayName: "Statements",
            displayPrompt: "These are the presentation elements you have added. Click on an element to edit it."
        },
        {
            id: "projectPresentation_exportPresentationOutlineButton",
            valueType: "none",
            displayType: "button",
            displayPrompt: "Print presentation outline",
            displayIconClass: "printButtonImage",
            displayConfiguration: "exportPresentationOutline",
        }
    ]
};

export = panel;

