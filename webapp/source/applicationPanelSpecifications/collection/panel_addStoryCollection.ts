import surveyCollection = require("../../surveyCollection");

"use strict";

var panel: Panel = {
    id: "panel_addStoryCollection",
    modelClass: "StoryCollection",
    panelFields: [
        {
            
            id: "storyCollection_note",
            valueType: "none",
            displayType: "label",
            displayPrompt: `
                The story collection is only created when you click the <strong>Close</strong> button.
                If you forget to click the Close button when you create the story collection, 
                you can come back to this panel, set the story form, and click the "Update Story Form" button.
            `
        },
        {
            id: "storyCollection_shortName",
            valueType: "string",
            // valueImmutable: true,
            displayType: "text",
            displayName: "Story collection name",
            displayPrompt: `
                Please give this story collection a short <strong>name</strong>, so we can refer to it.<br><br>
                <span.narrafirma-special-warning>This name should not be changed after you start using the story collection.
                Also, the name should be unique within the project.</span>
            `
        },
        {
            id: "storyCollection_questionnaireIdentifier",
            valueType: "string",
            // valueImmutable: true,
            valueOptions: "/project/project_storyForms",
            valueOptionsSubfield: "questionForm_shortName",
            displayType: "select",
            displayName: "Story form",
            displayPrompt: `
                Please select a <strong>story form</strong> to use for this story collection.<br><br>
                <span.narrafirma-special-warning>The first time you choose a story form here and click the Close button,
                a <strong>copy</strong> of the story form, <em>as it is at that moment</em>, will be placed into the new story collection.
                Any changes you make to the story form afterwards will <em>not</em> be automatically reflected in the copy stored in the story collection.
                To start using new changes to a story form (like during testing), press the "Update Story Form button" below.
                However, it is not recommended to update a story form after data collection has begun (except perhaps for minor typographical errors).
                Also, you should not change which form is used in an existing story collection.
                To use a different or significantly revised story form after story collection has begun, create a new story collection.</span>
            `
        },
        {
            id: "storyCollection_updateStoryForm",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "updateQuestionnaireForStoryCollection",
            displayPrompt: "Update Story Form (see caution above)"
        },
        {
            id: "storyCollection_activeOnWeb",
            valueType: "boolean",
            displayType: "checkbox",
            displayReadOnly: true,
            displayName: "Active on web?",
            displayPrompt: "If this survey is currently <strong>active</strong> on the web server, this check box will be checked."
        },
        {
            id: "storyCollection_webFormAddress",
            valueType: "none",
            displayType: "questionAnswer",
            displayName: "Web form address",
            displayPrompt: "The <strong>web address</strong> (URL) of this story collection is:",
            displayConfiguration: "storyCollection_activeOnWeb",
            displayTransformValue: function (value, model) {
                if (!value) return "";
                return surveyCollection.urlForSurvey(model);
            }
        },
        {
            id: "storyCollection_notes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Notes",
            displayPrompt: "You can enter <strong>notes</strong> on the story collection here."
        }
    ]
};

export = panel;

