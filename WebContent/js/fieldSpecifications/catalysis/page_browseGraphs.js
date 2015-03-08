define([], function() {
    "use strict";
    return [
        {
            id: "page_browseGraphs",
            displayName: "Browse graphs",
            displayType: "page",
            section: "catalysis",
            modelClass: "ProjectModel"
        },
        {
            id: "graphBrowserLabel",
            dataType: "none",
            displayType: "label",
            displayPrompt: "On this page you can look at patterns in the answers people gave about their stories,\nand save patterns to observations for later use."
        },
        {
            id: "graphBrowserDisplay",
            dataType: "none",
            displayType: "graphBrowser",
            displayPrompt: "Graph browser"
        },
        {
            id: "graphBrowserMockupLabel_unfinished",
            dataType: "none",
            displayType: "label",
            displayPrompt: "(Unfinished: This area will show graphs of patterns in the data."
        },
        {
            id: "mockup_graphBrowser",
            dataType: "none",
            displayType: "image",
            displayConfiguration: "images/mockups/mockupGraphs.png",
            displayPrompt: "It will look something like this.)"
        }
    ];
});
