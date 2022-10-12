import versions = require("../../versions");
"use strict";

const panel: Panel = {
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
            displayPrompt: "In this section you can do house-keeping tasks like backing up your data."
        }
    ]
};

export = panel;
