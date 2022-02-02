import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "page_dashboard",
    displayName: "Home",
    panelFields: [
        {
            id: "project_homepage_label",
            valueType: "none",
            displayType: "html",
            displayPrompt: `This is the home page of your <a href="//www.workingwithstories.org" target="_blank">participatory narrative inquiry</a> project. 
                Click on any of the colored boxes below to work on that phase of your project.`
        },
        {
            id: "project_mainDashboardPNIPhasesDiagram",
            valueType: "none",
            displayType: "html",
            displayPrompt: `
            <img class=\"narrafirma-pni-phases-image\" src=\"images/PNIPhasesDiagram-trimmed.png\" alt=\"NarraFirma sections (click to navigate)\" usemap=\"#pniphasesmap\"></img>
            <map name=\"pniphasesmap\">
            <area shape=\"rect\" coords=\"2,116,132,236\" href=\"javascript:narrafirma_openPage('page_planning')\" alt=\"Planning\" 
            title=\"Click here to make decisions about how your project will proceed.\">
            
            <area shape=\"rect\" coords=\"285,20,415,138\" href=\"javascript:narrafirma_openPage('page_collection')\" alt=\"Collection\" 
            title=\"Click here to choose story collection methods, write questions, design sessions and forms, and collect stories.\">
            
            <area shape=\"rect\" coords=\"563,115,694,235\" href=\"javascript:narrafirma_openPage('page_catalysis')\" alt=\"Catalysis\" 
            title=\"Click here to look for patterns in stories and answers to questions.\">
            
            <area shape=\"rect\" coords=\"413,170,542,287\" href=\"javascript:narrafirma_openPage('page_sensemaking')\" alt=\"Sensemaking\" 
            title=\"Click here to help people use stories and patterns to think together.\">
            
            <area shape=\"rect\" coords=\"284,324,414,443\" href=\"javascript:narrafirma_openPage('page_intervention')\" alt=\"Intervention\" 
            title=\"Click here to plan and record interventions in the narrative life of the community or organization.\">
            
            <area shape=\"rect\" coords=\"152,171,282,289\" href=\"javascript:narrafirma_openPage('page_return')\" alt=\"Return\" 
            title=\"Click here to reflect on the project and support the return of stories to the community or organization.\">
            </map>`
        },

        {
            id: "project_mainDashboardStoryCollectionStatus",
            valueType: "none",
            displayType: "dashboardStoryCollectionStatusDisplay",
            displayPrompt: "Story collections"
        },


     ]
};

export = panel;

