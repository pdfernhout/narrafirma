import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_writeStoryElicitingQuestions",
    displayName: "Write story eliciting questions",
    tooltipText: "Think of questions you want people to answer by telling stories.",
    headerAbove: "Design Your Questions and Story Form",
    panelFields: [
        {
            id: "project_elicitingQuestionsLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you will design the questions you will use <strong>to ask people to tell stories</strong>. You need at least one question for people to answer. We recommend giving people three to five questions to choose from."
        },
        {
            id: "project_elicitingQuestionsList",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: "panel_addElicitingQuestion",
            displayName: "Story eliciting questions",
            displayPrompt: "These are the <strong>eliciting questions</strong> you have created so far."
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

