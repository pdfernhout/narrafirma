import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_addPresentationElement",
    modelClass: "PresentationElement",
    panelFields: [
        {
            id: "projectPresentationElement_name",
            valueType: "string",
            displayType: "text",
            displayName: "Element name",
            displayPrompt: "Please give this presentation element a <strong>name</strong>."
        },
        {
            id: "projectPresentationElement_description",
            valueType: "string",
            displayType: "textarea",
            displayName: "Description",
            displayPrompt: "<strong>Describe</strong> this presentation element. What do you want to tell people about?"
        },
        {
            id: "projectPresentationElement_type",
            valueType: "string",
            valueOptions: [
                "a background explanation about the project",
                "a report on what happened",
                "a project outcome",
                "something someone said about the project",
                "something you learned during the project",
                "how the project affected the community",
                "a proposal for the future",
                "other"
            ],
            displayType: "select",
            displayName: "Type",
            displayPrompt: "What <strong>type</strong> of element is this?"
        },
        {
            id: "projectPresentationElement_examples",
            valueType: "string",
            displayType: "textarea",
            displayName: "Examples",
            displayPrompt: "Here you can list some <strong>stories and/or patterns</strong> that illustrate this presentation element."
        },
        {
            id: "projectPresentationElement_QA",
            valueType: "string",
            displayType: "textarea",
            displayName: "Q&A",
            displayPrompt: "What <strong>questions</strong> do you anticipate about this element? How would you like to answer them?"
        },
        {
            id: "projectPresentationElement_notes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Notes",
            displayPrompt: "Enter any other <strong>notes</strong> you want to include about this presentation element."
        }
    ]
};

export = panel;

