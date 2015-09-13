import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_designStoryForms",
    displayName: "Design story forms",
    panelFields: [
        {
            id: "storyForms_Label",
            valueType: "none",
            displayType: "label",
            displayPrompt: "<p>On this page you will design one or more <strong>story forms</strong> for your project. Choose from the library of questions you already created to create the form your participants will use to tell their stories and answer questions about them.</p>"
        },
        {
            id: "project_storyForms",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: "panel_addStoryForm",
            displayName: "Questionnaires",
            displayPrompt: "These are the story forms you have created so far."
        }
    ]
};

export = panel;

