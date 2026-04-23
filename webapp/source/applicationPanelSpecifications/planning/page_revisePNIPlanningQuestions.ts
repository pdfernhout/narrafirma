import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_revisePNIPlanningQuestions",
    displayName: "Revise your answers to the PNI planning questions",
    pageExplanation: "Revisit your project's goals, topic, people, perspectives, scale, and process.",
    pageCategories: "compose",
    headerAbove: "Finalize your project plans",
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
            displayIconClass: "copyButtonImage",
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
            id: "project_pniQuestions_focus_final",
            valueType: "string",
            displayType: "textarea",
            displayName: "Project topic",
            displayPrompt: "What is the <strong>topic</strong> of the project? What is it about? What is its subject matter?"
        },
        {
            id: "project_pniQuestions_relationships_final",
            valueType: "string",
            displayType: "textarea",
            displayName: "Project people",
            displayPrompt: "Who are the <strong>people</strong> that matter to the project? Who will connect with whom, how, and why? Who will tell stories, listen to stories, make sense of stories, facilitate, and so on?"
        },
        {
            id: "project_pniQuestions_range_final",
            valueType: "string",
            displayType: "textarea",
            displayName: "Project perspectives",
            displayPrompt: "What <strong>perspectives</strong> matter to the project? What range of experiences will be included in the project?"
        },
        {
            id: "project_pniQuestions_scope_final",
            valueType: "string",
            displayType: "textarea",
            displayName: "Project scale",
            displayPrompt: "What is the project's <strong>scale</strong>? How many people will be involved? How many stories? How many questions? How many sessions?"
        },
        {
            id: "project_pniQuestions_emphasis_final",
            valueType: "string",
            displayType: "textarea",
            displayName: "Project process",
            displayPrompt: "What will the project's <strong>process</strong> be like? What will happen in the project?"
        },
    ]
};

export = panel;

