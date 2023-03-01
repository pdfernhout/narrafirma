import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_designInterventions",
    displayName: "Design intervention plans",
    pageExplanation: "Decide how you want to intervene in the flow of stories.",
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
            displayIconClass: "recommendationsButtonImage",
            displayConfiguration: "interventions",
            displayPrompt: "Recommendations for intervention plans"
        },
        {
            id: "project_interventionPlansList",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: {
                itemPanelID: "panel_addIntervention",
                gridConfiguration: {
                    addButton: true,
                    removeButton: true, 
                    duplicateButton: true,
               }
            },
            displayName: "Intervention plans",
            displayPrompt: "These are the intervention plans you have added. Click on a plan to edit it."
        }
    ]
};

export = panel;

