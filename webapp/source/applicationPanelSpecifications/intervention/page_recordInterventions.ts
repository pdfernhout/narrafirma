import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_recordInterventions",
    displayName: "Enter intervention records",
    displayType: "page",
    section: "intervention",
    modelClass: "EnterInterventionRecordsActivity",
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
            required: true,
            displayType: "grid",
            displayConfiguration: "panel_addInterventionRecord",
            displayName: "Intervention records",
            displayPrompt: "These are the intervention records you have created so far."
        }
    ]
};

export = panel;

