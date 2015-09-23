import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_introduction",
    displayName: "Introduction",
    panelFields: [
        {
            id: "project_introductionLabel",
            valueType: "none",
            displayType: "html",
            displayPrompt: "This page provides a brief overview to using the NarraFirma&#0153; software."
        },
        {
            id: "project_wwsBookImage",
            valueType: "none",
            displayType: "image",
            displayConfiguration: "images/WWS_BookCover_front_small.png",
            displayPrompt: `
                The NarraFirma software is a companion for the book "Working with Stories in Your Community or Organization" (WWS) by Cynthia F. Kurtz.
                "Working with Stories" describes one approach to a process called "Participatory Narrative Inquiry" or "PNI" for short.
            `
        },
        {
            id: "project_wwsBookAndHelpLink",
            valueType: "none",
            displayType: "html",
            displayPrompt: `
                Click <a href="http://workingwithstories.org/">here</a> to obtain a copy of the Working With Stories book.
                If you want some help, you can contact <a href="http://cfkurtz.com">Cynthia Kurtz</a> for consulting or training on PNI projects and/or the NarraFirma software.
            `
        },
        {
            id: "project_narrafirmaSoftwareLink",
            valueType: "none",
            displayType: "html",
            displayPrompt: `
                If you want to host the NarraFirma software yourself,
                the source code is available under the GPL license on <a href="https://github.com/pdfernhout/narrafirma">GitHub</a>.
                You can submit bug reports or feature requests at the GitHub project.
                Cynthia designed the overall NarraFirma application.
                Her husband <a href="http://pdfernhout.net">Paul Fernhout</a> designed the supporting architecture and wrote most of the code.
            `
        },
        {
            id: "project_pniOverviewLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: `
                Participatory narrative inquiry (PNI) methods involve collecting stories from a community;
                reviewing, tagging, and thinking about those stories;
                and then returning that information back to the community for further discussion or additional iterations of the PNI process.
                PNI often works much better that typical surveys to get at the "ground truth" in a community.
                PNI help people discover insights, catch emerging trends, make decisions, generate ideas, resolve conflicts, and connect people.
                PNI draws on theory and practice in narrative inquiry, participatory action research, oral history, mixed-methods research,
                participatory theatre, narrative therapy, sensemaking, complexity theory, and decision support.
                Its focus is on the exploration of values, beliefs, feelings, and perspectives through collaborative sensemaking with stories of lived experience.
            `
        },
        {
            id: "project_usesLabel",
            valueType: "none",
            displayType: "html",
            displayPrompt: `
                The NarraFirma software is designed to support people using the PNI approach step-by-step as described in the WWS book.
                You can use the NarraFirma software to:\n
                <ul>\n
                    <li>plan your Participatory Narrative Inquiry (PNI) project</li>\n
                    <li>decide how you will collect stories</li>\n
                    <li>write questions about stories</li>\n
                    <li>plan group story sessions (and record what went on in them)</li>\n
                    <li>collect or enter stories (and answers to questions)</li>\n
                    <li>look at patterns in collected stories and answers</li>\n
                    <li>build "catalytic" material</li>\n
                    <li>plan sensemaking sessions (and record what went on in them)</li>\n
                    <li>plan interventions (and record what went on in them)</li>\n
                    <li>gather project feedback</li>\n<li>reflect on the project</li>\n
                    <li>present the project to others</li>\n
                    <li>preserve what you learned so you can use it on the next project</li>\n
                </ul>
            `
        },
        {
            id: "project_pniPhasesDiagramLabel",
            valueType: "none",
            displayType: "label",
            displayConfiguration: "images/PNIPhasesDiagram.png",
            displayPrompt: `
                The NarraFirma software supports all six major phases of the PNI process.
                You can click on the buttons on the main dashboard (home) page to open those sections.
                Each phase is further subdivided into typically about seven or so individual pages that represent tasks.
            `
        },
        {
            id: "project_pniPhasesDiagramImage",
            valueType: "none",
            displayType: "image",
            displayConfiguration: "images/PNIPhasesDiagram.png",
            displayName: "Diagram of PNI phases showing planning, collection, catalysis, sensemaking, intervention, and return",
            displayPrompt: "Here is an image of the PNI phases from page 75 from the WWS book"
        },
        {
            id: "project_helpLabelExplanation",
            valueType: "none",
            displayType: "label",
            displayPrompt: "If you click on the help link in the navigation bar, a separate help window will open with more information about that page."
        },
        {
            id: "project_helpNavigationButtonsLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: `
                The NarraFirma software has several sections that correspond with phases of the PNI process. 
                Only one section is open at a time.
                To navigate within the pages of a section, use the "Previous Page" and "Next Page" links
                in the navigation section at the top of each page or the buttons at the bottom of the page.
                Or you can select a page within the section directly from the drop down list in the navigation section.
            `
        },
        {
            id: "project_helpDashboardStatusLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: `
                At the bottom of each page (other than dashboard pages) 
                is a text area where you can set the \"status\" of the page to track your progress through tasks.
                That text will be displayed on the first page in the related section of the application.
            `
        },
        {
            id: "project_helpSavingData",
            valueType: "none",
            displayType: "label",
            displayPrompt: `
                Any changes you make to any field in the project are normally saved immediately to the server and are relayed to other connected users of the same project.
                However, if you are viewing a project in "readonly" mode, changes are only saved locally and will be lost when you reload the page or close your browser.
                You can backup and restore a project (including changes made in readonly mode) using a page in the Administration section.
            `
        },
        {
            id: "project_getStartedLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: `
                Now that you have finished with this page, you can click the "home" link in the navigation bar to go back to the main dashboard.
                Then from the home dashboard page, click the "Planning" button to begin the first phase of the PNI process
                and start working with stories in your community or organization.
            `
        }
    ]
};

export = panel;

