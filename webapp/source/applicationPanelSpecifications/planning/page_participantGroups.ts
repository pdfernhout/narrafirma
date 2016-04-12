import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_participantGroups",
    displayName: "Describe participant groups",
    tooltipText: "Think about the people who will be telling stories.",
    headerAbove: "Think about Context",
    panelFields: [
        {
            id: "project_aboutParticipantGroups",
            valueType: "none",
            displayType: "label",
            displayPrompt: 
`On this page you will think about groups of <strong>participants</strong> you want to involve in your project. 
(Examples might be: doctors and patients; staff and customers; natives, immigrants, and tourists.)
The choices you make here will influence the <strong>recommendations</strong> NarraFirma shows you (for story collection methods, 
questions about stories, etc.).`
        },
        {
            id: "project_participantGroupsList",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: "panel_addParticipantGroup",
            displayName: "Participant groups",
            displayPrompt: "Please add participant <strong>groups</strong> in the list below (typically up to three groups)."
        }
    ]
};

export = panel;

