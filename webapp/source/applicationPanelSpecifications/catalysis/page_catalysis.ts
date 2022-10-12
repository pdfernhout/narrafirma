import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_catalysis",
    displayName: "Catalysis",
    panelFields: [
        {
            id: "catalysisIntro",
            valueType: "none",
            displayType: "label",
            displayPrompt: 
                `In this phase of PNI, you look for patterns
                in the stories people told and in their answers to questions.
                Then you prepare the patterns to catalyze sensemaking.`
        }
    ]
};

export = panel;

