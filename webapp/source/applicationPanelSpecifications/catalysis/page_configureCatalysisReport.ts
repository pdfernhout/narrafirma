import Globals = require("../../Globals");
"use strict";

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
            displayPrompt: "Which <strong>graph types</strong> do you want to see on the \"Explore Patterns\" page?",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "configureCatalysisReport_chooseQuestions",
            valueType: "object",
            valuePath: "/clientState/catalysisReportIdentifier/questionsToInclude",
            displayType: "catalysisReportQuestionChooser",
            displayPrompt: "Which <strong>questions</strong> do you want to see on the \"Explore Patterns\" page? (Only questions checked here will be considered in data integrity graphs.)",
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
            displayPrompt: `Do you want to <strong>see interpretations</strong> in the table of patterns on the "Explore Patterns" page?`,
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
            displayPrompt: `Would you like to <strong>graph multi-choice questions against themselves</strong>?`,
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
            displayPrompt: `Would you prefer to <strong>hide statistical results on the "Explore Patterns" page</strong>?
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
            If you want to <strong>filter the stories</strong> used in this report, enter your filter here.
            (For details, click Help.)`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },

        ////////////////////////////////////////////////////// drawing graphs
        {
            id: "configureCatalysisReport_DrawingGraphsHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Drawing graphs",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "configureCatalysisReport_hideNoAnswerValues",
            valueType: "boolean",
            valuePath: "/clientState/catalysisReportIdentifier/hideNoAnswerValues_reportDefault",
            displayType: "checkbox",
            displayConfiguration: "Hide no-answer counts",
            displayPrompt: `Do you want to <strong>hide the bars/bubbles/boxes that represent "No answer" counts</strong> on graphs? 
                (This setting affects graphs in the application and the printed report.
                You can override this choice for any pattern by choosing "Toggle display of "No answer" values" in the "things you can do" list.)`,
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
            displayPrompt: `<strong>How wide should graphs be</strong> on the "Explore patterns" page, in pixels? (The default width is 800 pixels. 
                There is a separate place to specify this for the printed report.)`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "configureCatalysisReport_customLabelLengthLimit",
            valuePath: "/clientState/catalysisReportIdentifier/customLabelLengthLimit",
            valueType: "string",
            displayType: "select",
            valueOptions: ["10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60"],
            displayName: "Custom label length limit",
            displayPrompt: `At what length do you want to <strong>truncate labels</strong> on bar and contingency charts?
                (This choice affects graphs in the application and the printed report.
                If no selection is made here, labels will be truncated at 30 characters.)`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "configureCatalysisReport_minimumStoryCountRequiredForGraph",
            valuePath: "/clientState/catalysisReportIdentifier/minimumStoryCountRequiredForGraph",
            valueType: "string",
            valueOptions: ["1", "5", "10", "15", "20", "25", "30", "35", "40", "45", "50", "60", "70", "80", "90", "100", "120", "140", "160", "180", "200", "250", "300", "350", "400", "450", "500"],
            displayType: "select",
            displayName: "Minimum story count for graph",
            displayPrompt: `<strong>How many stories should a subset have</strong> to draw a graph? 
                    (This choice affects multiple histograms and multiple scatterplots in the application and the printed report.
                    If no selection is made here, graphs will be drawn if at there is least one story in the subset.
                    Note that a high number here could create patterns with no graphs in them.)`,
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
            displayPrompt: `<strong>How many story length categories</strong> do you want to graph? 
                (This choice affects graphs in the application and the printed report.
                If no selection is made here, four categories will be used.)`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },    
        {
            id: "configureCatalysisReport_maxStoryLengthToShow",
            valuePath: "/clientState/catalysisReportIdentifier/maxStoryLengthToShow",
            valueType: "string",
            valueOptions: ["100", "200", "300", "400", "500", "600", "700", "800", "900", "1000", "1100", "1200", "1300", "1400", "1500", "1600", "1700", "1800", "1900", "2000", "2500", "3000", "3500", "4000", "4500", "5000", "6000", "7000", "8000", "9000", "10000"],
            displayType: "select",
            displayName: "Maximum story length to show",
            displayPrompt: `In the story length graph, above what character length do you want to <strong>lump all remaining stories into the last bin</strong>? 
                (This choice affects graphs in the application and the printed report.
                If no selection is made here, the maximum story length will be drawn from the stories themselves.)`,
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
            displayPrompt: `How many <strong>histogram bins</strong> should the data be sorted into?
                (This choice affects graphs in the application and the printed report.
                If no selection is made here, 20 bins will be used.)`,
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
            displayPrompt: `To <strong>hide observed/expected story counts</strong> on continency tables, check this box. 
                (This choice affects graphs in the application and the printed report.)`,
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
            displayPrompt: `How many stories should it take to <strong>draw an opaque dot</strong> in a scatter plot? 
                (This choice affects graphs in the application and the printed report. 
                    If no selection is made here, 3 levels will be used.
                    Set this number high if you have a lot of identical scale values.)`,
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
            displayPrompt: `<strong>How big should dots be</strong> on scatter plots, in pixels? 
                This choice affects graphs in the application and the printed report.
                If no selection is made here, a size of 8 will be used.
                Set this number low if you have a large number of slightly-different data points.)`,
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
            displayPrompt: `When should <strong>correlation lines</strong> be drawn on scatter plots?
                (This choice affects graphs in the application and the printed report.
                If no selection is made here, a limit of 0.05 will be used.)`,
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
            valueOptions: ["1", "5", "10", "15", "20", "25", "30", "35", "40", "45", "50", "60", "70", "80", "90", "100", "120", "140", "160", "180", "200", "250", "300", "350", "400", "450", "500"],
            displayType: "select",
            displayName: "Minimum subset size",
            displayPrompt: `<strong>How many stories should a subset have</strong> to be compared to other subsets in a statistical test?
                (This choice affects multiple histograms and multiple scatterplots in the application and the printed report.
                If no selection is made here, a 20-story minimum will be used.
                Note that test results based on low sample sizes (usually less than 30) should be regarded as suggestive rather than conclusive.)`,
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
                What questions do you want to include when you <strong>view selected stories</strong> in a pop-up window on the "Explore "Patterns" page?
                (Enter the short names of the questions whose answers you want to see, one per line.)
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
            displayPrompt: `You can <strong>copy observations, interpretations, themes, and perspectives</strong> from one catalysis report to another (new, empty) report,
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

