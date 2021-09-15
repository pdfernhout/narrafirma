import Globals = require("../../Globals");
import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
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
            displayPrompt: `Choose a <strong>story collection</strong> to annotate.`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().atLeastOneAnnotationQuestionExists();}
        },
        {
            id: "project_annotateStories_noAnnotationQuestionsLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: `<em>You have not yet created any annotation questions for this project. Write at least one annotation question, then come back to this page and annotate your stories</em>.`,
            displayVisible: function(panelBuilder, model) {
                return !Globals.clientState().atLeastOneAnnotationQuestionExists();}
        },
        {
            id: "project_annotateStoriesList",
            valuePath: "/clientState/storyCollectionName",
            valueType: "none",
            displayType: "storyAnnotationBrowser",
            displayPrompt: "Stories in collection",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().atLeastOneAnnotationQuestionExists() && !!Globals.clientState().storyCollectionIdentifier();}
        },
        {
            id: "annotationGraphBrowserDisplay",
            valuePath: "/clientState/storyCollectionName",
            valueType: "none",
            displayType: "annotationGraphBrowser",
            displayPrompt: "Choose an annotation question whose counts or values you want to <strong>graph</strong> (for the selected story collection).",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().atLeastOneAnnotationQuestionExists() && !!Globals.clientState().storyCollectionIdentifier();}
        },
    ]
};

export = panel;

