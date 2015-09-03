import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    "id": "page_enterSensemakingSessionRecords",
    "displayName": "Enter sensemaking session records",
    "displayType": "page",
    "section": "sensemaking",
    "modelClass": "EnterSensemakingSessionRecordsActivity",
    "panelFields": [
        {
            "id": "project_sensemakingSessionRecordsLabel",
            "valueType": "none",
            "displayType": "label",
            "displayPrompt": "On this page you can enter <strong>records</strong> of what happened during your sensemaking sessions."
        },
        {
            "id": "project_sensemakingSessionRecordsList",
            "valueType": "array",
            "required": true,
            "displayType": "grid",
            "displayConfiguration": "panel_addSensemakingSessionRecord",
            "displayName": "Sensemaking session records",
            "displayPrompt": "These are the session records you have created so far."
        }
    ]
};

export = panel;

