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
        var reviewStoriesURL = surveyCollection.urlForStoryCollectionReview(storyCollectionIdentifier, "reviewIncomingStories");
        var browseGraphsURL = surveyCollection.urlForStoryCollectionReview(storyCollectionIdentifier, "browseGraphs");
        
        return {
            id: storyCollectionIdentifier,
            shortName: shortName,
            storyCount: storyCount,
            activeOnWeb: activeOnWeb,
            surveyURL: surveyURL,
            reviewStoriesURL: reviewStoriesURL,
            browseGraphsURL: browseGraphsURL
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
        m("br"),
        m("table", 
            m("tr", [
                m("th", "Story collection"),
                m("th", "stories"), 
                m("th", "active?") 
            ]),
            storyCollections.map(function(storyCollection) {
                var reviewStories = m("a[id=narrafirma-review-stories-url]", 
                    {href: storyCollection.reviewStoriesURL, title: "Click here to view the stories in this collection."}, storyCollection.shortName);
                var reviewGraphs = m("a[id=narrafirma-review-stories-url]", 
                    {href: storyCollection.browseGraphsURL, title: "Click here to review graphs in this collection."}, <any>storyCollection.storyCount);
                var surveyActive = storyCollection.activeOnWeb ? m("a[id=narrafirma-survey-url]", 
                    {href: storyCollection.surveyURL, target: "_blank", title: "Click here to launch the survey for this collection."}, "yes") : "no";
                return m("tr", [
                    m("td", reviewStories),
                    m("td", {style: "text-align: center;"}, reviewGraphs),
                    m("td", {style: "text-align: center;"}, surveyActive),
                ]);
            })
        )
    ]);

}

export = add_dashboardStoryCollectionStatusDisplay;
