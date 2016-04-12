import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_projectStories",
    displayName: "Tell project stories",
    tooltipText: "Tell some stories about how your project might play out.",
    headerAbove: "Imagine the Future",
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
            displayType: "grid",
            displayConfiguration: "panel_projectStory",
            displayName: "Project stories",
            displayPrompt: "These are the project stories you have told so far."
        }
    ]
};

export = panel;

