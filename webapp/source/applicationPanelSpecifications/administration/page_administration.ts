import versions = require("../../versions");
"use strict";

var panel: Panel = {
    id: "page_administration",
    displayName: "Administration",
    panelFields: [
        {
            id: "administrationVersionLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: "NarraFirma version: " + versions.narrafirmaApplication
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
