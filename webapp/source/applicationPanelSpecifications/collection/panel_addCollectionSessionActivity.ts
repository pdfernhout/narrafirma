import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_addCollectionSessionActivity",
    modelClass: "CollectionSessionActivity",
    panelFields: [
        {
            id: "order",
            valueType: "string",
            displayType: "text",
            displayName: "Order",
            displayPrompt: "Specify the <strong>order</strong> in which to do this collection activity (e.g., 1, 2a, 2b, 3)."
        },
        {
            id: "collectionSessionActivity_name",
            valueType: "string",
            displayType: "text",
            displayName: "Name",
            displayPrompt: "Please give this activity a <strong>name</strong>."
        },
        {
            id: "collectionSessionActivity_duration",
            valueType: "string",
            displayType: "text",
            displayName: "Length",
            displayPrompt: "<strong>How long</strong> will this activity take?"
        },
        {
            id: "collectionSessionActivity_type",
            valueType: "string",
            valueOptions: [
                "ice-breaker",
                "sharing stories (no task)",
                "sharing stories (simple task)",
                "discussing stories",
                "looking for patterns in stories",
                "twice-told stories exercise",
                "timeline exercise",
                "landscape exercise",
                "my own exercise",
                "break",
                "wrap-up",
                "other"
            ],
            displayType: "select",
            displayName: "Type",
            displayPrompt: "What <strong>type</strong> of activity is this?"
        },
        {
            id: "collectionSessionActivity_plan",
            valueType: "string",
            displayType: "textarea",
            displayName: "Plan",
            displayPrompt: "Describe the <strong>plan</strong> for this activity."
        },
        {
            id: "collectionSessionActivity_optionalParts",
            valueType: "string",
            displayType: "textarea",
            displayName: "Optional elaborations",
            displayPrompt: "Describe any optional <strong>elaborations</strong> you might or might not use in this activity."
        },
        {
            id: "collectionSessionActivity_recording",
            valueType: "string",
            displayType: "textarea",
            displayName: "Recording",
            displayPrompt: "How will stories be <strong>recorded</strong> during this activity?"
        },
        {
            id: "collectionSessionActivity_materials",
            valueType: "string",
            displayType: "textarea",
            displayName: "Materials",
            displayPrompt: "What <strong>materials</strong> will be needed for this activity?"
        },
        {
            id: "collectionSessionActivity_spaces",
            valueType: "string",
            displayType: "textarea",
            displayName: "Spaces",
            displayPrompt: "What <strong>spaces</strong> will be used for this activity?"
        },
        {
            id: "collectionSessionActivity_facilitation",
            valueType: "string",
            displayType: "textarea",
            displayName: "Facilitation",
            displayPrompt: "What sort of <strong>facilitation</strong> will be necessary for this activity?"
        },
        {
            id: "collectionSessionActivity_helping",
            valueType: "string",
            displayType: "textarea",
            displayName: "Helpers",
            displayPrompt: "What will <strong>helpers</strong> do during this activity?"
        },
        {
            id: "SPECIAL_templates_storyCollectionActivities",
            valueType: "none",
            displayType: "templateList",
            displayConfiguration: "storyCollectionActivities",
            displayPrompt: "Copy an activity from a template"
        }
    ]
};

export = panel;

