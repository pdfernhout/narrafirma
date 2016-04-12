import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_designInterventions",
    displayName: "Design intervention plans",
    tooltipText: "Write out plans for interventions you want to carry out.",
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

