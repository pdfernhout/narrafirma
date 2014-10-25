"use strict";

define([
    "js/widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_header(contentPane, model, "outcomes_hopesHeader");
        widgets.add_select(contentPane, model, "outcomes_peopleFeltHeard", ["never","occasionally","sometimes","often","mixed"]);
        widgets.add_select(contentPane, model, "outcomes_peopleFeltInvolved", ["never","occasionally","sometimes","often","mixed"]);
        widgets.add_select(contentPane, model, "outcomes_peopleLearnedAboutCommOrg", ["never","occasionally","sometimes","often","mixed"]);
        widgets.add_header(contentPane, model, "outcomes_voicesHeader");
        widgets.add_select(contentPane, model, "outcomes_peopleWantedToTellMoreStories", ["never","occasionally","sometimes","often","mixed"]);
        widgets.add_select(contentPane, model, "outcomes_peopleWantedToShareMoreStoriesWithEachOther", ["never","occasionally","sometimes","often","mixed"]);
        widgets.add_select(contentPane, model, "outcomes_peopleFeltStoriesNeededToBeHeard", ["not at all","somewhat","definitely","mixed"]);
        widgets.add_select(contentPane, model, "outcomes_peopleFeltNobodyCares", ["not at all","somewhat","definitely","mixed"]);
        widgets.add_header(contentPane, model, "outcomes_needsHeader");
        widgets.add_select(contentPane, model, "outcomes_peopleFeltNobodyCanMeetNeeds", ["not at all","somewhat","definitely","mixed"]);
        widgets.add_select(contentPane, model, "outcomes_peopleFeltTheyNeedNewStories", ["not at all","somewhat","definitely","mixed"]);
        widgets.add_select(contentPane, model, "outcomes_peopleWantedToKeepExploring", ["not at all","somewhat","definitely","mixed"]);
        widgets.add_select(contentPane, model, "outcomes_crisisPointsWereFound", ["not at all","somewhat","definitely","mixed"]);
        widgets.add_select(contentPane, model, "outcomes_issuesWereBeyondWords", ["not at all","somewhat","definitely","mixed"]);
        widgets.add_header(contentPane, model, "outcomes_learningHeader");
        widgets.add_select(contentPane, model, "outcomes_peopleLarnedAboutTopic", ["never","occasionally","sometimes","often","mixed"]);
        widgets.add_select(contentPane, model, "outcomes_issuesNewMembersStruggleWith", ["not at all","somewhat","definitely","mixed"]);
        widgets.add_select(contentPane, model, "outcomes_foundInfoWithoutUnderstanding", ["not at all","somewhat","definitely","mixed"]);
        widgets.add_select(contentPane, model, "outcomes_foundOverConfidence", ["not at all","somewhat","definitely","mixed"]);
        widgets.add_select(contentPane, model, "outcomes_peopleCuriousAboutStoryWork", ["never","occasionally","sometimes","often","mixed"]);
    }

    return {
        "id": "page_outcomesTable",
        "name": "Project outcomes",
        "type": "questionsTable",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});