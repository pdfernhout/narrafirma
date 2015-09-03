import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    "id": "page_administration",
    "displayName": "Administration",
    "displayType": "page",
    "isHeader": true,
    "section": "administration",
    "modelClass": null,
    "panelFields": [
        {
            "id": "administrationIntroLabel",
            "valueType": "none",
            "displayType": "label",
            "displayPrompt": "In the administration section, you can do house-keeping actions like backing up data. There is also an introduction page for first-time users. Below are links to each activity, along with any reminders you may have entered on them."
        }
    ]
};

export = panel;
