import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_importExport",
    displayName: "Import & Export",
    panelFields: [
        {
            id: "importExport_header",
            valueType: "none",
            displayType: "label",
            displayPrompt: "This page can be used to import or export project data in various ways."
        },
        {
            id: "importExport_export",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "exportEntireProject",
            displayPrompt: "Export entire project"
        },
        {
            id: "project_projectFileUploaderForForm",
            valueType: "none",
            displayType: "html",
            displayPrompt: '<input type="file" id="projectFileUploader" name="files" title="Import Project from JSON File" style="display:none"/>'
        },
        {
            id: "importExport_import",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "importEntireProject",
            displayPrompt: "Import entire project"
        }
    ]
};

export = panel;
