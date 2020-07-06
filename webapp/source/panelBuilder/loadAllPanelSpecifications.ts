import kludgeForUseStrict = require("../kludgeForUseStrict");
"use strict";

// Setup all the panels from TypeScript files specified in navigationSections array
// see navigation.ts for an example of the format
// The "panels" are child panels used by grids and similar widgets on the page (including recursively)
/*
 [
     {
        "section": "planning",
        "sectionName": "Planning",
        "pages": [
            "page_planning",
             "page_participantGroups",
             ...
        ],
        "panels": [
            "panel_addParticipantGroup",
            ...
        ]
     }, ...
 ]
 */

function loadAllPanelSpecifications(panelSpecificationCollection, navigationSections, loadingBase, callback) {
    const panelMetadata = [];
    const navigationModules = navigationSections["navigationModules"];
    let panelSpecification;
    
    for (let sectionIndex = 0; sectionIndex < navigationSections.length; sectionIndex++) {
        const sectionInfo = navigationSections[sectionIndex];
        let pageIndex
        for (pageIndex = 0; pageIndex < sectionInfo.pages.length; pageIndex++) {
            const pageID = sectionInfo.pages[pageIndex];
            panelSpecification = navigationModules[pageID];
            if (panelSpecification.id !== pageID) {
                console.log("pageID mismatch; expected:", pageID, panelSpecification);
                throw new Error("pageID does not match id in file for pae: " + pageID);
            }
            panelSpecification.section = sectionInfo.section;
            panelSpecification.isHeader = pageIndex === 0 || false;
            panelSpecification.displayType = "page";
            panelSpecificationCollection.addPanelSpecification(panelSpecification);
        }
        if (sectionInfo.panels) {
            for (let extraPanelIndex = 0; extraPanelIndex < sectionInfo.panels.length; extraPanelIndex++) {
                const extraPanelID = sectionInfo.panels[extraPanelIndex];
                panelSpecification = navigationModules[extraPanelID];
                if (panelSpecification.id !== extraPanelID) {
                    console.log("panelID mismatch; expected:", extraPanelID, panelSpecification);
                    throw new Error("panelID does not match id in file for panel: " + extraPanelID);
                }
                panelSpecification.section = sectionInfo.section;
                panelSpecification.isHeader = pageIndex === 0 || false;
                panelSpecification.displayType = "panel";
                panelSpecificationCollection.addPanelSpecification(panelSpecification);
            }
        }
    }
    
    // TODO: Legacy: Used to be asynchronous require, but now page and panel modules are loaded at startup
    callback();
}

export = loadAllPanelSpecifications;