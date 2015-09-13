import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_addToExcerpt",
    panelFields: [
        {
            id: "addToExcerpt_excerptsListChoose",
            valueType: "none",
            displayType: "excerptsList",
            displayPrompt: "Choose an excerpt from this list to which to add the selected text, or create a new excerpt."
        },
        {
            id: "addToExcerpt_addTextToExistingExcerptButton",
            valueType: "none",
            displayType: "button",
            displayPrompt: "Add text to selected excerpt"
        },
        {
            id: "addToExcerpt_createNewExcerptWithTextButton",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "panel_createNewExcerpt",
            displayPrompt: "Create new excerpt with this text"
        }
    ]
};

export = panel;

