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
            displayPrompt: `On this page you can <strong>discover patterns</strong> that appear in the answers people gave about their stories. 
            (You can also examine these graphs in more detail in the Catalysis section.)`
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

