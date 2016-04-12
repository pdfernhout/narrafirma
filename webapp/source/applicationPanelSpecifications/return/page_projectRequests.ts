import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_projectRequests",
    displayName: "Respond to requests for post-project support",
    tooltipText: "Record requests for help as the project winds down, so you can meet them now and remember them later.",
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
            displayType: "grid",
            displayConfiguration: {
                itemPanelID: "panel_addNewReturnRequest",
                gridConfiguration: {
                    viewButton: true,
                    editButton: true,
                    addButton: true,
                    removeButton: true,
                    columnsToDisplay: ["returnRequest_description", "returnRequest_type", "returnRequest_isMet"]
                }
            },
            displayName: "Help requests",
            displayPrompt: "These are the requests you have recorded so far."
        }
    ]
};

export = panel;

