import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_importExport",
    displayName: "Import & Export",
    panelFields: [
        {
            id: "project_importExport_header",
            valueType: "none",
            displayType: "label",
            displayPrompt: "This page can be used to import or export project data in various ways. NOT FINISHED!"
        },
        {
            id: "project_importExport_loadLatest",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "loadLatest",
            displayPrompt: "Load latest (also going away?)"
        },
        {
            id: "project_importExport_importExportOld",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "importExportOld",
            displayPrompt: "Import/Export (old approach)"
        }
    ]
};

export = panel;
