define([], function() {
    "use strict";
    return [
        {
            id: "panel_addStoryElement",
            displayName: "Add story element",
            displayType: "panel",
            section: "planning",
            modelClass: "StoryElementModel"
        },
        {
            id: "storyElement_name",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Name",
            displayPrompt: "What is the name of the story element?"
        },
        {
            id: "storyElement_type",
            dataType: "string",
            dataOptions: ["character","situation","value","theme","relationship","motivation","belief","conflict"],
            required: true,
            displayType: "select",
            displayName: "Type",
            displayPrompt: "What type of story element is this?"
        },
        {
            id: "storyElement_description",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Description",
            displayPrompt: "You can describe the story element more fully here."
        }
    ];
});
