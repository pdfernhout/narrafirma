import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_writeQuestionsAboutStories",
    displayName: "Write questions about stories",
    pageExplanation: "Build a library of questions that help people interpret their stories.",
    pageCategories: "enter",
    panelFields: [
        {
            id: "project_storyQuestionsLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: `On this page you can build a <strong>library of questions about stories</strong>.
                You will draw on this library as you build your story forms. `
        },
        {
            id: "project_storyQuestionsList",
            valueType: "array",
            displayType: "grid",
            displayName: "Story questions",
            displayPrompt: "These are the questions you have added. Click on a question to edit it.",
            displayConfiguration: {
                itemPanelID: "panel_addStoryQuestion",
                gridConfiguration: {
                    columnsToDisplay: ["storyQuestion_text", "storyQuestion_type", "storyQuestion_shortName", "storyQuestion_options"],
                    validateAdd: "requireShortNameTypeOptionsAndTrimming",
                    validateEdit: "requireShortNameTypeOptionsAndTrimming",
                    addButton: true,
                    removeButton: true, 
                    duplicateButton: true,
                    navigationButtons: true,
               }
            }
        },
        {
            id: "SPECIAL_storyQuestionRecommendations",
            valueType: "none",
            displayType: "recommendationTable",
            displayIconClass: "recommendationsButtonImage",
            displayConfiguration: "storyQuestions",
            displayPrompt: "Recommendations for story questions"
        }
    ]
};

export = panel;

