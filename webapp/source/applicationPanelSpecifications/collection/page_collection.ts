import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_collection",
    displayName: "Collection",
    panelFields: [
        {
            id: "project_collectionPhaseDescriptionLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt:
`In the collection phase of your PNI project, you will decide on story collection <strong>methods</strong>; 
write <strong>questions</strong> for story elicitation and interpretation; design story <strong>forms</strong>; 
collect stories over the <strong>web</strong>; and plan story collection <strong>sessions</strong>. You can also 
<strong>review</strong> incoming stories and enter <strong>records</strong> of story collection sessions.`
        }
    ]
};

export = panel;

