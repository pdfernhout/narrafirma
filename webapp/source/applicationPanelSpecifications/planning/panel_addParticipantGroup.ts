import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "panel_addParticipantGroup",
    modelClass: "ParticipantGroup",
    panelFields: [
        {
            id: "participantGroup_name",
            valueType: "string",
            displayType: "text",
            displayName: "Participant group name",
            displayPrompt: "Please <strong>name</strong> this group of participants (for example, \"doctors\", \"students\", \"staff\")."
        },
        {
            id: "participantGroup_description",
            valueType: "string",
            displayType: "textarea",
            displayName: "Description",
            displayPrompt: "Please <strong>describe</strong> this group of participants."
        },
        {
            id: "participantGroup_statusHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Status"
        },
        {
            id: "participantGroup_status",
            valueType: "string",
            valueOptions: [
                "very low",
                "low",
                "moderate",
                "high",
                "very high",
                "mixed",
                "unknown"
            ],
            displayType: "select",
            displayName: "Status",
            displayPrompt: "What is the <strong>status</strong> of these participants in the community or organization?"
        },
        {
            id: "participantGroup_confidence",
            valueType: "string",
            valueOptions: [
                "very low",
                "low",
                "medium",
                "high",
                "very high",
                "mixed",
                "unknown"
            ],
            displayType: "select",
            displayName: "Self-confidence",
            displayPrompt: "How much <strong>self-confidence</strong> do these participants have?"
        },
        {
            id: "participantGroup_abilityHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Ability"
        },
        {
            id: "participantGroup_time",
            valueType: "string",
            valueOptions: [
                "very little",
                "little",
                "some",
                "a lot",
                "mixed",
                "unknown"
            ],
            displayType: "select",
            displayName: "Free time",
            displayPrompt: "How much free <strong>time</strong> do these participants have?"
        },
        {
            id: "participantGroup_education",
            valueType: "string",
            valueOptions: [
                "illiterate",
                "minimal",
                "moderate",
                "high",
                "very high",
                "mixed",
                "unknown"
            ],
            displayType: "select",
            displayName: "Education level",
            displayPrompt: "What is the <strong>education</strong> level of these participants?"
        },
        {
            id: "participantGroup_physicalDisabilities",
            valueType: "string",
            valueOptions: [
                "none",
                "minimal",
                "moderate",
                "strong",
                "mixed",
                "unknown"
            ],
            displayType: "select",
            displayName: "Physical limitations",
            displayPrompt: "Do these participants have <strong>physical limitations</strong> that will impact their participation?"
        },
        {
            id: "participantGroup_emotionalImpairments",
            valueType: "string",
            valueOptions: [
                 "none",
                "minimal",
                "moderate",
                "strong",
                "mixed",
                 "unknown"
           ],
            displayType: "select",
            displayName: "Emotional limitations",
            displayPrompt: "Do these participants have <strong>emotional impairments</strong> that will impact their participation (such as mental illness or traumatic stress)?"
        },
        {
            id: "participantGroup_expectationsHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Expectations"
        },
        {
            id: "participantGroup_performing",
            valueType: "string",
            valueOptions: [
                "very unimportant",
                "somewhat unimportant",
                "somewhat important",
                "very important",
                "mixed",
                "unknown"
            ],
            displayType: "select",
            displayName: "Performance",
            displayPrompt: "For these participants, how important is <strong>performing</strong> well (with \"high marks\")?"
        },
        {
            id: "participantGroup_conforming",
            valueType: "string",
            valueOptions: [
                "very unimportant",
                "somewhat unimportant",
                "somewhat important",
                "very important",
                "mixed",
                "unknown"
            ],
            displayType: "select",
            displayName: "Conformance",
            displayPrompt: "For these participants, how important is <strong>conforming</strong> (to what is \"normal\" or expected)?"
        },
        {
            id: "participantGroup_promoting",
            valueType: "string",
            valueOptions: [
                "very unimportant",
                "somewhat unimportant",
                "somewhat important",
                "very important",
                "mixed",
                "unknown"
            ],
            displayType: "select",
            displayName: "Self-promotion",
            displayPrompt: "For these participants, how important is <strong>self-promotion</strong> (competing with others)?"
        },
        {
            id: "participantGroup_venting",
            valueType: "string",
            valueOptions: [
                "very unimportant",
                "somewhat unimportant",
                "somewhat important",
                "very important",
                "mixed",
                "unknown"
            ],
            displayType: "select",
            displayName: "Speaking out",
            displayPrompt: "For these participants, how important is <strong>speaking out</strong> (having a say, venting, sounding off)?"
        },
        {
            id: "participantGroup_feelingsHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Feelings about the project"
        },
        {
            id: "participantGroup_interest",
            valueType: "string",
            valueOptions: [
                "very little",
                "a little",
                "some",
                "a lot",
                "extremely",
                "mixed",
                "unknown"
            ],
            displayType: "select",
            displayName: "Motivated",
            displayPrompt: "How <strong>motivated</strong> are these people to participate in the project?"
        },
        {
            id: "participantGroup_feelings_project",
            valueType: "string",
            valueOptions: [
                "negative",
                "neutral",
                "positive",
                "mixed",
                "unknown"
            ],
            displayType: "select",
            displayName: "Feelings about project",
            displayPrompt: "How are these participants likely to <strong>feel</strong> about the project? Will they see it as a good or bad thing?"
        },
        {
            id: "participantGroup_feelings_facilitator",
            valueType: "string",
            valueOptions: [
                "negative",
                "neutral",
                "positive",
                "mixed",
                 "unknown"
           ],
            displayType: "select",
            displayName: "Feelings about you",
            displayPrompt: "How do these participants feel about <strong>you</strong>?"
        },
        {
            id: "participantGroup_feelings_stories",
            valueType: "string",
            valueOptions: [
                "negative",
                "neutral",
                "positive",
                "mixed",
                 "unknown"
           ],
            displayType: "select",
            displayName: "Feel about stories",
            displayPrompt: "How do these participants feel about the idea of collecting <strong>stories</strong>?"
        },
        {
            id: "participantGroup_topicHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Feelings about the topic"
        },
        {
            id: "participantGroup_topic_feeling",
            valueType: "string",
            valueOptions: [
                "strongly negative",
                "negative",
                "neutral",
                "positive",
                "strongly positive",
                "mixed",
                "unknown"
            ],
            displayType: "select",
            displayName: "Experiences with topic",
            displayPrompt: "What experiences have these participants had with the project's <strong>topic</strong>?"
        },
        {
            id: "participantGroup_topic_private",
            valueType: "string",
            valueOptions: [
                "very private",
                "medium",
                "not private",
                "mixed",
                 "unknown"
           ],
            displayType: "select",
            displayName: "How private",
            displayPrompt: "How <strong>private</strong> do these participants consider the topic to be?"
        },
        {
            id: "participantGroup_topic_articulate",
            valueType: "string",
            valueOptions: [
                "hard",
                "medium",
                "easy",
                "mixed",
                 "unknown"
           ],
            displayType: "select",
            displayName: "Articulation",
            displayPrompt: "How hard will it be for these participants to <strong>articulate</strong> their feelings about the topic? Do they know how they feel?"
        },
        {
            id: "participantGroup_topic_timeframe",
            valueType: "string",
            valueOptions: [
                "hours",
                "days",
                "months",
                "years",
                "decades",
                "mixed",
                 "unknown"
           ],
            displayType: "select",
            displayName: "Time period",
            displayPrompt: "How long of a <strong>time period</strong> do you need these participants to look back on?"
        },
        {
            id: "participantGroup_notes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Notes",
            displayPrompt: "Enter any additional <strong>notes</strong> you want to remember about this group of participants."
        }
    ]
};

export = panel;

