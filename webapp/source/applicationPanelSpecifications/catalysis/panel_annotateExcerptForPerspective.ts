import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_annotateExcerptForPerspective",
    modelClass: "ExcerptAnnotationForPerspective",
    panelFields: [
        {
            id: "perspective_excerptLinkageNotes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Notes",
            displayPrompt: "Enter any notes you want to remember about this excerpt with respect to this perspective."
        }
    ]
};

export = panel;

