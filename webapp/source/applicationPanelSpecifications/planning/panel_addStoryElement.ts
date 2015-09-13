import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_addStoryElement",
    modelClass: "StoryElement",
    panelFields: [
        {
            id: "storyElement_name",
            valueType: "string",
            displayType: "text",
            displayName: "Name",
            displayPrompt: "What is the name of the story element?"
        },
        {
            id: "storyElement_type",
            valueType: "string",
            valueOptions: [
                "character",
                "situation",
                "value",
                "theme",
                "relationship",
                "motivation",
                "belief",
                "conflict"
            ],
            displayType: "select",
            displayName: "Type",
            displayPrompt: "What type of story element is this?"
        },
        {
            id: "storyElement_description",
            valueType: "string",
            displayType: "textarea",
            displayName: "Description",
            displayPrompt: "You can describe the story element more fully here."
        }
    ]
};

export = panel;

