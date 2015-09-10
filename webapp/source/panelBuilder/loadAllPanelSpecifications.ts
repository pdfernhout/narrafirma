import kludgeForUseStrict = require("../kludgeForUseStrict");
"use strict";

// To suppress TypeScript error on require statement
declare var require: (moduleId: string[], any) => any;

// Load all the panels from TypeScript files specified in navigationSections array
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

// loadingBase should be something like:
// var loadingBase = "lib/text!js/applicationPanelSpecifications/";

function loadAllPanelSpecifications(panelSpecificationCollection, navigationSections, loadingBase, callback) {
    // console.log("loadAllPanelSpecifications", loadingBase, navigationSections);
    var requireList = [];
    var panelMetadata = [];
    
    for (var sectionIndex = 0; sectionIndex < navigationSections.length; sectionIndex++) {
        var sectionInfo = navigationSections[sectionIndex];
        for (var pageIndex = 0; pageIndex < sectionInfo.pages.length; pageIndex++) {
            var pageID = sectionInfo.pages[pageIndex];
            requireList.push(loadingBase + sectionInfo.section + "/" + pageID + ".js");
            panelMetadata.push({
                panelID: pageID,
                section: sectionInfo.section
            });
        }
        if (sectionInfo.panels) {
            for (var extraPanelIndex = 0; extraPanelIndex < sectionInfo.panels.length; extraPanelIndex++) {
                var extraPanelID = sectionInfo.panels[extraPanelIndex];
                requireList.push(loadingBase + sectionInfo.section + "/" + extraPanelID + ".js");
                panelMetadata.push({
                    panelID: extraPanelID,
                    section: sectionInfo.section
                });
            }
        }
    }
    
    // console.log("requireList", requireList);
    
    // Asynchronous call that may take a while to get all the files
    require(requireList, function() {
        // Using "arguments" to get the results
        for (var panelIndex = 0; panelIndex < requireList.length; panelIndex++) {
            var panelInfo = panelMetadata[panelIndex];
            var panelSpecification = arguments[panelIndex];

            if (panelSpecification.id !== panelInfo.panelID) {
                console.log("panelID mismatch", panelInfo, panelSpecification);
                throw new Error("panelID does not match id in file for panel: " + panelInfo.panelID);
            }
            // panelSpecification.section = panelInfo.section;
            // panelSpecification.displayName = panelInfo.panelName;
            panelSpecificationCollection.addPanelSpecification(panelSpecification);
        }
        callback();
    });
}

export = loadAllPanelSpecifications;