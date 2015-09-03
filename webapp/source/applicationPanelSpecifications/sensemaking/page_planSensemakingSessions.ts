import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_planSensemakingSessions",
    displayName: "Plan sensemaking sessions",
    displayType: "page",
    section: "sensemaking",
    modelClass: "PlanSensemakingSessionsActivity",
    panelFields: [
        {
            id: "project_sensemakingSessionPlansLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you can create <strong>plans</strong> for your sensemaking sessions. After a plan is complete, you can print a session agenda and use it to remember what you plan to do, and to coordinate your facilitation with any helpers you might have."
        },
        {
            id: "sensemakingSessionRecommendations",
            valueType: "none",
            displayType: "recommendationTable",
            displayConfiguration: "sessions",
            displayPrompt: "Recommendations for sensemaking sessions"
        },
        {
            id: "project_sensemakingSessionPlansList",
            valueType: "array",
            required: true,
            displayType: "grid",
            displayConfiguration: "panel_addSensemakingSessionPlan",
            displayName: "Sensemaking session plans",
            displayPrompt: "These are the session plans you have created so far."
        }
    ]
};

export = panel;

