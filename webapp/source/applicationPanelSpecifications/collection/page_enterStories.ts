import Globals = require("../../Globals");
import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_enterStories",
    displayName: "Enter or import stories",
    tooltipText: "Add stories you collected off-line.",
    panelFields: [
        {
            id: "enterStories_Label",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you can <strong>enter</strong> or import stories you collected from participants."
        },
        {
            id: "storyCollectionChoice_enterStories",
            valuePath: "/clientState/storyCollectionName",
            valueType: "string",
            valueOptions: "project_storyCollections",
            valueOptionsSubfield: "storyCollection_shortName",
            displayType: "select",
            displayName: "Story collection",
            displayPrompt: "Choose a <strong>story collection</strong> to add a story to."
        },
        {
            id: "project_enterStories",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "enterSurveyResult",
            displayPrompt: "Add Story...",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().storyCollectionIdentifier();}
        },
        {
            id: "project_importCSVStories",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "importCSVStories",
            displayPrompt: "Import stories from CSV file...",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().storyCollectionIdentifier();}
        },
        {
            id: "project_csvFileUploaderForStories",
            valueType: "none",
            displayType: "html",
            displayPrompt: '<input type="file" id="csvFileLoader" name="files" title="Import Stories from CSV File" style="display:none"/>',
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().storyCollectionIdentifier();}
        },
    ]
};

export = panel;

