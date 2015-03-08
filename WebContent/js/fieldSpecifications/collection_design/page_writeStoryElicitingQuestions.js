define([], function() {
    "use strict";
    return [
        {
            id: "page_writeStoryElicitingQuestions",
            displayName: "Write story eliciting questions",
            displayType: "page",
            section: "collection_design",
            modelClass: "ProjectModel"
        },
        {
            id: "project_elicitingQuestionsLabel",
            dataType: "none",
            displayType: "label",
            displayPrompt: "On this page you will design the eliciting questions you use to ask people to tell stories.\nYou need at least one question for people to answer. Giving people more than one question to choose from\nis recommended."
        },
        {
            id: "project_elicitingQuestionsList",
            dataType: "array",
            required: true,
            displayType: "grid",
            displayConfiguration: "panel_addElicitingQuestion",
            displayName: "Story eliciting questions",
            displayPrompt: "These are the questions you will be asking."
        },
        {
            id: "SPECIAL_elicitingQuestionRecommendations",
            dataType: "none",
            displayType: "recommendationTable",
            displayConfiguration: "Eliciting questions",
            displayPrompt: "Recommendations for eliciting questions"
        }
    ];
});
