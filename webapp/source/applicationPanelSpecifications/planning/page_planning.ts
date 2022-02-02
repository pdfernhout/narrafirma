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
                `In the planning phase of your PNI project, you can make <strong>decisions</strong> about how your project will proceed. 
                You can think about your goals, your topic, your participants, and any opportunities and dangers you might encounter 
                during the project.`
        }
    ]
};

export = panel;

