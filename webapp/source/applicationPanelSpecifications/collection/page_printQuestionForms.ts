import Globals = require("../../Globals");
import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_printQuestionForms",
    displayName: "Print story forms",
    tooltipText: "Export your story form for use in face-to-face sessions or interviews.",
    panelFields: [
        {
            id: "printQuestionsForm_introduction",
            valueType: "none",
            displayType: "label",
            displayPrompt: `
                On this page you can print story forms for off-line use. 
                Later, you can enter the completed forms into your story collection (see "Enter or import stories").
                You can change the way your printed story form appears by entering custom CSS on the "Design, generate, or import story forms" page.
                `
        },
        {
            id: "storyCollectionChoice_printing",
            valuePath: "/clientState/storyCollectionName",
            valueType: "string",
            valueOptions: "project_storyCollections",
            valueOptionsSubfield: "storyCollection_shortName",
            displayType: "select",
            displayName: "Story collection",
            displayPrompt: "Choose the <strong>story collection</strong> whose story form you want to print."
        },
        {
            id: "printQuestionsForm_printFormButton",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "printStoryForm",
            displayPrompt: "Print Story Form",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().storyCollectionIdentifier();}
        }
    ]
};

export = panel;

