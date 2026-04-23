import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_planning",
    displayName: "Planning",
    panelFields: [
        {
            id: "project_projectPlanningDescriptionLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: 
                `In the first phase of PNI, you decide what you are going to do. 
                You consider your goals, topic, and participants; you ponder opportunities and dangers; you firm up your plans.`
        }
    ]
};

export = panel;

