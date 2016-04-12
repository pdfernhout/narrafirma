import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_writeAnnotationsAboutStories",
    displayName: "Write annotations about stories",
    tooltipText: "Add some questions that you will answer by reading the stories you collected.",
    headerAbove: "Review, Repair, and Annotate",
    panelFields: [
        {
            id: "project_storyQuestionsLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you can write questions you will use to <strong>annotate</strong> stories with additional information. You can add more annotation questions after you start collecting stories."
        },
        {
            id: "project_annotationQuestionsList",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: "panel_addAnnotationQuestion",
            displayName: "Annotations about stories",
            displayPrompt: "These are the annotation questions you have written so far."
        }
    ]
};

export = panel;

