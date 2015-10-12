import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_newSensemakingSessionOutcome",
    modelClass: "SensemakingSessionOutcome",
    panelFields: [
        {
            id: "sensemakingSessionRecord_outcome_name",
            valueType: "string",
            displayType: "text",
            displayName: "Name",
            displayPrompt: "Please give this outcome a <strong>name</strong>."
        },
        {
            id: "sensemakingSessionRecord_outcome_type",
            valueType: "string",
            valueOptions: [
                "discovery",
                "opportunity",
                "issue",
                "idea",
                "recommendation",
                "perspective",
                "dilemma",
                "discussion",
                "priority",
                "other"
            ],
            displayType: "select",
            displayName: "Type",
            displayPrompt: "What <strong>type</strong> of session outcome is this?"
        },
        {
            id: "sensemakingSessionRecord_outcome_description",
            valueType: "string",
            displayType: "textarea",
            displayName: "Description",
            displayPrompt: "<strong>Describe</strong> the outcome."
        }
    ]
};

export = panel;

