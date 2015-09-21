import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_addAnnotationQuestion",
    modelClass: "AnnotationQuestion",
    panelFields: [
        {
            id: "annotationQuestion_text",
            valueType: "string",
            displayType: "textarea",
            displayName: "Question",
            displayPrompt: "Enter a <strong>question</strong> you will use to annotate stories after they have been collected."
        },
        {
            id: "annotationQuestion_type",
            valueType: "string",
            valueOptions: [
                "boolean",
                "label",
                "header",
                "checkbox",
                "checkboxes",
                "text",
                "textarea",
                "select",
                "radiobuttons",
                "slider"
            ],
            displayType: "select",
            displayName: "Type",
            displayPrompt: "What <strong>type</strong> of question is this?"
        },
        {
            id: "annotationQuestion_shortName",
            valueType: "string",
            displayType: "text",
            displayName: "Short name",
            displayPrompt: "Please enter a <strong>short name</strong> we can use to refer to the question. (It must be unique within the project.)"
        },
        {
            id: "annotationQuestion_options",
            valueType: "string",
            displayType: "textarea",
            displayName: "Options",
            displayPrompt: "If your question requires <strong>choices</strong>, enter them here (one per line). For a slider, enter the texts to place on the left and right sides (on separate lines)."
        }
    ]
};

export = panel;

