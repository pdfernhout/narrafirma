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
            displayPrompt: "<strong>Describe</strong> this interpretation. What does the pattern mean, from this perspective?"
        },
        {
            id: "interpretation_name",
            valueType: "string",
            displayType: "text",
            displayName: "Name",
            displayPrompt: 'Give the interpretation a short <strong>name</strong>. This name will represent it on the "Cluster interpretations" page and in the printed report.'
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

