import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_projectStories",
    displayName: "Tell project stories",
    pageExplanation: "Go through a small story-sharing exercise that will help you imagine your project.",
    pageCategories: "plan",
    headerAbove: "Brainstorm",
    panelFields: [
        {
            id: "project_projectStories",
            valueType: "none",
            displayType: "label",
            displayPrompt: `You can use this page to tell yourself some <strong>project stories</strong> about how your project might play out. 
                Project stories help you think through your project's goals and consider its risks and opportunities.`
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

