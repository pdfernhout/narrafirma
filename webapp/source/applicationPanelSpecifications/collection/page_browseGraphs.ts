import Globals = require("../../Globals");
import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_browseGraphs",
    displayName: "Review graphs",
    pageExplanation: "Look at patterns in your data. Notice gaps, miscommunications, confounding, other anomalies. ",
    pageCategories: "review",
    panelFields: [
        {
            id: "graphBrowserLabel",
            valueType: "none",
            displayType: "html",
            displayPrompt: `On this page you can <strong>browse through graphs</strong> that show the answers people gave to questions about their stories. 
            (You can also examine these graphs in more detail in the <a href=\"javascript:narrafirma_openPage('page_catalysis')\">Catalysis</a> section.)`
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

