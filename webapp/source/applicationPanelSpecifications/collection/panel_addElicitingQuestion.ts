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
            valueType: "object",
            displayType: "shortNameQuestionConfigurationPanel",
            displayName: "Short Name",
            displayPrompt: "Enter a short <strong>name</strong> for this question, to use as a reference."
        },

        {
            id: "elicitingQuestion_import_header",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Import options"
        },
        {
            id: "elicitingQuestion_dataColumnName",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "20",
            displayName: "Answer cell name",
            displayPrompt: "In your data file, what does it say <strong>in the data cell</strong> when the participant chose this eliciting question?"
        },

        {
            id: "elicitingQuestion_notesHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Your notes"
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
                "memorable",
                "surprise or change",
                "people, places, things, decisions",
                "fictional scenario",
                "other"
            ],
            displayType: "checkboxes",
            displayName: "Type",
            displayPrompt: "What <strong>type</strong> of question is this? (This choice is for your own reflection; it doesn't affect how the question is asked on the story form.)"
        },
        {
            id: "elicitingQuestion_notes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Notes",
            displayPrompt: "You might want to record some <b>notes</b> about this question: why you want to use it, how you think people will respond, what sorts of experiences you expect it will call to mind, etc."
        },
        {
            id: "SPECIAL_templates_elicitingQuestions",
            valueType: "none",
            displayType: "templateList",
            displayConfiguration: "elicitationQuestions",
            displayPrompt: "Copy a question from a template",
            displayVisible: function(panelBuilder, model) {
                return panelBuilder.readOnly === false;
            }
        }
    ]
};

export = panel;

