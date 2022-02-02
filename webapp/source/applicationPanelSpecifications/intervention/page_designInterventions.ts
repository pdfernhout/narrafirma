import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_designInterventions",
    displayName: "Design intervention plans",
    pageExplanation: "Describe any interventions you plan to carry out: what will happen, who will be involved, what resources you will need. Review recommendations based on your answers on the previous page.",
    pageCategories: "plan",
    panelFields: [
        {
            id: "project_interventionLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you can <strong>design plans</strong> for interventions that change the stories people tell in your community or organization."
        },
        {
            id: "interventionRecommendations",
            valueType: "none",
            displayType: "recommendationTable",
            displayConfiguration: "interventions",
            displayPrompt: "Recommendations for intervention plans"
        },
        {
            id: "project_interventionPlansList",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: "panel_addIntervention",
            displayName: "Intervention plans",
            displayPrompt: "These are the intervention plans you have created so far."
        }
    ]
};

export = panel;

