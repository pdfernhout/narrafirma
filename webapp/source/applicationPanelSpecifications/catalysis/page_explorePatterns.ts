import Globals = require("../../Globals");
import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_explorePatterns",
    displayName: "Explore patterns",
    pageExplanation: "Look at patterns in the answers to the questions you asked. Write observations, interpretations, and ideas about those patterns.",
    pageCategories: "review, input",
    headerAbove: "Build Your Catalysis Report",
    panelFields: [
        {
            id: "explorePatternsLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: `
            On this page you can explore <strong>patterns</strong> in the data you 
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
            id: "explorePatterns_filterNotice",
            valueType: "object",
            displayType: "catalysisReportFilterNotice",
            displayPrompt: "",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
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

