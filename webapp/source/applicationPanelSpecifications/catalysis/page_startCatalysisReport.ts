import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_startCatalysisReport",
    displayName: "Start catalysis report",
    pageExplanation: "Create a report of patterns, observations, interpretations, and ideas for use in sensemaking.",
    pageCategories: "manage",
    headerAbove: "Explore",
    panelFields: [
        {
            id: "catalysis_createCatalysisReportLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you can create one or more catalysis reports: sets of <strong>observations</strong> and <strong>interpretations</strong> based on <strong>patterns</strong> you find in one or more story collections.<br><br>Note: You should only create a catalysis report when your story collection is complete. Otherwise, the report may be incorrect or incomplete (because new data might change the patterns you see)."
        },
        {
            id: "project_catalysisReports",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: {
                itemPanelID: "panel_addCatalysisReport",
                gridConfiguration: {
                    viewButton: true,
                    editButton: true,
                    validateAdd: "requireShortName",
                    validateEdit: "requireShortName",
                    addButton: true,
                    removeButton: true,
                    navigationButtons: true,
                    columnsToDisplay: ["catalysisReport_shortName", "catalysisReport_notes", "catalysisReport_about", "catalysisReport_conclusion"]
                }
            },
            displayName: "Catalysis reports",
            displayPrompt: "These are the catalysis reports you have added. Click on a report to edit it."
        }
    ]
};

export = panel;

