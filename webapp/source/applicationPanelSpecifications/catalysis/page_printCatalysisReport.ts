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
                On this page you can print a <strong>catalysis report</strong>, which will include
                your observations, interpretations, and perspectives, as well as
                the introduction (and other sections) you wrote on the "Start catalysis report" page.
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
            displayPrompt: "Choose a catalysis report to print."
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
            id: "catalysisReportPrint_printObservationsOrClusteredInterpretations",
            valuePath: "/clientState/catalysisReportIdentifier/catalysisReportPrint_printObservationsOrClusteredInterpretations",
            valueType: "string",
            valueOptions: ["clustered interpretations", "observations (all)", "observations (strong)", "observations (medium)", "observations (weak)", "observations (strong and medium)"],
            displayType: "select",
            displayPrompt: "Would you like to print a <strong>complete</strong> report with clustered interpretations? Or a <strong>preliminary</strong> report with only observations?",
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
            id: "configureCatalysisReport_showStatsPanelsInReport",
            valueType: "boolean",
            valuePath: "/clientState/catalysisReportIdentifier/showStatsPanelsInReport",
            displayType: "checkbox",
            displayConfiguration: "Yes, include statistics in the report",
            displayPrompt: `Would you like to <strong>include statistical results</strong> in the catalysis report?`,
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

