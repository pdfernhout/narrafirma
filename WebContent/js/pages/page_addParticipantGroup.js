"use strict";

define([
    "js/widgetBuilder"
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

    return {
        "id": "page_addParticipantGroup",
        "name": "Participant group",
        "type": "popup",
        "isHeader": false,
        "addWidgets": addWidgets
    };
});