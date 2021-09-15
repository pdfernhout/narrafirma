import Globals = require("../../Globals");
import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_reviewIncomingStories",
    displayName: "Review incoming stories",
    tooltipText: "Look at the stories you have collected, fix data entry mistakes, and mark stories to be ignored.",
    headerAbove: "Review and Repair",
    panelFields: [
        {
            id: "collectedStoriesDuringCollectionLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you can see your <strong>collected stories</strong> as they come in."
        },
        {
            id: "storyCollectionChoiceX",
            valuePath: "/clientState/storyCollectionName",
            valueType: "string",
            valueOptions: "project_storyCollections",
            valueOptionsSubfield: "storyCollection_shortName",
            displayType: "select",
            displayName: "Story collection",
            displayPrompt: "Choose a <strong>story collection</strong> to review."
        },
        {
            id: "webStoryCollection_collectedStoriesDuringCollection",
            valuePath: "/clientState/storyCollectionName",
            valueType: "none",
            displayType: "storyBrowser",
            displayPrompt: "Collected stories",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().storyCollectionIdentifier();}
        }
    ]
};

export = panel;

