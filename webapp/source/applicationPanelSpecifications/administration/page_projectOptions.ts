import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
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
            displayName: "Nickname",
            displayPrompt: `You can't change a project's name after it is created, 
                but here you can enter a <strong>project nickname</strong>. 
                It will appear on all within-the-project pages and reports.`
        },
        {
            id: "projectOptions_warning_label",
            valueType: "none",
            displayType: "label",
            displayName: "Warning",
            displayPrompt: `<span.narrafirma-special-warning>Note: <strong>The project's real name will still appear in several places</strong>: 
            in your browser's address bar and development console, in the list of projects you see before you open the project, in any exported files, and in the project's stored files.
            If you want to change the project's actual name, export its full history, create a new project with a new name,
            then import the project file to that empty project.</span>`
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
