import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_reviewTrends",
    displayName: "Review trends",
    panelFields: [
        {
            id: "reviewTrendsLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you will look over the most significant statistical results\nand save some to observations for later use."
        },
        {
            id: "catalysisReportReviewTrends",
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
            id: "reviewTrends_minSubsetSize",
            valueType: "string",
            valueOptions: [
                "20",
                "30",
                "40",
                "50"
            ],
            required: true,
            displayType: "select",
            displayName: "Minimum subset size",
            displayPrompt: "How large should subsets of stories be to be considered for comparison?"
        },
        {
            id: "reviewTrends_display",
            valuePath: "/clientState/catalysisReportIdentifier",
            valueType: "none",
            displayType: "trendsReport",
            displayPrompt: "Trends report"
        }
    ]
};

export = panel;

