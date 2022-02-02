import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_chooseCollectionMethods",
    displayName: "Choose collection methods",
    pageExplanation: "Decide how you will collect stories (surveys? interviews? group sessions?). Describe your plans. View recommendations based on questions you answered in the Planning section.",
    pageCategories: "plan",
    headerAbove: "Plan Your Story Collection",
    panelFields: [
        {
            id: "project_methodsIntro",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you can plan your story collection <strong>methods</strong>, or the ways you will collect stories."
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

