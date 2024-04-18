import Globals = require("../../Globals");
import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_writeAnnotationsAboutStories",
    displayName: "Write annotation questions",
    pageExplanation: "Design research questions to answer as you study your collected stories.",
    pageCategories: "enter",
    headerAbove: "Interpret",
    panelFields: [
        {
            id: "project_annotationQuestionsLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: `On this page you can create <strong>annotation questions</strong> 
               that you will use to add qualitative research codes or tags to your story texts. For details on how annotation works, see the help system.`
        },   
        {
            id: "project_annotationQuestionsList",
            valueType: "array",
            displayType: "grid",
            displayName: "Annotation questions",
            displayPrompt: "These are the annotation questions you have added. Click on a question to edit it.",
            displayConfiguration: {
                itemPanelID: "panel_addAnnotationQuestion",
                gridConfiguration: {
                    columnsToDisplay: ["annotationQuestion_text", "annotationQuestion_type", "annotationQuestion_shortName", "annotationQuestion_options"],
                    validateAdd: "requireShortName",
                    validateEdit: "requireShortName",
                    addButton: true,
                    removeButton: true, 
                    duplicateButton: true,
                    navigationButtons: true,
               }
            }
        },
        {
            id: "project_annotationQuestionsOrder",
            valueType: "string",
            displayType: "textarea",
            displayName: "Annotation questions order",
            displayPrompt: `You can specify the <b>order</b> in which your questions should appear on the "Annotate stories" page.
                Enter each question's (exact) short name, one per line. 
                To add a header (e.g., "Questions about emotions"), write it on a line by itself.
                To include a question as a column in the table of stories, type an asterisk (*) before its name.
                If you don't type anything here, your questions will appear in the order in which you created them.
                (Note: This only affects the "Annotate stories" page.)`
        },
        {
            id: "project_annotateStories_exportButtonsLabel",
            valueType: "none",
            displayType: "html",
            displayPrompt: `Note: Before you make any widespread (bulk) changes to annotation answers, you might want to 
                <a href="javascript:narrafirma_openPage('page_importExport')">back up your project</a>.`,
        },
    ]
};

export = panel;

