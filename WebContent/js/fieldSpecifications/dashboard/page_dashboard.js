define([], function() {
    "use strict";
    return [
        {
            id: "page_dashboard",
            displayName: "Dashboard",
            displayType: "page",
            isHeader: true,
            section: "dashboard",
            modelClass: "ProjectModel"
        },
        {
            id: "project_mainDashboardLabel",
            dataType: "none",
            displayType: "label",
            displayPrompt: "Welcome to NarraFirma. You can use this software to:\n<ul>\n<li>plan your Participatory Narrative Inquiry (PNI) project</li>\n<li>decide how you will collect stories</li>\n<li>write questions about stories</li>\n<li>plan group story sessions (and record what went on in them)</li>\n<li>collect or enter stories (and answers to questions)</li>\n<li>look at patterns in collected stories and answers</li>\n<li>build catalytic material</li>\n<li>plan sensemaking sessions (and record what went on in them)</li>\n<li>plan interventions (and record what went on in them)</li>\n<li>gather project feedback</li>\n<li>reflect on the project</li>\n<li>present the project to others</li>\n<li>preserve what you learned so you can use it on the next project</li>\n</ul>\n<p>Note: When finished, this page will bring together all of the dashboard pages from\nthe phases of the project.</p>"
        },
        {
            id: "project_testImage",
            dataType: "none",
            displayType: "image",
            displayConfiguration: "images/WWS_BookCover_front_small.png",
            displayPrompt: "This software is a companion for the book \"Working with Stories in  Your Community or Organization\" by Cynthia F. Kurtz"
        }
    ];
});
