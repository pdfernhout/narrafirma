import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    "id": "page_startStoryCollection",
    "displayName": "Start story collection",
    "displayType": "page",
    "section": "collection",
    "modelClass": "StartStoryCollectionActivity",
    "panelFields": [
        {
            "id": "storyCollection_createCollectionLabel",
            "valueType": "none",
            "displayType": "label",
            "displayPrompt": "On this page you can create one or more <strong>story collections</strong> for your project. A story collection is a body of stories collected using a specific story form." 
        },
        {
            "id": "project_storyCollections",
            "valueType": "array",
            "required": true,
            "displayType": "grid",
            "displayConfiguration": {
                "itemPanelID": "panel_addStoryCollection",
                "gridConfiguration": {
                    "validateAdd": "storeQuestionnaireInStoryCollection",
                    "viewButton": true,
                    "editButton": true,
                    "addButton": true,
                    "removeButton": true,
                    "customButton": {"customButtonLabel": "Activate or Deactivate Web Form", "callback": "toggleWebActivationOfSurvey"},
                    "columnsToDisplay": ["storyCollection_shortName", "storyCollection_questionnaireIdentifier", "storyCollection_activeOnWeb", "storyCollection_notes"]
                }
            },
            "displayName": "Story collections",
            "displayPrompt": "These are the story collections you have created so far."
        },
        {
            "id": "project_csvFileUploader",
            "valueType": "none",
            "displayType": "html",
            "displayPrompt": "<input type=\"file\" id=\"csvFileLoader\" name=\"files\" title=\"Load File\" style=\"display:none\"/>"
        },
        {
            "id": "project_importStoryFormAndDataFromCSV",
            "valueType": "none",
            "displayType": "button",
            "displayConfiguration": "importCSVQuestionnaire",
            "displayPrompt": "Import Story Form from CSV File ..."
        },
        {
            "id": "project_importCSVStories",
            "valueType": "none",
            "displayType": "button",
            "displayConfiguration": "importCSVStories",
            "displayPrompt": "Import Story Data from CSV File into Story Collection ..."
        }
    ]
};

export = panel;

