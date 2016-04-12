import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_chooseCollectionMethods",
    displayName: "Choose collection methods",
    tooltipText: "Decide how you will collect stories.",
    headerAbove: "Plan Your Story Collection",
    panelFields: [
        {
            id: "project_methodsIntro",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you will plan your story collection <strong>methods</strong>, or the ways you will collect stories."
        },
        {
            id: "SPECIAL_methodRecommendations",
            valueType: "none",
            displayType: "recommendationTable",
            displayConfiguration: "venues",
            displayPrompt: "Method recommendations"
        },
        {
            id: "project_methodsList",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: "panel_addStoryCollectionMethod",
            displayName: "Story collection methods",
            displayPrompt: "These are the ways you will be collecting stories."
        }
    ]
};

export = panel;

