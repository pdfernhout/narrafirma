import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_chooseElicitingQuestion",
    displayName: "Choose a story eliciting question",
    displayType: "panel",
    section: "collection",
    modelClass: "ElicitingQuestionChoice",
    panelFields: [
        {
            id: "order",
            valueType: "string",
            required: true,
            displayType: "text",
            displayName: "Order",
            displayPrompt: "Specify the order to present this eliciting question (e.g. 1, 2a, 2b, 3)"
        },
        {
            id: "elicitingQuestion",
            valueType: "string",
            valueOptions: "/projectModel/project_elicitingQuestionsList",
            valueOptionsSubfield: "elicitingQuestion_shortName",
            required: true,
            displayType: "select",
            displayName: "Question choice",
            displayPrompt: "Choose a story-eliciting question."
        }
    ]
};

export = panel;

