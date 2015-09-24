import Globals = require("../../Globals");
"use strict";

var panel: Panel = {
    id: "page_describePerspectives",
    displayName: "Describe perspectives",
    panelFields: [
        {
            id: "project_perspectivesLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you will describe the perspectives that resulted from clustering\nyour interpretations."
        },
        {
            id: "catalysisReportDescriptPerspectives",
            valuePath: "/clientState/catalysisReportName",
            valueType: "string",
            valueOptions: "project_catalysisReports",
            valueOptionsSubfield: "catalysisReport_shortName",
            displayType: "select",
            displayName: "Catalysis report",
            displayPrompt: "Choose a catalysis report to work on"
        },
        {
            id: "copyPerspectivesButton",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "copyPerspectives",
            displayPrompt: "Copy perspectives from interpretations clustering diagram to table"
            //displayVisible: function(panelBuilder, model) {
            //    return !!Globals.clientState().catalysisReportIdentifier();
            //}
        },
        {
            id: "project_perspectivesList",
            valuePath: "/clientState/catalysisReportName",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: "panel_addPerspective",
            displayName: "Catalysis perspectives",
            displayPrompt: "These are the perspectives you created from interpretations. You can add notes on them below."
        }
    ]
};

export = panel;

