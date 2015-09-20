import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_projectStory",
    modelClass: "ProjectStory",
    panelFields: [
        {
            id: "projectStory_scenario",
            valueType: "string",
            valueOptions: [
                "ask me anything",
                "magic ears",
                "fly on the wall",
                "because of (something about the project)",
                "my own scenario type"
            ],
            displayType: "select",
            displayName: "Scenario",
            displayPrompt: "Start by choosing a <strong>scenario</strong> for your project story. (Click \"Help\" for explanations of these scenario types.)"
        },
        {
            id: "projectStory_outcome",
            valueType: "string",
            valueOptions: [
                "colossal success",
                "miserable failure",
                "acceptable outcome",
                "my own outcome"
            ],
            displayType: "select",
            displayName: "Outcome",
            displayPrompt: "Now choose an <strong>outcome</strong> for your story. How will it end?"
        },
        {
            id: "projectStory_text",
            valueType: "string",
            displayType: "textarea",
            displayName: "Story",
            displayPrompt: "Now tell your project story. Tell it as a <strong>future history</strong>, as though it has already happened."
        },
        {
            id: "projectStory_name",
            valueType: "string",
            displayType: "text",
            displayName: "Project story name",
            displayPrompt: "Please <strong>name</strong> your project story."
        },
        {
            id: "projectStory_surprise",
            valueType: "string",
            displayType: "textarea",
            displayName: "Project story surprise",
            displayPrompt: "What <strong>surprised</strong> you about this story?"
        },
        {
            id: "projectStory_dangers",
            valueType: "string",
            displayType: "textarea",
            displayName: "Project story opportunities or dangers",
            displayPrompt: "Describe any <strong>opportunities</strong> or <strong>dangers</strong> you see in the story."
        },
        {
            id: "projectStory_changes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Project story changes",
            displayPrompt: "Now that you've told and thought about this story, are there any <strong>changes</strong> you want to make to your project plans because of it?"
        }
    ]
};

export = panel;

