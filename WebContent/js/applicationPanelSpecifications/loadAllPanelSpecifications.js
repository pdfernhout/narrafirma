define([
    "dojo/text!js/applicationPanelSpecifications/navigation.json",   
], function(
    navigationJSONText
) {
    "use strict";
    
    function loadAllPanelSpecifications(panelSpecificationCollection, callback) {
        // Load all the panels specified in navigation.json
        
        var loadingBase = "dojo/text!js/applicationPanelSpecifications/";
        
        var navigationSections = JSON.parse(navigationJSONText);
        
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
        
        console.log("requireList", requireList);
        
        // Asynchronous call that may take a while to get all the files
        require(requireList, function() {
            // Using "arguments" to get the results
            for (var panelIndex = 0; panelIndex < requireList.length; panelIndex++) {
                var panelJSONText = arguments[panelIndex];
                var panelInfo = panelMetadata[panelIndex];
                var panelSpecification = JSON.parse(panelJSONText);
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

    return loadAllPanelSpecifications;
});