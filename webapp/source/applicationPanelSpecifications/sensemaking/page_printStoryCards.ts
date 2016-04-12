import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_printStoryCards",
    displayName: "Print story cards",
    tooltipText: "Print out the stories you collected so people can use them during sensemaking sessions.",
    headerAbove: "Get Ready for Sensemaking",
    panelFields: [
        {
            id: "printStoryCards_introduction",
            valueType: "none",
            displayType: "label",
            displayPrompt: `On this page you can print or export <strong>story cards</strong>, printed versions 
                of stories that people can arrange and compare as they 
                encounter stories and work on sensemaking exercises.
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
            displayPrompt: "Choose the <strong>story collection</strong> whose story cards you want to print."
        },
        {
            id: "printStoryCards_output",
            valueType: "none",
            displayType: "label",
            displayPrompt: ""
        },
        {
            id: "printStoryCards_printFormButton",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "printStoryCards",
            displayPrompt: "Print Story Cards"
        }
    ]
};

export = panel;

