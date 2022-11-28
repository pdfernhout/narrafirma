import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "panel_addStorySharingObservation",
    modelClass: "StorySharingObservation",
    panelFields: [
        {
            id: "storySharingObservation_name",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "20",
            displayName: "Observation name",
            displayPrompt: "Please give this observation a <strong>name</strong>."
        },
        {
            id: "storySharingObservation_context",
            valueType: "string",
            displayType: "textarea",
            displayName: "Context",
            displayPrompt: "What do you want to remember about the <strong>context</strong> of this conversation?"
        },
        {
            id: "storySharingObservation_surprise",
            valueType: "string",
            displayType: "textarea",
            displayName: "Surprise",
            displayPrompt: "What <strong>surprised</strong> you about this conversation?"
        },
        {
            id: "storySharingObservation_drawingOutStories",
            valueType: "string",
            displayType: "textarea",
            displayName: "Drawing out stories",
            displayPrompt: "If you made any attempts to <strong>draw out stories</strong>, what worked, and what didn't?"
        },
        {
            id: "storySharingObservation_storiesList",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: "panel_addObservedStory",
            displayName: "Observed stories",
            displayPrompt: "Describe the <strong>stories</strong> you heard."
        },
        {
            id: "observationOfStorySharing_chains",
            valueType: "string",
            displayType: "textarea",
            displayName: "Story chains",
            displayPrompt: "Were there any <strong>story chains</strong> in the conversation? If so, what were they like? "
        },
        {
            id: "storySharingObservation_themes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Themes",
            displayPrompt: "Did you notice any <strong>themes</strong> that ran throughout the stories and the conversation?"
        },
        {
            id: "storySharingObservation_lulls",
            valueType: "string",
            displayType: "textarea",
            displayName: "Lulls",
            displayPrompt: "Did you notice any <strong>lulls</strong> or pauses where people weren't sure of what to say next?"
        },
        {
            id: "storySharingObservation_style",
            valueType: "string",
            displayType: "textarea",
            displayName: "Style",
            displayPrompt: `What did you notice about the story-sharing <strong>style</strong> of the conversation? 
                How did match up with - and depart from - your expectations about what a conversational story is like?`
        },
        {
            id: "storySharingObservation_ownStyle",
            valueType: "string",
            displayType: "textarea",
            displayName: "Your style",
            displayPrompt: `What did you notice about <strong>your own</strong> story-sharing style? 
                How was it the same as, and different from, the styles of the other people in the conversation?`
        },
        {
            id: "storySharingObservation_learn",
            valueType: "string",
            displayType: "textarea",
            displayName: "Learned",
            displayPrompt: `What did you <strong>learn</strong> about conversational story sharing by listening to this conversation? `
        },
        {
            id: "storySharingObservation_help",
            valueType: "string",
            displayType: "textarea",
            displayName: "Learned about helping",
            displayPrompt: `What did you learn about <strong>helping</strong> people share stories? `
        },
    ]
};

export = panel;

