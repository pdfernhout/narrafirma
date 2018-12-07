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
            displayPrompt: "Please enter a <strong>short name</strong> we can use to refer to the question. <strong>It must be unique within the project.</strong>"
        },
        {
            id: "storyQuestion_options",
            valueType: "string",
            displayType: "textarea",
            displayName: "Options",
            displayPrompt: `
                If your question requires <strong>choices</strong>, enter them here. 
                Write each choice on a separate line.
                For a slider, enter the texts to place on the left and right sides of the slider, 
                then the text to show on the \"Does not apply\" checkbox (or leave the third line blank
                to use \"Does not apply\"). 
            `
        },

        {
            id: "storyQuestions_import_header",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Import options"
        },
        {
            id: "storyQuestions_import_intro",
            valueType: "none",
            displayType: "label",
            displayPrompt: "Use these options to specify how you want to <strong>read stories from a CSV file</strong>. If you are not importing data, you can ignore them."
        },
        {
            id: "storyQuestion_import_columnName",
            valueType: "string",
            displayType: "text",
            displayName: "Data column name",
            displayPrompt: "In your data file, what is the <strong>data column header</strong> for this question? (What you write here must match the header in your data file exactly. Extra spaces will be trimmed off.)"
        },
        {
            id: "storyQuestion_import_valueType",
            valueType: "string",
            valueOptions: [
                "Single choice",
                "Single choice indexed",
                "Scale",
                "Text",
                "Multi-choice multi-column texts",
                "Multi-choice multi-column yes/no",
                "Multi-choice single-column delimited",
                "Multi-choice single-column delimited indexed",
            ],
            displayType: "select",
            displayName: "Import type",
            displayPrompt: "In your data file, how is this question <strong>formatted</strong>? (For an explanation of these import data types, click the Help button.)"
        },
        {
            id: "storyQuestion_import_answerNames",
            valueType: "string",
            displayType: "textarea",
            displayName: "Choice names in data file",
            displayPrompt: `If your data file has <strong>choices</strong> for this question, either in the column headers or in the data cells, what are those choices? 
                If they are the same as listed above, or if this is an indexed question type, leave this field blank. 
                If they are different, list the choices NarraFirma will find in your data file <strong>in the same order</strong> as the choices listed above.`
        },
        {
            id: "storyQuestion_import_minScaleValue",
            valueType: "string",
            displayType: "text",
            displayName: "Min scale value",
            displayPrompt: "If this question is a scale, what is the <strong>minimum</strong> value in its column? (This must be a number. If this field is blank, the default minimum of zero will be used.)"
        },
        {
            id: "storyQuestion_import_maxScaleValue",
            valueType: "string",
            displayType: "text",
            displayName: "Max scale value",
            displayPrompt: "If this question is a scale, what is the <strong>maximum</strong> value in its column? (This must be a number. If this field is blank, the default maximum of 100 will be used.)"
        },

        {
            id: "storyQuestions_notesHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Your notes"
        },
        {
            id: "storyQuestion_notes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Notes",
            displayPrompt: "You might want to record some <b>notes</b> about this question."
        },
        {
            id: "SPECIAL_templates_storyQuestions",
            valueType: "none",
            displayType: "templateList",
            displayConfiguration: "storyQuestions",
            displayPrompt: "Copy a question from a template",
            displayVisible: function(panelBuilder, model) {
                return panelBuilder.readOnly === false;
            }
        }
    ]
};

export = panel;

