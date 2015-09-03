import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    "id": "panel_addIntervention",
    "displayName": "Plan an intervention",
    "displayType": "panel",
    "section": "intervention",
    "modelClass": "InterventionPlan",
    "panelFields": [
        {
            "id": "interventionPlan_name",
            "valueType": "string",
            "required": true,
            "displayType": "text",
            "displayName": "Name",
            "displayPrompt": "Please give this intervention plan a <strong>name</strong>."
        },
        {
            "id": "interventionPlan_type",
            "valueType": "string",
            "valueOptions": [
                "narrative ombudsman",
                "narrative suggestion box",
                "story sharing space",
                "narrative orientation",
                "narrative learning resource",
                "narrative simulation",
                "narrative presentation",
                "dramatic action",
                "sensemaking space",
                "sensemaking pyramid",
                "narrative mentoring program",
                "narrative therapy",
                "participatory theatre",
                "mixed",
                "other"
            ],
            "required": true,
            "displayType": "select",
            "displayName": "Type",
            "displayPrompt": "What <strong>type</strong> of intervention will this be?"
        },
        {
            "id": "interventionPlan_description",
            "valueType": "string",
            "required": true,
            "displayType": "textarea",
            "displayName": "Description",
            "displayPrompt": "Please describe your <strong>plan</strong> for this intervention."
        },
        {
            "id": "interventionPlan_groups",
            "valueType": "string",
            "required": true,
            "displayType": "text",
            "displayName": "Participant groups",
            "displayPrompt": "Which participant <strong>group</strong> (or groups) will be involved?"
        },
        {
            "id": "interventionPlan_howmany",
            "valueType": "string",
            "required": true,
            "displayType": "text",
            "displayName": "How many",
            "displayPrompt": "<strong>How many</strong> people will be involved in this intervention?"
        },
        {
            "id": "interventionPlan_times",
            "valueType": "string",
            "required": true,
            "displayType": "text",
            "displayName": "Time",
            "displayPrompt": "<strong>When</strong> will the intervention take place?"
        },
        {
            "id": "interventionPlan_locations",
            "valueType": "string",
            "required": true,
            "displayType": "text",
            "displayName": "Location",
            "displayPrompt": "<strong>Where</strong> will the intervention take place?"
        },
        {
            "id": "interventionPlan_help",
            "valueType": "string",
            "required": true,
            "displayType": "textarea",
            "displayName": "Help",
            "displayPrompt": "What sort of <strong>help</strong> will you need to carry out this intervention?"
        },
        {
            "id": "interventionPlan_permission",
            "valueType": "string",
            "required": true,
            "displayType": "textarea",
            "displayName": "Permission",
            "displayPrompt": "Describe any <strong>permissions</strong> you will need to carry out this intervention."
        },
        {
            "id": "interventionPlan_participation",
            "valueType": "string",
            "required": true,
            "displayType": "textarea",
            "displayName": "Participation",
            "displayPrompt": "How will you <strong>recruit</strong> people to participate in this intervention?"
        },
        {
            "id": "interventionPlan_materials",
            "valueType": "string",
            "required": true,
            "displayType": "textarea",
            "displayName": "Materials",
            "displayPrompt": "What physical <strong>materials</strong> will you need?"
        },
        {
            "id": "interventionPlan_space",
            "valueType": "string",
            "required": true,
            "displayType": "textarea",
            "displayName": "Spaces",
            "displayPrompt": "What <strong>spaces</strong> will you use?"
        },
        {
            "id": "interventionPlan_techResources",
            "valueType": "string",
            "required": true,
            "displayType": "textarea",
            "displayName": "Technology",
            "displayPrompt": "What technological <strong>resources</strong> will you need?"
        },
        {
            "id": "interventionPlan_recording",
            "valueType": "string",
            "required": true,
            "displayType": "textarea",
            "displayName": "Recording",
            "displayPrompt": "How will you <strong>record</strong> the results of this intervention?"
        }
    ]
};

export = panel;

