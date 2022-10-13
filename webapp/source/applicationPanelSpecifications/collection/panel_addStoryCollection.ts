import surveyCollection = require("../../surveyCollection");

"use strict";

const panel: Panel = {
    id: "panel_addStoryCollection",
    modelClass: "StoryCollection",
    panelFields: [
        {
            id: "storyCollection_shortName",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "20",
            required: true,
            displayName: "Story collection name",
            displayPrompt: `
                Please give this story collection a short <strong>name</strong>.
                This name is required, must be unique within the project, and must not be changed after you start using the collection.
            `
        },
        {
            id: "storyCollection_questionnaireIdentifier",
            valueType: "string",
            valueOptions: "/project/project_storyForms",
            valueOptionsSubfield: "questionForm_shortName",
            displayType: "select",
            displayName: "Story form",
            displayPrompt: `Please select a <strong>story form</strong> to use for this story collection. After you choose a story form, <strong>click the Close button</strong> to link 
                the story form to your new story collection.`
        },
        {
            id: "storyCollection_copyStoryFormWarning",
            valueType: "string",
            displayType: "label",
            displayName: "Warning",
            displayPrompt: `
                <span.narrafirma-special-warning>Note: The first time you choose a story form here and <strong>click the Close button</strong>,
                a <em>copy</em> of the story form <em>as it exists at that moment</em> will be stored in the story collection.
                Any changes you make to the form after that moment will not appear in the copy.
                If you have changed a story form and want to update the copy in the story collection, press the "Update Story Form" button below.
                However, <strong>we do not recommend that you update a story form after data collection has begun</strong>, except for minor typographical errors.
                Also, you should not change <em>which</em> story form is being used by an existing story collection.
                To use a different (or significantly revised) story form after story collection has begun, create a new story collection.</span>
            `
        },
        {
            id: "storyCollection_updateStoryForm",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "updateQuestionnaireForStoryCollection",
            displayPrompt: "Update Story Form",
            displayVisible: function(panelBuilder, model) {
                return panelBuilder.readOnly === false;
            }
        },
        {
            id: "storyCollection_note",
            valueType: "none",
            displayType: "label",
            displayReadOnly: true,
            displayPrompt: `
                <span.narrafirma-special-warning>Also note: After you give your new story collection a name and choose a story form to go with it, 
                <strong>don't forget to click the Close button</strong>. If you leave this panel without clicking the Close button, 
                you will have created a story collection with no associated story form. 
                This may lead you to see error messages when you try to do things that use the story form. 
                If that happens, come back to this panel, 
                choose the story form again, and click the "Update Story Form" button.</span>
            `
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
            displayReadOnly: true,
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

