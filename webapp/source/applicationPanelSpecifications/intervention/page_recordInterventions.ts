import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_recordInterventions",
    displayName: "Enter intervention records",
    pageExplanation: "Describe interventions you carried out.",
    pageCategories: "journal",
    headerAbove: "Wrap up",
    panelFields: [
        {
            id: "project_interventionRecordsLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you can enter <strong>records</strong> of the interventions you have carried out as part of your project."
        },
        {
            id: "project_interventionRecordsList",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: {
                itemPanelID: "panel_addInterventionRecord",
                gridConfiguration: {
                    addButton: true,
                    removeButton: true, 
                    duplicateButton: true,
               }
            },
            displayName: "Intervention records",
            displayPrompt: "These are the intervention records you have added. Click on a record to edit it."
        }
    ]
};

export = panel;

