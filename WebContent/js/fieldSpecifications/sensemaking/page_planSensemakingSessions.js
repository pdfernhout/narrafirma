define([], function() {
    "use strict";
    return [
        {
            id: "page_planSensemakingSessions",
            displayName: "Plan sensemaking sessions",
            displayType: "page",
            section: "sensemaking",
            modelClass: "ProjectModel"
        },
        {
            id: "project_sensemakingSessionPlansLabel",
            dataType: "none",
            displayType: "label",
            displayPrompt: "On this page you can create plans for your sensemaking sessions."
        },
        {
            id: "sensemakingSessionRecommendations",
            dataType: "none",
            displayType: "recommendationTable",
            displayConfiguration: "sensemakingSessions",
            displayPrompt: "Recommendations for sensemaking sessions"
        },
        {
            id: "project_sensemakingSessionPlansList",
            dataType: "array",
            required: true,
            displayType: "grid",
            displayConfiguration: "panel_addSensemakingSessionPlan",
            displayName: "Sensemaking session plans",
            displayPrompt: "Enter your plans for sensemaking sessions here."
        }
    ];
});
