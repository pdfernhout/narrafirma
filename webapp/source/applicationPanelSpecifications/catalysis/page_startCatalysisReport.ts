import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_startCatalysisReport",
    displayName: "Start catalysis report",
    tooltipText: "Create a place to store your catalysis report.",
    headerAbove: "Get Started",
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
                    addButton: true,
                    removeButton: true,
                    columnsToDisplay: ["catalysisReport_shortName", "catalysisReport_notes"]
                }
            },
            displayName: "Catalysis reports",
            displayPrompt: "These are the catalysis reports you have created so far."
        }
    ]
};

export = panel;

