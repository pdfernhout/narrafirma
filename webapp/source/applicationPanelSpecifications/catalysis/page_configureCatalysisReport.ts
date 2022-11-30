import Globals = require("../../Globals");
"use strict";

const panel: Panel = {
    id: "page_configureCatalysisReport",
    displayName: "Configure catalysis report",
    pageExplanation: "Choose how you want to structure your catalysis report.",
    pageCategories: "manage",
    panelFields: [
        {
            id: "configureCatalysisReport_label",
            valueType: "none",
            displayType: "label",
            displayPrompt: `
                On this page you can set various options that affect your catalysis report.
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
            id: "configureCatalysisReport_showOrHideAdvancedOptions",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "showOrHideAdvancedOptions",
            displayName: "Show/hide advanced options",
            displayIconClass: function(panelBuilder, model) { return Globals.clientState().showAdvancedOptions() ? "hideButtonImage" : "showButtonImage"; },
            displayPrompt: function(panelBuilder, model) { return Globals.clientState().showAdvancedOptions() ? "Hide advanced options" : "Show advanced options"; },
            displayPreventBreak: false,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },

        ////////////////////////////////////////////////////// more things you can show or hide
        {
            id: "configureCatalysisReport_MoreThingsYouCanShowOrHideHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Things you can show or hide",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
            }
        },
        {
            id: "configureCatalysisReport_columnIDsToShowInPatternsTable",
            valueType: "none",
            valuePath: "/clientState/catalysisReportIdentifier/columnIDsToShowInPatternsTable",
            displayType: "catalysisReportPatternTableColumnsChooser",
            displayConfiguration: "Columns to show in the patterns table",
            displayPrompt: `What <strong>columns</strong> do you want to see in the table of patterns on the "Explore Patterns" page?`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
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
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
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
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
            }
        },
        {
            id: "catalysisReport_filter",
            valuePath: "/clientState/catalysisReportIdentifier/catalysisReport_filter",
            valueType: "string",
            displayType: "text",
            displayPrompt: `
            To <strong>filter the stories</strong> used in this report, enter your filter here, 
            using the format [question] == [answer].
            For details, see the help system.`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
            }
        },
        {
            id: "configureCatalysisReport_lumpingCommands",
            valuePath: "/clientState/catalysisReportIdentifier/lumpingCommands",
            valueType: "string",
            displayType: "textarea",
            displayPrompt: `
            To use <strong>display lumping</strong>, enter your lumping commands here, one per line,
            using the format [question] == [answer] || [answer] == [lumped answer].
            For details, see the help system.`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
            }
        },

        ////////////////////////////////////////////////////// drawing graphs
        {
            id: "configureCatalysisReport_DrawingGraphsHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Drawing graphs (in general)",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
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
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
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
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
            }
        },
        {
            id: "configureCatalysisReport_customDisplayGraphWidth",
            valuePath: "/clientState/catalysisReportIdentifier/customDisplayGraphWidth",
            valueType: "string",
            displayType: "select",
            valueOptions: ["400", "425", "450", "475", 
                "500", "525", "550", "575", "600", "625", "650", "675", 
                "700", "725", "750", "775", "800", "825", "850", "875", 
                "900", "925", "950", "975", "1000", "1025", "1050", "1075", 
                "1100", "1125", "1150", "1175", "1200", "1225", "1250", "1275", 
                "1300", "1325", "1350", "1375", "1400", "1425", "1450", "1475", 
                "1500", "1525", "1550", "1575", "1600", "1625", "1650", "1675", 
                "1700", "1725", "1750", "1725", "1800", "1825", "1850", "1875", 
                "1900", "1925", "1950", "1975", "2000"],
            displayName: "Custom display graph width",
            displayPrompt: `<strong>How wide should graphs be</strong> on the "Explore patterns" page, in pixels? 
                (This choice affects graphs in the application only. 
                If no selection is made here, graphs will be 800 pixels wide.)`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
            }
        },
        {
            id: "configureCatalysisReport_customDisplayGraphHeight",
            valuePath: "/clientState/catalysisReportIdentifier/customDisplayGraphHeight",
            valueType: "string",
            displayType: "select",
            valueOptions: ["200", "225", "250", "275", "300", "325", "350", "375",
                "400", "425", "450", "475", 
                "500", "525", "550", "575", "600", "625", "650", "675", 
                "700", "725", "750", "775", "800", "825", "850", "875", 
                "900", "925", "950", "975", "1000", "1025", "1050", "1075", 
                "1100", "1125", "1150", "1175", "1200", "1225", "1250", "1275", 
                "1300", "1325", "1350", "1375", "1400", "1425", "1450", "1475", 
                "1500", "1525", "1550", "1575", "1600", "1625", "1650", "1675", 
                "1700", "1725", "1750", "1725", "1800", "1825", "1850", "1875", 
                "1900", "1925", "1950", "1975", "2000"],
            displayName: "Custom display graph height",
            displayPrompt: `<strong>How tall</strong> should graphs be on the "Explore patterns" page, in pixels? 
                (This choice affects graphs in the application only. 
                If no selection is made here, graphs will be 600 pixels tall.)`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
            }
        },
        {
            id: "configureCatalysisReport_customGraphPadding",
            valuePath: "/clientState/catalysisReportIdentifier/customGraphPadding",
            valueType: "string",
            displayType: "select",
            valueOptions: ["0", "5", "10", "15", "20", "25", "30", "35", "40", "45", "50", "60", "70", "80", "90", "100", "110", "120", "130", "140", "150", "160", "170", "180", "190", "200", "210", "220", "230", "240", "250", "260", "270", "280", "290", "300"],
            displayName: "Custom graph padding",
            displayPrompt: `Do you want to <strong>add extra pixels</strong> 
                to bar graphs (below) and contingency tables (below and left) 
                to accommodate larger font sizes you set using CSS?
                (This setting affects bar graphs and contingency tables in the application and the printed report.
                If no selection is made here, no padding will be added.)`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
            }
        },
        {
            id: "configureCatalysisReport_customLabelLengthLimit",
            valuePath: "/clientState/catalysisReportIdentifier/customLabelLengthLimit",
            valueType: "string",
            displayType: "select",
            valueOptions: ["10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60"],
            displayName: "Custom label length limit",
            displayPrompt: `At what length do you want to <strong>truncate labels</strong> on bar graphs, tables, and correlation maps?
                (This choice affects graphs in the application and the printed report.
                If no selection is made here, labels will be truncated at 30 characters.)`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
            }
        },
        {
            id: "catalysisReport_customGraphCSS",
            valuePath: "/clientState/catalysisReportIdentifier/catalysisReport_customGraphCSS",
            valueType: "string",
            displayType: "textarea",
            displayName: "Custom Graph CSS",
            displayPrompt: `You can enter <strong>custom CSS</strong> to change how graphs are drawn. 
                (This choice affects graphs in the application and the printed report.
                For details see the help system.)`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
            }
        },


        ////////////////////////////////////////////////////// histograms
        {
            id: "configureCatalysisReport_DrawingHistogramsHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Histograms",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
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
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
            }
        },

        ////////////////////////////////////////////////////// contingency tables
        {
            id: "configureCatalysisReport_DrawingContingencyTablesHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Contingency tables",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
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
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
            }
        },

        ////////////////////////////////////////////////////// scatter plots
        {
            id: "configureCatalysisReport_DrawingScatterPlotsHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Scatter plots",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
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
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
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
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
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
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
            }
        },

        ////////////////////////////////////////////////////// correlation maps
        {
            id: "configureCatalysisReport_DrawingCorrelationMapsHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Correlation maps",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
            }
        },
        {
            id: "configureCatalysisReport_correlationMapShape",
            valuePath: "/clientState/catalysisReportIdentifier/correlationMapShape",
            valueType: "string",
            valueOptions: ["line with arcs", "circle with lines"],
            displayType: "select",
            displayName: "Correlation map shape",
            displayPrompt: `What <strong>shape</strong> should correlation maps be? 
                (This choice affects graphs in the application and the printed report.
                If no selection is made here, the "line with arcs" choice will be used.)`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
            }
        },
        {
            id: "configureCatalysisReport_correlationMapIncludeScaleEndLabels",
            valuePath: "/clientState/catalysisReportIdentifier/correlationMapIncludeScaleEndLabels",
            valueType: "string",
            valueOptions: ["always", "only when there is no choice question", "only when there are 6 or fewer questions", "never"],
            displayType: "select",
            displayName: "Correlation map end labels choice",
            displayPrompt: `For correlation maps, when should the <strong>ends of scales</strong> be labeled? 
                Depending on your project, these could be helpful, irrelevant, or in the way. 
                (This choice affects graphs in the application and the printed report.
                If no selection is made here, the "only on main graph" choice will be used.)`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
            }
        },
        {
            id: "configureCatalysisReport_correlationMapCircleDiameter",
            valuePath: "/clientState/catalysisReportIdentifier/correlationMapCircleDiameter",
            valueType: "string",
            valueOptions: ["50", "100", "150", "200", "250", "300", "350", "400", "450", "500", "550", "600", "650", "700", "750", "800", "850", "900", "950", "1000"],
            displayType: "select",
            displayName: "Correlation circle diameter",
            displayPrompt: `For circular correlation maps, what should the 
                <strong>circle diameter</strong> be, in pixels?
                Circles on subchoice graphs will be half this diameter.
                (This choice affects graphs in the application and the printed report.
                If no selection is made here, a diameter of 300 pixels will be used.)`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
            }
        },

        ////////////////////////////////////////////////////// story lengths
        {
            id: "configureCatalysisReport_DrawingStoryLengthsHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Story lengths",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
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
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
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
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
            }
        },   

        ////////////////////////////////////////////////////// story collection dates
        {
            id: "configureCatalysisReport_DrawingStoryCollectionDatesHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Story collection dates",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
            }
        },
        {
            id: "configureCatalysisReport_storyCollectionDateUnit",
            valuePath: "/clientState/catalysisReportIdentifier/storyCollectionDateUnit",
            valueType: "string",
            valueOptions: ["years", "quarters", "months", "days"],
            displayType: "select",
            displayName: "Story collection date unit",
            displayPrompt: `For graphing story collection dates, <strong>what time units</strong> do you want to graph? 
                (This choice affects graphs in the application and the printed report.
                If no selection is made here, days will be used.)`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
            }
        },    


        ////////////////////////////////////////////////////// other options
        {
            id: "configureCatalysisReport_moreOptionsHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Other options",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
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
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
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
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
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
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
            }
        },
        {
            id: "catalysisReport_importElements",
            valueType: "none",
            displayType: "button",
            displayIconClass: "importButtonImage",
            displayConfiguration: "importCatalysisReportElements",
            displayName: "Import elements",
            displayPreventBreak: true,
            displayPrompt: "Import report elements from CSV",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
            }
        },
        {
            id: "catalysisReport_exportElements",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "exportCatalysisReportElements",
            displayName: "Export elements",
            displayIconClass: "exportButtonImage",
            displayPrompt: "Export report elements to CSV",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();
            }
        },
        {
            id: "project_csvFileUploader",
            valueType: "none",
            displayType: "html",
            displayPrompt: '<input type="file" id="csvFileLoader" name="files" title="Import Data from CSV File" style="display:none"/>',
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().haveCatalysisReportAndShowingAdvancedOptions();}
        },
    ]
};

export = panel;

