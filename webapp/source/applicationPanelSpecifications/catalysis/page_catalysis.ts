import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_catalysis",
    displayName: "Catalysis",
    panelFields: [
        {
            id: "catalysisIntro",
            valueType: "none",
            displayType: "label",
            displayPrompt: 
`In the catalysis phase of your PNI project, you will look for <strong>patterns</strong>
in the stories people told and in their answers to questions. You will build on these
patterns by adding <strong>observations</strong>, <strong>interpretations</strong> and <strong>ideas</strong> that will 
catalyze thought and discussion
during the sensemaking phase of your project.`
        }
    ]
};

export = panel;

