import Globals = require("../../Globals");
import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

function matchQuestionType(model, typesToMatch) {
    const modelObject = Globals.project().tripleStore.makeObject(model, true);
    if (modelObject)
        return (typesToMatch.indexOf(modelObject.storyQuestion_type) >= 0); 
    else
        return false;
}

const panel: Panel = {
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
            id: "storyQuestion_shortName",
            valueType: "object",
            displayType: "shortNameQuestionConfigurationPanel",
            displayName: "Short name",
            displayPrompt: "Please enter a <strong>short name</strong> we can use to refer to the question. <strong>It must be unique within the project.</strong>"
        },
        {
            id: "storyQuestion_type",
            valueType: "none",
            displayType: "questionTypeChooser",
            displayConfiguration: "story",
            displayName: "Type",
            displayPrompt: "How do you want participants to <strong>answer</strong> this question?"
        },
        {
            id: "storyQuestion_checkbox_config",
            valuePath: "storyQuestion_options",
            valueType: "object",
            displayType: "checkboxQuestionConfigurationPanel",
            displayName: "Checkbox label",
            displayPrompt: "Configure your checkbox question here.",
            displayVisible: function(panelBuilder, model) { return matchQuestionType(model, ["checkbox"]); }
        },
        {
            id: "storyQuestion_slider_config",
            valuePath: "storyQuestion_options",
            valueType: "object",
            displayType: "sliderQuestionConfigurationPanel",
            displayName: "Slider labels",
            displayPrompt: `Configure your slider question here.`,
            displayVisible: function(panelBuilder, model) { return matchQuestionType(model, ["slider"]); }
        },
        {
            id: "storyQuestion_options",
            valuePath: "storyQuestion_options",
            valueType: "string",
            displayType: "textarea",
            displayName: "Options",
            displayPrompt: "Enter a list of <strong>answers</strong> participants can choose for this question, one answer per line.",
            displayVisible: function(panelBuilder, model) { return matchQuestionType(model, ["select", "radiobuttons", "checkboxes"]); }
        },

        // buttons to choose advanced options, import options, copy from template 

        {
            id: "storyQuestion_showOrHideAdvancedOptions",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "showOrHideAdvancedOptions",
            displayName: "Show/hide advanced options",
            displayPreventBreak: true,
            displayIconClass: function(panelBuilder, model) { return Globals.clientState().showAdvancedOptions() ? "hideButtonImage" : "showButtonImage"; },
            displayPrompt: function(panelBuilder, model) { return Globals.clientState().showAdvancedOptions() ? "Hide advanced options" : "Show advanced options"; },
            displayVisible: function(panelBuilder, model) { return !panelBuilder.readOnly; }
        },
        {
            id: "storyQuestion_showOrHideImportOptions",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "showOrHideImportOptions",
            displayName: "Show/hide import options",
            displayIconClass: function(panelBuilder, model) { return Globals.clientState().showImportOptions() ? "hideButtonImage" : "showButtonImage"; },
            displayPrompt: function(panelBuilder, model) { return Globals.clientState().showImportOptions() ? "Hide import options" : "Show import options"; },
            displayPreventBreak: true,
            displayVisible: function(panelBuilder, model) { return !panelBuilder.readOnly; }
        },
        {
            id: "SPECIAL_templates_storyQuestions",
            valueType: "none",
            displayType: "templateList",
            displayConfiguration: "storyQuestions",
            displayPrompt: "Copy a question from a template",
            displayIconClass: "copyButtonImage",
            displayPreventBreak: false,
            displayVisible: function(panelBuilder, model) { return !panelBuilder.readOnly; }
        },

        // advanced options

        {
            id: "storyQuestion_optionImageLinks",
            valuePath: "storyQuestion_optionImageLinks",
            valueType: "string",
            displayType: "textarea",
            displayName: "Option image links",
            displayPrompt: "If you want to show <strong>images</strong> for each answer, enter a series of web links (URLs) here, one per answer, in the same order as above.",
            displayVisible: function(panelBuilder, model) { return matchQuestionType(model, ["radiobuttons", "checkboxes"]) && !!Globals.clientState().showAdvancedOptions(); }
        },
        {
            id: "storyQuestion_optionImagesWidth",
            valuePath: "storyQuestion_optionImagesWidth",
            valueType: "string",
            displayType: "select",
            valueOptions: ["20", "30", "40", "50", "60", "70", "80", "90", "100", "110", "120", "130",  "140", "150", "160", "170", "180", "190", "200"],
            displayName: "Option images width",
            displayPrompt: "How wide do you want your answer images to be, in pixels?",
            displayVisible: function(panelBuilder, model) { return matchQuestionType(model, ["radiobuttons", "checkboxes"]) && !!Globals.clientState().showAdvancedOptions(); }
        },
        {
            id: "storyQuestion_listBoxRows",
            valueType: "string",
            valueOptions: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"],
            displayType: "select",
            displayName: "List box rows",
            displayPrompt: `How many <strong>list box rows</strong> do you want to show for this question? Leave this field blank to show a drop-down list.`,
            displayVisible: function(panelBuilder, model) { return matchQuestionType(model, ["select"]); }
        },
        {
            id: "storyQuestion_textBoxLength",
            valueType: "string",
            valueOptions: ["5", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55", "60", "65", "70", "75", "80", "85", "90", "95", "100"],
            displayType: "select",
            displayName: "Text box length",
            displayPrompt: `<strong>How long</strong> do you want this text box to be, in percentage units? Leave blank for a long text box. 
                (Note that this option only specifies the length of the text box on the screen. It does not limit the number of characters participants can enter.)`,
            displayVisible: function(panelBuilder, model) { return matchQuestionType(model, ["text"]) && !!Globals.clientState().showAdvancedOptions(); }
        },
        {
            id: "storyQuestion_maxNumAnswers",
            valueType: "string",
            valueOptions: ["2", "3", "4", "5", "6", "7", "8", "9", "10"],
            displayType: "select",
            displayName: "Max number of answers",
            displayPrompt: `What is the <strong>maximum number of checkboxes</strong> a participant can check? (Leave blank for no limit.)`,
            displayVisible: function(panelBuilder, model) { return matchQuestionType(model, ["checkboxes"]) && !!Globals.clientState().showAdvancedOptions(); }
        },
        {
            id: "storyQuestion_writeInTextBoxLabel",
            valuePath: "storyQuestion_writeInTextBoxLabel",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "20",
            displayName: "Write-in answer label",
            displayPrompt: `If you want participants to be able to append an extra <strong>write-in answer</strong> for this question,
                enter a label for the write-in text box here. (To display a multi-line text area, start the label with two asterisks.)`,
            displayVisible: function(panelBuilder, model) { return matchQuestionType(model, ["boolean", "checkbox", "checkboxes", "text", "textarea", "select", "radiobuttons", "slider"]) && !!Globals.clientState().showAdvancedOptions(); }
        },
        {
            id: "storyQuestion_notes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Notes",
            displayPrompt: "Enter any <b>notes</b> you want to remember about this question.",
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showAdvancedOptions(); }
        },

        // import options

        {
            id: "storyQuestions_import_header",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Import options",
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showImportOptions(); }
        },
        {
            id: "storyQuestion_import_columnName",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "20",
            displayName: "Data column name",
            displayPrompt: "In your data file, what is the <strong>data column header</strong> for this question? (What you write here must match the header in your data file exactly. Extra spaces will be trimmed off.)",
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showImportOptions(); }
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
            displayPrompt: "In your data file, how is this question <strong>formatted</strong>? (For an explanation of these import data types, click the Help button.)",
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showImportOptions(); }
        },
        {
            id: "storyQuestion_import_answerNames",
            valueType: "string",
            displayType: "textarea",
            displayName: "Choice names in data file",
            displayPrompt: `If your data file has <strong>choices</strong> for this question, either in the column headers or in the data cells, what are those choices? 
                If they are the same as listed above, or if this is an indexed question type, leave this field blank. 
                If they are different, list the choices NarraFirma will find in your data file <strong>in the same order</strong> as the choices listed above.`,
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showImportOptions(); }
        },
        {
            id: "storyQuestion_import_minScaleValue",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "10",
            displayName: "Min scale value",
            displayPrompt: "What is the <strong>minimum slider value</strong> in this column?(This must be a number. If this field is blank, the default minimum of zero will be used.)",
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showImportOptions() && matchQuestionType(model, ["slider"]); }
        },
        {
            id: "storyQuestion_import_maxScaleValue",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "10",
            displayName: "Max scale value",
            displayPrompt: "What is the <strong>maximum slider value</strong> in this column? (This must be a number. If this field is blank, the default maximum of 100 will be used.)",
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().showImportOptions()  && matchQuestionType(model, ["slider"]); }
        }
    ]
};

export = panel;

