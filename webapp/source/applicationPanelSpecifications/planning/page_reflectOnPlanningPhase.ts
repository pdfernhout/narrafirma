import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_reflectOnPlanningPhase",
    displayName: "Reflect on the planning phase",
    pageExplanation: "Think about what happened in this part of the project.",
    pageCategories: "record",
    panelFields: [
        {
            id: "project_phaseReflections_planning_intro",
            valueType: "none",
            displayType: "label",
            displayPrompt: `On this page you can answer some <strong>reflective questions</strong> 
                that will help you think about what happened.`
        },
        
        {
            id: "project_phaseReflections_planning_learned",
            valuePath: "project_phaseReflections_planning_learned",
            valueType: "string",
            displayType: "textarea",
            displayName: "Learned",
            displayPrompt: "What did you <strong>learn</strong> in the planning phase of your project?"
        },
        {
            id: "project_phaseReflections_planning_surprised",
            valuePath: "project_phaseReflections_planning_surprised",
            valueType: "string",
            displayType: "textarea",
            displayName: "Surprised",
            displayPrompt: "What <strong>surprised</strong> you about what happened?"
        },
        {
            id: "project_phaseReflections_planning_notsurprised",
            valuePath: "project_phaseReflections_planning_notsurprised",
            valueType: "string",
            displayType: "textarea",
            displayName: "Not surprised",
            displayPrompt: "What <strong>didn't surprise</strong> you? What happened just as you thought it would?"
        },
        {
            id: "project_phaseReflections_planning_obstacles",
            valuePath: "project_phaseReflections_planning_obstacles",
            valueType: "string",
            displayType: "textarea",
            displayName: "Obstacles",
            displayPrompt: `Were there any <strong>obstacles</strong> that played a part in how things went? 
                Where did they come from? What did you do to overcome them? How did that work out?`
        },
        {
            id: "project_phaseReflections_planning_opportunities",
            valuePath: "project_phaseReflections_planning_opportunities",
            valueType: "string",
            displayType: "textarea",
            displayName: "Opportunities",
            displayPrompt: `Did any <strong>opportunities</strong> play a part? 
                Where did they come from? What did you do to take advantage of them? How did that work out?`
        },
        {
            id: "project_phaseReflections_planning_newIdeas",
            valuePath: "project_phaseReflections_planning_newIdeas",
            valueType: "string",
            displayType: "textarea",
            displayName: "New ideas",
            displayPrompt: "Did any <strong>new ideas</strong> emerge? How might you want to use those ideas in the future?"
        },
        {
            id: "project_phaseReflections_planning_issues",
            valuePath: "project_phaseReflections_planning_issues",
            valueType: "string",
            displayType: "textarea",
            displayName: "Issues",
            displayPrompt: "Are there any unresolved <strong>issues</strong> going forward?"
        },
        
    ]
};

export = panel;

