import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_reflectOnCollectionPhase",
    displayName: "Reflect on the collection phase",
    pageExplanation: "Think about what happened in this part of the project.",
    pageCategories: "record",
    panelFields: [
        {
            id: "project_phaseReflections_collection_intro",
            valueType: "none",
            displayType: "label",
            displayPrompt: `On this page you can answer some <strong>reflective questions</strong> 
                that will help you think about what happened.`
        },
        
        {
            id: "project_phaseReflections_collection_learned",
            valuePath: "project_phaseReflections_collection_learned",
            valueType: "string",
            displayType: "textarea",
            displayName: "Learned",
            displayPrompt: "What did you <strong>learn</strong> in the collection phase of your project?"
        },
        {
            id: "project_phaseReflections_collection_surprised",
            valuePath: "project_phaseReflections_collection_surprised",
            valueType: "string",
            displayType: "textarea",
            displayName: "Surprised",
            displayPrompt: "What <strong>surprised</strong> you about what happened?"
        },
        {
            id: "project_phaseReflections_collection_notsurprised",
            valuePath: "project_phaseReflections_collection_notsurprised",
            valueType: "string",
            displayType: "textarea",
            displayName: "Not surprised",
            displayPrompt: "What <strong>didn't surprise</strong> you? What happened just as you thought it would?"
        },
        {
            id: "project_phaseReflections_collection_obstacles",
            valuePath: "project_phaseReflections_collection_obstacles",
            valueType: "string",
            displayType: "textarea",
            displayName: "Obstacles",
            displayPrompt: `Were there any <strong>obstacles</strong> that played a part in how things went? 
                Where did they come from? What did you do to overcome them? How did that work out?`
        },
        {
            id: "project_phaseReflections_collection_opportunities",
            valuePath: "project_phaseReflections_collection_opportunities",
            valueType: "string",
            displayType: "textarea",
            displayName: "Opportunities",
            displayPrompt: `Did any <strong>opportunities</strong> play a part? 
                Where did they come from? What did you do to take advantage of them? How did that work out?`
        },
        {
            id: "project_phaseReflections_collection_newIdeas",
            valuePath: "project_phaseReflections_collection_newIdeas",
            valueType: "string",
            displayType: "textarea",
            displayName: "New ideas",
            displayPrompt: "Did any <strong>new ideas</strong> emerge? How might you want to use those ideas in the future?"
        },
        {
            id: "project_phaseReflections_collection_issues",
            valuePath: "project_phaseReflections_collection_issues",
            valueType: "string",
            displayType: "textarea",
            displayName: "Issues",
            displayPrompt: "Are there any unresolved <strong>issues</strong> going forward?"
        },
        
    ]
};

export = panel;
