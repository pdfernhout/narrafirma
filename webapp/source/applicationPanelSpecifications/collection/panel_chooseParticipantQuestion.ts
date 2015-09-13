import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_chooseParticipantQuestion",
    modelClass: "ParticipantQuestionChoice",
    panelFields: [
        {
            id: "order",
            valueType: "string",
            required: true,
            displayType: "text",
            displayName: "Order",
            displayPrompt: "Specify the order to ask this participant question (e.g. 1, 2a, 2b, 3)"
        },
        {
            id: "participantQuestion",
            valueType: "string",
            valueOptions: "/projectModel/project_participantQuestionsList",
            valueOptionsSubfield: "participantQuestion_shortName",
            required: true,
            displayType: "select",
            displayName: "Question choice",
            displayPrompt: "Choose a participant question."
        }
    ]
};

export = panel;

