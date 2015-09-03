import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    "id": "page_intervention",
    "displayName": "Intervention",
    "displayType": "page",
    "isHeader": true,
    "section": "intervention",
    "modelClass": null,
    "panelFields": [
        {
            "id": "interventionIntroLabel",
            "valueType": "none",
            "displayType": "label",
            "displayPrompt": "In the intervention phase of your PNI project, you will <strong>plan interventions</strong> and record information about them. An intervention is an action that has an impact on the stories people tell.<br><br>Below are links to each step of this phase, along with any reminders you may have entered on them."
        }
    ]
};

export = panel;

