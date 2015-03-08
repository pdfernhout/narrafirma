define([], function() {
    "use strict";
    return [
        {
            id: "page_clusterInterpretations",
            displayName: "Cluster interpretations",
            displayType: "page",
            section: "catalysis",
            modelClass: "ProjectModel"
        },
        {
            id: "project_interpretationsClusteringLabel",
            dataType: "none",
            displayType: "label",
            displayPrompt: "On this page you will cluster together the interpretations you have collected (based on observations)\nto create perspectives for your catalysis report.\nNote: Do not cluster your interpretations unless you are sure you have finished collecting them."
        },
        {
            id: "project_interpretationsClusteringDiagram",
            dataType: "object",
            required: true,
            displayType: "clusteringDiagram",
            displayConfiguration: "project_interpretationsClusteringDiagram",
            displayPrompt: "Cluster interpretations into perspectives"
        }
    ];
});
