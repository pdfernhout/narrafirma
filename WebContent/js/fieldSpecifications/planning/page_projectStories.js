define([], function() {
    "use strict";
    return [
        {
            id: "page_projectStories",
            displayName: "Tell project stories",
            displayType: "page",
            section: "planning",
            modelClass: "ProjectModel"
        },
        {
            id: "project_projectStoriesList",
            dataType: "array",
            required: true,
            displayType: "grid",
            displayConfiguration: "panel_projectStory",
            displayName: "Project stories",
            displayPrompt: "On this page you will tell yourself some stories about how your project might play out.\nThese \"project stories\" will help you think about how best to plan the project."
        }
    ];
});
