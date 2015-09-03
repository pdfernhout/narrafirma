import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    "id": "panel_addResonantPattern",
    "displayName": "Add resonant pattern",
    "displayType": "panel",
    "section": "sensemaking",
    "modelClass": "resonantPattern",
    "panelFields": [
        {
            "id": "sensemakingSessionRecord_resonantPattern_name",
            "valueType": "string",
            "required": true,
            "displayType": "text",
            "displayName": "Why",
            "displayPrompt": "Please give this resonant pattern a <strong>name</strong>."
        },
        {
            "id": "sensemakingSessionRecord_resonantPattern_type",
            "valueType": "string",
            "valueOptions": [
                "pivot",
                "voice",
                "discovery",
                "other"
            ],
            "required": true,
            "displayType": "select",
            "displayName": "Type",
            "displayPrompt": "Which <strong>type</strong> of resonant pattern is this?"
        },
        {
            "id": "sensemakingSessionRecord_resonantPattern_description",
            "valueType": "string",
            "required": true,
            "displayType": "textarea",
            "displayName": "Description",
            "displayPrompt": "Please <strong>describe</strong> the pattern."
        },
        {
            "id": "sensemakingSessionRecord_resonantPattern_reason",
            "valueType": "string",
            "required": true,
            "displayType": "textarea",
            "displayName": "Why",
            "displayPrompt": "Why did this pattern <strong>stand out</strong>?"
        },
        {
            "id": "sensemakingSessionRecord_resonantPattern_groups",
            "valueType": "string",
            "required": true,
            "displayType": "text",
            "displayName": "Groups",
            "displayPrompt": "For which participant <strong>group</strong>  (or groups) was this pattern important?"
        },
        {
            "id": "sensemakingSessionRecord_resonantPattern_notes",
            "valueType": "string",
            "displayType": "textarea",
            "displayName": "Notes",
            "displayPrompt": "You can enter any other <strong>notes</strong> about this pattern here."
        }
    ]
};

export = panel;

