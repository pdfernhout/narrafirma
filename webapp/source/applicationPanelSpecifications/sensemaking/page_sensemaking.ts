import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_sensemaking",
    displayName: "Sensemaking",
    panelFields: [
        {
            id: "sensemakingIntroLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: 
                `In this phase of PNI, you run group sessions 
                in which participants make use of your collected stories and patterns to think together 
                about the topic of your project.`
        }
    ]
};

export = panel;

