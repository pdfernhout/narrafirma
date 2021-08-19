import Globals = require("../../Globals");
import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_annotateStories",
    displayName: "Annotate stories",
    tooltipText: "Answer questions about the stories you collected.",
    panelFields: [
        {
            id: "project_annotateStoriesLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: `On this page you can <strong>answer the annotation questions</strong> you created on the previous page.`
        },   
        {
            id: "storyCollectionChoiceForAnnotation",
            valuePath: "/clientState/storyCollectionName",
            valueType: "string",
            valueOptions: "project_storyCollections",
            valueOptionsSubfield: "storyCollection_shortName",
            displayType: "select",
            displayName: "Story collection",
            displayPrompt: `Choose a <strong>story collection</strong> to annotate.`
        },
        {
            id: "project_annotateStoriesList",
            valuePath: "/clientState/storyCollectionName",
            valueType: "none",
            displayType: "storyAnnotationBrowser",
            displayPrompt: "Stories in collection",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().storyCollectionIdentifier();}
        },
        {
            id: "annotationGraphBrowserDisplay",
            valuePath: "/clientState/storyCollectionName",
            valueType: "none",
            displayType: "annotationGraphBrowser",
            displayPrompt: "Choose an annotation question whose counts or values you want to <strong>graph</strong> (for the selected story collection).",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().storyCollectionIdentifier();}
        },
    ]
};

export = panel;

