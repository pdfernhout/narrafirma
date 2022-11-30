import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_writeStoryElicitingQuestions",
    displayName: "Write story eliciting questions",
    pageExplanation: "Build a library of questions that help people think of experiences to recount.",
    pageCategories: "enter",
    headerAbove: "Design",
    panelFields: [
        {
            id: "project_elicitingQuestionsLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: `On this page you can build a 
                <strong>library of questions you will invite people to answer by telling stories</strong>.
                You will draw on this library as you build your story forms. 
                Each story form must contain at least one story-eliciting question.
                `
        },
        {
            id: "project_elicitingQuestionsList",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: {
                itemPanelID: "panel_addElicitingQuestion",
                gridConfiguration: {
                    viewButton: true,
                    editButton: true,
                    addButton: true,
                    removeButton: true,
                    validateAdd: "requireShortNameAndType",
                    validateEdit: "requireShortNameAndType",
                    navigationButtons: true,
                    columnsToDisplay: ["elicitingQuestion_text", "elicitingQuestion_shortName"]
                }
            },
            displayName: "Story eliciting questions",
            displayPrompt: "These are the eliciting questions you have added. Click on a question to edit it."
        },
        {
            id: "SPECIAL_elicitingQuestionRecommendations",
            valueType: "none",
            displayType: "recommendationTable",
            displayIconClass: "recommendationsButtonImage",
            displayConfiguration: "elicitingQuestions",
            displayPrompt: "Recommendations for eliciting questions"
        }
    ]
};

export = panel;

