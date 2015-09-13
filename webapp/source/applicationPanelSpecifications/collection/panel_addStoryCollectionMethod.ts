import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_addStoryCollectionMethod",
    modelClass: "Venue",
    panelFields: [
        {
            id: "storyCollectionMethod_name",
            valueType: "string",
            required: true,
            displayType: "text",
            displayName: "Name",
            displayPrompt: "Please give this method plan a <strong>name</strong>."
        },
        {
            id: "storyCollectionMethod_primary_type",
            valueType: "string",
            valueOptions: [
                "one-on-one expert interviews",
                "group interviews",
                "peer interviews",
                "group story sessions",
                "surveys",
                "journals",
                "narrative incident reports",
                "gleaned stories",
                "other"
            ],
            required: true,
            displayType: "select",
            displayName: "Type",
            displayPrompt: "What <strong>type</strong> of method is this?"
        },
        {
            id: "storyCollectionMethod_participantGroups",
            valueType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Participants",
            displayPrompt: "Which <strong>group</strong> (or groups) of participants will tell stories using this method?"
        },
        {
            id: "storyCollectionMethod_timeline",
            valueType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Timeline",
            displayPrompt: "What is your <strong>timeline</strong> for collecting stories using this method?"
        },
        {
            id: "storyCollectionMethod_locations",
            valueType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Locations",
            displayPrompt: "In what <strong>locations</strong> will stories be collected?"
        },
        {
            id: "storyCollectionMethod_help",
            valueType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Help",
            displayPrompt: "What <strong>help</strong> will you have collecting stories? What are your plans for organizing your help?"
        },
        {
            id: "storyCollectionMethod_resources",
            valueType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Technology",
            displayPrompt: "What <strong>technologies</strong>, if any, will you use to collect stories?"
        },
        {
            id: "storyCollectionMethod_why",
            valueType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Why",
            displayPrompt: "<strong>Why</strong> did you choose this method? Why is it appropriate for this context?"
        },
        {
            id: "storyCollectionMethod_description",
            valueType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Other",
            displayPrompt: "Describe any other <strong>details</strong> of your story collection plans for this method."
        }
    ]
};

export = panel;

