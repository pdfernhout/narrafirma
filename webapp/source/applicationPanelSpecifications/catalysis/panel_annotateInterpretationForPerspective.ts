import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_annotateInterpretationForPerspective",
    modelClass: "InterpretationAnnotationForPerspective",
    panelFields: [
        {
            id: "perspective_interpretation_name",
            valueType: "string",
            displayType: "text",
            displayName: "Name",
            displayPrompt: "Interpretation name (as previously entered)"
        },
        {
            id: "perspective_interpretationLinkageNotes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Notes",
            displayPrompt: "Enter any notes you want to remember about this interpretation as it is linked to this perspective."
        }
    ]
};

export = panel;

