import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_sensemaking",
    displayName: "Sensemaking",
    displayType: "page",
    isHeader: true,
    section: "sensemaking",
    modelClass: null,
    panelFields: [
        {
            id: "sensemakingIntroLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: "In the sensemaking phase of your PNI project, you can plan <strong>sensemaking sessions</strong>, during which people make use of your collected stories and catalytic patterns to think together about the topic of your project. Afterward, you can record what happened in your sensemaking sessions.<br><br>Below are links to each step of this phase, along with any reminders you may have entered on them."
        }
    ]
};

export = panel;

