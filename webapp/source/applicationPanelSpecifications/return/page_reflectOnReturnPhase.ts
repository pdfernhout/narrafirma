import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_reflectOnReturnPhase",
    displayName: "Reflect on the return phase",
    pageExplanation: "Think about what happened in this part of the project.",
    pageCategories: "record",
    headerAbove: "Wrap up",
    panelFields: [
        {
            id: "project_phaseReflections_return_intro",
            valueType: "none",
            displayType: "label",
            displayPrompt: `On this page you can answer some <strong>reflective questions</strong> 
                that will help you learn from what happened and record what you learned.`
        },
        
        {
            id: "project_phaseReflections_return_learned",
            valuePath: "project_phaseReflections_return_learned",
            valueType: "string",
            displayType: "textarea",
            displayName: "Learned",
            displayPrompt: "What did you <strong>learn</strong> in the return phase of your project?"
        },
        {
            id: "project_phaseReflections_return_surprised",
            valuePath: "project_phaseReflections_return_surprised",
            valueType: "string",
            displayType: "textarea",
            displayName: "Surprised",
            displayPrompt: "What <strong>surprised</strong> you about what happened?"
        },
        {
            id: "project_phaseReflections_return_notsurprised",
            valuePath: "project_phaseReflections_return_notsurprised",
            valueType: "string",
            displayType: "textarea",
            displayName: "Not surprised",
            displayPrompt: "What <strong>didn't surprise</strong> you? What happened just as you thought it would?"
        },
        {
            id: "project_phaseReflections_return_obstacles",
            valuePath: "project_phaseReflections_return_obstacles",
            valueType: "string",
            displayType: "textarea",
            displayName: "Obstacles",
            displayPrompt: `Were there any <strong>obstacles</strong> that played a part in how things went? 
                Where did they come from? What did you do to overcome them? How did that work out?`
        },
        {
            id: "project_phaseReflections_return_opportunities",
            valuePath: "project_phaseReflections_return_opportunities",
            valueType: "string",
            displayType: "textarea",
            displayName: "Opportunities",
            displayPrompt: `Did any <strong>opportunities</strong> play a part? 
                Where did they come from? What did you do to take advantage of them? How did that work out?`
        },
        {
            id: "project_phaseReflections_return_newIdeas",
            valuePath: "project_phaseReflections_return_newIdeas",
            valueType: "string",
            displayType: "textarea",
            displayName: "New ideas",
            displayPrompt: "Did any <strong>new ideas</strong> emerge? How might you want to use those ideas in the future?"
        },
        {
            id: "project_phaseReflections_return_issues",
            valuePath: "project_phaseReflections_return_issues",
            valueType: "string",
            displayType: "textarea",
            displayName: "Issues",
            displayPrompt: "Are there any unresolved <strong>issues</strong> going forward?"
        },
        
    ]
};

export = panel;

