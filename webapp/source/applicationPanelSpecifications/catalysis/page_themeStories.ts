import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_themeStories",
    displayName: "Theme stories",
    displayType: "page",
    section: "catalysis",
    modelClass: "ThemeStoriesActivity",
    panelFields: [
        {
            id: "themeStoriesLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you will derive emergent themes from the collected stories.\nThe themes will appear in your data as answers to a \"Theme\" question, creating patterns you can use."
        },
        {
            id: "catalysisReportThemeStories",
            valuePath: "/clientState/catalysisReportIdentifier",
            valueType: "string",
            valueOptions: "project_catalysisReports",
            valueOptionsSubfield: "catalysisReport_shortName",
            required: true,
            displayType: "select",
            displayName: "Catalysis report",
            displayPrompt: "Choose a catalysis report to work on"
        },
        {
            id: "themeStories",
            valuePath: "/clientState/catalysisReportIdentifier",
            valueType: "none",
            displayType: "storyThemer",
            displayPrompt: "Theme stories"
        }
    ]
};

export = panel;

