import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_addCatalysisReport",
    modelClass: "CatalysisReport",
    panelFields: [
        {
            id: "catalysisReport_shortName",
            valueType: "string",
            displayType: "text",
            displayName: "Catalysis report name",
            displayPrompt: "Please give this catalysis report a short <strong>name</strong>."
        },
        {
            id: "catalysisReport_storyCollections",
            valueType: "array",
            displayType: "grid",
            displayConfiguration: {
                itemPanelID: "panel_chooseStoryCollection",
                gridConfiguration: {
                    viewButton: true,
                    editButton: true,
                    addButton: true,
                    removeButton: true
                }
            },
            displayName: "Story collections",
            displayPrompt: "Add one or more <strong>story collections</strong> to this catalysis report."
        },
        {
            id: "catalysisReport_notes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Introduction",
            displayPrompt: `
            You can enter an <strong>introduction</strong> to your catalysis report here (explaining, for example,
                what the project is about and where the stories came from). 
                It will appear at the start of your printed report. You can add HTML to this text (for example, to
                start the section with an "Introduction" header). See the help system for details.`
        },
        {
            id: "catalysisReport_about",
            valueType: "string",
            displayType: "textarea",
            displayName: "About",
            displayPrompt: `
            You can enter an <strong>About this report</strong> section that describes 
            the structure of your report here (explaining, for example, how it was created). 
            It will appear after your introduction at the start of your printed report.`
        },
        {
            id: "catalysisReport_tocHeaderFirstLevel",
            valueType: "string",
            displayType: "textarea",
            displayName: "Contents header (top level)",
            displayPrompt: `
            This header precedes the <strong>top-level table of contents</strong> (list of perspectives) at the start
            of your report. If you leave this field blank, the header will read "Perspectives in this report (#)."
            To change the header, enter some text here. A number sign (#) will be replaced
            with the number of perspectives in the report.`
        },
        {
            id: "catalysisReport_tocHeaderSecondLevel",
            valueType: "string",
            displayType: "textarea",
            displayName: "Contents header (second level)",
            displayPrompt: `
            This header precedes the <strong>second-level table of contents</strong> (list of interpretations) 
            within each perspective section. If you leave this field blank, the header will read 
            "Interpretations in this perspective (#)."
            To change the header, enter some text here. A number sign (#) will be replaced
            with the number of interpretations in the perspective.`
        },
        {
            id: "catalysisReport_perspectiveLabel",
            valueType: "string",
            displayType: "text",
            displayName: "Perspective label",
            displayPrompt: `
            This optional label (e.g., "Perspective: ") will appear <strong>before each perspective name</strong> in the report.`
        },
        {
            id: "catalysisReport_interpretationLabel",
            valueType: "string",
            displayType: "text",
            displayName: "Interpretation label",
            displayPrompt: `
            This optional label (e.g., "Interpretation: ")  will appear <strong>before each interpretation name</strong> in the report.`
        },
        {
            id: "catalysisReport_observationLabel",
            valueType: "string",
            displayType: "text",
            displayName: "Observation label",
            displayPrompt: `
            This optional label (e.g., "Observation: ")  will appear <strong>before each observation name</strong> in the report.`
        },
        {
            id: "catalysisReport_conclusion",
            valueType: "string",
            displayType: "textarea",
            displayName: "Conclusion",
            displayPrompt: `
            You can enter a report <strong>conclusion</strong> here (for example, making suggestions
                for use of the report or summarizing major points). 
            It will appear at the end of the report, after all of the perspectives (and their interpretations and observations) have been listed.`
        },
        {
            id: "catalysisReport_customCSS",
            valueType: "string",
            displayType: "textarea",
            displayName: "Custom CSS",
            displayPrompt: "You can enter <strong>custom CSS</strong> that modifies elements of the catalysis report here. (For more information on how this works, see the help system.)"
        },

    ]
};

export = panel;

