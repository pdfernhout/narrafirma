import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_projectOptions",
    displayName: "Project options",
    panelFields: [
        {
            id: "projectOptions_header",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you can set project-wide options."
        },
        {
            id: "projectOptions_csvDelimiter",
            valueType: "string",
            displayType: "radiobuttons",
            valueOptions: ["comma", "semicolon", "tab"],
            displayName: "CSV delimiter",
            displayPrompt: `How do you want CSV files to be <strong>delimited</strong>? 
                That is, what character do you want to use to mark boundaries between cells?
                (If no choice is made here, a comma delimiter will be used.)`
        },
    ]
};

export = panel;
