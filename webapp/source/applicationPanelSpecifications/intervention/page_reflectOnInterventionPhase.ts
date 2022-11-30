import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_reflectOnInterventionPhase",
    displayName: "Reflect on the intervention phase",
    pageExplanation: "Think about what happened in this part of the project.",
    pageCategories: "journal",
    panelFields: [
        {
            id: "project_phaseReflections_intervention_intro",
            valueType: "none",
            displayType: "label",
            displayPrompt: `On this page you can answer some <strong>reflective questions</strong> 
                that will help you think about what happened.`
        },
        
        {
            id: "project_phaseReflections_intervention_happened",
            valuePath: "project_phaseReflections_intervention_happened",
            valueType: "string",
            displayType: "textarea",
            displayName: "What happened",
            displayPrompt: "What <strong>happened</strong> in the intervention phase of your project?"
        },
        {
            id: "project_phaseReflections_intervention_surprisedAndNot",
            valuePath: "project_phaseReflections_intervention_surprisedAndNot",
            valueType: "string",
            displayType: "textarea",
            displayName: "Surprised and Not",
            displayPrompt: "What <strong>surprised</strong> you? What didn't?"
        },
        {
            id: "project_phaseReflections_intervention_obstaclesAndOpportunities",
            valuePath: "project_phaseReflections_intervention_obstaclesAndOpportunities",
            valueType: "string",
            displayType: "textarea",
            displayName: "Obstacles and Opportunities",
            displayPrompt: `Did any <strong>obstacles</strong> or <strong>opportunities</strong> play a part in how things went? 
                Where did they come from? What did you do about them? How did that work out?`
        },
        {
            id: "project_phaseReflections_intervention_learned",
            valuePath: "project_phaseReflections_intervention_learned",
            valueType: "string",
            displayType: "textarea",
            displayName: "Learned",
            displayPrompt: "What did you <strong>learn</strong> from all of this?"
        },
        {
            id: "project_phaseReflections_intervention_newIdeas",
            valuePath: "project_phaseReflections_intervention_newIdeas",
            valueType: "string",
            displayType: "textarea",
            displayName: "New ideas",
            displayPrompt: "Did any <strong>new ideas</strong> come up that you want to remember in the future?"
        },
        {
            id: "project_phaseReflections_intervention_issues",
            valuePath: "project_phaseReflections_intervention_issues",
            valueType: "string",
            displayType: "textarea",
            displayName: "Issues",
            displayPrompt: "Are there any unresolved <strong>issues</strong> going forward?"
        },
        
    ]
};

export = panel;

