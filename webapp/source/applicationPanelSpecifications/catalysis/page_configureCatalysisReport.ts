import Globals = require("../../Globals");
"use strict";

var panel: Panel = {
    id: "page_configureCatalysisReport",
    displayName: "Configure Catalysis Report",
    panelFields: [
        {
            id: "configureCatalysisReport_label",
            valueType: "none",
            displayType: "label",
            displayPrompt: `
                On this page you will choose the questions you want to explore in your catalysis report.
                You can also specifiy a threshold for some tests.
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
            displayPrompt: "Choose a catalysis report to work on"
        },
        {
            id: "configureCatalysisReport_promptToSelectCatalysisReportForInterpretations",
            valueType: "none",
            displayType: "label",
            displayPrompt: "<strong>Please select a catalysis report above to get a list of questions here.</strong>",
            displayVisible: function(panelBuilder, model) {
                return !Globals.clientState().catalysisReportName();
            }
        },
        {
            id: "configureCatalysisReport_minimumSubsetSize",
            valuePath: "/clientState/catalysisReportIdentifier/minimumSubsetSize",
            valueType: "string",
            valueOptions: [
                "20",
                "30",
                "40",
                "50"
            ],
            displayType: "select",
            displayName: "Minimum subset size",
            displayPrompt: "How large should subsets of stories be to be considered for comparison?",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportName();
            }
        },
        {
            id: "configureCatalysisReport_chooseQuestions",
            valueType: "object",
            valuePath: "/clientState/catalysisReportIdentifier/questionsToInclude",
            displayType: "catalysisReportQuestionChooser",
            displayPrompt: "Choose questions to include in the catalysis report",
            displayVisible: function(panelBuilder, model) {
                return !!Globals.clientState().catalysisReportName();
            }
        }
    ]
};

export = panel;

