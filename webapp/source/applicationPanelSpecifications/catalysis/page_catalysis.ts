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
                `In the catalysis phase of your PNI project, you can look for <strong>patterns</strong>
                as you study the stories people told and their answers to questions. 
                You can build on these patterns by writing <strong>observations</strong>, <strong>interpretations</strong>, and <strong>ideas</strong>
                that will catalyze thought and discussion during the sensemaking phase of your project.`
        }
    ]
};

export = panel;

