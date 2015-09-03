import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    "id": "page_reviewExcerpts",
    "displayName": "Review excerpts",
    "displayType": "page",
    "section": "catalysis",
    "modelClass": "ReviewExcerptsActivity",
    "panelFields": [
         {
            "id": "catalysisReportReviewExcerpts",
            "valuePath": "/clientState/catalysisReportIdentifier",
            "valueType": "string",
            "valueOptions": "project_catalysisReports",
            "valueOptionsSubfield": "catalysisReport_shortName",
            "required": true,
            "displayType": "select",
            "displayName": "Catalysis report",
            "displayPrompt": "Choose a catalysis report to work on"
        },
        {
            "id": "project_savedExcerptsList",
            "valuePath": "/clientState/catalysisReportIdentifier",
            "valueType": "array",
            "required": true,
            "displayType": "grid",
            "displayConfiguration": "panel_createNewExcerpt",
            "displayName": "Story excerpts",
            "displayPrompt": "These are the story excerpts you have saved."
        }
    ]
};

export = panel;

