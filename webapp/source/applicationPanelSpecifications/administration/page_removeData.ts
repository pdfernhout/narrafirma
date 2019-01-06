import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_removeData",
    displayName: "Data Removal",
    panelFields: [
        {
            id: "removeData_header",
            valueType: "none",
            displayType: "label",
            displayPrompt: "This page can be used to remove data from the project."
        },
        {
            id: "removeData_removeStoriesFromDeletedStoryCollections",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "removeStoriesFromDeletedStoryCollections",
            displayPrompt: "Remove all stories associated with deleted story collections"
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
