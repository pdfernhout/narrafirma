import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_debug",
    displayName: "Debug",
    pageExplanation: "Used by developers for debugging project data",
    pageCategories: "debug",
    headerAbove: "Debug",
    panelFields: [
        {
            id: "debug_header",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page, software developers can debug project data."
        },
        {
            id: "debug_browser",
            valueType: "none",
            displayType: "debugBrowser",
            displayPrompt: "Debug browser",
        }
    ]
};

export = panel;
