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
    let text = "" + count + " " + name;
    if (count != 1) text += "s";
    return [m("a.narrafirma-home-page-link", {href: 'javascript:narrafirma_openPage("' + page + '")', title: text, tabindex: 0}, text)];  
}

function add_dashboardStoryCollectionStatusDisplay(panelBuilder: PanelBuilder, model, fieldSpecification): any {
    let resultItems = [];
    const tripleStore = Globals.project().tripleStore;
    let newItems = null;

    // eliciting questions
    const elicitingQuestionIdentifiers = Globals.project().getListForField("project_elicitingQuestionsList");
    newItems = mithrilArrayForListOfThingsAndLink("Eliciting question", elicitingQuestionIdentifiers, "page_writeStoryElicitingQuestions");
    if (newItems) resultItems = resultItems.concat(newItems);

    // questions about stories
    const storyQuestionIdentifiers = Globals.project().getListForField("project_storyQuestionsList");
    newItems = mithrilArrayForListOfThingsAndLink("Story question", storyQuestionIdentifiers, "page_writeQuestionsAboutStories");
    if (newItems) resultItems = resultItems.concat(newItems);

    // questions about participants
    const participantQuestionIdentifiers = Globals.project().getListForField("project_participantQuestionsList");
    newItems = mithrilArrayForListOfThingsAndLink("Participant question", participantQuestionIdentifiers, "page_writeQuestionsAboutParticipants");
    if (newItems) resultItems = resultItems.concat(newItems);

    // annotation questions
    const annotationQuestionIdentifiers = Globals.project().getListForField("project_annotationQuestionsList");
    newItems = mithrilArrayForListOfThingsAndLink("Annotation question", annotationQuestionIdentifiers, "page_writeAnnotationsAboutStories");
    if (newItems) resultItems = resultItems.concat(newItems);

    // story forms
    const storyFormIdentifiers = Globals.project().getListForField("project_storyForms");
    newItems = mithrilArrayForListOfThingsAndLink("Story form", storyFormIdentifiers, "page_designStoryForms");
    if (newItems) resultItems = resultItems.concat(newItems);

    // catalysis reports
    const catalysisReportIdentifiers = Globals.project().getListForField("project_catalysisReports");
    newItems = mithrilArrayForListOfThingsAndLink("Catalysis report", catalysisReportIdentifiers, "page_configureCatalysisReport");
    if (newItems) resultItems = resultItems.concat(newItems);

    // story collections
    const storyCollectionsIdentifiers = Globals.project().getListForField("project_storyCollections");
    let storyCollectionItems =  [];

    if (storyCollectionsIdentifiers && storyCollectionsIdentifiers.length) {
        const storyCollections = storyCollectionsIdentifiers.map(function(storyCollectionIdentifier) {
            const shortName = tripleStore.queryLatestC(storyCollectionIdentifier, "storyCollection_shortName");
            const allStoriesInStoryCollection = surveyCollection.getStoriesForStoryCollection(shortName);
            const storyCount = allStoriesInStoryCollection.length;
            const activeOnWeb = tripleStore.queryLatestC(storyCollectionIdentifier, "storyCollection_activeOnWeb");
            if (activeOnWeb) {
                console.log("active on web: ", shortName, storyCollectionIdentifier);
            }
            const surveyURL = activeOnWeb ? surveyCollection.urlForSurveyAsString(storyCollectionIdentifier) : "";
            const reviewStoriesURL = surveyCollection.urlForStoryCollectionReview(storyCollectionIdentifier, "reviewIncomingStories");
            const browseGraphsURL = surveyCollection.urlForStoryCollectionReview(storyCollectionIdentifier, "browseGraphs");
            
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
            const aName = a.shortName || "";
            const bName = b.shortName || "";
            return aName.localeCompare(bName);
        });
        
        storyCollectionItems =  [
            m("br"),
            m("table", 
                m("tr", [
                    m("th", "Story collection"),
                    m("th", "stories"), 
                    m("th", "active?") 
                ]),
                storyCollections.map(function(storyCollection) {
                    const reviewStories = m("a[id=narrafirma-review-stories-url]", 
                        {href: storyCollection.reviewStoriesURL, title: "Click here to view the stories in this collection.", tabindex: 0}, storyCollection.shortName);
                        const reviewGraphs = m("a[id=narrafirma-review-graphs-url]", 
                        {href: storyCollection.browseGraphsURL, title: "Click here to review graphs in this collection.", tabindex: 0}, <any>storyCollection.storyCount);
                        const surveyActive = storyCollection.activeOnWeb ? m("a[id=narrafirma-survey-url]", 
                        {href: storyCollection.surveyURL, target: "_blank", title: "Click here to launch the survey for this collection.", tabindex: 0}, "yes") : "no";
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
        resultItems.unshift(m("p", {style: "margin-top: 0"}, "Quick links for: " + Globals.project().projectNameOrNickname()));
    }

    // section links (to use if can't click on image)
    const sectionLinks = [
        m("p"),
        m("a.narrafirma-home-page-section-link", {href: 'javascript:narrafirma_openPage("page_planning")', title: "Go to planning section", tabindex: 0}, "Planning"),
        m("a.narrafirma-home-page-section-link", {href: 'javascript:narrafirma_openPage("page_collection")', title: "Go to collection section", tabindex: 0}, "Collection"),
        m("a.narrafirma-home-page-section-link", {href: 'javascript:narrafirma_openPage("page_catalysis")', title: "Go to catalysis section", tabindex: 0}, "Catalysis"),
        m("a.narrafirma-home-page-section-link", {href: 'javascript:narrafirma_openPage("page_sensemaking")', title: "Go to sensemaking section", tabindex: 0}, "Sensemaking"),
        m("a.narrafirma-home-page-section-link", {href: 'javascript:narrafirma_openPage("page_intervention")', title: "Go to intervention section", tabindex: 0}, "Intervention"),
        m("a.narrafirma-home-page-section-link", {href: 'javascript:narrafirma_openPage("page_return")', title: "Go to return section", tabindex: 0}, "Return"),

    ];
    resultItems = resultItems.concat(sectionLinks); 
    
    // project admin
    resultItems = resultItems.concat([m("p"), m("a.narrafirma-home-page-link", {href: 'javascript:narrafirma_openPage("page_administration")', title: "Project administration", tabindex: 0}, "Project administration")]); 

    // choose another project
    let chooseProjectLink;
    const isWordPressAJAX = !!window["ajaxurl"];
    if (!isWordPressAJAX) {
        chooseProjectLink = "\\";
    } else {
        chooseProjectLink = "../webapp/narrafirma.html";
    }
    resultItems = resultItems.concat([m("a.narrafirma-home-page-link", {href: chooseProjectLink, title: "Choose another project", tabindex: 0}, "Choose another project")]); 

    // site admin
    if (Globals.project().currentUserIsSuperUser) {
        // no need to get WordPress URL because superuser account does not exist there
        resultItems = resultItems.concat([m("a.narrafirma-home-page-link", {href: "\\admin.html", title: "Site administration", tabindex: 0}, "Site administration"), m("br")]); 
    }

    return m("div.narrafirma-dashboard-story-collection-status", resultItems);
}

export = add_dashboardStoryCollectionStatusDisplay;
