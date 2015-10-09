import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_addSensemakingSessionPlan",
    modelClass: "SensemakingSessionPlan",
    panelFields: [
        {
            id: "sensemakingSessionPlan_name",
            valueType: "string",
            displayType: "text",
            displayName: "Sensemaking session plan name",
            displayPrompt: "Please give this session plan a <strong>name</strong>."
        },
        {
            id: "sensemakingSessionPlan_groups",
            valueType: "string",
            displayType: "textarea",
            displayName: "Participant groups",
            displayPrompt: "Which participant <strong>group</strong> (or groups) will be involved?"
        },
        {
            id: "sensemakingSessionPlan_participantGroupsMixing",
            valueType: "string",
            displayType: "textarea",
            displayName: "Mixing",
            displayPrompt: "What are your plans for keeping participant groups <strong>together or apart</strong>?"
        },
        {
            id: "sensemakingSessionPlan_repetitions",
            valueType: "string",
            displayType: "text",
            displayName: "Repetitions",
            displayPrompt: "How many <strong>repetitions</strong> of the session will there be?"
        },
        {
            id: "sensemakingSessionPlan_duration",
            valueType: "string",
            displayType: "text",
            displayName: "Length",
            displayPrompt: "<strong>How long</strong> will this session last?"
        },
        {
            id: "sensemakingSessionPlan_times",
            valueType: "string",
            displayType: "text",
            displayName: "Time",
            displayPrompt: "<strong>When</strong> will the sessions take place?"
        },
        {
            id: "sensemakingSessionPlan_location",
            valueType: "string",
            displayType: "text",
            displayName: "Location",
            displayPrompt: "<strong>Where</strong> will these sessions take place?"
        },
        {
            id: "sensemakingSessionPlan_numPeople",
            valueType: "string",
            displayType: "textarea",
            displayName: "Number of people",
            displayPrompt: "<strong>How many people</strong> will be invited to each repetition of this session?"
        },
        {
            id: "sensemakingSessionPlan_materials",
            valueType: "string",
            displayType: "textarea",
            displayName: "Materials",
            displayPrompt: "What <strong>materials</strong> will this session plan require?"
        },
        {
            id: "sensemakingSessionPlan_smallGroups",
            valueType: "string",
            displayType: "textarea",
            displayName: "Groups",
            displayPrompt: "What sorts of <strong>small groups</strong> will be formed in this session?"
        },
        {
            id: "sensemakingSessionPlan_details",
            valueType: "string",
            displayType: "textarea",
            displayName: "Other",
            displayPrompt: "Enter other <strong>details</strong> about this session."
        },
        {
            id: "sensemakingSessionPlan_activitiesList",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: "panel_addSensemakingSessionActivity",
            displayName: "Sensemaking session activities",
            displayPrompt: "Here you can enter some <strong>activities</strong> you plan to use in the session. Activities can be simple instructions or complicated exercises (like the creation of timelines)."
        },
        {
            id: "sensemakingSessionPlan_printSensemakingSessionAgendaButton",
            valueType: "none",
            displayType: "button",
            displayPrompt: "Export session agenda",
            displayConfiguration: "printSensemakingSessionAgenda"
        }
    ]
};

export = panel;

