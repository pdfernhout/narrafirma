// Generated from design
"use strict";

define([], function() {

    var questions = [
        {"id":"participantGroup_name", "type":"text", "isInReport":true, "isGridColumn":true},
        {"id":"participantGroup_description", "type":"textarea", "isInReport":true, "isGridColumn":true},
        {"id":"detailsAboutParticipantGroup", "type":"label", "isInReport":false, "isGridColumn":false},
        {"id":"participantGroupAspects_statusHeader", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"participantGroupAspects_status", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "very low", "low", "moderate", "high", "very high", "mixed"]},
        {"id":"participantGroupAspects_confidence", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "very low", "low", "medium", "high", "very high", "mixed"]},
        {"id":"participantGroupAspects_abilityHeader", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"participantGroupAspects_time", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "very little", "little", "some", "a lot", "mixed"]},
        {"id":"participantGroupAspects_education", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "illiterate", "minimal", "moderate", "high", "very high", "mixed"]},
        {"id":"participantGroupAspects_physicalDisabilities", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "none", "minimal", "moderate", "strong", "mixed"]},
        {"id":"participantGroupAspects_emotionalImpairments", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "none", "minimal", "moderate", "strong", "mixed"]},
        {"id":"aspects_expectationsHeader", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"participantGroupAspects_performing", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "very unimportant", "somewhat unimportant", "somewhat important", "very important", "mixed"]},
        {"id":"participantGroupAspects_conforming", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "very unimportant", "somewhat unimportant", "somewhat important", "very important", "mixed"]},
        {"id":"participantGroupAspects_promoting", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "very unimportant", "somewhat unimportant", "somewhat important", "very important", "mixed"]},
        {"id":"participantGroupAspects_venting", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "very unimportant", "somewhat unimportant", "somewhat important", "very important", "mixed"]},
        {"id":"aspects_feelingsHeader", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"participantGroupAspects_interest", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "very little", "a little", "some", "a lot", "extremely", "mixed"]},
        {"id":"participantGroupAspects_feelings_project", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "negative", "neutral", "positive", "mixed"]},
        {"id":"participantGroupAspects_feelings_facilitator", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "negative", "neutral", "positive", "mixed"]},
        {"id":"participantGroupAspects_feelings_stories", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "negative", "neutral", "positive", "mixed"]},
        {"id":"aspects_topicHeader", "type":"header", "isInReport":false, "isGridColumn":false},
        {"id":"participantGroupAspects_topic_feeling", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "strongly negative", "negative", "neutral", "positive", "strongly positive", "mixed"]},
        {"id":"participantGroupAspects_topic_private", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "very private", "medium", "not private", "mixed"]},
        {"id":"participantGroupAspects_topic_articulate", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "hard", "medium", "easy", "mixed"]},
        {"id":"participantGroupAspects_topic_timeframe", "type":"select", "isInReport":true, "isGridColumn":false, "options":["unknown", "hours", "days", "months", "years", "decades", "mixed"]}
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