import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_addResonantStory",
    modelClass: "ResonantStory",
    panelFields: [
        {
            id: "sensemakingSessionRecord_resonantStory_name",
            valueType: "string",
            displayType: "text",
            displayName: "Resonant story name",
            displayPrompt: "What is the <strong>name</strong> of the resonant story?"
        },
        {
            id: "sensemakingSessionRecord_resonantStory_type",
            valueType: "string",
            valueOptions: [
                "pivot",
                "voice",
                "discovery",
                "other"
            ],
            displayType: "select",
            displayName: "Type",
            displayPrompt: "Which <strong>type</strong> of resonant story is this?"
        },
        {
            id: "sensemakingSessionRecord_resonantStory_text",
            valueType: "string",
            displayType: "textarea",
            displayName: "Story text",
            displayPrompt: "You can type (or paste) the story <strong>text</strong> (or summary) here."
        },
        {
            id: "sensemakingSessionRecord_resonantStory_reason",
            valueType: "string",
            displayType: "textarea",
            displayName: "Why",
            displayPrompt: "Why did this story <strong>stand out</strong>?"
        },
        {
            id: "sensemakingSessionRecord_resonantStory_peopleSaid",
            valueType: "string",
            displayType: "textarea",
            displayName: "People said",
            displayPrompt: "What did people <strong>say</strong> about this story?"
        },
        {
            id: "sensemakingSessionRecord_resonantStory_notes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Notes",
            displayPrompt: "You can enter any other <strong>notes</strong> about this story here."
        }
    ]
};

export = panel;

