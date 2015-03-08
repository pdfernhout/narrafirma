define([], function() {
    "use strict";
    return [
        {
            id: "panel_addSensemakingSessionPlan",
            displayName: "Enter sensemaking session plan",
            displayType: "panel",
            section: "sensemaking",
            modelClass: "SensemakingSessionPlanModel"
        },
        {
            id: "sensemakingSessionPlan_name",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Name",
            displayPrompt: "Please give this session plan a name."
        },
        {
            id: "sensemakingSessionPlan_groups",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Participant groups",
            displayPrompt: "Which participant group(s) will be involved?"
        },
        {
            id: "sensemakingSessionPlan_repetitions",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Repetitions",
            displayPrompt: "How many repetitions of the session will there be?"
        },
        {
            id: "sensemakingSessionPlan_duration",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Length",
            displayPrompt: "How long will this session last?"
        },
        {
            id: "sensemakingSessionPlan_times",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Time",
            displayPrompt: "At what dates and times will the session take place?"
        },
        {
            id: "sensemakingSessionPlan_location",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Location",
            displayPrompt: "Where will these sessions take place?"
        },
        {
            id: "sensemakingSessionPlan_numPeople",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Number of people",
            displayPrompt: "How many people will be invited to each repetition of this session?"
        },
        {
            id: "sensemakingSessionPlan_materials",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Materials",
            displayPrompt: "What materials will this session require?"
        },
        {
            id: "sensemakingSessionPlan_details",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Other",
            displayPrompt: "Enter other details about this session."
        },
        {
            id: "sensemakingSessionPlan_activitiesList",
            dataType: "array",
            required: true,
            displayType: "grid",
            displayConfiguration: "panel_addSensemakingSessionActivity",
            displayName: "Sensemaking session activities",
            displayPrompt: "Here you can enter some activities you plan for the session.\nActivities within story collection sessions can be simple instructions or complicated exercises (like the creation of timelines)."
        },
        {
            id: "sensemakingSessionPlan_printSensemakingSessionAgendaButton",
            dataType: "none",
            displayType: "button",
            displayPrompt: "Print session agenda"
        }
    ];
});
