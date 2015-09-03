import kludgeForUseStrict = require("../kludgeForUseStrict");
"use strict";

// To suppress TypeScript error on require statement
declare var require: (moduleId: string[], any) => any;

// Load all the panels from JSON files specified in navigationSections array
// see navigation.json for an example of the format
// The "extraPanels" are child panels used by grids and similar widgets on the page (including recursively)
/*
 [
     {
        "section": "planning",
        "sectionName": "Planning",
        "pages": [
            {
                "panelID": "page_planning",
                "panelName": "Planning"
            },
            {
                "panelID": "page_participantGroups",
                "panelName": "Describe participant groups",
                "extraPanels": [
                    {
                        "panelID": "panel_addParticipantGroup",
                        "panelName": "Participant group"
                    }
                ]
            }, ...
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
            var page = sectionInfo.pages[pageIndex];
            requireList.push(loadingBase + sectionInfo.section + "/" + page.panelID + ".json");
            page.section = sectionInfo.section;
            panelMetadata.push(page);
            if (page.extraPanels) {
                for (var extraPanelIndex = 0; extraPanelIndex < page.extraPanels.length; extraPanelIndex++) {
                    var extraPanel = page.extraPanels[extraPanelIndex];
                    requireList.push(loadingBase + sectionInfo.section + "/" + extraPanel.panelID + ".json");
                    extraPanel.section = sectionInfo.section;
                    panelMetadata.push(extraPanel);
                }
            }
        }
    }
    
    // console.log("requireList", requireList);
    
    // Asynchronous call that may take a while to get all the files
    require(requireList, function() {
        // Using "arguments" to get the results
        for (var panelIndex = 0; panelIndex < requireList.length; panelIndex++) {
            var panelJSONText = arguments[panelIndex];
            var panelInfo = panelMetadata[panelIndex];
            var panelSpecification;
            try {
                panelSpecification = JSON.parse(panelJSONText);
            } catch (e) {
                console.log("Parsing problem for page or panel", panelInfo);
                throw e;
            }
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