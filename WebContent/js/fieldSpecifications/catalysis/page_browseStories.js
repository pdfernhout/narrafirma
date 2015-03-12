define([], function() {
    "use strict";
    return [
        {
            id: "page_browseStories",
            displayName: "Browse stories",
            displayType: "page",
            section: "catalysis",
            modelClass: "ProjectModel"
        },
        {
            id: "browseStories_collectedStoriesAfterCollectionLabel",
            dataType: "none",
            displayType: "label",
            displayPrompt: "On this page you will review your collected stories.\nYou can save stories (or groups of stories) to observations for later use.\nYou can also save excerpts (parts of stories) for later use."
        },
        {
            id: "browseStories_loadLatestStoriesFromServer",
            dataType: "none",
            displayType: "button",
            displayConfiguration: "loadLatestStoriesFromServer",
            displayPrompt: "Load latest stories from server"
        },
        {
            id: "browseStories_totalResults",
            dataType: "none",
            displayType: "functionResult",
            displayConfiguration: "totalNumberOfSurveyResults",
            displayPrompt: "Total number of survey results loaded from server: {{result}}"
        },
        {
            id: "browseStories_collectedStoriesAfterCollection",
            dataType: "none",
            displayType: "storyBrowser",
            displayConfiguration: ["addToObservation:\"page_addToObservation\"","addToExcerpt:\"page_addToExcerpt\""],
            displayPrompt: "Collected stories"
        }
    ];
});
