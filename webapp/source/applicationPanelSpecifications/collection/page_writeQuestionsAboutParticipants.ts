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
            displayPrompt: "On this page you can write questions to ask people about <strong>themselves</strong>."
        },
        {
            id: "project_participantQuestionsList",
            valueType: "array",
            displayType: "grid",
            displayName: "Participant questions",
            displayPrompt: "These are the questions you have written so far.",
            displayConfiguration: {
                itemPanelID: "panel_addParticipantQuestion",
                gridConfiguration: {
                    columnsToDisplay: ["participantQuestion_text", "participantQuestion_type", "participantQuestion_shortName", "participantQuestion_options"],
                    viewButton: true,
                    editButton: true,
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
            displayConfiguration: "participantQuestions",
            displayPrompt: "Recommendations for participant questions"
        }
    ]
};

export = panel;

