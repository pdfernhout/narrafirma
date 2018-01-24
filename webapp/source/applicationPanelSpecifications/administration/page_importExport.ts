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
            id: "importExport_exportHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Export"
        },
        {
            id: "importExport_exportType",
            valueType: "string",
            displayType: "radiobuttons",
            valueOptions: ["project snapshot without stories", "project snapshot with stories", "project history with stories"],
            displayName: "Export type",
            displayPrompt: `In what way would you like to <strong>export the current project</strong>? 
                (A \"project snapshot\" is a copy of the project in its current state. A project history captures all changes to the project
                since it was created. Project histories are not being used for anything special right now, but they could be used 
                to implement an undo system in the future.)
                `
        },
        {
            id: "importExport_exportProject",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "exportProject",
            displayPrompt: "Export project"
        },
        {
            id: "importExport_otherExports",
            valueType: "none",
            displayType: "html",
            displayPrompt: `<p>Other things you can export:</p>
                <ul>
                    <li><a href="javascript:narrafirma_openPage('page_enterStories')">A story form</a></li>
                    <li><a href="javascript:narrafirma_openPage('page_enterStories')">A story collection</a></li>
                </ul>`
        },

        {
            id: "importExport_importHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Import"
        },
        {
            id: "importExport_importType",
            valueType: "string",
            displayType: "radiobuttons",
            valueOptions: ["project snapshot (with or without stories)", "project history with stories"],
            displayName: "Import type",
            displayPrompt: `In what way would you like to <strong>import a previously exported project</strong>? (Note that this should only be done if the current project is empty. 
                If you aren't sure which option to pick, check your project file name. 
                The name of a project snapshot file will include the words \"current state.\")`
        },
        {
            id: "importExport_importProject",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "importProject",
            displayPrompt: "Import project"
        },
        {
            id: "importExport_otherImports",
            valueType: "none",
            displayType: "html",
            displayPrompt: `<p>Other things you can import:</p>
                <ul>
                    <li><a href="javascript:narrafirma_openPage('page_designStoryForms')">A story form</a></li>
                    <li><a href="javascript:narrafirma_openPage('page_enterStories')">Stories</a></li>
                </ul>`
        },
        {
            id: "project_projectFileUploaderForForm",
            valueType: "none",
            displayType: "html",
            displayPrompt: '<input type="file" id="projectFileUploader" name="files" title="Import Project from JSON File" style="display:none"/>'
        },

    ]
};

export = panel;
