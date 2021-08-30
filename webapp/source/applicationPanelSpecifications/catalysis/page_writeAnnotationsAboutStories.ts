import Globals = require("../../Globals");
import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_writeAnnotationsAboutStories",
    displayName: "Write annotation questions",
    tooltipText: "Create questions to answer about the stories you collected.",
    headerAbove: "Annotate Stories with Qualitative Codes",
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
            displayPrompt: "These are the annotation questions you have created so far.",
            displayConfiguration: {
                itemPanelID: "panel_addAnnotationQuestion",
                gridConfiguration: {
                    columnsToDisplay: ["annotationQuestion_text", "annotationQuestion_type", "annotationQuestion_shortName", "annotationQuestion_options"],
                    viewButton: true,
                    editButton: true,
                    addButton: true,
                    removeButton: true, 
                    navigationButtons: true,
               }
            }
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

