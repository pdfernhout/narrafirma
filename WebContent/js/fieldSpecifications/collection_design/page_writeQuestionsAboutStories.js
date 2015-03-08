define([], function() {
    "use strict";
    return [
        {
            id: "page_writeQuestionsAboutStories",
            displayName: "Write questions about stories",
            displayType: "page",
            section: "collection_design",
            modelClass: "ProjectModel"
        },
        {
            id: "project_storyQuestionsLabel",
            dataType: "none",
            displayType: "label",
            displayPrompt: "On this page you will write your questions to ask people about their stories."
        },
        {
            id: "project_storyQuestionsList",
            dataType: "array",
            required: true,
            displayType: "grid",
            displayConfiguration: "panel_addStoryQuestion",
            displayName: "Questions about stories",
            displayPrompt: "These are the questions you will be asking about stories."
        },
        {
            id: "SPECIAL_storyQuestionRecommendations",
            dataType: "none",
            displayType: "recommendationTable",
            displayConfiguration: "storyQuestions",
            displayPrompt: "Recommendations for story questions"
        }
    ];
});
