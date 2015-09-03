import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_projectRequests",
    displayName: "Respond to requests for post-project support",
    displayType: "page",
    section: "return",
    modelClass: "ProjectRequestsActivity",
    panelFields: [
        {
            id: "project_returnRequestsLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you can keep track of <strong>requests for help</strong> you receive as your project winds down."
        },
        {
            id: "project_returnRequestsList",
            valueType: "array",
            required: true,
            displayType: "grid",
            displayConfiguration: "panel_addNewReturnRequest",
            displayName: "Help requests",
            displayPrompt: "These are the requests you have recorded so far."
        }
    ]
};

export = panel;

