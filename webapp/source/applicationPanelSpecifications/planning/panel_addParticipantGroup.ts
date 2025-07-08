import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

const panel: Panel = {
    id: "panel_addParticipantGroup",
    modelClass: "ParticipantGroup",
    panelFields: [
        {
            id: "participantGroup_name",
            valueType: "string",
            displayType: "text",
            displayConfiguration: "20",
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
            id: "participantGroup_statusNotes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Notes on status",
            displayPrompt: "Enter any <strong>notes</strong> you want to remember about the status of this group."
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
            id: "participantGroup_abilityNotes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Notes on ability",
            displayPrompt: "Enter any <strong>notes</strong> you want to remember about the abilities of this group."
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
            id: "participantGroup_expectationsNotes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Notes on expectations",
            displayPrompt: "Enter any <strong>notes</strong> you want to remember about the expectations of this group."
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
            id: "participantGroup_feelingsNotes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Notes on feelings about project",
            displayPrompt: "Enter any <strong>notes</strong> you want to remember about the feelings of this group towards your project."
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
            id: "participantGroup_topic_dangerous",
            valueType: "string",
            valueOptions: [
                "very dangerous",
                "medium",
                "not dangerous",
                "mixed",
                 "unknown"
            ],
            displayType: "select",
            displayName: "Dangerous",
            displayPrompt: "Do you think these participants will find this topic <strong>dangerous</strong> to talk about?"
        },   
        {
            id: "participantGroup_topic_defensive",
            valueType: "string",
            valueOptions: [
                "very defensive",
                "medium",
                "not defensive",
                "mixed",
                 "unknown"
            ],
            displayType: "select",
            displayName: "Defensive",
            displayPrompt: "Do you think these participants will feel <strong>defensive</strong> when asked to talk about this topic?"
        },   
        {
            id: "participantGroup_topic_complicated",
            valueType: "string",
            valueOptions: [
                "very complicated",
                "medium",
                "not complicated",
                "mixed",
                 "unknown"
            ],
            displayType: "select",
            displayName: "Complicated",
            displayPrompt: "Do you think these participants will find this topic <strong>complicated</strong> and hard to understand?"
        },       
        {
            id: "participantGroup_topicNotes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Notes on feelings about the topic",
            displayPrompt: "Enter any <strong>notes</strong> you want to remember about the feelings of this group towards your topic."
        },
        {
            id: "participantGroup_winwinHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Win-win proposal"
        },
        {
            id: "participantGroup_winwin_ideal",
            valueType: "string",
            displayType: "textarea",
            displayName: "Ideal project",
            displayPrompt: "Describe the <strong>ideal project</strong> from the perspective of this participant group. If the project worked very well for them, what would it be like?"
        },
        {
            id: "participantGroup_winwin_bring",
            valueType: "string",
            displayType: "textarea",
            displayName: "Bring to the project",
            displayPrompt: "What can this group of people <strong>bring to the project</strong> that no other group can?"
        },
        {
            id: "participantGroup_winwin_energy",
            valueType: "string",
            displayType: "textarea",
            displayName: "Participatory energy",
            displayPrompt: "What might draw out the <strong>participatory energy</strong> of this group? What might they be enthused about doing?"
        },
        {
            id: "participantGroup_winwin_turnaway",
            valueType: "string",
            displayType: "textarea",
            displayName: "Turn away",
            displayPrompt: "What might cause these people to <strong>turn away</strong> from the project? What might concern or demotivate them?"
        },
        {
            id: "participantGroup_winwin_proposal",
            valueType: "string",
            displayType: "textarea",
            displayName: "Proposal",
            displayPrompt: "What is your <strong>win-win proposal</strong> to this group of participants? What do you plan to say to them?"
        },
        {
            id: "participantGroup_notesHeader",
            valueType: "none",
            displayType: "header",
            displayPrompt: "General notes"
        },
        {
            id: "participantGroup_notes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Notes",
            displayPrompt: "Enter any <strong>general notes</strong> you want to remember about this group of participants."
        }
    ]
};

export = panel;

