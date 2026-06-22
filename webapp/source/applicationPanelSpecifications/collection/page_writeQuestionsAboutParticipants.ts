import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_writeQuestionsAboutParticipants",
    displayName: "Write questions about participants",
    pageExplanation: "Build a library of questions about people.",
    pageCategories: "compose",
    panelFields: [
        {
            id: "project_participantQuestionsLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: `On this page you can build a <strong>library of questions about people</strong>.
            You will draw on this library as you build your story forms. `,
            emptyJournalPrompt: `***Write here all of the <strong>questions about participants</strong> 
                you thought of to ask, whether you end up using them or not.`
        },
        {
            id: "project_participantQuestionsList",
            valueType: "array",
            displayType: "grid",
            displayName: "Participant questions",
            displayPrompt: "These are the questions you have added. Click on a question to edit it.",
            displayConfiguration: {
                itemPanelID: "panel_addParticipantQuestion",
                gridConfiguration: {
                    columnsToDisplay: ["participantQuestion_text", "participantQuestion_type", "participantQuestion_shortName", "participantQuestion_options"],
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
            id: "SPECIAL_participantQuestionRecommendations",
            valueType: "none",
            displayType: "recommendationTable",
            displayIconClass: "recommendationsButtonImage",
            displayConfiguration: "participantQuestions",
            displayPrompt: "Recommendations for participant questions"
        }
    ]
};

export = panel;

