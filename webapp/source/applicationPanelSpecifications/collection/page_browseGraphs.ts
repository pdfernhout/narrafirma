import Globals = require("../../Globals");
import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_browseGraphs",
    displayName: "Spot-check graphs",
    pageExplanation: "Look at patterns in your data. Notice gaps, miscommunications, confounding, other anomalies. ",
    pageCategories: "review",
    panelFields: [
        {
            id: "graphBrowserLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you can take a preliminary look at <strong>patterns</strong> in the answers people gave about their incoming stories. (This page is intended mainly to spot check for issues related to the story form design. You can review your graphs more systematically in the catalysis section.)"
        },
        {
            id: "graphBrowserDisplay",
            valuePath: "/clientState/storyCollectionName",
            valueType: "none",
            displayType: "graphBrowser",
            displayPrompt: "",
        }
    ]
};

export = panel;

