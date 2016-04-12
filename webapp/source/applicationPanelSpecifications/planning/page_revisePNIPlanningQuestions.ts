import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_revisePNIPlanningQuestions",
    displayName: "Revise PNI planning questions",
    tooltipText: "Go back to your goals, focus, etc., and see how you can improve what you wrote before.",
    headerAbove: "Wrap Up Planning",
    panelFields: [
        {
            id: "project_improvePlanningDrafts",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you can review and improve your draft answers to the <strong>PNI planning questions</strong>, based on your consideration of project aspects and your project stories."
        },
        {
            id: "project_pniQuestions_copyDraftsButton",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "copyDraftPNIQuestionVersionsIntoAnswers",
            displayPrompt: "Copy your draft versions into any empty answers below"
        },
        {
            id: "project_pniQuestions_goal_final",
            valueType: "string",
            displayType: "textarea",
            displayName: "Project goal",
            displayPrompt: "What is the <strong>goal</strong> of the project? Why are you doing it? What will be achieved if it succeeds?"
        },
        {
            id: "project_pniQuestions_relationships_final",
            valueType: "string",
            displayType: "textarea",
            displayName: "Project relationships",
            displayPrompt: "What <strong>relationships</strong> are important to the project? Who will connect with whom, how, and why? Who will tell stories, listen to stories, make sense of stories, facilitate, and so on?"
        },
        {
            id: "project_pniQuestions_focus_final",
            valueType: "string",
            displayType: "textarea",
            displayName: "Project focus",
            displayPrompt: "What is the <strong>focus</strong> of the project? What is it about? What is its subject matter?"
        },
        {
            id: "project_pniQuestions_range_final",
            valueType: "string",
            displayType: "textarea",
            displayName: "Project range",
            displayPrompt: "What <strong>range</strong> (or ranges) of experience will the project cover? Which perspectives will be explored? (Perhaps multiple groups, or locations, or time frames.)"
        },
        {
            id: "project_pniQuestions_scope_final",
            valueType: "string",
            displayType: "textarea",
            displayName: "Project scope",
            displayPrompt: "What is the project's <strong>scope</strong>? How many people will be involved? How many stories? How many questions? How many sessions?"
        },
        {
            id: "project_pniQuestions_emphasis_final",
            valueType: "string",
            displayType: "textarea",
            displayName: "Project emphasis",
            displayPrompt: "What is the project's <strong>emphasis</strong>? Which phases of PNI (planning, collection, catalysis, sensemaking, intervention, return) will be important to the project?"
        }
    ]
};

export = panel;

