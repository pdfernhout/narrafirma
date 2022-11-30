import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_projectOptions",
    displayName: "Project options",
    pageExplanation: "Change options that affect your entire project.",
    pageCategories: "manage",
    headerAbove: "Manage",
    panelFields: [
        {
            id: "projectOptions_header",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you can set project-wide options."
        },

        {
            id: "projectOptions_generalsettings_header",
            valueType: "none",
            displayType: "header",
            displayPrompt: "General options"
        },
        {
            id: "projectOptions_projectNickname",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "40",
            displayName: "Nickname",
            displayPrompt: `Enter a <strong>project nickname</strong> you want to appear on within-the-project pages and reports.
                (The project's real name will still appear in your browser's address bar and development console, 
                in the list of projects you see before you open the project, in any exported files, and in the project's stored files.
                If you want to change this project's actual name, export its full history, create a new project with a different name,
                and import the project file to that empty project.)`
        },
        {
            id: "projectOptions_showPageExplanations",
            valueType: "string",
            displayType: "radiobuttons",
            valueOptions: ["yes", "no"],
            displayName: "Verbose",
            displayPrompt: `Would you like to see an <strong>explanation</strong> of each page 
                next to its link on the section page where it appears? 
                (If no choice is made here, explanations will be shown.)`
        },
        {
            id: "projectOptions_showPageCategoryIcons",
            valueType: "string",
            displayType: "radiobuttons",
            valueOptions: ["yes", "no"],
            displayName: "Page category icons",
            displayPrompt: `When showing page explanations, would you also like to see an <strong>icon</strong> for each page,
                so you can see what type of page it is? 
                (The categories are: manage, plan, enter, review, journal, export.) 
                (If no choice is made here, page-type icons will be shown.)`
        },
        {
            id: "projectOptions_showTips",
            valueType: "string",
            displayType: "radiobuttons",
            valueOptions: ["yes", "no"],
            displayName: "Tips",
            displayPrompt: `Would you like to see <strong>tips</strong> at the bottom of each page? 
                (If no choice is made here, tips will be shown.)`
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
