import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    "id": "page_planning",
    "displayName": "Planning",
    "displayType": "page",
    "isHeader": true,
    "section": "planning",
    "modelClass": null,
    "panelFields": [
        {
            "id": "project_projectPlanningDescriptionLabel",
            "valueType": "none",
            "displayType": "label",
            "displayPrompt": "In the planning phase of your PNI project, you will make <strong>decisions</strong> about how your project will proceed. You will think about your goals, your topic, your participants, and any opportunities and dangers you might encounter during the project."
        },
        {
            "id": "project_projectPlanningLinksLabel",
            "valueType": "none",
            "displayType": "label",
            "displayPrompt": "Below are links to each step of the planning phase, along with any reminders you may have entered on them."
        }
    ]
};

export = panel;

