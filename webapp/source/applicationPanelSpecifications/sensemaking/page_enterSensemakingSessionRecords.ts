import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_enterSensemakingSessionRecords",
    displayName: "Enter sensemaking session records",
    pageExplanation: "Answer questions about the sessions you held.",
    pageCategories: "record",
    headerAbove: "Wrap up",
    panelFields: [
        {
            id: "project_sensemakingSessionRecordsLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you can enter <strong>records</strong> of what happened during your sensemaking sessions."
        },
        {
            id: "project_sensemakingSessionRecordsList",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: "panel_addSensemakingSessionRecord",
            displayName: "Sensemaking session records",
            displayPrompt: "These are the session records you have added. Click on a record to edit it."
        }
    ]
};

export = panel;

