// Generated from design
"use strict";

define([
    "../widgetBuilder"
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

    var questions = [
        {"id":"outcomes_hopesHeader", "type":"header", "isReportable":false, "isHeader":false},
        {"id":"outcomes_peopleFeltHeard", "type":"select", "isReportable":true, "isHeader":false},
        {"id":"outcomes_peopleFeltInvolved", "type":"select", "isReportable":true, "isHeader":false},
        {"id":"outcomes_peopleLearnedAboutCommOrg", "type":"select", "isReportable":true, "isHeader":false},
        {"id":"outcomes_voicesHeader", "type":"header", "isReportable":false, "isHeader":false},
        {"id":"outcomes_peopleWantedToTellMoreStories", "type":"select", "isReportable":true, "isHeader":false},
        {"id":"outcomes_peopleWantedToShareMoreStoriesWithEachOther", "type":"select", "isReportable":true, "isHeader":false},
        {"id":"outcomes_peopleFeltStoriesNeededToBeHeard", "type":"select", "isReportable":true, "isHeader":false},
        {"id":"outcomes_peopleFeltNobodyCares", "type":"select", "isReportable":true, "isHeader":false},
        {"id":"outcomes_needsHeader", "type":"header", "isReportable":false, "isHeader":false},
        {"id":"outcomes_peopleFeltNobodyCanMeetNeeds", "type":"select", "isReportable":true, "isHeader":false},
        {"id":"outcomes_peopleFeltTheyNeedNewStories", "type":"select", "isReportable":true, "isHeader":false},
        {"id":"outcomes_peopleWantedToKeepExploring", "type":"select", "isReportable":true, "isHeader":false},
        {"id":"outcomes_crisisPointsWereFound", "type":"select", "isReportable":true, "isHeader":false},
        {"id":"outcomes_issuesWereBeyondWords", "type":"select", "isReportable":true, "isHeader":false},
        {"id":"outcomes_learningHeader", "type":"header", "isReportable":false, "isHeader":false},
        {"id":"outcomes_peopleLarnedAboutTopic", "type":"select", "isReportable":true, "isHeader":false},
        {"id":"outcomes_issuesNewMembersStruggleWith", "type":"select", "isReportable":true, "isHeader":false},
        {"id":"outcomes_foundInfoWithoutUnderstanding", "type":"select", "isReportable":true, "isHeader":false},
        {"id":"outcomes_foundOverConfidence", "type":"select", "isReportable":true, "isHeader":false},
        {"id":"outcomes_peopleCuriousAboutStoryWork", "type":"select", "isReportable":true, "isHeader":false}
    ];

    return {
        "id": "page_outcomesTable",
        "name": "Project outcomes",
        "type": "questionsTable",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});