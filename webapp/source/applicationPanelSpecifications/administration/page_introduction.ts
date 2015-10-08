import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_introduction",
    displayName: "Introduction",
    panelFields: [
        {
            id: "project_narrafirma_whatisnf_header",
            valueType: "none",
            displayType: "header",
            displayPrompt: "What is NarraFirma?"
        },
        {
            id: "project_wwsBookAndHelpLink",
            valueType: "none",
            displayType: "html",
            displayPrompt: `
                NarraFirma&#0153; is a software companion to the book 
                <em><a href="http://workingwithstories.org">Working with Stories in Your Community or Organization</a></em>
                (WWS) by Cynthia F. Kurtz.
                <em>Working with Stories</em> describes one approach to a process called 
                participatory narrative inquiry (PNI).
            `
        },
        {
            id: "project_wwsBookImage",
            valueType: "none",
            displayType: "image",
            displayConfiguration: "images/WWS_BookCover_front_small.png",
            displayPrompt: ""
        },
        {
            id: "project_narrafirma_whatispni_header",
            valueType: "none",
            displayType: "header",
            displayPrompt: "What is participatory narrative inquiry?"
        },
        {
            id: "project_pniOverviewLabel",
            valueType: "none",
            displayType: "label",
            displayPrompt: `
                Participatory narrative inquiry (PNI) methods involve collecting stories from a community;
                reviewing, tagging, and thinking about those stories;
                and then returning that information back to the community for further discussion or additional iterations of the PNI process.
                PNI often works much better than typical surveys to get at the "ground truth" in a community.
                PNI helps people discover insights, catch emerging trends, make decisions, generate ideas, resolve conflicts, and connect people.
                PNI draws on theory and practice in narrative inquiry, participatory action research, oral history, mixed-methods research,
                participatory theatre, narrative therapy, sensemaking, complexity theory, and decision support.
                Its focus is on the exploration of values, beliefs, feelings, and perspectives through collaborative 
                sensemaking with stories of lived experience.
            `
        },
        
        {
            id: "project_narrafirma_whatdoesnfdo_header",
            valueType: "none",
            displayType: "header",
            displayPrompt: "How does NarraFirma help with PNI?"
        },
        {
            id: "project_usesLabel",
            valueType: "none",
            displayType: "html",
            displayPrompt: `
                NarraFirma is designed to support people using the PNI approach step-by-step as described in the WWS book.
                You can use NarraFirma to:\n
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
            <p>You can read more about the ideas behind NarraFirma at <a href="http://www.narrafirma.com">narrafirma.com</a>.</p>
            `
        },
        {
            id: "project_pniPhasesDiagramLabel",
            valueType: "none",
            displayType: "label",
            displayConfiguration: "",
            displayPrompt: `NarraFirma supports the six phases of the PNI process (as shown below).
                You can click on the buttons on the main dashboard (home) page to open a section on each PNI phase.
                Each phase is further subdivided into several pages that represent tasks.
                The Help link on any page will lead you to more information about that phase or task.
                The phases also correspond to chapters in the WWS book.
            `
        },
        {
            id: "project_pniPhasesDiagramImage",
            valueType: "none",
            displayType: "image",
            displayConfiguration: "images/PNIPhasesDiagram.png",
            displayName: "Diagram of PNI phases showing planning, collection, catalysis, sensemaking, intervention, and return",
            displayPrompt: ""
        },

        
        
        {
            id: "project_narrafirma_howcaniusenf_header",
            valueType: "none",
            displayType: "header",
            displayPrompt: "How can I use NarraFirma?"
        },
        {
            id: "project_narrafirmaSoftwareLink",
            valueType: "none",
            displayType: "html",
            displayPrompt: `
                If you want to host the NarraFirma software yourself,
                the source code is available under the GPL license on <a href="https://github.com/pdfernhout/narrafirma">GitHub</a>.
                You can install NarraFirma on a WordPress or node.js server.
                You can submit bug reports or feature requests at the GitHub project.
            `
        },
        
        {
            id: "project_narrafirma_wheredidnfcomefrom_header",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Where did NarraFirma come from?"
        },
        {
            id: "project_whoWroteNF",
            valueType: "none",
            displayType: "html",
            displayPrompt: `
                Cynthia Kurtz designed the overall NarraFirma application.
                Her husband <a href="http://pdfernhout.net">Paul Fernhout</a> designed the supporting architecture and wrote most of the code.
            `
        },

        {
            id: "project_narrafirma_howcanigethelp_header",
            valueType: "none",
            displayType: "header",
            displayPrompt: "How can I get help with NarraFirma?"
        },
        {
            id: "project_consultingLink",
            valueType: "none",
            displayType: "html",
            displayPrompt: `
                If you want some help, you can <a href="http://cfkurtz.com">contact Cynthia</a> for consulting or training on PNI projects and/or the NarraFirma software.
            `
        },

        
        {
            id: "project_narrafirma_whendoesnfsavedata_header",
            valueType: "none",
            displayType: "header",
            displayPrompt: "When does NarraFirma save my data? Where is the Save button?"
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

