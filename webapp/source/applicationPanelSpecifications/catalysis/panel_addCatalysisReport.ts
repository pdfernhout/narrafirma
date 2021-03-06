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
            displayPrompt: `Please give this catalysis report a short <strong>name</strong>.<br><br>
            <span.narrafirma-special-warning>A catalysis report must have a name. The name must not be changed after you start using the report.
            The name must be unique within the project.</span>`
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
            displayPrompt: `Add one or more <strong>story collections</strong> to this catalysis report.`
        },


    ]
};

export = panel;

