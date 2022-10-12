import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_return",
    displayName: "Return",
    panelFields: [
        {
            id: "returnIntroLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: 
                `In this phase of PNI, you wrap up your project and support the return of stories 
                (stories you collected and stories about the project) to your community or organization.` 
        }
    ]
};

export = panel;

