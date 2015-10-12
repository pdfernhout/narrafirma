import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_administration",
    displayName: "Administration",
    panelFields: [
        {
            id: "administrationVersionLabel",
            valueType: "none",
            displayType: "label",
            // TODO: This is hard coded. Replace with lookup later.
            displayPrompt: "NarraFirma version: 0.9.0."
        },
        {
            id: "administrationIntroLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: "In the administration section, you can do house-keeping actions like backing up data. Below are links to each activity, along with any reminders you may have entered on them."
        }
    ]
};

export = panel;
