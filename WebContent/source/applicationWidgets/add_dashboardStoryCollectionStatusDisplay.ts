import translate = require("../panelBuilder/translate");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
import surveyCollection = require("../surveyCollection");
import Project = require("../Project");
import m = require("mithril");

"use strict";

function add_dashboardStoryCollectionStatusDisplay(panelBuilder: PanelBuilder, model, fieldSpecification): any {
    var tripleStore = panelBuilder.project.tripleStore;
    var storyCollectionsIdentifiers = panelBuilder.project.getListForField("project_storyCollections");
    if (!storyCollectionsIdentifiers || !storyCollectionsIdentifiers.length) {
        // TODO: Translate
        return m("div", ["No story collections defined"]);
    }
    
    var storyCollections = storyCollectionsIdentifiers.map(function(storyCollectionIdentifier) {
        var shortName = tripleStore.queryLatestC(storyCollectionIdentifier, "storyCollection_shortName");
        var allStoriesInStoryCollection = surveyCollection.getStoriesForStoryCollection(shortName);
        var storyCount = allStoriesInStoryCollection.length;
        var activeOnWeb = tripleStore.queryLatestC(storyCollectionIdentifier, "storyCollection_activeOnWeb");
        var surveyActive = activeOnWeb ? m("a", {href: activeOnWeb, target: "_blank"}, "active") : "";
        return {
            id: storyCollectionIdentifier,
            shortName: shortName,
            storyCount: storyCount,
            activeOnWeb: activeOnWeb
        };
    });
    
    storyCollections.sort(function(a, b) {
        var aName = a.shortName || "";
        var bName = b.shortName || "";
        return aName.localeCompare(bName);
    });
    
    return m("div.narrafirma-dashboard-story-collection-status", [
        m("p", "Story collections:"),
        m("table", 
            m("tr", [m("th", "Name"), m("th", "#"), m("th", "Active?")]),
            storyCollections.map(function(storyCollection) {
                var surveyActive = storyCollection.activeOnWeb ? m("a", {href: storyCollection.activeOnWeb, target: "_blank"}, "active") : "";
                return m("tr", [
                    m("td", storyCollection.shortName),
                    m("td", {style: "text-align: right;"}, storyCollection.storyCount),
                    m("td", surveyActive),
                ]);
            })
        )
    ]);

}

export = add_dashboardStoryCollectionStatusDisplay;
