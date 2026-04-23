import kludgeForUseStrict = require("../../kludgeForUseStrict");
//import phasesSVG = require("../../../images/nf_front_page.svg");

"use strict";

const panel: Panel = {
    id: "page_dashboard",
    displayName: "Home",
    panelFields: [
        {
            id: "project_homepage_label",
            valueType: "none",
            displayType: "html",
            displayPrompt: `
            Click to navigate to the phases of your <a href="https://www.workingwithstories.org" target="_blank">PNI</a> project:
                <a href="javascript:narrafirma_openPage('page_planning')">Planning</a>,
                <a href="javascript:narrafirma_openPage('page_collection')">Collection</a>,
                <a href="javascript:narrafirma_openPage('page_catalysis')">Catalysis</a>,
                <a href="javascript:narrafirma_openPage('page_sensemaking')">Sensemaking</a>,
                <a href="javascript:narrafirma_openPage('page_intervention')">Intervention</a>, and
                <a href="javascript:narrafirma_openPage('page_return')">Return</a>.
                `
        },
        {
            id: "project_mainDashboardPNIPhasesDiagram",
            valueType: "none",
            displayType: "html",
            displayPrompt: `
            <img class=\"narrafirma-pni-phases-image\" src=\"images/nf_front_page.png\" width="700" alt=\"NarraFirma sections (click to navigate)\" usemap=\"#pniphasesmap\"></img>
            <map name=\"pniphasesmap\">
            <area shape=\"rect\" coords=\"33,117,154,228\" href=\"javascript:narrafirma_openPage('page_planning')\" alt=\"Planning\">
            <area shape=\"rect\" coords=\"295,11,419,150\" href=\"javascript:narrafirma_openPage('page_collection')\" alt=\"Collection\">
            <area shape=\"rect\" coords=\"548,112,672,225\" href=\"javascript:narrafirma_openPage('page_catalysis')\" alt=\"Catalysis\">
            <area shape=\"rect\" coords=\"410,227,537,367\" href=\"javascript:narrafirma_openPage('page_sensemaking')\" alt=\"Sensemaking\">
            <area shape=\"rect\" coords=\"287,380,426,492\" href=\"javascript:narrafirma_openPage('page_intervention')\" alt=\"Intervention\">
            <area shape=\"rect\" coords=\"176,226,301,367\" href=\"javascript:narrafirma_openPage('page_return')\" alt=\"Return\">
            </map>
            `
            },
        {
            id: "project_mainDashboardStoryCollectionStatus",
            valueType: "none",
            displayType: "dashboardStoryCollectionStatusDisplay",
            displayPrompt: "Story collections"
        },
     ]
};

// cfk testing svg image map
//<object type="image/svg+xml" width="600" height="600" data="images/nf_front_page.svg">     4
            //    <img width="600" height="600" src="PNIPhasesDiagram-trimmed.png" alt="PNI phases"/>     5
            //</object>`
            //class=\"narrafirma-pni-phases-image\" src=\"images/nf_front_page.svg\" alt=\"NarraFirma sections (click to navigate)\"></svg>
            //<svg viewBox="0 0 800 800">
            //<use xlink:href="images/nf_front_page.svg#svg"></use>
            //</svg>


export = panel;

