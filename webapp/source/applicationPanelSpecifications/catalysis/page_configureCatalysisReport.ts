import Globals = require("../../Globals");
"use strict";

// start, 1, 2, 5, 10, 50, 100
function fillChoiceArray(start, lastSequential, lastEveryTwo = null, lastEveryFive = null, lastEveryTen = null, lastEveryFifty = null, lastEveryHundred = null) {
    var result = [];
    for (var i = start; i <= lastSequential; i++) {
        result.push("" + i);
    }
    if (lastEveryTwo) {
        for (i = lastSequential+2; i <= lastEveryTwo; i += 2) {
            result.push("" + i);
        }
    }
    if (lastEveryFive) {
        for (i = lastEveryTwo+5; i <= lastEveryFive; i += 5) {
            result.push("" + i);
        }
    }
    if (lastEveryTen) {
        for (i = lastEveryFive+10; i <= lastEveryTen; i += 10) {
            result.push("" + i);
        }  
    }
    if (lastEveryFifty) {
        for (i = lastEveryTen+50; i <= lastEveryFifty; i += 50) {
            result.push("" + i);
        } 
    }
    if (lastEveryHundred) 
        for (i = lastEveryFifty+100; i <= lastEveryHundred; i += 100) {
            result.push("" + i);
        }  
    return result;
}

var panel: Panel = {
    id: "page_configureCatalysisReport",
    displayName: "Configure Catalysis Report",
    tooltipText: "Decide what questions you want to consider as you build your catalysis report.",
    panelFields: [
        {
            id: "configureCatalysisReport_label",
            valueType: "none",
            displayType: "label",
            displayPrompt: `
                On this page you can set various options that affect your catalysis report.
                Most of these options affect only the "Explore patterns" page, but
                some also influence the printed report.
            `
        },
        {
            id: "configureCatalysisReport_chooseReport",
            valuePath: "/clientState/catalysisReportName",
            valueType: "string",
            valueOptions: "project_catalysisReports",
            valueOptionsSubfield: "catalysisReport_shortName",
            displayType: "select",
            displayName: "Catalysis report",
            displayPrompt: "Choose a catalysis <strong>report</strong> to work on."
        },

        {
            id: "configureCatalysisReport_filterNotice",
            valueType: "object",
            valuePath: "/clientState/catalysisReportIdentifier/catalysisReport_filter",
            displayType: "catalysisReportFilterNotice",
            displayPrompt: "",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },

        {
            id: "configureCatalysisReport_promptToSelectCatalysisReportForInterpretations",
            valueType: "none",
            displayType: "label",
            displayPrompt: "<strong>Please select a catalysis report above to get a list of questions here.</strong>",
            displayVisible: function(panelBuilder, model) {
                return !Globals.clientState().catalysisReportIdentifier();
            }
        },


        ////////////////////////////////////////////////////// show or hide
        {
            id: "configureCatalysisReport_ShowOrHideHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Things you can show and hide",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "configureCatalysisReport_chooseGraphTypes",
            valueType: "object",
            valuePath: "/clientState/catalysisReportIdentifier/graphTypesToCreate",
            displayType: "catalysisReportGraphTypesChooser",
            displayPrompt: "Which <strong>graph types</strong> should appear on the \"Explore Patterns\" page?",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "configureCatalysisReport_chooseQuestions",
            valueType: "object",
            valuePath: "/clientState/catalysisReportIdentifier/questionsToInclude",
            displayType: "catalysisReportQuestionChooser",
            displayPrompt: "Which <strong>questions</strong> should appear on the \"Explore Patterns\" page? (Note: Only questions checked here will be considered in data integrity graphs.)",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "configureCatalysisReport_showInterpretationsInGrid",
            valueType: "boolean",
            valuePath: "/clientState/catalysisReportIdentifier/showInterpretationsInGrid",
            displayType: "checkbox",
            displayConfiguration: "Show interpretations in the patterns table",
            displayPrompt: `Should <strong>interpretations</strong> be shown in the table of patterns on the "Explore Patterns" page? 
                (Tip: Turn this on to find or review interpretations; turn it off to shrink the table height.)`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "configureCatalysisReport_graphMultiChoiceQuestionsAgainstThemselves",
            valueType: "boolean",
            valuePath: "/clientState/catalysisReportIdentifier/graphMultiChoiceQuestionsAgainstThemselves",
            displayType: "checkbox",
            displayConfiguration: "Show graphs of multi-choice questions against themselves",
            displayPrompt: `Would you like to <strong>graph multi-choice questions against themselves</strong> 
                to show patterns of coincidence among answers to the same question? 
                `,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "configureCatalysisReport_hideStatsPanelsOnExplorePatternsPage",
            valueType: "boolean",
            valuePath: "/clientState/catalysisReportIdentifier/hideStatsPanelsOnExplorePatternsPage",
            displayType: "checkbox",
            displayConfiguration: "Hide statistical results on Explore patterns page",
            displayPrompt: `Would you prefer to <strong>hide statistical results on the Explore patterns page</strong>?
                (You can still see the results in a pop-up window when you choose "Show statistical results" from the "things you can do" list under the graph.)`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "catalysisReport_filter",
            valuePath: "/clientState/catalysisReportIdentifier/catalysisReport_filter",
            valueType: "string",
            displayType: "text",
            displayPrompt: `
            If you want to <strong>filter</strong> the stories used in this report, enter your filter here.
            (For details on how to use this function, click Help.)`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },

        ////////////////////////////////////////////////////// drawing graphs
        {
            id: "configureCatalysisReport_DrawingGraphsHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "How graphs are drawn",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "configureCatalysisReport_customDisplayGraphWidth",
            valuePath: "/clientState/catalysisReportIdentifier/customDisplayGraphWidth",
            valueType: "string",
            displayType: "text",
            displayName: "Custom graph width",
            displayPrompt: `The default width of large graphs on the "Explore patterns" page is 800 pixels. 
                You can enter a <strong>custom graph width</strong> here. (There is a separate place to specify a custom graph width for the printed report.)`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "configureCatalysisReport_minimumStoryCountRequiredForGraph",
            valuePath: "/clientState/catalysisReportIdentifier/minimumStoryCountRequiredForGraph",
            valueType: "string",
            valueOptions: fillChoiceArray(1, 30, 60, 100, 300, 500, 1000), // start, 1, 2, 5, 10, 50, 100
            displayType: "select",
            displayName: "Minimum story count for graph",
            displayPrompt: `How many stories should a subset have to <strong>draw a graph</strong>? 
                This choice affects multiple histograms and multiple scatterplots 
                    on the "Explore Patterns" page and the printed catalysis report.
                    Note that higher numbers could create graph sets with one or even zero graphs in them.
                    If no selection is made, graphs will be drawn if at there is least one story in the subset.`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }

        },  
        {
            id: "configureCatalysisReport_maxStoryLengthToShow",
            valuePath: "/clientState/catalysisReportIdentifier/maxStoryLengthToShow",
            valueType: "string",
            valueOptions: ["500", "600", "700", "800", "900", "1000", "1100", "1200", "1300", "1400", "1500", "1600", "1700", "1800", "1900", "2000", "2500", "3000", "3500", "4000", "4500", "5000", "6000", "7000", "8000", "9000", "10000"],
            displayType: "select",
            displayName: "Maximum story length to show",
            displayPrompt: `In the <strong>story length graph</strong>, above what character length do you want to lump all remaining stories into the last bin? 
                This choice affects both the the "Explore Patterns" page and the printed catalysis report.
                If no selection is made, the maximum story length will be drawn from the stories themselves.`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },   
        {
            id: "configureCatalysisReport_numStoryLengthBins",
            valuePath: "/clientState/catalysisReportIdentifier/numStoryLengthBins",
            valueType: "string",
            valueOptions: ["2", "3", "4", "5", "6", "7", "8", "9", "10"],
            displayType: "select",
            displayName: "Number of story length bins",
            displayPrompt: `How many <strong>story length categories</strong> do you want to graph? 
                This choice affects both the the "Explore Patterns" page and the printed catalysis report.
                If no selection is made, four categories will be used.`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },    
        {
            id: "configureCatalysisReport_numHistogramBins",
            valuePath: "/clientState/catalysisReportIdentifier/numHistogramBins",
            valueType: "string",
            valueOptions: ["5", "10", "15", "20", "25", "30"],
            displayType: "select",
            displayName: "Number of histogram bins",
            displayPrompt: `For <strong>histograms</strong>, how many <strong>bins</strong> (bars) should the data be sorted into?
                This choice affects both the the "Explore Patterns" page and the printed catalysis report.
                If no selection is made, 20 bins will be used.`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "configureCatalysisReport_hideNumbersOnContingencyGraphs",
            valueType: "boolean",
            valuePath: "/clientState/catalysisReportIdentifier/hideNumbersOnContingencyGraphs",
            displayType: "checkbox",
            displayConfiguration: "Hide numbers on contingency graphs",
            displayPrompt: `For <strong>contingency graphs</strong>, if you want to hide the observed/expected numbers of stories, check this box. This choice affects both the "Explore Patterns" page and the printed report.`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },

        {
            id: "configureCatalysisReport_numScatterDotOpacityLevels",
            valuePath: "/clientState/catalysisReportIdentifier/numScatterDotOpacityLevels",
            valueType: "string",
            valueOptions: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"],
            displayType: "select",
            displayName: "Number of scatter plot dot opacity levels",
            displayPrompt: `For <strong>scatter plots</strong>, how many stories should it take to draw a completely <strong>opaque dot</strong>? 
                Set this number high if you have a lot of identical scale values. If no selection is made, 3 levels will be used.`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },

        {
            id: "configureCatalysisReport_scatterDotSize",
            valuePath: "/clientState/catalysisReportIdentifier/scatterDotSize",
            valueType: "string",
            valueOptions: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"],
            displayType: "select",
            displayName: "Scatter dot size",
            displayPrompt: `For <strong>scatter plots</strong>, what <strong>dot size</strong> (in pixels) would you like? 
                Set this number low if you have a large number of data points.
                This choice affects both the the "Explore Patterns" page and the printed catalysis report.
                If no selection is made, a size of 8 will be used.`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },

        {
            id: "configureCatalysisReport_correlationLineChoice",
            valuePath: "/clientState/catalysisReportIdentifier/correlationLineChoice",
            valueType: "string",
            valueOptions: [
                "none",
                "0.01",
                "0.05"
            ],
            displayType: "select",
            displayName: "Mark correlation lines",
            displayPrompt: `For <strong>scatter plots</strong>, at what significance level should <strong>correlations</strong> be marked?
                This choice affects both the the "Explore Patterns" page and the printed catalysis report.
                If no selection is made, a limit of 0.05 will be used.`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },

        ////////////////////////////////////////////////////// other options
        {
            id: "configureCatalysisReport_moreOptionsHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Other options",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "configureCatalysisReport_minimumSubsetSize",
            valuePath: "/clientState/catalysisReportIdentifier/minimumSubsetSize",
            valueType: "string",
            valueOptions: ["1", "5", "10", "15", "20", "25", "30", "35", "40", "45", "50", "60", "70", "80", "90", "100", "120", "140", "160", "180", "200", "250", "300"],
            displayType: "select",
            displayName: "Minimum subset size",
            displayPrompt: `How large should <strong>subsets</strong> of stories be to be considered for statistical tests? 
                Test results based on low sample sizes - usually less than 30 - should be regarded as suggestive rather than conclusive.
                This choice affects both the the "Explore Patterns" page and the printed catalysis report.
                If no selection is made, a 20-story minimum will be used.`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "configureCatalysisReport_questionShortNamesToShowForSelectedStories",
            valuePath: "/clientState/catalysisReportIdentifier/questionShortNamesToShowForSelectedStories",
            valueType: "string",
            displayType: "textarea",
            displayName: "Fields to show on selections",
            displayPrompt: `
                On the Explore patterns page, when you select stories on a graph, you can view them in a separate window for copying (maybe into an observation).
                When you look at subsets of stories in that way, you might also want to <strong>see the answers to a few important questions</strong> about each story.
                Enter the short names of those questions here, one per line. 
                `,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        
        ////////////////////////////////////////////////////// export import

        {
            id: "configureCatalysisReport_exportImportLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: `You can copy observations, interpretations, and perspectives from one catalysis report to another (new, empty) report,
            as long as the question short names are the same. For more information, see the help system.`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "catalysisReport_exportElements",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "exportCatalysisReportElements",
            displayName: "Export elements",
            displayPrompt: "Export report elements to CSV",
            displayPreventBreak: true,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "catalysisReport_importElements",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "importCatalysisReportElements",
            displayName: "Import elements",
            displayPrompt: "Import report elements from CSV",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "project_csvFileUploader",
            valueType: "none",
            displayType: "html",
            displayPrompt: '<input type="file" id="csvFileLoader" name="files" title="Import Data from CSV File" style="display:none"/>',
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();}
        },
    ]
};

export = panel;

