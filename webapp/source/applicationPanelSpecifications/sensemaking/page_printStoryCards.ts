import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    "id": "page_printStoryCards",
    "displayName": "Print story cards",
    "displayType": "page",
    "section": "sensemaking",
    "modelClass": "PrintStoryCardsActivity",
    "panelFields": [
        {
            "id": "printStoryCards_introduction",
            "valueType": "none",
            "displayType": "label",
            "displayPrompt": "On this page you can print <strong>story cards</strong> to use in sensemaking sessions. Story cards are card-like presentations of stories that people can arrange and compare as they encounter stories and work on sensemaking exercises."
        },
        {
            "id": "storyCollectionChoice_printing",
            "valuePath": "/clientState/storyCollectionIdentifier",
            "valueType": "string",
            "valueOptions": "project_storyCollections",
            "valueOptionsSubfield": "storyCollection_shortName",
            "required": true,
            "displayType": "select",
            "displayName": "Story collection",
            "displayPrompt": "Choose the <strong>story collection</strong> whose story cards you want to print."
        },
        {
            "id": "printStoryCards_output",
            "valueType": "none",
            "displayType": "label",
            "displayPrompt": ""
        },
        {
            "id": "printStoryCards_printFormButton",
            "valueType": "none",
            "displayType": "button",
            "displayConfiguration": "printStoryCards",
            "displayPrompt": "Print Story Cards"
        }
    ]
};

export = panel;

