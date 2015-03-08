define([], function() {
    "use strict";
    return [
        {
            id: "page_planStoryCollectionSessions",
            displayName: "Plan story collection sessions",
            displayType: "page",
            section: "collection_design",
            modelClass: "ProjectModel"
        },
        {
            id: "project_collectionSessionsLabel",
            dataType: "none",
            displayType: "label",
            displayPrompt: "On this page you will design group sessions in which you will collect stories.\nIf you don't plan to collect stories using group sessions, you can skip this page."
        },
        {
            id: "SPECIAL_collectionSessionRecommendations",
            dataType: "none",
            displayType: "recommendationTable",
            displayConfiguration: "collectionSessions",
            displayPrompt: "Recommendations for story collection sessions"
        },
        {
            id: "project_collectionSessionPlansList",
            dataType: "array",
            required: true,
            displayType: "grid",
            displayConfiguration: "panel_addStoryCollectionSession",
            displayName: "Story collection session plans",
            displayPrompt: "Plans for story collection sessions lay out what you will do and how.\nEach plan can be used in multiple sessions."
        }
    ];
});
