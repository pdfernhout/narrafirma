define([], function() {
    "use strict";
    return [
        {
            id: "page_startStoryCollection",
            displayName: "Start story collection",
            displayType: "page",
            section: "collection_process",
            modelClass: "ProjectModel"
        },
        {
            id: "webStoryCollection_startCollectionLabel",
            dataType: "none",
            displayType: "label",
            displayPrompt: "If you are doing story collection over the internet, click this button to make the web form \"live\" and able to be used by people other than yourself."
        },
        {
            id: "webStoryCollection_enableStoryCollectionButton",
            dataType: "none",
            displayType: "button",
            displayConfiguration: "storyCollectionStart",
            displayPrompt: "Start web story collection"
        },
        {
            id: "webStoryCollection_enabledTracker",
            dataType: "none",
            displayType: "function",
            displayConfiguration: "isStoryCollectingEnabled",
            displayPrompt: "Web story collection enabled:"
        },
        {
            id: "webStoryCollection_copyStoryFormURLButton",
            dataType: "none",
            displayType: "button",
            displayConfiguration: "copyStoryFormURL",
            displayPrompt: "Copy story form web URL link"
        },
        {
            id: "webStoryCollection_stopCollectionLabel",
            dataType: "none",
            displayType: "label",
            displayPrompt: "You can also disable the data collection here."
        },
        {
            id: "webStoryCollection_disableStoryCollectionButton",
            dataType: "none",
            displayType: "button",
            displayConfiguration: "storyCollectionStop",
            displayPrompt: "Stop web story collection"
        }
    ];
});
