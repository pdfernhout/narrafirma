define([], function() {
    "use strict";
    return [
        {
            id: "panel_addNewReturnRequest",
            displayName: "Enter project request",
            displayType: "panel",
            section: "return",
            modelClass: "ReturnRequestModel"
        },
        {
            id: "returnRequest_text",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Request",
            displayPrompt: "What is the request?"
        },
        {
            id: "returnRequest_type",
            dataType: "string",
            dataOptions: ["help with their own projects","help with sustaining story exchange","help with examining this project's stories and results","help learning about story work","other"],
            required: true,
            displayType: "select",
            displayName: "Type",
            displayPrompt: "What type of request is this?"
        },
        {
            id: "returnRequest_isMet",
            dataType: "boolean",
            required: true,
            displayType: "boolean",
            displayName: "Satisfied",
            displayPrompt: "Do you consider this request to have been satisfied?"
        },
        {
            id: "returnRequest_whatHappened",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "What happened",
            displayPrompt: "What has happened in relation to this request?"
        },
        {
            id: "returnRequest_notes",
            dataType: "string",
            displayType: "textarea",
            displayName: "Notes",
            displayPrompt: "Enter any notes about the request here."
        }
    ];
});
