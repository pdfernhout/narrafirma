import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_collection",
    displayName: "Collection",
    panelFields: [
        {
            id: "project_collectionPhaseDescriptionLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt:
                `In this phase of PNI, you choose story collection methods, 
                build a library of questions, use them to create story forms, 
                and collect and review your stories.`
        }
    ]
};

export = panel;

