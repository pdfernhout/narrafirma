import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_newCollectionSessionConstruction",
    modelClass: "CollectionSessionConstruction",
    panelFields: [
        {
            id: "collectionSessionRecord_construction_name",
            valueType: "string",
            required: true,
            displayType: "text",
            displayName: "Name",
            displayPrompt: "Please give this construction a <strong>name</strong>."
        },
        {
            id: "collectionSessionRecord_construction_type",
            valueType: "string",
            valueOptions: [
                "timeline",
                "landscape",
                "other"
            ],
            required: true,
            displayType: "select",
            displayName: "Type",
            displayPrompt: "What <strong>type</strong> of construction is it?"
        },
        {
            id: "collectionSessionRecord_construction_description",
            valueType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Description",
            displayPrompt: "Please <strong>describe</strong> the construction (or include a description given by participants). Your description can include links to images or other documents."
        }
    ]
};

export = panel;

