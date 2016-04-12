import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_stopStoryCollection",
    displayName: "Stop story collection",
    tooltipText: "Deactivate your online surveys.",
    headerAbove: "Wrap Up Story Collection",
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

