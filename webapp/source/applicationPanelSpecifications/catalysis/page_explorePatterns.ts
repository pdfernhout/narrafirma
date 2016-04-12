import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_explorePatterns",
    displayName: "Explore patterns",
    tooltipText: "Look at graphs of your data, discover useful patterns, and write observations and interpretations about them.",
    headerAbove: "Work Through Your Data",
    panelFields: [
        {
            id: "explorePatternsLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: `
            On this page you will explore <strong>patterns</strong> in the data you 
            collected, make <strong>observations</strong> on the patterns,
            and <strong>interpret</strong> the observations. The
            <strong>catalysis report</strong> you build here can help other people 
            make sense of what the story collection has to say.
            `
        },
        {
            id: "catalysisReportExplorePatterns",
            valuePath: "/clientState/catalysisReportName",
            valueType: "string",
            valueOptions: "project_catalysisReports",
            valueOptionsSubfield: "catalysisReport_shortName",
            displayType: "select",
            displayName: "Catalysis report",
            displayPrompt: "Choose a catalysis report to work on."
        },
        {
            id: "explorePatterns_display",
            valuePath: "/clientState/catalysisReportName",
            valueType: "none",
            displayType: "patternExplorer",
            displayPrompt: ""
        }
    ]
};

export = panel;

