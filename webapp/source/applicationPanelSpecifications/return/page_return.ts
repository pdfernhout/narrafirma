import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_return",
    displayName: "Return",
    panelFields: [
        {
            id: "returnIntroLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: 
`In the return phase of your PNI project, you will support the return of stories to your community or organization. 
You will gather <strong>feedback</strong>, <strong>reflect</strong> on the project, perhaps make 
a <strong>presentation</strong> about the project, and help people with <strong>requests</strong> about the project.`
        }
    ]
};

export = panel;

