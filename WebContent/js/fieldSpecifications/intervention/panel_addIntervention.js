define([], function() {
    "use strict";
    return [
        {
            id: "panel_addIntervention",
            displayName: "Plan an intervention",
            displayType: "panel",
            section: "intervention",
            modelClass: "InterventionModel"
        },
        {
            id: "interventionPlan_name",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Name",
            displayPrompt: "Please name this intervention plan."
        },
        {
            id: "interventionPlan_type",
            dataType: "string",
            dataOptions: ["narrative ombudsman","narrative suggestion box","story sharing space","narrative orientation","narrative learning resource","narrative simulation","narrative presentation","dramatic action","sensemaking space","sensemaking pyramid","narrative mentoring program","narrative therapy","participatory theatre","other"],
            required: true,
            displayType: "select",
            displayName: "Type",
            displayPrompt: "What type of intervention will this be?"
        },
        {
            id: "interventionPlan_description",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Description",
            displayPrompt: "Please describe your plan for this intervention."
        },
        {
            id: "interventionPlan_groups",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Participant groups",
            displayPrompt: "Which participant group(s) will be involved?"
        },
        {
            id: "interventionPlan_times",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Time",
            displayPrompt: "When will the intervention start and end?"
        },
        {
            id: "interventionPlan_locations",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Location",
            displayPrompt: "Where will the intervention take place?"
        },
        {
            id: "interventionPlan_help",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Help",
            displayPrompt: "What sort of help will you need to carry out this intervention?"
        },
        {
            id: "interventionPlan_permission",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Permission",
            displayPrompt: "Describe any permissions you will need to carry out this intervention."
        },
        {
            id: "interventionPlan_participation",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Participation",
            displayPrompt: "How will you get people to participate in this intervention?"
        },
        {
            id: "interventionPlan_materials",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Materials",
            displayPrompt: "What physical materials will you need?"
        },
        {
            id: "interventionPlan_space",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Spaces",
            displayPrompt: "What spaces will you use?"
        },
        {
            id: "interventionPlan_techResources",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Technology",
            displayPrompt: "What technological resources will you need?"
        },
        {
            id: "interventionPlan_recording",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Recording",
            displayPrompt: "How will you record the results of this intervention?"
        }
    ];
});
