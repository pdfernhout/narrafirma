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
                `In the return phase of your PNI project, you can support the return of stories to your community or organization. 
                You might gather <strong>feedback</strong>, <strong>reflect</strong> on the project, make 
                a <strong>presentation</strong> about the project, and help people with <strong>requests</strong> about the project.`
        },
        {
            id: "returnIntroLabel_optional",
            valueType: "none",
            displayType: "label",
            displayPrompt: `Except for the "Reflect on the project" page, which is strongly recommended, 
                all of the pages in this section are optional. Use them if you have need of them.`
        },
    ]
};

export = panel;

