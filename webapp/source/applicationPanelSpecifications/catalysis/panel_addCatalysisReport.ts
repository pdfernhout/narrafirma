import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "panel_addCatalysisReport",
    modelClass: "CatalysisReport",
    panelFields: [
        {
            id: "catalysisReport_shortName",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "30",
            required: true,
            displayName: "Catalysis report name",
            displayPrompt: `Please give this catalysis report a short <strong>name</strong>.
                The name is required, must be unique within the project, and must not be changed after you start using the catalysis report.`
        },
        {
            id: "catalysisReport_storyCollections",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: {
                itemPanelID: "panel_chooseStoryCollection",
                gridConfiguration: {
                    addButton: true,
                    removeButton: true
                }
            },
            displayName: "Story collections",
            displayPrompt: `Add one or more <strong>story collections</strong> to this catalysis report.`
        },


    ]
};

export = panel;

