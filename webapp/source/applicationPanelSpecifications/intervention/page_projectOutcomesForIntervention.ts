import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_projectOutcomesForIntervention",
    displayName: "Answer questions about project outcomes",
    pageExplanation: "Describe the outcome of your project (so far) for each participant group. (Your answers will be used to recommend interventions on the next page.)",
    pageCategories: "plan",
    headerAbove: "Plan Interventions",
    panelFields: [
        {
            id: "project_outcomes_intro",
            valueType: "none",
            displayType: "label",
            displayPrompt: "In order to choose interventions that will be useful in your project, it will be helpful to think about some of the <strong>outcomes</strong> of your project (so far). Please answer these questions in reference to the <strong>participant groups</strong> you set up in the project planning phase. Enter one set of outcomes for each participant group."
        },
        {
            id: "project_outcomesList",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: "panel_projectOutcome",
            displayName: "Project outcomes",
            displayPrompt: "These are the participant groups for which you have entered outcomes so far."
        }
    ]
};

export = panel;

