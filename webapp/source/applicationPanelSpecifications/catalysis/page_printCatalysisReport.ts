import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_printCatalysisReport",
    displayName: "Print catalysis report",
    displayType: "page",
    section: "catalysis",
    modelClass: "PrintCatalysisReport",
    panelFields: [
        {
            id: "catalysisReportPrint_label",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you can print a catalysis report."
        },
        {
            id: "catalysisReportPrint_selected",
            valuePath: "/clientState/catalysisReportIdentifier",
            valueType: "string",
            valueOptions: "project_catalysisReports",
            valueOptionsSubfield: "catalysisReport_shortName",
            required: true,
            displayType: "select",
            displayName: "Catalysis report",
            displayPrompt: "Choose a catalysis report to print"
        },
        {
            id: "catalysisReportPrint_printButton",
            valuePath: "/clientState/catalysisReportIdentifier",
            valueType: "none",
            displayType: "button",
            displayPrompt: "Print selected catalysis report",
            displayConfiguration: "printCatalysisReport"
        }
    ]
};

export = panel;

