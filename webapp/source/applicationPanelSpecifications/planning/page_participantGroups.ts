import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_participantGroups",
    displayName: "Describe participant groups",
    pageExplanation: "Answer questions about your storytellers. Think about how their needs affect your plans. (Your answers will be used to recommend options on other pages.)",
    pageCategories: "plan",
    headerAbove: "Consider Context",
    panelFields: [
        {
            id: "project_aboutParticipantGroups",
            valueType: "none",
            displayType: "label",
            displayPrompt: 
            `On this page you can think about groups of <strong>participants</strong> you want to involve in your project. 
            (Examples might be: doctors and patients; staff and customers; natives, immigrants, and tourists.).`
        },
        {
            id: "project_participantGroupsList",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: "panel_addParticipantGroup",
            displayName: "Participant groups",
            displayPrompt: "Please add participant <strong>groups</strong> in the list below (typically up to three groups)."
        }
    ]
};

export = panel;

