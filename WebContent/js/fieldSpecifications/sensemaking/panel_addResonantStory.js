define([], function() {
    "use strict";
    return [
        {
            id: "panel_addResonantStory",
            displayName: "Add resonant story",
            displayType: "panel",
            section: "sensemaking",
            modelClass: "ResonantStoryModel"
        },
        {
            id: "sensemakingSessionRecord_resonantStory_selection",
            dataType: "none",
            displayType: "storiesList",
            displayName: "Resonant story",
            displayPrompt: "Choose a story to mark as a resonant story for this sensemaking session."
        },
        {
            id: "sensemakingSessionRecord_resonantStory_type",
            dataType: "string",
            dataOptions: ["pivot","voice","discovery","other"],
            required: true,
            displayType: "select",
            displayName: "Type",
            displayPrompt: "Which type of resonant story is this?"
        },
        {
            id: "sensemakingSessionRecord_resonantStory_reason",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Why",
            displayPrompt: "Why did this story stand out?"
        },
        {
            id: "sensemakingSessionRecord_resonantStory_groups",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Groups",
            displayPrompt: "For which participant groups was this story important?"
        },
        {
            id: "sensemakingSessionRecord_resonantStory_notes",
            dataType: "string",
            displayType: "textarea",
            displayName: "Notes",
            displayPrompt: "Would you like to make any other notes about this story?"
        }
    ];
});
