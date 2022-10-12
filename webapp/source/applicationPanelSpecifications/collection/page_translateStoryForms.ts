import Globals = require("../../Globals");
import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_translateStoryForms",
    displayName: "Translate story forms",
    pageExplanation: "Enter translations to display your story form in multiple languages.",
    pageCategories: "input",
    panelFields: [
        {
            id: "translateStoryForm_Label",
            valueType: "none",
            displayType: "label",
            displayPrompt: `On this page you can <strong>translate</strong> your story forms into additional languages. 
                You can also import and export translations from this page.
                For details on building multi-lingual story forms, see the help system.`
        },
        {
            id: "translateStoryForm_chooseStoryForm",
            valuePath: "/clientState/storyFormName",
            valueType: "string",
            valueOptions: "/project/project_storyForms",
            valueOptionsSubfield: "questionForm_shortName",
            displayType: "select",
            displayName: "Story form",
            displayPrompt: `Please select a <strong>story form</strong> to translate.`
        },


        {
            id: "translateStoryForm_defaultLanguage",
            valuePath: "/clientState/storyFormIdentifier/questionForm_defaultLanguage",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "20",
            displayName: "Default language",
            displayPrompt: "What is the <strong>default language</strong> of this story form?",
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().storyFormIdentifier(); }
        },
    
        {
            id: "translateStoryForm_languageChoiceQuestion_text",
            valuePath: "/clientState/storyFormIdentifier/questionForm_languageChoiceQuestion_text",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "80",
            displayName: "Language choice question text",
            displayPrompt: "Enter a question participants will answer to <strong>choose a language</strong> in which to view the story form.",
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().storyFormIdentifier(); }
        },
        {
            id: "translateStoryForm_languageChoiceQuestion_choices",
            valuePath: "/clientState/storyFormIdentifier/questionForm_languageChoiceQuestion_choices",
            valueType: "string",
            displayType: "textarea",
            displayName: "Languages",
            displayPrompt: `Enter a list of <strong>additional (non-default) languages</strong> participants can choose from.`,
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().storyFormIdentifier(); }
        },

        {
            id: "translateStoryForm_dictionaryEditor",
            valueType: "none",
            displayType: "translationDictionaryEditorPanel",
            displayName: "Translation dictionary",
            displayPrompt: ``,
            displayVisible: function(panelBuilder, model) { return !!Globals.clientState().storyFormIdentifier(); }
        },
        {
            id: "project_csvFileUploaderForTranslations",
            valueType: "none",
            displayType: "html",
            displayPrompt: '<input type="file" id="csvFileLoader" name="files" title="Import Translations from CSV File" style="display:none"/>'
        },
    ]
};

export = panel;

