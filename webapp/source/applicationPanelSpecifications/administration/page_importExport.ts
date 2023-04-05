import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_importExport",
    displayName: "Import & Export",
    pageExplanation: "Backup or restore project data, or copy it from one project to another.",
    pageCategories: "manage",
    headerAbove: "Integrate",
    panelFields: [
        {
            id: "importExport_header",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you can import project data (into an empty project), export project data (for backup or transfer), or reset (empty) a project."
        },

        // import
        {
            id: "importExport_importHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Import"
        },
        {
            id: "importExport_importLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: `Importing should only be done if the current project is empty. It requires administrator permission.`
        },
        {
            id: "importExport_importType",
            valueType: "string",
            displayType: "radiobuttons",
            valueOptions: ["project snapshot (with or without stories)", "project history with stories"],
            displayName: "Import type",
            displayPrompt: `How would you like to <strong>import a previously exported project</strong>? 
                If you aren't sure which option to pick, check your project file name. 
                The name of a snapshot file will include the words \"current state.\"`
        },
        {
            id: "importExport_importProject",
            valueType: "none",
            displayType: "button",
            displayIconClass: "importButtonImage",
            displayConfiguration: "importProject",
            displayPrompt: "Import project"
        },
        {
            id: "importExport_otherImports",
            valueType: "none",
            displayType: "html",
            displayPrompt: `<p style="margin: 0">You can also import <a href="javascript:narrafirma_openPage('page_designStoryForms')">story forms</a> and 
                <a href="javascript:narrafirma_openPage('page_enterStories')">stories</a>.
                See the <a href="help/collection/help_page_importGuide.html" target="_blank">Import guide</a> for details.</p>`
        },

        // export
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
            displayPrompt: `How would you like to <strong>export the current project</strong>? 
                A project snapshot is a copy of the project's current state, leaving out data that is no longer being used. 
                A project history is a complete backup of everything that was added to the project since its creation.`
        },
        {
            id: "importExport_exportProject",
            valueType: "none",
            displayType: "button",
            displayIconClass: "exportButtonImage",
            displayConfiguration: "exportProject",
            displayPrompt: "Export project"
        },
        {
            id: "importExport_otherExports",
            valueType: "none",
            displayType: "html",
            displayPrompt: `<p style="margin: 0">You can also export <a href="javascript:narrafirma_openPage('page_exportStories')">story forms</a> and
                    <a href="javascript:narrafirma_openPage('page_exportStories')">story collections</a>.</p>`
        },

        // check
        {
            id: "importExport_checkHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Check"
        },
        {
            id: "importExport_showDeletedStoryCollections_label",
            valueType: "none",
            displayType: "label",
            displayPrompt: `Deleted story collections leave disconnected stories behind.
                If you delete many story collections, you may encounter slowdowns or memory problems.
                Click here to see a list of the story collections you have deleted.
                You can remove disconnected stories by exporting, resetting, and re-importing the project. Click the Help button for details.
                `
        },
        {
            id: "importExport_showDeletedStoryCollections",
            valueType: "none",
            displayType: "button",
            displayIconClass: "showButtonImage",
            displayConfiguration: "showListOfRemovedStoryCollections",
            displayPrompt: "Show removed story collections"
        },

        // reset
        {
            id: "importExport_resetHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Reset"
        },
        {
            id: "importExport_resetLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: `
                Resetting a project empties it out, removing all of its content. Be careful!
                Click the Help button for details.
                This action requires administrator permission.`
        },
        {
            id: "importExport_resetProject",
            valueType: "none",
            displayType: "button",
            displayIconClass: "removeButtonImage",
            displayConfiguration: "resetProject",
            displayPrompt: "Reset project"
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
