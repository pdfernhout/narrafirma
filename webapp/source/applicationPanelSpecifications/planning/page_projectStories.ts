import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_projectStories",
    displayName: "Tell project stories",
    displayType: "page",
    section: "planning",
    modelClass: "ProjectStoriesActivity",
    panelFields: [
        {
            id: "project_projectStories",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you will tell yourself some <strong>project stories</strong> about how your project might play out. These stories will help you think about how best to plan the project."
        },
        {
            id: "project_projectStoriesList",
            valueType: "array",
            required: true,
            displayType: "grid",
            displayConfiguration: "panel_projectStory",
            displayName: "Project stories",
            displayPrompt: "These are the project stories you have told so far."
        }
    ]
};

export = panel;

