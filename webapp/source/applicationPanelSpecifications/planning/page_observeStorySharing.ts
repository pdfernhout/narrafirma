import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_observeStorySharing",
    displayName: "Observe story sharing",
    pageExplanation: "Listen to conversations and ponder how stories flow.",
    pageCategories: "plan",
    panelFields: [
        {
            id: "observeStorySharing_intro",
            valueType: "none",
            displayType: "label",
            displayPrompt: `You can use this page to think about 
                <strong>how people share stories</strong> in conversation,
                either in general or with respect to your community or organization.
                Here's how to use it.
                Sit down in a group of people and watch how stories are flowing in the conversation (or not).
                Try to encourage the flow of stories. Then answer some questions about what you saw.`
        },
        {
            id: "project_storySharingObservationsList",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: {
                itemPanelID: "panel_addStorySharingObservation",
                gridConfiguration: {
                    addButton: true,
                    removeButton: true,
                    duplicateButton: true,
                }
            },
            displayName: "Story sharing observations",
            displayPrompt: `These are the observations you have added. 
                Each one represents a conversation in which you observed and supported story sharing. 
                Click on an observation to edit it.`
        }
    ]
};

export = panel;

