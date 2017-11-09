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
                Please describe your story collection here.<br><br>
                <span.narrafirma-special-warning><strong>NOTE</strong>: 
                When you create a new story collection and click the <strong>Close</strong> button, the story form
                you chose becomes associated with the new story collection. If you forget to click the <strong>Close</strong> button
                (and, say, click on a link to go to another NarraFirma page), you will have created a story collection
                that has no associated story form. This may lead you to see error messages when you try to do things
                that use the story form. But don't worry! If that happens, come back to this panel, 
                set the story form, and click the "Update Story Form" button.</span>
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
                <strong>This name should be unique within the project.</strong></span>
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
                <br><br>
                To start using new changes to a story form (such as during testing), press the "Update Story Form button" below.
                We do not recommend that you update a story form after data collection has begun, except for minor typographical errors.
                <br><br>
                Also, you should not change which form is being used by an existing story collection.
                To use a different or significantly revised story form after story collection has begun, create a new story collection.</span>
            `
        },
        {
            id: "storyCollection_updateStoryForm",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "updateQuestionnaireForStoryCollection",
            displayPrompt: "Update Story Form (see caution above)",
            displayVisible: function(panelBuilder, model) {
                return panelBuilder.readOnly === false;
            }
        },
        {
            id: "storyCollection_activeOnWeb",
            valueType: "boolean",
            displayType: "checkbox",
            displayReadOnly: true,
            displayName: "Active on web?",
            displayConfiguration: "Yes, this survey is currently active on the web server.",
            displayPrompt: "If this survey is currently <strong>active</strong> on the web server, this check box will be checked. (You can't <i>change</i> whether the survey is active here. To do that, click the \"Activate or Deactivate Web Form\" button above.)"
        },
        {
            id: "storyCollection_webFormAddress",
            valueType: "none",
            displayType: "questionAnswer",
            displayName: "Web form address",
            displayPrompt: "The <strong>web address</strong> (URL) of this story collection is:",
            displayConfiguration: "storyCollection_activeOnWeb",
            displayURLValue: function (value, model) {
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

