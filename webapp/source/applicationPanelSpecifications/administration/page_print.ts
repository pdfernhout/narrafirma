import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_print",
    displayName: "Print",
    pageExplanation: "Generate a whole-project report that displays everything you entered into NarraFirma so you can use it elsewhere.",
    pageCategories: "output",
    panelFields: [
        {
            id: "print_header",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you can print a project report, and you can follow links to all the other pages where you can print things."
        },
        {
            id: "print_printLabel",
            valueType: "none",
            displayType: "html",
            displayPrompt: `A project report is a summary of <strong>everything you typed</strong> into NarraFirma.
                It does not include stories (which you can export from the <a href="javascript:narrafirma_openPage('page_exportStories')">Export stories or story forms</a> page) or
                graphs (which you can export from the <a href="javascript:narrafirma_openPage('page_printCatalysisReport')">Print catalysis report</a> page).
                `
        },
        {
            id: "print_printProjectReport",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "printProjectReport",
            displayIconClass: "printButtonImage",
            displayPrompt: "Print project report"
        },
        {
            id: "print_otherThingsToPrint",
            valueType: "none",
            displayType: "html",
            displayPrompt: `<p>Other things you can print:</p>
                <ul>
                    <li><a href="javascript:narrafirma_openPage('page_planStoryCollectionSessions')">A story collection session agenda</a></li>
                    <li><a href="javascript:narrafirma_openPage('page_printQuestionForms')">A story form</a></li>
                    <li><a href="javascript:narrafirma_openPage('page_printCatalysisReport')">A catalysis report</a></li>
                    <li><a href="javascript:narrafirma_openPage('page_printStoryCards')">Story cards</a></li>
                    <li><a href="javascript:narrafirma_openPage('page_planSensemakingSessions')">A sensemaking session agenda</a></li>
                    <li><a href="javascript:narrafirma_openPage('page_prepareProjectPresentation')">An outline for a project presentation</a></li>
                </ul>`
        }
    ]
};

export = panel;
