import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_projectRequests",
    displayName: "Respond to requests for post-project support",
    pageExplanation: "Make a note of any requests or inquiries you get as your project winds down.",
    pageCategories: "journal",
    panelFields: [
        {
            id: "project_returnRequestsLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: `On this page you can keep track of <strong>requests for help</strong> you receive as your project winds down. 
                You could keep a record of your requests elsewhere, but keeping them here helps you find them later when you look at the project again.`
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

