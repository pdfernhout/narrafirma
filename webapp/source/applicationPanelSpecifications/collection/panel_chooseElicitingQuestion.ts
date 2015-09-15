import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_chooseElicitingQuestion",
    modelClass: "ElicitingQuestionChoice",
    panelFields: [
        {
            id: "order",
            valueType: "string",
            displayType: "text",
            displayName: "Order",
            displayPrompt: "Specify the order to present this eliciting question (e.g. 1, 2a, 2b, 3)"
        },
        {
            id: "elicitingQuestion",
            valueType: "string",
            valueOptions: "/project/project_elicitingQuestionsList",
            valueOptionsSubfield: "elicitingQuestion_shortName",
            displayType: "select",
            displayName: "Question choice",
            displayPrompt: "Choose a story-eliciting question."
        }
    ]
};

export = panel;

