// Generated from design
define([], function() {
    "use strict";
    
    var questions = [
        {"id":"participantGroup_name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"participantGroup_description", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"participantGroup_detailsAboutParticipantGroup", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"participantGroup_statusHeader", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"participantGroup_status", "type":"select", "isInReport":true, "isGridColumn":true, "options":["unknown", "very low", "low", "moderate", "high", "very high", "mixed"]},
        {"id":"participantGroup_confidence", "type":"select", "isInReport":true, "isGridColumn":true, "options":["unknown", "very low", "low", "medium", "high", "very high", "mixed"]},
        {"id":"participantGroup_abilityHeader", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"participantGroup_time", "type":"select", "isInReport":true, "isGridColumn":true, "options":["unknown", "very little", "little", "some", "a lot", "mixed"]},
        {"id":"participantGroup_education", "type":"select", "isInReport":true, "isGridColumn":true, "options":["unknown", "illiterate", "minimal", "moderate", "high", "very high", "mixed"]},
        {"id":"participantGroup_physicalDisabilities", "type":"select", "isInReport":true, "isGridColumn":true, "options":["unknown", "none", "minimal", "moderate", "strong", "mixed"]},
        {"id":"participantGroup_emotionalImpairments", "type":"select", "isInReport":true, "isGridColumn":true, "options":["unknown", "none", "minimal", "moderate", "strong", "mixed"]},
        {"id":"participantGroup_expectationsHeader", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"participantGroup_performing", "type":"select", "isInReport":true, "isGridColumn":true, "options":["unknown", "very unimportant", "somewhat unimportant", "somewhat important", "very important", "mixed"]},
        {"id":"participantGroup_conforming", "type":"select", "isInReport":true, "isGridColumn":true, "options":["unknown", "very unimportant", "somewhat unimportant", "somewhat important", "very important", "mixed"]},
        {"id":"participantGroup_promoting", "type":"select", "isInReport":true, "isGridColumn":true, "options":["unknown", "very unimportant", "somewhat unimportant", "somewhat important", "very important", "mixed"]},
        {"id":"participantGroup_venting", "type":"select", "isInReport":true, "isGridColumn":true, "options":["unknown", "very unimportant", "somewhat unimportant", "somewhat important", "very important", "mixed"]},
        {"id":"participantGroup_feelingsHeader", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"participantGroup_interest", "type":"select", "isInReport":true, "isGridColumn":true, "options":["unknown", "very little", "a little", "some", "a lot", "extremely", "mixed"]},
        {"id":"participantGroup_feelings_project", "type":"select", "isInReport":true, "isGridColumn":true, "options":["unknown", "negative", "neutral", "positive", "mixed"]},
        {"id":"participantGroup_feelings_facilitator", "type":"select", "isInReport":true, "isGridColumn":true, "options":["unknown", "negative", "neutral", "positive", "mixed"]},
        {"id":"participantGroup_feelings_stories", "type":"select", "isInReport":true, "isGridColumn":true, "options":["unknown", "negative", "neutral", "positive", "mixed"]},
        {"id":"participantGroup_topicHeader", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"participantGroup_topic_feeling", "type":"select", "isInReport":true, "isGridColumn":true, "options":["unknown", "strongly negative", "negative", "neutral", "positive", "strongly positive", "mixed"]},
        {"id":"participantGroup_topic_private", "type":"select", "isInReport":true, "isGridColumn":true, "options":["unknown", "very private", "medium", "not private", "mixed"]},
        {"id":"participantGroup_topic_articulate", "type":"select", "isInReport":true, "isGridColumn":true, "options":["unknown", "hard", "medium", "easy", "mixed"]},
        {"id":"participantGroup_topic_timeframe", "type":"select", "isInReport":true, "isGridColumn":true, "options":["unknown", "hours", "days", "months", "years", "decades", "mixed"]}
    ];
    
    function buildPage(builder, contentPane, model) {
        builder.addQuestions(questions, contentPane, model);
    }

    return {
        "id": "page_addParticipantGroup",
        "type": "popup",
        "isHeader": false,
        "questions": questions,
        "buildPage": buildPage
    };
});