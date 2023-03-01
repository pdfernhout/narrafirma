import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_planSensemakingSessions",
    displayName: "Plan sensemaking sessions",
    pageExplanation: "Create a printable agenda for your sensemaking sessions.",
    pageCategories: "plan",
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
            displayIconClass: "recommendationsButtonImage",
            displayConfiguration: "sessions",
            displayPrompt: "Recommendations for sensemaking sessions"
        },
        {
            id: "project_sensemakingSessionPlansList",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: {
                itemPanelID: "panel_addSensemakingSessionPlan",
                gridConfiguration: {
                    addButton: true,
                    removeButton: true, 
                    duplicateButton: true,
               }
            },
            displayName: "Sensemaking session plans",
            displayPrompt: "These are the session plans you have added. Click on a plan to edit it."
        }
    ]
};

export = panel;

