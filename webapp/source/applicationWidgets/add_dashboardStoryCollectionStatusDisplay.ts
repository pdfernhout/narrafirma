import translate = require("../panelBuilder/translate");
import PanelBuilder = require("../panelBuilder/PanelBuilder");
import surveyCollection = require("../surveyCollection");
import Project = require("../Project");
import m = require("mithril");
import Globals = require("../Globals");

"use strict";

function mithrilArrayForListOfThingsAndLink(name, list, page) {
    if (!list || list.length == 0) return null;
    const count = list.length;
    var text = "" + count + " " + name;
    if (count != 1) text += "s";
    return [m("a", {href: 'javascript:narrafirma_openPage("' + page + '")', title: text}, text), m("br")];  
}

function add_dashboardStoryCollectionStatusDisplay(panelBuilder: PanelBuilder, model, fieldSpecification): any {
    var resultItems = [];
    var tripleStore = Globals.project().tripleStore;
    var newItems = null;

    // eliciting questions
    var elicitingQuestionIdentifiers = Globals.project().getListForField("project_elicitingQuestionsList");
    newItems = mithrilArrayForListOfThingsAndLink("Eliciting question", elicitingQuestionIdentifiers, "page_writeStoryElicitingQuestions");
    if (newItems) resultItems = resultItems.concat(newItems);

    // questions about stories
    var storyQuestionIdentifiers = Globals.project().getListForField("project_storyQuestionsList");
    newItems = mithrilArrayForListOfThingsAndLink("Story question", storyQuestionIdentifiers, "page_writeQuestionsAboutStories");
    if (newItems) resultItems = resultItems.concat(newItems);

    // questions about participants
    var participantQuestionIdentifiers = Globals.project().getListForField("project_participantQuestionsList");
    newItems = mithrilArrayForListOfThingsAndLink("Participant question", participantQuestionIdentifiers, "page_writeQuestionsAboutParticipants");
    if (newItems) resultItems = resultItems.concat(newItems);

    // annotation questions
    var annotationQuestionIdentifiers = Globals.project().getListForField("project_annotationQuestionsList");
    newItems = mithrilArrayForListOfThingsAndLink("Annotation question", annotationQuestionIdentifiers, "page_writeAnnotationsAboutParticipants");
    if (newItems) resultItems = resultItems.concat(newItems);

    // story forms
    var storyFormIdentifiers = Globals.project().getListForField("project_storyForms");
    newItems = mithrilArrayForListOfThingsAndLink("Story form", storyFormIdentifiers, "page_designStoryForms");
    if (newItems) resultItems = resultItems.concat(newItems);

    // catalysis reports
    var catalysisReportIdentifiers = Globals.project().getListForField("project_catalysisReports");
    newItems = mithrilArrayForListOfThingsAndLink("Catalysis report", catalysisReportIdentifiers, "page_configureCatalysisReport");
    if (newItems) resultItems = resultItems.concat(newItems);

    // story collections
    var storyCollectionsIdentifiers = Globals.project().getListForField("project_storyCollections");
    if (storyCollectionsIdentifiers && storyCollectionsIdentifiers.length) {
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
        
        var storyCollectionItems =  [
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
            )];
        }
        resultItems = resultItems.concat(storyCollectionItems);

    if (resultItems.length && resultItems[0]) {
        resultItems.unshift(m("p", "Quick links:"));
    }
    
    // project admin
    resultItems = resultItems.concat([m("br"), m("a", {href: 'javascript:narrafirma_openPage("page_administration")', title: "Project administration"}, "Project administration"), m("br")]); 

    // choose another project
    var chooseProjectLink;
    var isWordPressAJAX = !!window["ajaxurl"];
    if (!isWordPressAJAX) {
        chooseProjectLink = "\\start";
    } else {
        chooseProjectLink = "../webapp/narrafirma.html";
    }
    resultItems = resultItems.concat([m("br"), m("a", {href: chooseProjectLink, title: "Choose another project"}, "Choose another project"), m("br")]); 

    return m("div.narrafirma-dashboard-story-collection-status", resultItems);

}

export = add_dashboardStoryCollectionStatusDisplay;
