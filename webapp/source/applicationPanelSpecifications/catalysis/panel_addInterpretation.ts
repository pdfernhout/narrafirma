import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_addInterpretation",
    modelClass: "Interpretation",
    panelFields: [
        {
            id: "interpretation_text",
            valueType: "string",
            displayType: "textarea",
            displayName: "Description",
            displayPrompt: "Please <strong>describe</strong> this interpretation. What does the pattern mean, from this perspective?"
        },
        {
            id: "interpretation_name",
            valueType: "string",
            displayType: "text",
            displayName: "Name",
            displayPrompt: "Please give this interpretation a <strong>name</strong>."
        },
        {
            id: "interpretation_idea",
            valueType: "string",
            displayType: "textarea",
            displayName: "Idea",
            displayPrompt: "If you like, you can record an <strong>idea</strong> that follows from this interpretation."
        }
    ]
};

export = panel;

