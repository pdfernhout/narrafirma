import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_recordInterventions",
    displayName: "Enter intervention records",
    tooltipText: "Reflect on the interventions you carried out to capture what happened and what you learned.",
    headerAbove: "Think About What Happened",
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
            displayConfiguration: "panel_addInterventionRecord",
            displayName: "Intervention records",
            displayPrompt: "These are the intervention records you have created so far."
        }
    ]
};

export = panel;

