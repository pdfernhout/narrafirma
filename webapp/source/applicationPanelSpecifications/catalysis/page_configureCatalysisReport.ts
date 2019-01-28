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
                On this page you can choose the <strong>questions</strong> you want to explore in your catalysis report.
                You can also specify a threshold for statistical tests.
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
            id: "configureCatalysisReport_graphMultiChoiceQuestionsAgainstThemselves",
            valueType: "boolean",
            valuePath: "/clientState/catalysisReportIdentifier/graphMultiChoiceQuestionsAgainstThemselves",
            displayType: "checkbox",
            displayConfiguration: "Yes, graph multi-choice questions against themselves",
            displayPrompt: `Would you like to graph multi-choice questions against themselves 
                to show <strong>patterns of coincidence</strong> among answers to the same question? 
                `,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },

        {
            id: "configureCatalysisReport_showInterpretationsInGrid",
            valueType: "boolean",
            valuePath: "/clientState/catalysisReportIdentifier/showInterpretationsInGrid",
            displayType: "checkbox",
            displayConfiguration: "Yes, show interpretations in the table",
            displayPrompt: "Should <strong>interpretations</strong> be shown in the table of patterns? (Tip: Turn this on to find or review interpretations; turn it off to shrink the table height.)",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },



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
            id: "configureCatalysisReport_outputGraphFormat",
            valuePath: "/clientState/catalysisReportIdentifier/outputGraphFormat",
            valueType: "string",
            valueOptions: ["SVG", "PNG"],
            displayType: "select",
            displayName: "Output graph format",
            displayPrompt: `What <strong>output format</strong> should be used to draw the graphs in the printed report? 
                SVG graphs have good resolution and can be styled with CSS classes, but cannot be copied or saved. (You can take screenshots of them, though.)
                PNG graphs can be easily saved and copied, but have lower resolution and can't be changed. 
                `,
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
                (This choice affects multiple histograms and multiple scatterplots 
                    on the Explore patterns page and the printed catalysis report.
                    Note that higher numbers could create graph sets with one or even zero graphs in them.
                    )`,
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
            displayPrompt: `In the <strong>story length graph</strong>, above what character length do you want to lump all remaining stories into the last bin?`,
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
            displayPrompt: "For <strong>histograms</strong>, how many <strong>bins</strong> (bars) should the data be sorted into?",
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
            displayPrompt: "For <strong>scatter plots</strong>, how many stories should it take to draw a completely <strong>opaque dot</strong>? (Set this number high if you have a lot of identical scale values.)",
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
            displayPrompt: "For <strong>scatter plots</strong>, what <strong>dot size</strong> (in pixels) would you like? (Set this number low if you have a large number of data points.)",
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
            displayPrompt: "For <strong>scatter plots</strong>, at what significance level should <strong>correlations</strong> be marked?",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },


        {
            id: "configureCatalysisReport_StatisticalTestsHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "How statistical tests are run",
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
            displayPrompt: "How large should <strong>subsets</strong> of stories be to be considered for statistical tests? (Test results based on low sample sizes - usually less than 30 - should be regarded as suggestive rather than conclusive.)",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        
        {
            id: "configureCatalysisReport_ReportLooksHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "How the report looks",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },

        {
            id: "catalysisReport_notes",
            valuePath: "/clientState/catalysisReportIdentifier/catalysisReport_notes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Introduction",
            displayPrompt: `
            You can enter an <strong>introduction</strong> to your catalysis report here (explaining, for example,
                what the project is about and where the stories came from). 
                It will appear at the start of your printed report. You can add HTML to this text (for example, to
                start the section with an "Introduction" header). See the help system for details.`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "catalysisReport_about",
            valuePath: "/clientState/catalysisReportIdentifier/catalysisReport_about",
            valueType: "string",
            displayType: "textarea",
            displayName: "About",
            displayPrompt: `
            You can enter an <strong>About this report</strong> section that describes 
            the structure of your report here (explaining, for example, how it was created). 
            It will appear after your introduction at the start of your printed report.`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "catalysisReport_tocHeaderFirstLevel",
            valuePath: "/clientState/catalysisReportIdentifier/catalysisReport_tocHeaderFirstLevel",
            valueType: "string",
            displayType: "textarea",
            displayName: "Contents header (top level)",
            displayPrompt: `
            This header precedes the <strong>top-level table of contents</strong> (list of perspectives) at the start
            of your report. If you leave this field blank, the header will read "Perspectives in this report (#)."
            To change the header, enter some text here. A number sign (#) will be replaced
            with the number of perspectives in the report.`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "catalysisReport_tocHeaderSecondLevel",
            valuePath: "/clientState/catalysisReportIdentifier/catalysisReport_tocHeaderSecondLevel",
            valueType: "string",
            displayType: "textarea",
            displayName: "Contents header (second level)",
            displayPrompt: `
            This header precedes the <strong>second-level table of contents</strong> (list of interpretations) 
            within each perspective section. If you leave this field blank, the header will read 
            "Interpretations and observations in this perspective (#)."
            To change the header, enter some text here. A number sign (#) will be replaced
            with the number of interpretations in the perspective.`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "catalysisReport_perspectiveLabel",
            valuePath: "/clientState/catalysisReportIdentifier/catalysisReport_perspectiveLabel",
            valueType: "string",
            displayType: "text",
            displayName: "Perspective label",
            displayPrompt: `
            This optional label (e.g., "Perspective: ") will appear <strong>before each perspective name</strong> in the report.`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "catalysisReport_interpretationLabel",
            valuePath: "/clientState/catalysisReportIdentifier/catalysisReport_interpretationLabel",
            valueType: "string",
            displayType: "text",
            displayName: "Interpretation label",
            displayPrompt: `
            This optional label (e.g., "Interpretation: ")  will appear <strong>before each interpretation name</strong> in the report.`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "catalysisReport_observationLabel",
            valuePath: "/clientState/catalysisReportIdentifier/catalysisReport_observationLabel",
            valueType: "string",
            displayType: "text",
            displayName: "Observation label",
            displayPrompt: `
            This optional label (e.g., "Observation: ")  will appear <strong>before each observation name</strong> in the report.`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "catalysisReport_conclusion",
            valuePath: "/clientState/catalysisReportIdentifier/catalysisReport_conclusion",
            valueType: "string",
            displayType: "textarea",
            displayName: "Conclusion",
            displayPrompt: `
            You can enter a report <strong>conclusion</strong> here (for example, making suggestions
                for use of the report or summarizing major points). 
            It will appear at the end of the report, after all of the perspectives (and their interpretations and observations) have been listed.`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "catalysisReport_customCSS",
            valuePath: "/clientState/catalysisReportIdentifier/catalysisReport_customCSS",
            valueType: "string",
            displayType: "textarea",
            displayName: "Custom CSS",
            displayPrompt: "You can enter <strong>custom CSS</strong> that modifies elements of the catalysis report here. (For more information on how this works, see the help system.)",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
    ]
};

export = panel;

