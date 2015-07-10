import translate = require("../panelBuilder/translate");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
import surveyCollection = require("../surveyCollection");
import Project = require("../Project");
import m = require("mithril");

"use strict";

function add_dashboardStoryCollectionStatusDisplay(panelBuilder: PanelBuilder, model, fieldSpecification): any {
    var tripleStore = panelBuilder.project.tripleStore;
    var storyCollections = panelBuilder.project.getListForField("project_storyCollections");
    if (!storyCollections || !storyCollections.length) {
        // TODO: Translate
        return m("div", ["No story collections defined"]);
    }
    
    return m("div.narrafirma-dashboard-story-collection-status", [
        m("i", "Story collections:"),
        m("br"),
        m("table", 
            m("tr", [m("th", "Name"), m("th", "Count"), m("th", "Active?")]),
            storyCollections.map(function(storyCollectionIdentifier) {
            var shortName = tripleStore.queryLatestC(storyCollectionIdentifier, "storyCollection_shortName");
            var allStoriesInStoryCollection = surveyCollection.getStoriesForStoryCollection(shortName);
            var storyCount = allStoriesInStoryCollection.length;
            var activeOnWeb = tripleStore.queryLatestC(storyCollectionIdentifier, "storyCollection_activeOnWeb");
            var surveyActive = activeOnWeb ? m("a", {href: activeOnWeb, target: "_blank"}, "active") : "";
            return m("tr", [
                m("td", shortName),
                m("td", {style: "text-align: right;"}, storyCount),
                m("td", surveyActive),
            ]);
        }))
    ]);

}

export = add_dashboardStoryCollectionStatusDisplay;
