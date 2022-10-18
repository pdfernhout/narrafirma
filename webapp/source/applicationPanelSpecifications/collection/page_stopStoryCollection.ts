import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_stopStoryCollection",
    displayName: "Stop story collection",
    pageExplanation: 'Deactivate an online survey. You can also do this on the "Start story collection" page.',
    pageCategories: "manage",
    headerAbove: "Wrap Up",
    panelFields: [
        {
            id: "webStoryCollection_stopCollectionLabel2",
            valueType: "none",
            displayType: "label",
            displayPrompt: "If you are doing story collection over the internet, you can click this button to make <em>all</em> of your web surveys <strong>unavailable</strong>. You might want to do this when you have finished collecting stories for your project. You can re-enable story collection by going back to the \"Start story collection\" page."
        },
        {
            id: "webStoryCollection_disableWebStoryFormAfterStoryCollectionButton",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "storyCollectionStop",
            displayIconClass: "activateOrDeactivateButtonImage",
            displayPrompt: "Disable All Web-based Story Collection"
        },
        {
            id: "webStoryCollection_enabledTracker2",
            valueType: "none",
            displayType: "functionResult",
            displayConfiguration: "isStoryCollectingEnabled",
            displayPrompt: "Web story collection enabled: <strong>{{result}}</strong>"
        }
    ]
};

export = panel;

