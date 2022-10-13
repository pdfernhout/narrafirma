import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_writeStoryElicitingQuestions",
    displayName: "Write story eliciting questions",
    pageExplanation: "Build a library of questions that help people think of experiences to recount.",
    pageCategories: "input",
    headerAbove: "Design",
    panelFields: [
        {
            id: "project_elicitingQuestionsLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you can design the questions you will use <strong>to ask people to tell stories</strong>. You need at least one question for people to answer. We recommend giving people three to five questions to choose from."
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
            displayConfiguration: "elicitingQuestions",
            displayPrompt: "Recommendations for eliciting questions"
        }
    ]
};

export = panel;

