import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_printQuestionForms",
    displayName: "Print story forms",
    displayType: "page",
    section: "collection",
    modelClass: "PrintQuestionFormsActivity",
    panelFields: [
        {
            id: "printQuestionsForm_introduction",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you can print story forms for off-line distribution to participants. You can later enter the results from each form into the system."
        },
        {
            id: "storyCollectionChoice_printing",
            valuePath: "/clientState/storyCollectionIdentifier",
            valueType: "string",
            valueOptions: "project_storyCollections",
            valueOptionsSubfield: "storyCollection_shortName",
            required: true,
            displayType: "select",
            displayName: "Story collection",
            displayPrompt: "Choose the <strong>story collection</strong> whose story form you want to print."
        },
        {
            id: "printQuestionsForm_output",
            valueType: "none",
            displayType: "label",
            displayPrompt: ""
        },
        {
            id: "printQuestionsForm_printFormButton",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "printStoryForm",
            displayPrompt: "Print Story Form"
        }
    ]
};

export = panel;

