import Globals = require("../../Globals");
import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_explorePatterns",
    displayName: "Explore patterns",
    emptyJournalName: "Record patterns",
    pageExplanation: "Look for patterns in your data. Write observations, interpretations, and ideas for use in sensemaking.",
    pageCategories: "compose",
    panelFields: [
        {
            id: "explorePatternsLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: `On this page you can explore <strong>patterns</strong> in the data you 
            collected, make <strong>observations</strong> on the patterns,
            and <strong>interpret</strong> the observations. The
            <strong>catalysis report</strong> you build here can help other people 
            make sense of what the story collection has to say.`,
            emptyJournalPrompt: `***On this page, as preparation for sensemaking, you can record any
            <strong>patterns</strong> you saw in the data you collected. 
            For each pattern, include:
            <ul>
            <li>an <strong>observation</strong> (objective description) of the pattern</li>
            <li>at least two competing <strong>interpretations</strong> of the observation 
                (subjective descriptions from differing points of view)</li>
            <li>possibly a few <strong>questions</strong> and <strong>ideas</strong> that follow
                from each interpretation</li>
            </ul>
            If you find a lot of patterns, you may want to cluster your observations or interpretations
            to provide your sensemaking participants with a birds-eye view of what you found.`
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

