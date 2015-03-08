define([], function() {
    "use strict";
    return [
        {
            id: "page_designInterventions",
            displayName: "Design intervention plans",
            displayType: "page",
            section: "intervention",
            modelClass: "ProjectModel"
        },
        {
            id: "project_interventionLabel",
            dataType: "none",
            displayType: "label",
            displayPrompt: "On this page you can design interventions that change the stories people tell\nin your community or organization."
        },
        {
            id: "interventionRecommendations",
            dataType: "none",
            displayType: "recommendationTable",
            displayConfiguration: "interventions",
            displayPrompt: "Recommendations for intervention plans"
        },
        {
            id: "project_interventionPlansList",
            dataType: "array",
            required: true,
            displayType: "grid",
            displayConfiguration: "panel_addIntervention",
            displayName: "Intervention plans",
            displayPrompt: "Enter your plans for narrative interventions here."
        }
    ];
});
