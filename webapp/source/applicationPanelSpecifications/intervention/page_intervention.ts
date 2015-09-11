import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_intervention",
    displayName: "Intervention",
    displayType: "page",
    isHeader: true,
    section: "intervention",
    modelClass: null,
    panelFields: [
        {
            id: "interventionIntroLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: 
`In the intervention phase of your PNI project, you will describe your project <strong>outcomes</strong> 
so you can get recommendations for useful narrative interventions (like story sharing spaces or narrative therapy). 
Then you might <strong>plan</strong> interventions 
and <strong>record</strong> what happened when you carried them out.`
        }
    ]
};

export = panel;

