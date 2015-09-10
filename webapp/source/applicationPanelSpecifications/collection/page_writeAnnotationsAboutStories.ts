import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_writeAnnotationsAboutStories",
    displayName: "Write annotations about stories",
    displayType: "page",
    section: "collection",
    modelClass: "WriteQuestionsAboutStoriesActivity",
    panelFields: [
        {
            id: "project_storyQuestionsLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you will write questions which you will use to annotate stories after they have been received. You may return here to add more questions after you start collecting stories."
        },
        {
            id: "project_storyAnnotationsList",
            valueType: "array",
            required: true,
            displayType: "grid",
            displayConfiguration: "panel_addStoryQuestion",
            displayName: "Annotations about stories",
            displayPrompt: "These are the annotation questions you have written so far."
        }
    ]
};

export = panel;

