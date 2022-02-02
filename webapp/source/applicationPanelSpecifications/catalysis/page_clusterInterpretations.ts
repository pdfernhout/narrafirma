import Globals = require("../../Globals");
"use strict";

const panel: Panel = {
    id: "page_clusterInterpretations",
    displayName: "Cluster interpretations and/or observations",
    pageExplanation: "Gather the interpretations and observations you created on the previous page into groups whose names will become the headings of your catalysis report.",
    pageCategories: "review, input",
    panelFields: [
        {
            id: "project_interpretationsClusteringLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: `
                On this page you can <strong>cluster</strong> your interpretations and/or observations into groups that will divide your catalysis report into sections.
                (If you can't decide whether to cluster by interpretations or observations, see the help system.)`
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
        },        
        {
            id: "promptToSelectCatalysisReportForInterpretations",
            valueType: "none",
            displayType: "label",
            displayPrompt: "<strong>Please select a catalysis report above to see clustering surfaces here.</strong>",
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
            id: "cluster_interpretationsIntroLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: `To start, click this button to <strong>copy</strong> the interpretations you wrote on the previous page onto the clustering space. 
                If you make any changes to your interpretations, click the button again to <strong>update</strong> the space.`,
            displayPreventBreak: true,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        }, 
        {
            id: "copyInterpretationsButton",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "copyInterpretationsToClusteringDiagram",
            displayPrompt: "Copy or update interpretations",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        
        {
            id: "cluster_interpretationsLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: `<strong>Drag similar interpretations together</strong> into clusters. 
                (Shift-click to select multiple interpretations.)
                <strong>Create a name</strong> for each cluster. Place it in the middle of the cluster. 
                Your cluster names will become the headings of your catalysis report, where they will be called "Perspectives."`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "interpretationsClusteringDiagram",
            valueType: "object",
            valuePath: "/clientState/catalysisReportIdentifier/interpretationsClusteringDiagram",
            displayType: "clusteringDiagram",
            displayPrompt: "",
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
        },  
        {
            id: "cluster_observationsIntroLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: `To start, click this button to <strong>copy</strong> the observations you wrote on the previous page onto the clustering space. 
            If you make any changes to your observations, click the button again to <strong>update</strong> the space.`,
            displayPreventBreak: true,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },      
        {
            id: "copyObservationsButton",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "copyObservationsToClusteringDiagram",
            displayPrompt: "Copy or update observations",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "cluster_observationsLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: `
                <strong>Drag similar observations together</strong> into clusters. 
                (Shift-click to select multiple observations.)
                <strong>Create a name</strong> for each cluster. Place it in the middle of the cluster. 
                Your cluster names will become the headings of your catalysis report, where they will be called "Themes."`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "observationsClusteringDiagram",
            valueType: "object",
            valuePath: "/clientState/catalysisReportIdentifier/observationsClusteringDiagram",
            displayType: "clusteringDiagram",
            displayPrompt: "",
            displayConfiguration: "observations",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
    ]
};

export = panel;

