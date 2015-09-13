import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_printProjectReport",
    displayName: "Print project report",
    panelFields: [
        {
            id: "wholeProjectReportLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: "This page will generate a report with all the information you have entered using this software. (UNFINISHED!)"
        }
    ]
};

export = panel;

