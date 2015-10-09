import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_addResonantPattern",
    modelClass: "ResonantPattern",
    panelFields: [
        {
            id: "sensemakingSessionRecord_resonantPattern_name",
            valueType: "string",
            displayType: "text",
            displayName: "Why",
            displayPrompt: "Please give this resonant pattern a <strong>name</strong>."
        },
        {
            id: "sensemakingSessionRecord_resonantPattern_type",
            valueType: "string",
            valueOptions: [
                "pivot",
                "voice",
                "discovery",
                "other"
            ],
            displayType: "select",
            displayName: "Type",
            displayPrompt: "Which <strong>type</strong> of resonant pattern is this?"
        },
        {
            id: "sensemakingSessionRecord_resonantPattern_description",
            valueType: "string",
            displayType: "textarea",
            displayName: "Description",
            displayPrompt: "Please <strong>describe</strong> the pattern."
        },
        {
            id: "sensemakingSessionRecord_resonantPattern_reason",
            valueType: "string",
            displayType: "textarea",
            displayName: "Why",
            displayPrompt: "Why did this pattern <strong>stand out</strong>?"
        },
        {
            id: "sensemakingSessionRecord_resonantPattern_peopleSaid",
            valueType: "string",
            displayType: "textarea",
            displayName: "People said",
            displayPrompt: "What did people <strong>say</strong> about this pattern?"
        },
        {
            id: "sensemakingSessionRecord_resonantPattern_notes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Notes",
            displayPrompt: "You can enter any other <strong>notes</strong> about this pattern here."
        }
    ]
};

export = panel;

