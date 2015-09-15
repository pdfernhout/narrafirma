import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_chooseStoryQuestion",
    modelClass: "StoryQuestionChoice",
    panelFields: [
       {
            id: "order",
            valueType: "string",
            displayType: "text",
            displayName: "Order",
            displayPrompt: "Specify the order to ask this story question (e.g. 1, 2a, 2b, 3)"
        },
        {
            id: "storyQuestion",
            valueType: "string",
            valueOptions: "/project/project_storyQuestionsList",
            valueOptionsSubfield: "storyQuestion_shortName",
            displayType: "select",
            displayName: "Question choice",
            displayPrompt: "Choose a story question."
        }
    ]
};

export = panel;

