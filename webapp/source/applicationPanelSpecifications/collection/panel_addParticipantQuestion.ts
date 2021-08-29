import Globals = require("../../Globals");
import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

function matchQuestionType(model, typesToMatch) {
    const modelObject = Globals.project().tripleStore.makeObject(model, true);
    if (modelObject)
        return (typesToMatch.indexOf(modelObject.participantQuestion_type) >= 0); 
    else
        return false;
}

var panel: Panel = {
    id: "panel_addParticipantQuestion",
    modelClass: "ParticipantQuestion",
    panelFields: [
        {
            id: "participantQuestion_text",
            valueType: "string",
            displayType: "textarea",
            displayName: "Question",
            displayPrompt: "Enter a <strong>question</strong> to ask people about themselves."
        },
        {
            id: "participantQuestion_type",
            valueType: "none",
            displayType: "questionTypeChooser",
            displayConfiguration: "participant",
            displayName: "Type",
            displayPrompt: "How do you want participants to <strong>answer</strong> this question?"
        },
        {
            id: "participantQuestion_shortName",
            valueType: "object",
            displayType: "shortNameQuestionConfigurationPanel",
            displayName: "Short name",
            displayPrompt: "Please enter a short <strong>name</strong> we can use to refer to the question. <strong>It must be unique within the project.</strong>"
        },
        {
            id: "participantQuestion_checkbox_config",
            valuePath: "participantQuestion_options",
            valueType: "object",
            displayType: "checkboxQuestionConfigurationPanel",
            displayName: "Checkbox label",
            displayPrompt: "Configure your checkbox question here.",
            displayVisible: function(panelBuilder, model) { return matchQuestionType(model, ["checkbox"]); }
        },
        {
            id: "participantQuestion_slider_config",
            valuePath: "participantQuestion_options",
            valueType: "object",
            displayType: "sliderQuestionConfigurationPanel",
            displayName: "Slider labels",
            displayPrompt: `Configure your slider question here.`,
            displayVisible: function(panelBuilder, model) { return matchQuestionType(model, ["slider"]); }
        },
        {
            id: "participantQuestion_options",
            valuePath: "participantQuestion_options",
            valueType: "string",
            displayType: "textarea",
            displayName: "Options",
            displayPrompt: "Enter a list of <strong>answers</strong> participants can choose for this question, one answer per line.",
            displayVisible: function(panelBuilder, model) { return matchQuestionType(model, ["select", "radiobuttons", "checkboxes"]); }
        },
        {
            id: "participantQuestion_writeInTextBoxLabel",
            valuePath: "participantQuestion_writeInTextBoxLabel",
            valueType: "string",
            displayType: "text",
            displayName: "Write-in answer label",
            displayPrompt: `If you want participants to be able to append an extra <strong>write-in answer</strong> for this question,
                enter a label for the write-in text box here.`,
            displayVisible: function(panelBuilder, model) { return matchQuestionType(model, ["boolean", "checkbox", "checkboxes", "text", "textarea", "select", "radiobuttons", "slider"]); }
        },
        {
            id: "participantQuestion_maxNumAnswers",
            valueType: "string",
            valueOptions: ["2", "3", "4", "5", "6", "7", "8", "9", "10"],
            displayType: "select",
            displayName: "Max number of answers",
            displayPrompt: `If this question has multiple checkboxes, what is the <strong>maximum number of checkboxes</strong> 
                a participant can check? (Leave blank for no limit.)`,
            displayVisible: function(panelBuilder, model) { return matchQuestionType(model, ["checkboxes"]); }
        },
        {
            id: "participantQuestion_notes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Notes",
            displayPrompt: "Enter any <b>notes</b> you want to remember about this question."
        },
        {
            id: "SPECIAL_templates_participantQuestions",
            valueType: "none",
            displayType: "templateList",
            displayConfiguration: "participantQuestions",
            displayPrompt: "Copy a question from a template",
            displayVisible: function(panelBuilder, model) {
                return panelBuilder.readOnly === false;
            }
        },


        // import options

        {
            id: "participantQuestion_showOrHideImportOptions",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "showOrHideImportOptions",
            displayName: "Show/hide import options",
            displayPrompt: function(panelBuilder, model) { return Globals.clientState().showImportOptions() ? "Hide import options" : "Show import options"; },
            displayPreventBreak: false,
        },
        {
            id: "participantQuestions_import_header",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Import options",
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showImportOptions(); }
        },
        {
            id: "participantuestions_import_intro",
            valueType: "none",
            displayType: "label",
            displayPrompt: "Use these options to specify how you want to <strong>read stories from a CSV file</strong>. If you are not importing data, you can ignore them.",
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showImportOptions(); }
        },
        {
            id: "participantQuestion_import_columnName",
            valueType: "string",
            displayType: "text",
            displayName: "Data column name",
            displayPrompt: "In your data file, what is the <strong>data column header</strong> for this question? (What you write here must match the header in your data file exactly. Extra spaces will be trimmed off.)",
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showImportOptions(); }
        },
        {
            id: "participantQuestion_import_valueType",
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
            displayPrompt: "In your data file, how is this question <strong>formatted</strong>? (For an explanation of these import data types, click the Help button.)",
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showImportOptions(); }
        },
        {
            id: "participantQuestion_import_answerNames",
            valueType: "string",
            displayType: "textarea",
            displayName: "Choice names in data file",
            displayPrompt: `If your data file has <strong>choices</strong> for this question, either in the column headers or in the data cells, what are those choices? 
            If they are the same as listed above, or if this is an indexed question type, leave this field blank. 
                If they are different, list the choices NarraFirma will find in your data file <strong>in the same order</strong> as the choices listed above.`,
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showImportOptions(); }
        },
        {
            id: "participantQuestion_import_minScaleValue",
            valueType: "string",
            displayType: "text",
            displayName: "Min scale value",
            displayPrompt: "If this question is a scale, what is the <strong>minimum</strong> value in its column? (This must be a number. If this field is blank, the default minimum of zero will be used.)",
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showImportOptions(); }
        },
        {
            id: "participantQuestion_import_maxScaleValue",
            valueType: "string",
            displayType: "text",
            displayName: "Max scale value",
            displayPrompt: "If this question is a scale, what is the <strong>maximum</strong> value in its column? (This must be a number. If this field is blank, the default maximum of 100 will be used.)",
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showImportOptions(); }
        }
    ]
};

export = panel;

