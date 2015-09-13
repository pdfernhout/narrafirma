import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_createNewExcerpt",
    modelClass: "Excerpt",
    panelFields: [
        {
            id: "excerpt_name",
            valueType: "string",
            displayType: "text",
            displayName: "Name",
            displayPrompt: "Please give this excerpt a name."
        },
        {
            id: "excerpt_text",
            valueType: "string",
            displayType: "textarea",
            displayName: "Excerpt",
            displayPrompt: "You can edit the excerpt here."
        },
        {
            id: "excerpt_notes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Notes",
            displayPrompt: "Enter some notes about the excerpt."
        }
    ]
};

export = panel;

