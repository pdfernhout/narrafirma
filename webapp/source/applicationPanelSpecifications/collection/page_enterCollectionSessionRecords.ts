import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_enterCollectionSessionRecords",
    displayName: "Enter story collection session records",
    panelFields: [
        {
            id: "project_collectionRecordsIntroductionLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you can enter records for any group story <strong>sessions</strong> you held. (If you did not hold any group story sessions, you can skip this page.)"
        },
        {
            id: "project_collectionSessionRecordsList",
            valueType: "array",
            required: true,
            displayType: "grid",
            displayConfiguration: "panel_addCollectionSessionRecord",
            displayName: "Story collection session records",
            displayPrompt: "These are the sessions records you have created so far."
        }
    ]
};

export = panel;

