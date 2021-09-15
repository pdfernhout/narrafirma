import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_projectOptions",
    displayName: "Project options",
    panelFields: [
        {
            id: "projectOptions_header",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you can set project-wide options."
        },
        {
            id: "projectOptions_projectNickname",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "20",
            displayName: "Nickname",
            displayPrompt: `Enter a <strong>project nickname</strong> you want to appear on within-the-project pages and reports.
                (Note that the project's real name will still appear in several places: 
                in your browser's address bar and development console, in the list of projects you see before you open the project, in any exported files, and in the project's stored files.
                If you want to change this project's actual name, export its full history, create a new project with a new name,
                and import the project file to that empty project.)`
        },

        {
            id: "projectOptions_regionalsettings_header",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Regional settings"
        },        
        {
            id: "projectOptions_csvDelimiter",
            valueType: "string",
            displayType: "radiobuttons",
            valueOptions: ["comma", "semicolon", "tab"],
            displayName: "CSV delimiter",
            displayPrompt: `How do you want CSV files to be <strong>delimited</strong>? 
                That is, what character do you want to use to mark boundaries between cells?
                (If no choice is made here, a comma delimiter will be used.)`
        },
    ]
};

export = panel;
