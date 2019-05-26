import Globals = require("../../Globals");
import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_printCatalysisReport",
    displayName: "Print catalysis report",
    tooltipText: "Export the graphs you've selected, and the observations and interpretations you've written, to use in a sensemaking session.",
    headerAbove: "Wrap Up Catalysis",
    panelFields: [
        {
            id: "catalysisReportPrint_label",
            valueType: "none",
            displayType: "label",
            displayPrompt: `
                On this page you can print a <strong>catalysis report</strong>.
                You can organize the report by the
                <strong>perspectives</strong> (clusters of interpretations) or <strong>themes</strong> (clusters of observations)
                you created on the previous page.
                The report can also include an introduction and other optional elements.
                `
        },
        {
            id: "catalysisReportPrint_selected",
            valuePath: "/clientState/catalysisReportName",
            valueType: "string",
            valueOptions: "project_catalysisReports",
            valueOptionsSubfield: "catalysisReport_shortName",
            displayType: "select",
            displayName: "Catalysis report",
            displayPrompt: "Choose a catalysis <strong>report</strong> to print."
        },
        {
            id: "catalysisReportPrint_filterNotice",
            valueType: "object",
            valuePath: "/clientState/catalysisReportIdentifier/catalysisReport_filter",
            displayType: "catalysisReportFilterNotice",
            displayPrompt: "",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },     
        {
            id: "catalysisReportPrint_reportType",
            valuePath: "/clientState/catalysisReportIdentifier/catalysisReportPrint_reportType",
            valueType: "string",
            valueOptions: ["perspectives (clustered interpretations)", "themes (clustered observations)", "observations (disregarding any clustering)", "observation graphs only"],
            displayType: "select",
            displayPrompt: `<strong>Which type</strong> of report would you like to print?`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },  
        {
            id: "catalysisReportPrint_observationStrengths",
            valuePath: "/clientState/catalysisReportIdentifier/catalysisReportPrint_observationStrengths",
            valueType: "dictionary",
            valueOptions: ["strong", "medium", "weak", "no strength value set"],
            displayType: "checkboxes",
            displayPrompt: "Which observation <strong>strengths</strong> do you want to include?",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },   
        {
            id: "catalysisReportPrint_includeObservationsWithNoInterpretations",
            valuePath: "/clientState/catalysisReportIdentifier/catalysisReportPrint_includeObservationsWithNoInterpretations",
            valueType: "boolean",
            displayType: "checkbox",
            displayConfiguration: "Include observations with no interpretations",
            displayPrompt: "Do you want to include observations that have <strong>no interpretations</strong> associated with them?",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        }, 
        {
            id: "catalysisReportPrint_printButton",
            valuePath: "/clientState/catalysisReportName",
            valueType: "none",
            displayType: "button",
            displayPrompt: "Print selected catalysis report",
            displayConfiguration: "printCatalysisReport",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "configureCatalysisReport_advancedOptionsLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: `<span.narrafirma-centered-label>Everything below this point is optional and can be ignored.</span>`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },


        ///////////////////////////////////////////////////// things to show and hide
        {
            id: "catalysisReportPrint_MoreThingsToShowAndHideHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Things you can show or hide",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },        
        {
            id: "configureCatalysisReport_showStatsPanelsInReport",
            valueType: "boolean",
            valuePath: "/clientState/catalysisReportIdentifier/showStatsPanelsInReport",
            displayType: "checkbox",
            displayConfiguration: "Include statistics",
            displayPrompt: `Would you like to <strong>print statistical results</strong>?`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "configureCatalysisReport_printItemIndexNumbers",
            valueType: "boolean",
            valuePath: "/clientState/catalysisReportIdentifier/printItemIndexNumbers",
            displayType: "checkbox",
            displayConfiguration: "Print sequence numbers",
            displayPrompt: `Do you want to <strong>print sequence numbers</strong> for each perspective, theme, observation, and interpretation in the report?`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "configureCatalysisReport_hideReportCreationInfo",
            valueType: "boolean",
            valuePath: "/clientState/catalysisReportIdentifier/hideReportCreationInfo",
            displayType: "checkbox",
            displayConfiguration: "Hide report creation information",
            displayPrompt: `You can <strong>hide the report creation information</strong> that NarraFirma usually puts at the start of the report.`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },

        ///////////////////////////////////////////////////// other printing options
        {
            id: "catalysisReportPrint_printOptionsHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Other printing options",
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
            displayPrompt: `Which <strong>graph format</strong> do you want to use? (If no choice is made here, SVG format will be used.)`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "configureCatalysisReport_outputFontModifierPercent",
            valuePath: "/clientState/catalysisReportIdentifier/outputFontModifierPercent",
            valueType: "string",
            displayType: "select",
            valueOptions: ["50", "60", "70", "80", "90", "110", "120", "130", "140", "150", "160", "170", "180", "190", "200"],
            displayName: "Output font modifier percent",
            displayPrompt: `If you want to modify the <strong>font sizes</strong> in report graphs, choose a percentage modifier here.`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "configureCatalysisReport_customReportGraphWidth",
            valuePath: "/clientState/catalysisReportIdentifier/customReportGraphWidth",
            valueType: "string",
            displayType: "select",
            valueOptions: ["400", "450", "500", "550", "600", "650", "700", "750", "800", "850", "900", "950", "1000", "1050", "1100", "1150", "1200", "1250", "1300", "1350", "1400", "1450", "1500", "1550", "1600", "1650", "1700", "1750", "1800", "1850", "1900", "1950", "2000"],
            displayName: "Custom report graph width",
            displayPrompt: `<strong>How wide should report graphs be</strong>, in pixels? 
                (This choice affects graphs in the report only. 
                If no selection is made here, graphs will be 800 pixels wide.)`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "catalysisReportPrint_useTableForInterpretationsFollowingObservation",
            valuePath: "/clientState/catalysisReportIdentifier/useTableForInterpretationsFollowingObservation",
            valueType: "boolean",
            displayType: "checkbox",
            displayConfiguration: "Show interpretations in a table side by side",
            displayPrompt: "For a clustered-observations report, do you want to show interpretations <strong>side by side</strong>? Or one after another?",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        }, 

        ///////////////////////////////////////////////////// custom texts
        {
            id: "catalysisReportPrint_customTextsHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Custom texts",
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
            displayPrompt: `You can enter <strong>custom CSS</strong> to modify elements of the catalysis report here. 
                (This option does not affect report graphs.
                Enter custom CSS for graphs on the "Configure catalysis report" page. For details on custom CSS, see the help system.)`,
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
                This optional <strong>introduction</strong> begins your report. (See the help system to learn about HTML formatting you can use.)`,
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
                An optional <strong>About this report</strong> section is printed after the introduction.`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "catalysisReport_tocHeaderFirstLevel",
            valuePath: "/clientState/catalysisReportIdentifier/catalysisReport_tocHeaderFirstLevel",
            valueType: "string",
            displayType: "text",
            displayName: "Contents header (top level)",
            displayPrompt: `
                You can enter a custom <strong>header for the list of perspectives</strong> at the start
                of your clustered-interpretations report. 
                A number sign (#) will be replaced
                with the number of perspectives in the report. (If you leave this field blank, the header will read "Perspectives in this report (#).")`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "catalysisReport_tocHeaderFirstLevel_themes",
            valuePath: "/clientState/catalysisReportIdentifier/catalysisReport_tocHeaderFirstLevel_observations",
            valueType: "string",
            displayType: "text",
            displayName: "Contents header (top level)",
            displayPrompt: `
                You can enter a custom <strong>header for the list of themes</strong> at the start
                of your clustered-observations report. 
                A number sign (#) will be replaced
                with the number of themes in the report. (If you leave this field blank, the header will read "Themes in this report (#).")`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },

        {
            id: "catalysisReport_tocHeaderSecondLevel",
            valuePath: "/clientState/catalysisReportIdentifier/catalysisReport_tocHeaderSecondLevel",
            valueType: "string",
            displayType: "text",
            displayName: "Contents header (second level)",
            displayPrompt: `
                You can enter a custom <strong>header for the table of interpretations and observations in each perspective</strong> 
                in a clustered-interpretations report. A number sign (#) will be replaced with the number of interpretations in the perspective. 
                (If you leave this field blank, the header will read "Interpretations and observations in this perspective (#).")`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "catalysisReport_tocHeaderSecondLevel_observations",
            valuePath: "/clientState/catalysisReportIdentifier/catalysisReport_tocHeaderSecondLevel_observations",
            valueType: "string",
            displayType: "text",
            displayName: "Contents header (second level)",
            displayPrompt: `
                You can enter a custom <strong>header for the list of observations in each theme</strong> 
                in a clustered-observations report. A number sign (#) will be replaced with the number of observations in the theme. 
                If you leave this field blank, the header will read "Observations and interpretations in this theme (#)."`,
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
            This optional label will appear <strong>before each perspective name</strong> in the report.`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "catalysisReport_themeLabel",
            valuePath: "/clientState/catalysisReportIdentifier/catalysisReport_themeLabel",
            valueType: "string",
            displayType: "text",
            displayName: "Theme label",
            displayPrompt: `
            This optional label will appear <strong>before each theme name</strong> in the report.`,
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
            This optional label will appear <strong>before each interpretation name</strong> in the report.`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "catalysisReport_interpretationQuestionsLabel",
            valuePath: "/clientState/catalysisReportIdentifier/catalysisReport_interpretationQuestionsLabel",
            valueType: "string",
            displayType: "text",
            displayName: "Interpretation questions label",
            displayPrompt: `
            This optional label will appear <strong>before each list of interpretation questions</strong> in the report.`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "catalysisReport_interpretationIdeaLabel",
            valuePath: "/clientState/catalysisReportIdentifier/catalysisReport_interpretationIdeaLabel",
            valueType: "string",
            displayType: "text",
            displayName: "Interpretation idea label",
            displayPrompt: `
            This optional label will appear <strong>before each interpretation idea</strong> in the report.`,
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
            This optional label will appear <strong>before each observation name</strong> in the report.`,
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
            You can enter a <strong>report conclusion</strong> here.`,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },
        {
            id: "catalysisReport_customStatsTextReplacements",
            valuePath: "/clientState/catalysisReportIdentifier/customStatsTextReplacements",
            valueType: "string",
            displayType: "textarea",
            displayName: "Text replacements",
            displayPrompt: `
                You can <strong>replace graph and statistical texts</strong> in your report with simpler or translated versions. 
                Enter one text replacement per line. 
                Each line should have the standard text you want to replace, followed by an equals sign, followed by the text you want to replace it with.
                For example, "median = médiane" will write "médiane" in every place where "median" would have been written.
                <br><br>
                The texts you can replace are (and must <em>exactly</em> match, to the left of the equals sign):
                <ul>
                <li>Count</li>
                <li>Frequency</li>
                <li>No answer</li>
                <li>Statistics</li>
                <li>p</li>
                <li>n</li>
                <li>n1</li>
                <li>n2</li>
                <li>mean</li>
                <li>median</li>
                <li>mode</li>
                <li>standard deviation</li>
                <li>skewness</li>
                <li>kurtosis</li>
                <li>chi squared (x2)</li>
                <li>degrees of freedom (k)</li>
                <li>Spearman's rho</li>
                <li>Sub-graph</li>
                <li>Mann-Whitney U</li>
                <li>Mann-Whitney U test results for multiple histograms, sorted by significance value (p)</li>
                </ul>
                These replacements apply only to your printed catalysis report.
                `,
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportIdentifier();
            }
        },

    ]
};

export = panel;

