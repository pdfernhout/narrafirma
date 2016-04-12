import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_enterSensemakingSessionRecords",
    displayName: "Enter sensemaking session records",
    tooltipText: "Reflect on your sensemaking sessions to capture what happened and what you learned.",
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

