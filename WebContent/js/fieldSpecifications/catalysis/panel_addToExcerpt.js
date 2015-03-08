define([], function() {
    "use strict";
    return [
        {
            id: "panel_addToExcerpt",
            displayName: "Add text to excerpt",
            displayType: "panel",
            section: "catalysis",
            modelClass: "ToExcerptModel"
        },
        {
            id: "addToExcerpt_excerptsListChoose",
            dataType: "none",
            displayType: "excerptsList",
            displayPrompt: "Choose an excerpt from this list to which to add the selected text, or create a new excerpt."
        },
        {
            id: "addToExcerpt_addTextToExistingExcerptButton",
            dataType: "none",
            displayType: "button",
            displayPrompt: "Add text to selected excerpt"
        },
        {
            id: "addToExcerpt_createNewExcerptWithTextButton",
            dataType: "none",
            displayType: "button",
            displayConfiguration: "panel_createNewExcerpt",
            displayPrompt: "Create new excerpt with this text"
        }
    ];
});
