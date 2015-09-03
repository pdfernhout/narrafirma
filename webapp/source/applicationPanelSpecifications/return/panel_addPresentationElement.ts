import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_addPresentationElement",
    displayName: "Add element to project presentation outline",
    displayType: "panel",
    section: "return",
    modelClass: "PresentationElement",
    panelFields: [
        {
            id: "projectPresentationElement_name",
            valueType: "string",
            required: true,
            displayType: "text",
            displayName: "Name",
            displayPrompt: "Please give this presentation element a <strong>name</strong>."
        },
        {
            id: "projectPresentationElement_description",
            valueType: "string",
            required: true,
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
            required: true,
            displayType: "select",
            displayName: "Type",
            displayPrompt: "What <strong>type</strong> of element is this?"
        },
        {
            id: "projectPresentationElement_examples",
            valueType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Examples",
            displayPrompt: "Here you can list some <strong>stories and/or patterns</strong> that illustrate this presentation element."
        },
        {
            id: "projectPresentationElement_QA",
            valueType: "string",
            required: true,
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

