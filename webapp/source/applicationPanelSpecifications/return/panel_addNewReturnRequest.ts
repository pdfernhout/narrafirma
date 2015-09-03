import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_addNewReturnRequest",
    displayName: "Enter project request",
    displayType: "panel",
    section: "return",
    modelClass: "ReturnRequest",
    panelFields: [
        {
            id: "returnRequest_description",
            valueType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Description",
            displayPrompt: "Please <strong>describe</strong> the request."
        },
        {
            id: "returnRequest_type",
            valueType: "string",
            valueOptions: [
                "help with their own projects",
                "help with sustaining story exchange",
                "help with examining this project's stories and results",
                "help learning about story work",
                "other"
            ],
            required: true,
            displayType: "select",
            displayName: "Type",
            displayPrompt: "What <strong>type</strong> of request is this?"
        },
        {
            id: "returnRequest_isMet",
            valueType: "boolean",
            required: true,
            displayType: "boolean",
            displayName: "Satisfied",
            displayPrompt: "Do you consider this request to have been <strong>satisfied</strong>?"
        },
        {
            id: "returnRequest_whatHappened",
            valueType: "string",
            required: true,
            displayType: "textarea",
            displayName: "What happened",
            displayPrompt: "<strong>What has happened</strong> in relation to this request? What discussions took place? Who did what?"
        },
        {
            id: "returnRequest_notes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Notes",
            displayPrompt: "Enter any other <strong>notes</strong> about the request here."
        }
    ]
};

export = panel;

