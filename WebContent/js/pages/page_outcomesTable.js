// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    var questions = [
        {"id":"outcomes_hopesHeader", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"outcomes_peopleFeltHeard", "type":"select", "isInReport":true, "isGridColumn":false, "options":["never", "occasionally", "sometimes", "often", "mixed"]},
        {"id":"outcomes_peopleFeltInvolved", "type":"select", "isInReport":true, "isGridColumn":false, "options":["never", "occasionally", "sometimes", "often", "mixed"]},
        {"id":"outcomes_peopleLearnedAboutCommOrg", "type":"select", "isInReport":true, "isGridColumn":false, "options":["never", "occasionally", "sometimes", "often", "mixed"]},
        {"id":"outcomes_voicesHeader", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"outcomes_peopleWantedToTellMoreStories", "type":"select", "isInReport":true, "isGridColumn":false, "options":["never", "occasionally", "sometimes", "often", "mixed"]},
        {"id":"outcomes_peopleWantedToShareMoreStoriesWithEachOther", "type":"select", "isInReport":true, "isGridColumn":false, "options":["never", "occasionally", "sometimes", "often", "mixed"]},
        {"id":"outcomes_peopleFeltStoriesNeededToBeHeard", "type":"select", "isInReport":true, "isGridColumn":false, "options":["not at all", "somewhat", "definitely", "mixed"]},
        {"id":"outcomes_peopleFeltNobodyCares", "type":"select", "isInReport":true, "isGridColumn":false, "options":["not at all", "somewhat", "definitely", "mixed"]},
        {"id":"outcomes_needsHeader", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"outcomes_peopleFeltNobodyCanMeetNeeds", "type":"select", "isInReport":true, "isGridColumn":false, "options":["not at all", "somewhat", "definitely", "mixed"]},
        {"id":"outcomes_peopleFeltTheyNeedNewStories", "type":"select", "isInReport":true, "isGridColumn":false, "options":["not at all", "somewhat", "definitely", "mixed"]},
        {"id":"outcomes_peopleWantedToKeepExploring", "type":"select", "isInReport":true, "isGridColumn":false, "options":["not at all", "somewhat", "definitely", "mixed"]},
        {"id":"outcomes_crisisPointsWereFound", "type":"select", "isInReport":true, "isGridColumn":false, "options":["not at all", "somewhat", "definitely", "mixed"]},
        {"id":"outcomes_issuesWereBeyondWords", "type":"select", "isInReport":true, "isGridColumn":false, "options":["not at all", "somewhat", "definitely", "mixed"]},
        {"id":"outcomes_learningHeader", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"outcomes_peopleLarnedAboutTopic", "type":"select", "isInReport":true, "isGridColumn":false, "options":["never", "occasionally", "sometimes", "often", "mixed"]},
        {"id":"outcomes_issuesNewMembersStruggleWith", "type":"select", "isInReport":true, "isGridColumn":false, "options":["not at all", "somewhat", "definitely", "mixed"]},
        {"id":"outcomes_foundInfoWithoutUnderstanding", "type":"select", "isInReport":true, "isGridColumn":false, "options":["not at all", "somewhat", "definitely", "mixed"]},
        {"id":"outcomes_foundOverConfidence", "type":"select", "isInReport":true, "isGridColumn":false, "options":["not at all", "somewhat", "definitely", "mixed"]},
        {"id":"outcomes_peopleCuriousAboutStoryWork", "type":"select", "isInReport":true, "isGridColumn":false, "options":["never", "occasionally", "sometimes", "often", "mixed"]}
    ];

    function addWidgets(contentPane, model) {
        widgets.addQuestionWidgets(questions, contentPane, model);
    }

    return {
        "id": "page_outcomesTable",
        "name": "Project outcomes",
        "type": "questionsTable",
        "isHeader": false,
        "questions": questions,
        "addWidgets": addWidgets
    };
});