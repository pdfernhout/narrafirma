import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_addSensemakingSessionPlan",
    displayName: "Enter sensemaking session plan",
    displayType: "panel",
    section: "sensemaking",
    modelClass: "SensemakingSessionPlan",
    panelFields: [
        {
            id: "sensemakingSessionPlan_name",
            valueType: "string",
            required: true,
            displayType: "text",
            displayName: "Name",
            displayPrompt: "Please give this session plan a <strong>name</strong>."
        },
        {
            id: "sensemakingSessionPlan_groups",
            valueType: "string",
            required: true,
            displayType: "text",
            displayName: "Participant groups",
            displayPrompt: "Which participant <strong>group</strong> (or groups) will be involved?"
        },
        {
            id: "sensemakingSessionPlan_repetitions",
            valueType: "string",
            required: true,
            displayType: "text",
            displayName: "Repetitions",
            displayPrompt: "How many <strong>repetitions</strong> of the session will there be?"
        },
        {
            id: "sensemakingSessionPlan_duration",
            valueType: "string",
            required: true,
            displayType: "text",
            displayName: "Length",
            displayPrompt: "<strong>How long</strong> will this session last?"
        },
        {
            id: "sensemakingSessionPlan_times",
            valueType: "string",
            required: true,
            displayType: "text",
            displayName: "Time",
            displayPrompt: "<strong>When</strong> will the sessions take place?"
        },
        {
            id: "sensemakingSessionPlan_location",
            valueType: "string",
            required: true,
            displayType: "text",
            displayName: "Location",
            displayPrompt: "<strong>Where</strong> will these sessions take place?"
        },
        {
            id: "sensemakingSessionPlan_numPeople",
            valueType: "string",
            required: true,
            displayType: "text",
            displayName: "Number of people",
            displayPrompt: "<strong>How many people</strong> will be invited to each repetition of this session?"
        },
        {
            id: "sensemakingSessionPlan_materials",
            valueType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Materials",
            displayPrompt: "What <strong>materials</strong> will this session plan require?"
        },
        {
            id: "sensemakingSessionPlan_details",
            valueType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Other",
            displayPrompt: "Enter other <strong>details</strong> about this session."
        },
        {
            id: "sensemakingSessionPlan_activitiesList",
            valueType: "array",
            required: true,
            displayType: "grid",
            displayConfiguration: "panel_addSensemakingSessionActivity",
            displayName: "Sensemaking session activities",
            displayPrompt: "Here you can enter some <strong>activities</strong> you plan to use in the session. Activities can be simple instructions or complicated exercises (like the creation of timelines)."
        },
        {
            id: "sensemakingSessionPlan_printSensemakingSessionAgendaButton",
            valueType: "none",
            displayType: "button",
            displayPrompt: "Export session agenda"
        }
    ]
};

export = panel;

