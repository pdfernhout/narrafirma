import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_addStoryQuestion",
    modelClass: "StoryQuestion",
    panelFields: [
        {
            id: "storyQuestion_text",
            valueType: "string",
            displayType: "textarea",
            displayName: "Question",
            displayPrompt: "Enter a <strong>question</strong> to ask people about their stories."
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
            displayType: "select",
            displayName: "Type",
            displayPrompt: "What <strong>type</strong> of question is this? (For an explanation of the question types, click the Help button.)"
        },
        {
            id: "storyQuestion_shortName",
            valueType: "string",
            displayType: "text",
            displayName: "Short name",
            displayPrompt: "Please enter a <strong>short name</strong> we can use to refer to the question. (It must be unique within the project.)"
        },
        {
            id: "storyQuestion_options",
            valueType: "string",
            displayType: "textarea",
            displayName: "Options",
            displayPrompt: `
                If your question requires <strong>choices</strong>, enter them here. 
                Write each choice on a separate line.
                <br><br>
                For a slider, enter the texts to place on the left and right sides of the slider, 
                then the text to show on the \"Does not apply\" checkbox (or leave the third line blank
                to use \"Does not apply\"). 
            `
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

