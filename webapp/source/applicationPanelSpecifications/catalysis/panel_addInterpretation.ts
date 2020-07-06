import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
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
            displayPrompt: 'Give the interpretation a short <strong>name</strong>. This name will represent it during clustering and will be its heading in the printed report.'
        },
        {
            id: "interpretation_questions",
            valueType: "string",
            displayType: "textarea",
            displayName: "Questions",
            displayPrompt: "You might want to record some <strong>questions</strong> that arise from this interpretation. (If you want your questions to appear as an HTML list in the report, write them on separate lines.)"
        },
        {
            id: "interpretation_idea",
            valueType: "string",
            displayType: "textarea",
            displayName: "Idea",
            displayPrompt: "If you like, you can record an <strong>idea</strong> that follows from this interpretation."
        },
    ]
};

export = panel;

