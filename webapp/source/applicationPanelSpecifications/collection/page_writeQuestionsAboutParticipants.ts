import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_writeQuestionsAboutParticipants",
    displayName: "Write questions about participants",
    tooltipText: "Think of questions you want to ask people about themselves.",
    panelFields: [
        {
            id: "project_participantQuestionsLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you will write questions to ask people about <strong>themselves</strong>."
        },
        {
            id: "project_participantQuestionsList",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: "panel_addParticipantQuestion",
            displayName: "Questions about people",
            displayPrompt: "These are the questions you have written so far."
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

