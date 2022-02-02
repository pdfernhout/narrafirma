import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_enterSensemakingSessionRecords",
    displayName: "Enter sensemaking session records",
    pageExplanation: "Reflect on your sensemaking sessions. Think about what you saw and heard and learned.",
    pageCategories: "record",
    headerAbove: "Think About What Happened",
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
            displayPrompt: "These are the session records you have created so far."
        }
    ]
};

export = panel;

