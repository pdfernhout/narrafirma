import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    "id": "panel_addCatalysisReport",
    "displayName": "Add catalysis report",
    "displayType": "panel",
    "section": "catalysis",
    "modelClass": "CatalysisReport",
    "panelFields": [
        {
            "id": "catalysisReport_shortName",
            "valueType": "string",
            "required": true,
            "displayType": "text",
            "displayName": "Name",
            "displayPrompt": "Please give this catalysis report a short name."
        },
        {
            "id": "catalysisReport_storyCollections",
            "valueType": "array",
            "required": true,
            "displayType": "grid",
            "displayConfiguration": {
                "itemPanelID": "panel_chooseStoryCollection",
                "gridConfiguration": {
                    "viewButton": true,
                    "editButton": true,
                    "addButton": true,
                    "removeButton": true
                }
            },
            "displayName": "Story collections",
            "displayPrompt": "Add one or more story collections to this catalysis report."
        },
        {
            "id": "catalysisReport_notes",
            "valueType": "string",
            "required": true,
            "displayType": "textarea",
            "displayName": "Notes",
            "displayPrompt": "You can enter any extra notes on the catalysis report here."
        }
    ]
};

export = panel;

