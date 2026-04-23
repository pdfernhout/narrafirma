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
    return [m("a.narrafirma-home-page-quicklink", {href: 'javascript:narrafirma_openPage("' + page + '")', tabindex: 0}, text)];  
}

function add_dashboardStoryCollectionStatusDisplay(panelBuilder: PanelBuilder, model, fieldSpecification): any {
    let resultItems = [];
    const tripleStore = Globals.project().tripleStore;
    let newItems = null;

    resultItems.push(m("p", {class: "narrafirma-quick-links"}, "Quick links"));

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
            let answerCount = 0;
            allStoriesInStoryCollection.map(function (story) { answerCount += story.storyAnswersCount(); });
            const activeOnWeb = tripleStore.queryLatestC(storyCollectionIdentifier, "storyCollection_activeOnWeb");
            if (activeOnWeb) {
                console.log("active on web: ", shortName, storyCollectionIdentifier);
            }
            const surveyURL = activeOnWeb ? surveyCollection.urlForSurveyAsString(storyCollectionIdentifier) : "";
            const reviewStoriesURL = surveyCollection.urlForStoryCollectionReview(storyCollectionIdentifier, "reviewIncomingStories");
            const browseGraphsURL = surveyCollection.urlForStoryCollectionReview(storyCollectionIdentifier, "browseGraphs");
            const startStoryCollectionURL = surveyCollection.urlForStoryCollectionReview(storyCollectionIdentifier, "startStoryCollection");
            
            return {
                id: storyCollectionIdentifier,
                shortName: shortName,
                storyCount: storyCount,
                answerCount: answerCount,
                activeOnWeb: activeOnWeb,
                surveyURL: surveyURL,
                reviewStoriesURL: reviewStoriesURL,
                browseGraphsURL: browseGraphsURL,
                startStoryCollectionURL: startStoryCollectionURL
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
                    m("th", "Collection"),
                    m("th", "stories"), 
                    m("th", "answers"),
                    m("th", "active?") 
                ]),
                storyCollections.map(function(storyCollection) {
                    const collectionNameLine = m("span.narrafirma-dashboard-story-collection-name", storyCollection.shortName);
                    const storiesLine = m("a[id=narrafirma-review-stories-url]", 
                        {href: storyCollection.reviewStoriesURL, tabindex: 0}, <any>storyCollection.storyCount);
                    const answersLine = m("a[id=narrafirma-review-graphs-url]", 
                        {href: storyCollection.browseGraphsURL, tabindex: 0}, <any>storyCollection.answerCount);
                    const surveyActive = storyCollection.activeOnWeb ? 
                        m("a[id=narrafirma-survey-url]",  {href: storyCollection.surveyURL, target: "_blank", tabindex: 0}, "yes")
                        : 
                        m("a[id=narrafirma-start-collections-url]", {href: storyCollection.startStoryCollectionURL, tabindex: 0}, "no");
                    return m("tr", [
                        m("td", collectionNameLine),
                        m("td", {style: "text-align: center;"}, storiesLine),
                        m("td", {style: "text-align: center;"}, answersLine),
                        m("td", {style: "text-align: center;"}, surveyActive),
                    ]);
                })
            )];
        }
        resultItems = resultItems.concat(storyCollectionItems);
    
    // project admin
    resultItems = resultItems.concat([m("p"), m("a.narrafirma-home-page-adminlink", {href: 'javascript:narrafirma_openPage("page_administration")', tabindex: 0}, "Project administration")]); 

    // choose another project
    let chooseProjectLink;
    const isWordPressAJAX = !!window["ajaxurl"];
    if (!isWordPressAJAX) {
        chooseProjectLink = "\\";
    } else {
        chooseProjectLink = "../webapp/narrafirma.html";
    }
    resultItems = resultItems.concat([m("a.narrafirma-home-page-adminlink", {href: chooseProjectLink, tabindex: 0}, "Choose another project")]); 

    // site admin
    if (Globals.project().currentUserIsSuperUser) {
        // no need to get WordPress URL because superuser account does not exist there
        resultItems = resultItems.concat([m("a.narrafirma-home-page-adminlink", {href: "\\admin.html", tabindex: 0}, "Site administration"), m("br")]); 
    }

    return m("div.narrafirma-dashboard-story-collection-status", resultItems);
}

export = add_dashboardStoryCollectionStatusDisplay;
