import Globals = require("../../Globals");
import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

function matchQuestionType(model, typesToMatch) {
    const modelObject = Globals.project().tripleStore.makeObject(model, true);
    if (modelObject)
        return (typesToMatch.indexOf(modelObject.annotationQuestion_type) >= 0); 
    else
        return false;
}

const panel: Panel = {
    id: "panel_addAnnotationQuestion",
    modelClass: "AnnotationQuestion",
    panelFields: [
        {
            id: "annotationQuestion_text",
            valueType: "string",
            displayType: "textarea",
            displayName: "Question",
            displayPrompt: `Enter a <strong>question</strong> you will use to annotate stories. <em>Changing this question text will have no effect on previously entered answers.</em>`
        },
        {
            id: "annotationQuestion_shortName",
            valueType: "object",
            displayType: "shortNameQuestionConfigurationPanel",
            displayName: "Short name",
            displayPrompt: `Please enter a <strong>short name</strong> we can use to refer to the question. <strong>It must be unique within the project.</strong>`
        },
        {
            id: "annotationQuestion_type",
            valueType: "none",
            displayType: "questionTypeChooser",
            displayConfiguration: "annotation",
            displayName: "Type",
            displayPrompt: `How do you want to <strong>answer</strong> this question?
                <em>If you change this question's type after you start using the question, you may lose any previously entered answers. See the help system for details.</em>`
        },
        {
            id: "annotationQuestion_checkbox_config",
            valuePath: "annotationQuestion_options",
            valueType: "object",
            displayType: "checkboxQuestionConfigurationPanel",
            displayName: "Checkbox label",
            displayPrompt: "Configure your checkbox question here.",
            displayVisible: function(panelBuilder, model) { return matchQuestionType(model, ["checkbox"]); }
        },
        {
            id: "annotationQuestion_slider_config",
            valuePath: "annotationQuestion_options",
            valueType: "object",
            displayType: "sliderQuestionConfigurationPanel",
            displayName: "Slider labels",
            displayPrompt: `Configure your slider question here.`,
            displayVisible: function(panelBuilder, model) { return matchQuestionType(model, ["slider"]); }
        },
        {
            id: "annotationQuestion_options",
            valuePath: "annotationQuestion_options",
            valueType: "object",
            displayName: "Options",
            displayType: "choiceQuestionAnswersManagementPanel",
            displayPrompt: "You can manage answers for this question here.",
            displayVisible: function(panelBuilder, model) { return matchQuestionType(model, ["select", "radiobuttons", "checkboxes"]); }
        },
        {
            id: "annotationQuestion_listBoxRows",
            valueType: "string",
            valueOptions: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"],
            displayType: "select",
            displayName: "List box rows",
            displayPrompt: `How many <strong>list box rows</strong> do you want to show for this question? Leave this field blank to show a drop-down list.`,
            displayVisible: function(panelBuilder, model) { return matchQuestionType(model, ["select"]); }
        },
        {
            id: "annotationQuestion_textBoxLength",
            valueType: "string",
            valueOptions: ["5", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55", "60", "65", "70", "75", "80", "85", "90", "95", "100"],
            displayType: "select",
            displayName: "Text box length",
            displayPrompt: `<strong>How long</strong> do you want this text box to be, in percentage units? Leave blank for a long text box. 
                (Note that this option only specifies the length of the text box on the screen. It does not limit the number of characters you can enter.)`,
            displayVisible: function(panelBuilder, model) { return matchQuestionType(model, ["text"]); }
        },
        {
            id: "annotationQuestion_maxNumAnswers",
            valueType: "string",
            valueOptions: ["2", "3", "4", "5", "6", "7", "8", "9", "10"],
            displayType: "select",
            displayName: "Max number of answers",
            displayPrompt: `
            <strong>How many checkboxes</strong> do you want to be able to check? (Leave blank for no limit.) 
                <em>If you change this maximum after you start using this question, it will have no effect on your previous answers.</em>`,
            displayVisible: function(panelBuilder, model) { return matchQuestionType(model, ["checkboxes"]); }
        },

        // notes and templates

        {
            id: "annotationQuestion_notes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Notes",
            displayPrompt: "Enter any <b>notes</b> you want to remember about this question."
        },
        {
            id: "SPECIAL_templates_annotationQuestions",
            valueType: "none",
            displayType: "templateList",
            displayConfiguration: "annotationQuestions",
            displayPrompt: "Copy a question from a template",
            displayVisible: function(panelBuilder, model) { return panelBuilder.readOnly === false; }
        },

    ]
};

export = panel;

