import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_writeProjectSynopsis",
    displayName: "Write project synopsis",
    panelFields: [
        {
            id: "project_synopsis_intro",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you can write your project <strong>synopsis</strong>, a one or two sentence summary of what matters most about your project."
        },
        {
            id: "project_synopsis",
            valueType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Project synopsis",
            displayPrompt: "Your synopsis should briefly <strong>summarize</strong> the project, so that anyone who hears about it can quickly understand what you are doing and why."
        }
    ]
};

export = panel;

