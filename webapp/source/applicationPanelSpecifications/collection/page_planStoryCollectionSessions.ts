import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_planStoryCollectionSessions",
    displayName: "Plan story collection sessions",
    pageExplanation: "Design printable agendas for story-sharing sessions.",
    pageCategories: "plan",
    panelFields: [
        {
            id: "project_collectionSessionsLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you can design group <strong>sessions</strong> in which you will collect stories. (If you don't plan to collect stories using group sessions, you can skip this page.)"
        },
        {
            id: "SPECIAL_collectionSessionRecommendations",
            valueType: "none",
            displayType: "recommendationTable",
            displayConfiguration: "sessions",
            displayPrompt: "Recommendations for story collection sessions"
        },
        {
            id: "project_collectionSessionPlansList",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: "panel_addStoryCollectionSession",
            displayName: "Story collection session plans",
            displayPrompt: "These are the session plans you have added. Click on a plan to edit it. (A single plan can be used for multiple sessions.)"
        }
    ]
};

export = panel;

