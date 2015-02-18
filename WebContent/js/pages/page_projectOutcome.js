// Generated from design
define([], function() {
    "use strict";
    
    var questions = [
        {"id":"outcomes_group", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"outcomes_hopesHeader", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"outcomes_peopleFeltHeard", "type":"select", "isInReport":true, "isGridColumn":true, "options":["never", "occasionally", "sometimes", "often", "mixed"]},
        {"id":"outcomes_peopleFeltInvolved", "type":"select", "isInReport":true, "isGridColumn":true, "options":["never", "occasionally", "sometimes", "often", "mixed"]},
        {"id":"outcomes_peopleLearnedAboutCommOrg", "type":"select", "isInReport":true, "isGridColumn":true, "options":["never", "occasionally", "sometimes", "often", "mixed"]},
        {"id":"outcomes_voicesHeader", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"outcomes_peopleWantedToTellMoreStories", "type":"select", "isInReport":true, "isGridColumn":true, "options":["never", "occasionally", "sometimes", "often", "mixed"]},
        {"id":"outcomes_peopleWantedToShareMoreStoriesWithEachOther", "type":"select", "isInReport":true, "isGridColumn":true, "options":["never", "occasionally", "sometimes", "often", "mixed"]},
        {"id":"outcomes_peopleFeltStoriesNeededToBeHeard", "type":"select", "isInReport":true, "isGridColumn":true, "options":["not at all", "somewhat", "definitely", "mixed"]},
        {"id":"outcomes_peopleFeltNobodyCares", "type":"select", "isInReport":true, "isGridColumn":true, "options":["not at all", "somewhat", "definitely", "mixed"]},
        {"id":"outcomes_needsHeader", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"outcomes_peopleFeltNobodyCanMeetNeeds", "type":"select", "isInReport":true, "isGridColumn":true, "options":["not at all", "somewhat", "definitely", "mixed"]},
        {"id":"outcomes_peopleFeltTheyNeedNewStories", "type":"select", "isInReport":true, "isGridColumn":true, "options":["not at all", "somewhat", "definitely", "mixed"]},
        {"id":"outcomes_peopleWantedToKeepExploring", "type":"select", "isInReport":true, "isGridColumn":true, "options":["not at all", "somewhat", "definitely", "mixed"]},
        {"id":"outcomes_crisisPointsWereFound", "type":"select", "isInReport":true, "isGridColumn":true, "options":["not at all", "somewhat", "definitely", "mixed"]},
        {"id":"outcomes_issuesWereBeyondWords", "type":"select", "isInReport":true, "isGridColumn":true, "options":["not at all", "somewhat", "definitely", "mixed"]},
        {"id":"outcomes_learningHeader", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"outcomes_peopleLarnedAboutTopic", "type":"select", "isInReport":true, "isGridColumn":true, "options":["never", "occasionally", "sometimes", "often", "mixed"]},
        {"id":"outcomes_issuesNewMembersStruggleWith", "type":"select", "isInReport":true, "isGridColumn":true, "options":["not at all", "somewhat", "definitely", "mixed"]},
        {"id":"outcomes_foundInfoWithoutUnderstanding", "type":"select", "isInReport":true, "isGridColumn":true, "options":["not at all", "somewhat", "definitely", "mixed"]},
        {"id":"outcomes_foundOverConfidence", "type":"select", "isInReport":true, "isGridColumn":true, "options":["not at all", "somewhat", "definitely", "mixed"]},
        {"id":"outcomes_peopleCuriousAboutStoryWork", "type":"select", "isInReport":true, "isGridColumn":true, "options":["never", "occasionally", "sometimes", "often", "mixed"]}
    ];
    
    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_projectOutcome",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});