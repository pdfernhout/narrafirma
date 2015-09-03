import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    "id": "page_startCatalysisReport",
    "displayName": "Start catalysis report",
    "displayType": "page",
    "section": "catalysis",
    "modelClass": "StartCatalysisReportActivity",
    "panelFields": [
        {
            "id": "catalysis_createCatalysisReportLabel",
            "valueType": "none",
            "displayType": "label",
            "displayPrompt": "On this page you will create one or more story catalysis reports, which you will fill out on later. These reports are used to store observations and interpretations derived from stories in one or more story collections. You should only create a catalysis report after you are done collecting stories for it. Otherwise, the report may be incorrect or incomplete relative to the new data."
        },
        {
            "id": "project_catalysisReports",
            "valueType": "array",
            "required": true,
            "displayType": "grid",
            "displayConfiguration": {
                "itemPanelID": "panel_addCatalysisReport",
                "gridConfiguration": {
                    "viewButton": true,
                    "editButton": true,
                    "addButton": true,
                    "removeButton": true,
                    "columnsToDisplay": ["catalysisReport_shortName", "catalysisReport_notes"]
                }
            },
            "displayName": "Catalysis reports",
            "displayPrompt": "Add one or more catalysis reports"
        }
    ]
};

export = panel;

