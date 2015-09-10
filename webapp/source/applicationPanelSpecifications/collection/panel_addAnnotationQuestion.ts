import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_addAnnotationQuestion",
    displayName: "Add story question",
    displayType: "panel",
    section: "collection",
    modelClass: "AnnotationQuestion",
    panelFields: [
        {
            id: "storyQuestion_text",
            valueType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Question",
            displayPrompt: "Enter a <strong>question</strong> you will use to annotate stories after they have been collected."
        },
        {
            id: "storyQuestion_type",
            valueType: "string",
            valueOptions: [
                "boolean",
                "label",
                "header",
                "checkbox",
                "checkboxes",
                "text",
                "textarea",
                "select",
                "radiobuttons",
                "slider"
            ],
            required: true,
            displayType: "select",
            displayName: "Type",
            displayPrompt: "What <strong>type</strong> of question is this?"
        },
        {
            id: "storyQuestion_shortName",
            valueType: "string",
            required: true,
            displayType: "text",
            displayName: "Short name",
            displayPrompt: "Please enter a <strong>short name</strong> we can use to refer to the question. (It must be unique within the project.)"
        },
        {
            id: "storyQuestion_options",
            valueType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Options",
            displayPrompt: "If your question requires <strong>choices</strong>, enter them here (one per line). For a slider, enter the texts to place on the left and right sides (on separate lines)."
        },
        {
            id: "SPECIAL_templates_storyQuestions",
            valueType: "none",
            displayType: "templateList",
            displayConfiguration: "storyQuestions",
            displayPrompt: "Copy a question from a template"
        }
    ]
};

export = panel;

