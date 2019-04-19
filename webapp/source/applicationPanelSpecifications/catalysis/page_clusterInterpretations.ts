import Globals = require("../../Globals");
"use strict";

var panel: Panel = {
    id: "page_clusterInterpretations",
    displayName: "Cluster interpretations and/or observations",
    tooltipText: "Draw your interpretations and/or observations together into clusters that make them more accessible during sensemaking.",
    panelFields: [
        {
            id: "project_interpretationsClusteringLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: `
                On this page you will <strong>cluster</strong> your interpretations and/or observations into groups.
                Creating groups helps you make sense of larger patterns, and it also divides your catalysis report into sections.
                <br><br>
                <i><strong>Note</strong>: The interpretations and observations shown here do not automatically update when you
                create or change interpretations or observations on the previous page. 
                After you make changes there, press the appropriate "Start or update clustering diagram" button to see your changes reflected here.</i>
                `
        },
        {
            id: "catalysisReportClusterInterpretations",
            valuePath: "/clientState/catalysisReportName",
            valueType: "string",
            valueOptions: "project_catalysisReports",
            valueOptionsSubfield: "catalysisReport_shortName",
            displayType: "select",
            displayName: "Catalysis report",
            displayPrompt: "Choose a catalysis report to work on."
        },
        {
            id: "clusterInterpretations_filterNotice",
            valueType: "object",
            valuePath: "/clientState/catalysisReportIdentifier/catalysisReport_filter",
            displayType: "catalysisReportFilterNotice",
            displayPrompt: "",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },        {
            id: "promptToSelectCatalysisReportForInterpretations",
            valueType: "none",
            displayType: "label",
            displayPrompt: "<strong>Please select a catalysis report above to get a clustering diagram here.</strong>",
            displayVisible: function(panelBuilder, model) {
                return !Globals.clientState().catalysisReportIdentifier();
            }
        },

        {
            id: "cluster_interpretationsHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Cluster interpretations into perspectives",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },

        {
            id: "copyInterpretationsButton",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "copyInterpretationsToClusteringDiagram",
            displayPrompt: "Start or update interpretations clustering diagram",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },

        {
            id: "interpretationsClusteringDiagram",
            valueType: "object",
            valuePath: "/clientState/catalysisReportIdentifier/interpretationsClusteringDiagram",
            displayType: "clusteringDiagram",
            displayPrompt: `
                Place similar interpretations together. 
                Then name and describe each cluster of interpretations. 
                These clusters, or <strong>perspectives</strong>, will become the headings of your clustered-interpretations catalysis report.
                `,
            displayConfiguration: "interpretations",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },

        {
            id: "cluster_observationsHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Cluster observations into themes",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },        {
            id: "copyObservationsButton",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "copyObservationsToClusteringDiagram",
            displayPrompt: "Start or update observations clustering diagram",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },

        {
            id: "observationsClusteringDiagram",
            valueType: "object",
            valuePath: "/clientState/catalysisReportIdentifier/observationsClusteringDiagram",
            displayType: "clusteringDiagram",
            displayPrompt: `
                Place similar observations together. 
                Then name and describe each cluster of observations. 
                These clusters, or <strong>themes</strong>, will become the headings of your clustered-observations catalysis report.
                `,
            displayConfiguration: "observations",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },

    ]
};

export = panel;

