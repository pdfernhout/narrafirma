import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    "id": "page_projectFacts",
    "displayName": "Enter project facts",
    "displayType": "page",
    "section": "planning",
    "modelClass": "ProjectFactsActivity",
    "panelFields": [
        {
            "id": "project_projectFacts",
            "valueType": "none",
            "displayType": "label",
            "displayPrompt": "On this page you will enter some <strong>facts</strong> about your project. The information you enter here will appear in your project report."
        },
        {
            "id": "project_title",
            "valueType": "string",
            "required": true,
            "displayType": "text",
            "displayName": "Project title",
            "displayPrompt": "What is the project's <strong>title</strong>?"
        },
        {
            "id": "project_communityOrOrganizationName",
            "valueType": "string",
            "required": true,
            "displayType": "text",
            "displayName": "Community/organization name",
            "displayPrompt": "What is the name of your <strong>community or organization</strong>?"
        },
        {
            "id": "project_topic",
            "valueType": "string",
            "required": true,
            "displayType": "text",
            "displayName": "Project topic",
            "displayPrompt": "Enter a brief name for the project's primary <strong>topic</strong>."
        },
        {
            "id": "project_startAndEndDates",
            "valueType": "string",
            "required": true,
            "displayType": "text",
            "displayName": "Project start and end",
            "displayPrompt": "What are the project's starting and ending <strong>dates</strong>?"
        },
        {
            "id": "project_facilitators",
            "valueType": "string",
            "required": true,
            "displayType": "textarea",
            "displayName": "Project facilitators",
            "displayPrompt": "Who is <strong>facilitating</strong> the project?"
        },
        {
            "id": "project_funders",
            "valueType": "string",
            "required": true,
            "displayType": "textarea",
            "displayName": "Project funders",
            "displayPrompt": "Who is funding or otherwise <strong>supporting</strong> the project?"
        },
        {
            "id": "project_reportStartText",
            "valueType": "string",
            "required": true,
            "displayType": "textarea",
            "displayName": "Report start text",
            "displayPrompt": "Enter any other information you want to appear at the start of your project report."
        },
        {
            "id": "project_reportEndText",
            "valueType": "string",
            "required": true,
            "displayType": "textarea",
            "displayName": "Report end text",
            "displayPrompt": "Enter any other information you want to appear at the end of your project report."
        }
    ]
};

export = panel;

