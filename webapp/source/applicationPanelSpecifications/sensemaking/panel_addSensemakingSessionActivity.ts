import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_addSensemakingSessionActivity",
    modelClass: "SensemakingSessionActivityPlan",
    panelFields: [
       {
            id: "order",
            valueType: "string",
            displayType: "text",
            displayName: "Order",
            displayPrompt: "Specify the order in which to do this sensemaking activity (e.g. 1, 2a, 2b, 3)"
        },
        {
            id: "sensemakingSessionPlan_activity_name",
            valueType: "string",
            displayType: "text",
            displayName: "Name",
            displayPrompt: "Please give this activity a <strong>name</strong>."
        },
        {
            id: "sensemakingSessionPlan_activity_duration",
            valueType: "string",
            displayType: "text",
            displayName: "Length",
            displayPrompt: "<strong>How long</strong> will this activity take?"
        },
        {
            id: "sensemakingSessionPlan_activity_type",
            valueType: "string",
            valueOptions: [
                "ice-breaker",
                "encountering stories (no task)",
                "encountering stories (simple task)",
                "discussing stories",
                "encountering patterns (no task)",
                "encountering patterns (simple task)",
                "discussing patterns",
                "twice-told stories exercise",
                "timeline exercise",
                "landscape exercise",
                "story elements exercise",
                "composite stories exercise",
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
            id: "sensemakingSessionPlan_activity_plan",
            valueType: "string",
            displayType: "textarea",
            displayName: "Plan",
            displayPrompt: "Describe the <strong>plan</strong> for this activity."
        },
        {
            id: "sensemakingSessionPlan_activity_optionalParts",
            valueType: "string",
            displayType: "textarea",
            displayName: "Optional elaborations",
            displayPrompt: "Describe any optional <strong>elaborations</strong> you might or might not use in this activity."
        },
        {
            id: "sensemakingSessionPlan_activity_recording",
            valueType: "string",
            displayType: "textarea",
            displayName: "New stories",
            displayPrompt: "Will new stories be <strong>recorded</strong> during this activity? If so, how?"
        },
        {
            id: "sensemakingSessionPlan_activity_materials",
            valueType: "string",
            displayType: "textarea",
            displayName: "Materials",
            displayPrompt: "What materials (including catalytic materials, e.g., graphs and story cards) will this session plan require?"
        },
        {
            id: "sensemakingSessionPlan_activity_spaces",
            valueType: "string",
            displayType: "textarea",
            displayName: "Spaces",
            displayPrompt: "What <strong>spaces</strong> will be used for this activity?"
        },
        {
            id: "sensemakingSessionPlan_activity_facilitation",
            valueType: "string",
            displayType: "textarea",
            displayName: "Facilitation",
            displayPrompt: "What sort of <strong>facilitation</strong> will be necessary for this activity?"
        },
        {
            id: "sensemakingSessionActivity_helping",
            valueType: "string",
            displayType: "textarea",
            displayName: "Help",
            displayPrompt: "What will <strong>helpers</strong> do during this activity?"
        },
        {
            id: "templates_sensemakingActivities",
            valueType: "none",
            displayType: "templateList",
            displayConfiguration: "sensemakingActivities",
            displayPrompt: "Copy activity from template"
        }
    ]
};

export = panel;

