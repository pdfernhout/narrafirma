define([], function() {
    "use strict";
    return [
        {
            id: "page_reviewTrends",
            displayName: "Review trends",
            displayType: "page",
            section: "catalysis",
            modelClass: "ProjectModel"
        },
        {
            id: "reviewTrendsLabel",
            dataType: "none",
            displayType: "label",
            displayPrompt: "On this page you will look over the most significant statistical results\nand save some to observations for later use."
        },
        {
            id: "reviewTrends_minSubsetSize",
            dataType: "string",
            dataOptions: ["20","30","40","50"],
            required: true,
            displayType: "select",
            displayName: "Minimum subset size",
            displayPrompt: "How large should subsets of stories be to be considered for comparison?"
        },
        {
            id: "reviewTrends_significanceThreshold",
            dataType: "string",
            dataOptions: ["0.05","0.01"],
            required: true,
            displayType: "select",
            displayName: "Significance threshold",
            displayPrompt: "What significance threshold do you want reported?"
        },
        {
            id: "reviewTrends_display",
            dataType: "none",
            displayType: "trendsReport",
            displayPrompt: "Trends report"
        },
        {
            id: "mockupTrendsLabel_unfinished",
            dataType: "none",
            displayType: "label",
            displayPrompt: "(Unfinished: This area will show the most significant statistical trends."
        },
        {
            id: "mockup_trends",
            dataType: "none",
            displayType: "image",
            displayConfiguration: "images/mockups/mockupTrends.png",
            displayPrompt: "It will look something like this.)"
        }
    ];
});
