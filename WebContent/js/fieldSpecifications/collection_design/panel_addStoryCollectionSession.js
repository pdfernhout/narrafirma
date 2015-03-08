define([], function() {
    "use strict";
    return [
        {
            id: "panel_addStoryCollectionSession",
            displayName: "Design story collection session",
            displayType: "panel",
            section: "collection_design",
            modelClass: "StoryCollectionSessionModel"
        },
        {
            id: "collectionSessionPlan_name",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Name",
            displayPrompt: "Please give this session plan a name."
        },
        {
            id: "collectionSessionPlan_groups",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Participant groups",
            displayPrompt: "From which participant groups will people be invited?"
        },
        {
            id: "collectionSessionPlan_repetitions",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Repetitions",
            displayPrompt: "How many repetitions of the session will there be?"
        },
        {
            id: "collectionSessionPlan_duration",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Length",
            displayPrompt: "How long will each session be?"
        },
        {
            id: "collectionSessionPlan_times",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Time",
            displayPrompt: "At what dates and times will these sessions take place?"
        },
        {
            id: "collectionSessionPlan_location",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Location",
            displayPrompt: "Where will these sessions take place?"
        },
        {
            id: "collectionSessionPlan_numPeople",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Number of people",
            displayPrompt: "How many people will be invited to each repetition of this session?"
        },
        {
            id: "collectionSessionPlan_materials",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Materials",
            displayPrompt: "What materials will this session require?"
        },
        {
            id: "collectionSessionPlan_details",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Other",
            displayPrompt: "Enter other details about this session."
        },
        {
            id: "collectionSessionPlan_activitiesList",
            dataType: "array",
            required: true,
            displayType: "grid",
            displayConfiguration: "panel_addCollectionSessionActivity",
            displayName: "Story collection activities",
            displayPrompt: "Here you can enter some activities you plan for the session.\nActivities within story collection sessions can be simple instructions or complicated exercises (like the creation of timelines)."
        },
        {
            id: "collectionSessionPlan_printCollectionSessionAgendaButton",
            dataType: "none",
            displayType: "button",
            displayPrompt: "Print session agenda"
        }
    ];
});
