import translate = require("../panelBuilder/translate");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
import surveyCollection = require("../surveyCollection");
import Project = require("../Project");
import m = require("mithril");
import Globals = require("../Globals");

"use strict";

function add_dashboardStoryCollectionStatusDisplay(panelBuilder: PanelBuilder, model, fieldSpecification): any {
    var tripleStore = Globals.project().tripleStore;
    var storyCollectionsIdentifiers = Globals.project().getListForField("project_storyCollections");
    var chooseProjectLink;
    var isWordPressAJAX = !!window["ajaxurl"];
    if (!isWordPressAJAX) {
        chooseProjectLink = "\\";
    } else {
        chooseProjectLink = "../webapp/narrafirma.html";
    }

    if (!storyCollectionsIdentifiers || !storyCollectionsIdentifiers.length) {
        // TODO: Translate
        return m("div.narrafirma-dashboard-story-collection-status", [
            m("a", {href: chooseProjectLink, title: "Choose another project"}, "Choose another project"), 
            m("br"),    
            m("br"),    
            m("div", ["No story collections defined"])
        ]);
    }

    var storyCollections = storyCollectionsIdentifiers.map(function(storyCollectionIdentifier) {
        var shortName = tripleStore.queryLatestC(storyCollectionIdentifier, "storyCollection_shortName");
        var allStoriesInStoryCollection = surveyCollection.getStoriesForStoryCollection(shortName);
        var storyCount = allStoriesInStoryCollection.length;
        var activeOnWeb = tripleStore.queryLatestC(storyCollectionIdentifier, "storyCollection_activeOnWeb");
        if (activeOnWeb) {
            console.log("active on web: ", shortName, storyCollectionIdentifier);
        }
        var surveyURL = activeOnWeb ? surveyCollection.urlForSurveyAsString(storyCollectionIdentifier) : "";
        return {
            id: storyCollectionIdentifier,
            shortName: shortName,
            storyCount: storyCount,
            activeOnWeb: activeOnWeb,
            surveyURL: surveyURL
        };
    });
    
    storyCollections.sort(function(a, b) {
        var aName = a.shortName || "";
        var bName = b.shortName || "";
        return aName.localeCompare(bName);
    });
    
    return m("div.narrafirma-dashboard-story-collection-status", [
        m("a", {href: chooseProjectLink, title: "Choose another project"}, "Choose another project"), 
        m("br"),       
        m("p", "Story collections"),
        m("table", 
            m("tr", [
                m("th", "Collection"),
                m("th", "Active?"),
                m("th", "# Stories") ]),
            storyCollections.map(function(storyCollection) {
                var surveyActive = storyCollection.activeOnWeb ? m("a[id=narrafirma-survey-url]", {href: storyCollection.surveyURL, target: "_blank"}, "yes") : "no";
                return m("tr", [
                    m("td", storyCollection.shortName),
                    
                    m("td", surveyActive),
                    m("td", {style: "text-align: right;"}, <any>storyCollection.storyCount),
                ]);
            })
        )
    ]);

}

export = add_dashboardStoryCollectionStatusDisplay;
