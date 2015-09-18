import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_newSensemakingSessionConstruction",
    modelClass: "SensemakingSessionConstruction",
    panelFields: [
        {
            id: "sensemakingSessionRecord_construction_name",
            valueType: "string",
            displayType: "text",
            displayName: "Sensemaking construction name",
            displayPrompt: "Please give this construction a <strong>name</strong>."
        },
        {
            id: "sensemakingSessionRecord_construction_type",
            valueType: "string",
            valueOptions: [
                "timeline",
                "landscape",
                "story elements",
                "composite story",
                "other"
            ],
            displayType: "select",
            displayName: "Type",
            displayPrompt: "What <strong>type</strong> of construction is it?"
        },
        {
            id: "sensemakingSessionRecord_construction_description",
            valueType: "string",
            displayType: "textarea",
            displayName: "Description",
            displayPrompt: "Please <strong>describe</strong> the construction (or include a description given by participants). Your description can include links to images or documents."
        }
    ]
};

export = panel;

