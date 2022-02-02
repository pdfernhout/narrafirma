import Globals = require("../../Globals");
import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_exportStories",
    displayName: "Export stories or story forms",
    pageExplanation: "Save a story form or story collection to a CSV spreadsheet file for backup or for use outside of NarraFirma.",
    pageCategories: "output",
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
            displayPreventBreak: true,
            displayPrompt: "Export story form with options for NarraFirma-native import...",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().storyCollectionIdentifier();}
        },
        {
            id: "project_exportStoryFormForImport",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "exportQuestionnaireForImport",
            displayPrompt: "Export story form with options for external import...",
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

