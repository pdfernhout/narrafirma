import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_intervention",
    displayName: "Intervention",
    panelFields: [
        {
            id: "interventionIntroLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: 
                `In this phase of PNI, you design, plan, carry out, and reflect on actions
                you take to change the flow of stories in your community or organization. `
        }
    ]
};

export = panel;

