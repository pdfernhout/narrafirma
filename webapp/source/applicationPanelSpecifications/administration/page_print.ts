import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_print",
    displayName: "Print",
    pageExplanation: "Generate a whole-project report or an empty project journal.",
    pageCategories: "export",
    panelFields: [
        {
            id: "print_header",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you can print a project report or a blank journal, and you can follow links to all the other pages where you can print things."
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
            id: "print_emptyJournalLabel",
            valueType: "none",
            displayType: "html",
            displayPrompt: `You can also print an <strong>empty project journal</strong>.
            Unlike a project report, this generated file does not include any information 
            you have already entered into NarraFirma.
            It simply includes every journal-type question in NarraFirma,
            as well as places to write down things you would normally enter into NarraFirma 
            (like questions you plan to ask and stories you collect).
            You might find it useful if you are doing a small pilot project,
            or if some members of your team don't want to use NarraFirma but would
            still like to suggest ideas and reflect on the project.
            You can even print the journal for them, adding blank spaces for them to write in.`
        },
        {
            id: "print_printEmptyJournal",
            valueType: "none",
            displayType: "button",
            displayConfiguration: "printEmptyJournal",
            displayIconClass: "printButtonImage",
            displayPrompt: "Print empty project journal"
        },
        {
            id: "print_otherThingsToPrint",
            valueType: "none",
            displayType: "html",
            displayPrompt: `<p>Here are some other things you can print:</p>
                <ul>
                    <li><a href="javascript:narrafirma_openPage('page_planStoryCollectionSessions')">A story collection session agenda</a></li>
                    <li><a href="javascript:narrafirma_openPage('page_printQuestionForms')">A story form</a></li>
                    <li><a href="javascript:narrafirma_openPage('page_printCatalysisReport')">A catalysis report</a></li>
                    <li><a href="javascript:narrafirma_openPage('page_printStoryCards')">Story cards</a></li>
                    <li><a href="javascript:narrafirma_openPage('page_planSensemakingSessions')">A sensemaking session agenda</a></li>
                    <li><a href="javascript:narrafirma_openPage('page_prepareProjectPresentation')">An outline for a project presentation</a></li>
                </ul>`
        },
    ]
};

export = panel;
