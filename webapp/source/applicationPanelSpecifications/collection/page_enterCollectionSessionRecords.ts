import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_enterCollectionSessionRecords",
    displayName: "Enter story collection session records",
    pageExplanation: "Answer reflective questions about your story-sharing sessions.",
    pageCategories: "journal",
    panelFields: [
        {
            id: "project_collectionRecordsIntroductionLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you can enter records for any story collecting interviews or <strong>sessions</strong> you held. (If you did not hold any story collecting sessions, you can skip this page.)"
        },
        {
            id: "project_collectionSessionRecordsList",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: {
                itemPanelID: "panel_addCollectionSessionRecord",
                gridConfiguration: {
                    addButton: true,
                    removeButton: true,
                    duplicateButton: true,
                    navigationButtons: true,
                }
            },
            displayName: "Story collection session records",
            displayPrompt: "These are the session records you have added. Click on a record to edit it."
        }
    ]
};

export = panel;

