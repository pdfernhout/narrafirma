import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_addPerspective",
    modelClass: "Perspective",
    panelFields: [
        {
            id: "perspective_name",
            valueType: "string",
            displayType: "text",
            displayName: "Perspective name",
            displayPrompt: "Please give this perspective a name."
        },
        {
            id: "perspective_description",
            valueType: "string",
            displayType: "textarea",
            displayName: "Perspective",
            displayPrompt: "Describe this perspective."
        },
        {
            id: "perspective_linkedInterpretationsList",
            valueType: "none",
            displayType: "grid",
            displayConfiguration: "panel_annotateInterpretationForPerspective",
            displayPrompt: "Interpretations linked to this perspective"
        }
    ]
};

export = panel;

