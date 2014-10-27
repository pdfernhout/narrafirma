// Generated from design
"use strict";

define([
    "../widgetBuilder"
], function(
    widgets
) {

    function addWidgets(contentPane, model) {
        widgets.add_text(contentPane, model, "participantGroup_name");
        widgets.add_textarea(contentPane, model, "participantGroup_description");
        widgets.add_label(contentPane, model, "detailsAboutParticipantGroup");
        widgets.add_header(contentPane, model, "participantGroupAspects_statusHeader");
        widgets.add_select(contentPane, model, "participantGroupAspects_status", ["unknown","very low","low","moderate","high","very high","mixed"]);
        widgets.add_select(contentPane, model, "participantGroupAspects_confidence", ["unknown","very low","low","medium","high","very high","mixed"]);
        widgets.add_header(contentPane, model, "participantGroupAspects_abilityHeader");
        widgets.add_select(contentPane, model, "participantGroupAspects_time", ["unknown","very little","little","some","a lot","mixed"]);
        widgets.add_select(contentPane, model, "participantGroupAspects_education", ["unknown","illiterate","minimal","moderate","high","very high","mixed"]);
        widgets.add_select(contentPane, model, "participantGroupAspects_physicalDisabilities", ["unknown","none","minimal","moderate","strong","mixed"]);
        widgets.add_select(contentPane, model, "participantGroupAspects_emotionalImpairments", ["unknown","none","minimal","moderate","strong","mixed"]);
        widgets.add_header(contentPane, model, "aspects_expectationsHeader");
        widgets.add_select(contentPane, model, "participantGroupAspects_performing", ["unknown","very unimportant","somewhat unimportant","somewhat important","very important","mixed"]);
        widgets.add_select(contentPane, model, "participantGroupAspects_conforming", ["unknown","very unimportant","somewhat unimportant","somewhat important","very important","mixed"]);
        widgets.add_select(contentPane, model, "participantGroupAspects_promoting", ["unknown","very unimportant","somewhat unimportant","somewhat important","very important","mixed"]);
        widgets.add_select(contentPane, model, "participantGroupAspects_venting", ["unknown","very unimportant","somewhat unimportant","somewhat important","very important","mixed"]);
        widgets.add_header(contentPane, model, "aspects_feelingsHeader");
        widgets.add_select(contentPane, model, "participantGroupAspects_interest", ["unknown","very little","a little","some","a lot","extremely","mixed"]);
        widgets.add_select(contentPane, model, "participantGroupAspects_feelings_project", ["unknown","negative","neutral","positive","mixed"]);
        widgets.add_select(contentPane, model, "participantGroupAspects_feelings_facilitator", ["unknown","negative","neutral","positive","mixed"]);
        widgets.add_select(contentPane, model, "participantGroupAspects_feelings_stories", ["unknown","negative","neutral","positive","mixed"]);
        widgets.add_header(contentPane, model, "aspects_topicHeader");
        widgets.add_select(contentPane, model, "participantGroupAspects_topic_feeling", ["unknown","strongly negative","negative","neutral","positive","strongly positive","mixed"]);
        widgets.add_select(contentPane, model, "participantGroupAspects_topic_private", ["unknown","very private","medium","not private","mixed"]);
        widgets.add_select(contentPane, model, "participantGroupAspects_topic_articulate", ["unknown","hard","medium","easy","mixed"]);
        widgets.add_select(contentPane, model, "participantGroupAspects_topic_timeframe", ["unknown","hours","days","months","years","decades","mixed"]);
    }

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

    return {
        "id": "page_addParticipantGroup",
        "name": "Participant group",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets,
        "questions": questions
    };
});