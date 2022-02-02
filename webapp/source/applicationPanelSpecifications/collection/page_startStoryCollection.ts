import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_startStoryCollection",
    displayName: "Start story collection",
    pageExplanation: "Create a story collection: a container that will hold a group of stories related to a particular story form. Start or stop collecting stories over the internet.",
    pageCategories: "manage",
    headerAbove: "Collect Stories",
    panelFields: [
        {
            id: "storyCollection_createCollectionLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you can create one or more <strong>story collections</strong> for your project. A story collection is a body of stories collected using a specific story form." 
        },
        {
            id: "project_storyCollections",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: {
                itemPanelID: "panel_addStoryCollection",
                gridConfiguration: {
                    validateAdd: "storeQuestionnaireInStoryCollection",
                    viewButton: true,
                    editButton: true,
                    addButton: true,
                    removeButton: true,
                    customButton: {customButtonLabel: "Activate or Deactivate Web Form", callback: "toggleWebActivationOfSurvey"},
                    columnsToDisplay: ["storyCollection_shortName", "storyCollection_questionnaireIdentifier", "storyCollection_activeOnWeb", "storyCollection_notes"],
                    transformDisplayedValues: function (value, fieldName) {
                        if (fieldName !== "storyCollection_activeOnWeb") return value;
                        return value ? "yes" : "no";
                    }
                }
            },
            displayName: "Story collections",
            displayPrompt: "These are the story collections you have created so far."
        },
    ]
};

export = panel;

