import Globals = require("../../Globals");
import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_exportStories",
    displayName: "Export stories",
    tooltipText: "Save your stories to a CSV file for backup or use elsewhere.",
    panelFields: [
        {
            id: "exportStories_Label",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you can <strong>export</strong> the stories (and story form) in a story collection."
        },
        {
            id: "storyCollectionChoice_exportStories",
            valuePath: "/clientState/storyCollectionName",
            valueType: "string",
            valueOptions: "project_storyCollections",
            valueOptionsSubfield: "storyCollection_shortName",
            displayType: "select",
            displayName: "Story collection",
            displayPrompt: "Choose a <strong>story collection</strong> to export from."
        },
        {
            id: "project_exportStoryForm",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "exportQuestionnaire",
            displayPrompt: "Export story form...",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().storyCollectionIdentifier();}
        },
        {
            id: "project_exportStories",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "exportStoryCollection",
            displayPrompt: "Export story collection...",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().storyCollectionIdentifier();}
        }
    ]
};

export = panel;

