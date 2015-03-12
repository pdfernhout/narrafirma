define([], function() {
    "use strict";
    return [
        {
            id: "page_reviewIncomingStories",
            displayName: "Review incoming stories",
            displayType: "page",
            section: "collection_process",
            modelClass: "ProjectModel"
        },
        {
            id: "collectedStoriesDuringCollectionLabel",
            dataType: "none",
            displayType: "label",
            displayPrompt: "On this page you can see your collected stories as they come in."
        },
        {
            id: "webStoryCollection_loadLatestStoriesFromServer",
            dataType: "none",
            displayType: "button",
            displayConfiguration: "loadLatestStoriesFromServer",
            displayPrompt: "Load latest stories from server"
        },
        {
            id: "webStoryCollection_totalResults",
            dataType: "none",
            displayType: "function",
            displayConfiguration: "totalNumberOfSurveyResults",
            displayPrompt: "Total number of survey results loaded from server: {{result}}"
        },
        {
            id: "webStoryCollection_collectedStoriesDuringCollection",
            dataType: "none",
            displayType: "storyBrowser",
            displayPrompt: "Collected stories"
        }
    ];
});
