import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    "id": "panel_annotateInterpretationForPerspective",
    "displayName": "Annotate interpretation for perspective",
    "displayType": "panel",
    "section": "catalysis",
    "modelClass": "InterpretationAnnotationForPerspective",
    "panelFields": [
        {
            "id": "perspective_interpretationLinkageNotes",
            "valueType": "string",
            "displayType": "textarea",
            "displayName": "Notes",
            "displayPrompt": "Enter any notes you want to remember about this interpretation as it is linked to this perspective."
        }
    ]
};

export = panel;

