define([], function() {
    "use strict";
    return [
        {
            id: "page_projectRequests",
            displayName: "Respond to requests for post-project support",
            displayType: "page",
            section: "return",
            modelClass: "ProjectModel"
        },
        {
            id: "project_returnRequestsLabel",
            dataType: "none",
            displayType: "label",
            displayPrompt: "On this page you can keep track of requests for help as your project winds down."
        },
        {
            id: "project_returnRequestsList",
            dataType: "array",
            required: true,
            displayType: "grid",
            displayConfiguration: "panel_addNewReturnRequest",
            displayName: "Help requests",
            displayPrompt: "Enter requests for help here."
        }
    ];
});
