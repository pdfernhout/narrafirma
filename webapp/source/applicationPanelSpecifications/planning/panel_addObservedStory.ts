import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "panel_addObservedStory",
    modelClass: "ObservedStory",
    panelFields: [
        {
            id: "observedStory_gist",
            valueType: "string",
            displayType: "textarea",
            displayName: "Gist",
            displayPrompt: "What was the <strong>gist</strong> of the story you heard?"
        },
        {
            id: "observedStory_start",
            valueType: "string",
            displayType: "textarea",
            displayName: "Start",
            displayPrompt: `How did the story <strong>start</strong>? How was its abstract offered and accepted? Did you hear any reframing or negotiation?`
        },
        {
            id: "observedStory_evaluation",
            valueType: "string",
            displayType: "textarea",
            displayName: "Evaluation",
            displayPrompt: "Describe any <strong>evaluation statements</strong> you heard as the story was told."
        },
        {
            id: "observedStory_coda",
            valueType: "string",
            displayType: "textarea",
            displayName: "Coda",
            displayPrompt: "Describe the story's <strong>coda</strong>. How did it end?"
        },
        {
            id: "observedStory_response",
            valueType: "string",
            displayType: "textarea",
            displayName: "Response",
            displayPrompt: "What was the <strong>response</strong> to the story? What happened after it was over?"
        },
    ]
};

export = panel;

