import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_writeQuestionsAboutParticipants",
    displayName: "Write questions about participants",
    pageExplanation: "Build a library of questions about people.",
    pageCategories: "input",
    panelFields: [
        {
            id: "project_participantQuestionsLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: `On this page you can build a <strong>library of questions about people</strong>.
            You will draw on this library as you build your story forms. `
                        
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
                    viewButton: true,
                    editButton: true,
                    validateAdd: "requireShortNameTypeAndQuestionOptionsIfNecessary",
                    validateEdit: "requireShortNameTypeAndQuestionOptionsIfNecessary",
                    addButton: true,
                    removeButton: true, 
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

