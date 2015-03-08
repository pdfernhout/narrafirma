define([], function() {
    "use strict";
    return [
        {
            id: "page_revisePNIPlanningQuestions",
            displayName: "Revise PNI Planning questions",
            displayType: "page",
            section: "planning",
            modelClass: "ProjectModel"
        },
        {
            id: "project_improvePlanningDrafts",
            dataType: "none",
            displayType: "label",
            displayPrompt: "On this page you can review and improve your draft answers to the PNI planning questions\nbased on your consideration of project aspects and your project stories."
        },
        {
            id: "project_pniQuestions_copyDraftsButton",
            dataType: "none",
            displayType: "button",
            displayConfiguration: "copyDraftPNIQuestionVersionsIntoAnswers",
            displayPrompt: "Copy the original draft versions into any corresponding empty answer fields below"
        },
        {
            id: "project_pniQuestions_goal_final",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Project goal",
            displayPrompt: "What is the goal of the project? Why are you doing it?"
        },
        {
            id: "project_pniQuestions_relationships_final",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Project relationships",
            displayPrompt: "What relationships are important to the project?"
        },
        {
            id: "project_pniQuestions_focus_final",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Project focus",
            displayPrompt: "What is the focus of the project? What is it about?"
        },
        {
            id: "project_pniQuestions_range_final",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Project range",
            displayPrompt: "What range(s) of experience will the project cover?"
        },
        {
            id: "project_pniQuestions_scope_final",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Project scope",
            displayPrompt: "What is the project's scope? (number of people, number of stories, number of questions about stories)"
        },
        {
            id: "project_pniQuestions_emphasis_final",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Project emphasis",
            displayPrompt: "Which phases of PNI will be important to the project? (indicate most and least important phases)"
        }
    ];
});
