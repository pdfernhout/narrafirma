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
            displayPrompt: "Export entire project with history (includes survey results)"
        },
        {
            id: "importExport_import",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "importEntireProject",
            displayPrompt: "Import entire project with history"
        },
        {
            id: "project_projectFileUploaderForForm",
            valueType: "none",
            displayType: "html",
            displayPrompt: '<input type="file" id="projectFileUploader" name="files" title="Import Project from JSON File" style="display:none"/>'
        },
        {
            id: "importExport_exportCurrentProjectSummary",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "exportProjectCurrentStateWithSurveyResults",
            displayPrompt: "Export current state of project (with survey results)"
        },
        {
            id: "importExport_exportCurrentProjectSummaryWithoutSurveyResults",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "exportProjectCurrentStateWithoutSurveyResults",
            displayPrompt: "Export current state of project (without survey results)"
        },
        {
            id: "importExport_importCurrentProjectSummary",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "importProjectCurrentState",
            displayPrompt: "Import current state of project"
        },
    ]
};

export = panel;
