import Globals = require("../../Globals");
import kludgeForUseStrict = require("../../kludgeForUseStrict");
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
            valuePath: "storyCollection_shortName",
            displayConfiguration: "60",
            displayReadOnly: true,
            displayName: "Story collection name",
            displayPrompt: `The <strong>name</strong> of this story collection is: `,
        },
        {
            id: "storyCollection_activeOnWeb",
            valueType: "none",
            valuePath: "storyCollection_activeOnWeb",
            displayType: "questionAnswer",
            displayName: "Active on web?",
            displayReadOnly: true,
            displayPrompt: "The <strong>web address</strong> (URL) of this story collection is: ",
            displayConfiguration: "storyCollection_activeOnWeb",
            displayURLValue: function (value, model) {
                if (!value) return "";
                return surveyCollection.urlForSurvey(model);
            },
        },
        {
            id: "storyCollection_questionnaireIdentifier",
            valueType: "string",
            valueOptions: "/project/project_storyForms",
            valueOptionsSubfield: "questionForm_shortName",
            displayType: "select",
            displayReadOnly: true,
            displayName: "Story form",
            displayPrompt: "The <strong>story form</strong> associated with this story collection is: ",
        },
        {
            id: "storyCollection_copyStoryFormWarning",
            valueType: "string",
            displayType: "label",
            displayName: "About updating",
            displayPrompt: `
                When you created this story collection,
                NarraFirma placed into it a <b>snapshot copy</b> of the story form you selected <i>as it existed at that moment</i>.
                If you have made changes to the form since then, you can update the snapshot copy by clicking the Update button below. 
                However, to avoid data loss, NarraFirma will not update the form if you have changed it in a way that conflicts with your existing data.
                For details, click the Help button below.
            `
        },
        {
            id: "storyCollection_checkForDataConflicts",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "checkStoryFormsForDataConflicts",
            displayPrompt: "Check for Data Conflicts",
            displayIconClass: "checkButtonImage",
            displayPreventBreak: true,
            displayVisible: function(panelBuilder, model) {
                return panelBuilder.readOnly === false;
            }
        },
        {
            id: "storyCollection_updateStoryForm",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "updateQuestionnaireForStoryCollection",
            displayPrompt: "Update Story Form",
            displayIconClass: "updateButtonImage",
            displayPreventBreak: true,
            displayVisible: function(panelBuilder, model) {
                return panelBuilder.readOnly === false;
            }
        },
        {
            id: "storyCollection_helpOnUpdatingStoryForms",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "showHelpOnUpdatingStoryFormsInCollections",
            displayPrompt: "Help on Updating Story Forms",
            displayIconClass: "showButtonImage",
            displayVisible: function(panelBuilder, model) {
                return panelBuilder.readOnly === false;
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

