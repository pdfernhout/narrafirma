import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_sensemaking",
    displayName: "Sensemaking",
    panelFields: [
        {
            id: "sensemakingIntroLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: 
`In the sensemaking phase of your PNI project, you will plan <strong>sensemaking sessions</strong>, 
during which people will make use of your collected <strong>stories and patterns</strong> to think together 
about the topic of your project. Afterward, you can record what happened in your 
sensemaking sessions.`
        }
    ]
};

export = panel;

