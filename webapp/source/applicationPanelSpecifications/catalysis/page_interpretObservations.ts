import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_interpretObservations",
    displayName: "Review and interpret observations",
    panelFields: [
         {
            id: "catalysisReportReviewExcerpts",
            valuePath: "/clientState/catalysisReportIdentifier",
            valueType: "string",
            valueOptions: "project_catalysisReports",
            valueOptionsSubfield: "catalysisReport_shortName",
            displayType: "select",
            displayName: "Catalysis report",
            displayPrompt: "Choose a catalysis report to work on"
        },
        {
            id: "project_observationsDisplayList",
            valuePath: "/clientState/catalysisReportIdentifier",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: "panel_createOrEditObservation",
            displayName: "Catalysis observations",
            displayPrompt: "These are the observations you have collected from the\nbrowse, graph, and trends pages."
        }
    ]
};

export = panel;

