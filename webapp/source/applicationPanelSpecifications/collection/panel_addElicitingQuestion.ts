import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_addElicitingQuestion",
    modelClass: "ElicitingQuestion",
    panelFields: [
        {
            id: "elicitingQuestion_text",
            valueType: "string",
            displayType: "textarea",
            displayName: "Question",
            displayPrompt: "What <strong>question</strong> will you ask? (Remember to write a question whose answer is a story.)"
        },
        {
            id: "elicitingQuestion_shortName",
            valueType: "string",
            displayType: "text",
            displayName: "Short Name",
            displayPrompt: "Enter a short <strong>name</strong> for this question, to use as a reference."
        },
        {
            id: "elicitingQuestion_type",
            valueType: "dictionary",
            valueOptions: [
                "what happened",
                "directed question",
                "undirected question",
                "point in time",
                "event",
                "extreme",
                "surprise or change",
                "people, places, things, decisions",
                "fictional scenario",
                "other"
            ],
            displayType: "checkboxes",
            displayName: "Type",
            displayPrompt: "What <strong>type</strong> of question is this?"
        },
        {
            id: "SPECIAL_templates_elicitingQuestions",
            valueType: "none",
            displayType: "templateList",
            displayConfiguration: "elicitationQuestions",
            displayPrompt: "Copy a question from a template"
        }
    ]
};

export = panel;

