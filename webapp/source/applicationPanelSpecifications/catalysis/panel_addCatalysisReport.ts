import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_addCatalysisReport",
    modelClass: "CatalysisReport",
    panelFields: [
        {
            id: "catalysisReport_shortName",
            valueType: "string",
            displayType: "text",
            displayName: "Catalysis report name",
            displayPrompt: "Please give this catalysis report a short <strong>name</strong>."
        },
        {
            id: "catalysisReport_storyCollections",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: {
                itemPanelID: "panel_chooseStoryCollection",
                gridConfiguration: {
                    viewButton: true,
                    editButton: true,
                    addButton: true,
                    removeButton: true
                }
            },
            displayName: "Story collections",
            displayPrompt: "Add one or more <strong>story collections</strong> to this catalysis report."
        },
        {
            id: "catalysisReport_notes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Notes",
            displayPrompt: "You can enter <strong>notes</strong> on the catalysis report here. They will appear at the start of your printed report."
        }
    ]
};

export = panel;

