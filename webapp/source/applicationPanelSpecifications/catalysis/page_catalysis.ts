import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_catalysis",
    displayName: "Catalysis",
    displayType: "page",
    isHeader: true,
    section: "catalysis",
    modelClass: null,
    panelFields: [
        {
            id: "catalysisIntro",
            valueType: "none",
            displayType: "label",
            displayPrompt: 
`In the catalysis phase of your PNI project, you will look for <strong>patterns</strong>
in the stories people told and in their answers to questions. You will build on these
patterns by adding <strong>observations</strong>, <strong>interpretations</strong> and <strong>ideas</strong> that will be of use
during the sensemaking phase.`
        }
    ]
};

export = panel;

