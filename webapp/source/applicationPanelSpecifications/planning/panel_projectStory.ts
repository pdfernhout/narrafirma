import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
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
            displayPrompt: `Start by choosing a <strong>scenario</strong> for your project story. 
                (Click \"Help\" for explanations of these scenario types.)`,
            emptyJournalPrompt: `Start by choosing a <strong>scenario</strong> for your project story.
                If you could ask any question and be guaranteed a truthful answer, what would you like to ask? 
                If you could see or hear any event or interaction, what would you like to see or hear?
                If one aspect of your project mattered more than anything else, what aspect would it be?
                Start your story by answering the question you chose. For example, you might say, 
                "We asked our residents about times when they felt proud of or disappointed in our community"
                or "We were able to listen in as people decided whether to raise their children here."
                `
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
            displayPrompt: "Now choose an <strong>outcome</strong> for your story. How will it end?",
            emptyJournalPrompt: "Now choose an <strong>outcome</strong> for your story. How will it end? Perfectly, horribly, or well enough?"
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
            displayConfiguration: "20",
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

