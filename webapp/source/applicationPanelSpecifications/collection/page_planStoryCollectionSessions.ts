import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_planStoryCollectionSessions",
    displayName: "Plan story collection sessions",
    tooltipText: "Create agendas for any group story sessions you want to hold.",
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
            displayPrompt: "<strong>Plans</strong> for story collection sessions lay out what you will do and how. Each plan can be used in multiple sessions."
        }
    ]
};

export = panel;

