import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_planning",
    displayName: "Planning",
    panelFields: [
        {
            id: "project_projectPlanningDescriptionLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: 
`In the planning phase of your PNI project, you will make <strong>decisions</strong> about how your project will proceed. 
You will think about your goals, your topic, your participants, and any opportunities and dangers you might encounter 
            during the project.`
        }
    ]
};

export = panel;

