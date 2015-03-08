define([], function() {
    "use strict";
    return [
        {
            id: "page_projectFacts",
            displayName: "Enter project facts",
            displayType: "page",
            section: "planning",
            modelClass: "ProjectModel"
        },
        {
            id: "project_projectFacts",
            dataType: "none",
            displayType: "label",
            displayPrompt: "On this page you will enter some facts about your project. The information you enter here will appear in your reports."
        },
        {
            id: "project_title",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Project title",
            displayPrompt: "What is the project's title?"
        },
        {
            id: "project_communityOrOrganizationName",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Community/organization name",
            displayPrompt: "What is the name of your community or organization?"
        },
        {
            id: "project_topic",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Project topic",
            displayPrompt: "Enter a brief name for the project's primary topic."
        },
        {
            id: "project_startAndEndDates",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Project start and end",
            displayPrompt: "What are the project's starting and ending dates?"
        },
        {
            id: "project_funders",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Project funders",
            displayPrompt: "Who is funding or otherwise supporting the project?"
        },
        {
            id: "project_facilitators",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Project facilitators",
            displayPrompt: "Who is facilitating the project?"
        },
        {
            id: "project_reportStartText",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Report start text",
            displayPrompt: "Enter any other information you want to appear at the top of project reports."
        },
        {
            id: "project_reportEndText",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Report end text",
            displayPrompt: "Enter any other information you want to appear at the bottom of project reports."
        }
    ];
});
