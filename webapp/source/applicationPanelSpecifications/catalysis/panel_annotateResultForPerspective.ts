import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_annotateResultForPerspective",
    displayName: "Annotate result for perspective",
    displayType: "panel",
    section: "catalysis",
    modelClass: "ResultAnnotationForPerspective",
    panelFields: [
        {
            id: "perspective_resultLinkageNotes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Notes",
            displayPrompt: "Enter any notes you want to remember about this result with respect to this perspective."
        }
    ]
};

export = panel;

