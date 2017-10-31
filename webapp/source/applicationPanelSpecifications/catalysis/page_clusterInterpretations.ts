import Globals = require("../../Globals");
"use strict";

var panel: Panel = {
    id: "page_clusterInterpretations",
    displayName: "Cluster interpretations",
    tooltipText: "Draw your interpretations together into clusters that make them more accessible during sensemaking.",
    panelFields: [
        {
            id: "project_interpretationsClusteringLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: `
                On this page you will draw together the interpretations you have collected (on the previous page) 
                into <strong>perspectives</strong> that will become the headings of your catalysis report.
                <br><br>
                Note: These interpretations are <i>copies</i> of the interpretations on the previous
                page. They do not automatically change when you change those interpretations.
                To update an interpretation here for a change on the previous page, delete it from
                this diagram, then press the "Copy interpretations" button again to get an updated copy.
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
            id: "promptToSelectCatalysisReportForInterpretations",
            valueType: "none",
            displayType: "label",
            displayPrompt: "<strong>Please select a catalysis report above to get a clustering diagram here.</strong>",
            displayVisible: function(panelBuilder, model) {
                return !Globals.clientState().catalysisReportName();
            }
        },
        {
            id: "copyInterpretationsButton",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "copyInterpretationsToClusteringDiagram",
            displayPrompt: "Copy interpretations to clustering diagram",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportName();
            }
        },
        {
            id: "interpretationsClusteringDiagram",
            valueType: "object",
            valuePath: "/clientState/catalysisReportIdentifier/interpretationsClusteringDiagram",
            displayType: "clusteringDiagram",
            displayPrompt: "Place similar interpretations together. Then name and describe each cluster of interpretations. Those clusters, or <strong>perspectives</strong>, will become the headings of your catalysis report.",
            displayConfiguration: "interpretations",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportName();
            }
        }
    ]
};

export = panel;

