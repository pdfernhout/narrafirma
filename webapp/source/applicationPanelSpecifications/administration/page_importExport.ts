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
            displayPrompt: "On this page you can export project data (for backup or transfer), reset (empty) a project, or import project data into an empty project."
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
                (A project snapshot is a copy of the project's current state, leaving out data that is no longer being used. 
                A project history is a complete backup of everything that was added to the project since its creation. )
                `
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
            displayPrompt: `<p>Other things you can export:</p>
                <ul>
                    <li><a href="javascript:narrafirma_openPage('page_exportStories')">A story form</a></li>
                    <li><a href="javascript:narrafirma_openPage('page_exportStories')">A story collection</a></li>
                </ul>`
        },

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
            displayPrompt: `<p>When you delete a story collection, NarraFirma removes the collection from its list,
                but it does not delete the stories themselves. It just disconnects them.
                You can get the stories back by creating a new story collection with the same name.
                </p><p>
                This is generally a good thing! 
                But if you happen to be importing data, and you are adding and removing story collections over and over to get things right, 
                you could end up with a lot of disconnected stories; 
                and that could cause NarraFirma to run slowly or even run out of memory. 
                If you think you might have this problem, click the button that says "Show removed story collections" below.
                If it says you have disconnected stories (and you think that's a problem), you can remove the stories by doing this:</p>
                <ol>
                <li>In the "Export" section above, choose "project snapshot with stories," then click "Export project". Save the file.</li>
                <li>Click the "Reset project" button below to empty out the project.</li>
                <li>In the "Import" section below, choose "project snapshot (with or without stories), then click "Import project." Choose the file you saved in step one.</li>
                </ol>
                <p>This will restore the project without the disconnected stories. Note that resetting a project requires administrator permission.</p>`
        },
        {
            id: "importExport_showDeletedStoryCollections",
            valueType: "none",
            displayType: "button",
            displayIconClass: "showButtonImage",
            displayConfiguration: "showListOfRemovedStoryCollections",
            displayPrompt: "Show removed story collections"
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
            id: "importExport_importHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Import"
        },
        {
            id: "importExport_importLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: `Importing should be done only if the current project is empty. It requires administrator permission.`
        },
        {
            id: "importExport_importType",
            valueType: "string",
            displayType: "radiobuttons",
            valueOptions: ["project snapshot (with or without stories)", "project history with stories"],
            displayName: "Import type",
            displayPrompt: `In what way would you like to <strong>import a previously exported project</strong>? 
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
