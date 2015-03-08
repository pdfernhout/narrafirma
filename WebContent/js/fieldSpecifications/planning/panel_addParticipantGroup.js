define([], function() {
    "use strict";
    return [
        {
            id: "panel_addParticipantGroup",
            displayName: "Participant group",
            displayType: "panel",
            section: "planning",
            modelClass: "ParticipantGroupModel"
        },
        {
            id: "participantGroup_name",
            dataType: "string",
            required: true,
            displayType: "text",
            displayName: "Name",
            displayPrompt: "Please name this group of participants (for example, \"doctors\", \"students\", \"staff\")."
        },
        {
            id: "participantGroup_description",
            dataType: "string",
            required: true,
            displayType: "textarea",
            displayName: "Description",
            displayPrompt: "Please describe this group of participants.\nFor example, you might want to record any observations you have made about this group.\nWhat do you know about them?"
        },
        {
            id: "participantGroup_detailsAboutParticipantGroup",
            dataType: "none",
            displayType: "label",
            displayPrompt: "Details for the participant group."
        },
        {
            id: "participantGroup_statusHeader",
            dataType: "none",
            displayType: "header",
            displayPrompt: "Status"
        },
        {
            id: "participantGroup_status",
            dataType: "string",
            dataOptions: ["unknown","very low","low","moderate","high","very high","mixed"],
            required: true,
            displayType: "select",
            displayName: "Status",
            displayPrompt: "What is the status of these participants in the community or organization?"
        },
        {
            id: "participantGroup_confidence",
            dataType: "string",
            dataOptions: ["unknown","very low","low","medium","high","very high","mixed"],
            required: true,
            displayType: "select",
            displayName: "Self-confidence",
            displayPrompt: "How much self-confidence do these participants have?"
        },
        {
            id: "participantGroup_abilityHeader",
            dataType: "none",
            displayType: "header",
            displayPrompt: "Ability"
        },
        {
            id: "participantGroup_time",
            dataType: "string",
            dataOptions: ["unknown","very little","little","some","a lot","mixed"],
            required: true,
            displayType: "select",
            displayName: "Free time",
            displayPrompt: "How much free time do these participants have?"
        },
        {
            id: "participantGroup_education",
            dataType: "string",
            dataOptions: ["unknown","illiterate","minimal","moderate","high","very high","mixed"],
            required: true,
            displayType: "select",
            displayName: "Education level",
            displayPrompt: "What is the education level of these participants?"
        },
        {
            id: "participantGroup_physicalDisabilities",
            dataType: "string",
            dataOptions: ["unknown","none","minimal","moderate","strong","mixed"],
            required: true,
            displayType: "select",
            displayName: "Physical limitations",
            displayPrompt: "Do these participants have physical limitations that will impact their participation?"
        },
        {
            id: "participantGroup_emotionalImpairments",
            dataType: "string",
            dataOptions: ["unknown","none","minimal","moderate","strong","mixed"],
            required: true,
            displayType: "select",
            displayName: "Emotional limitations",
            displayPrompt: "Do these participants have emotional impairments that will impact their participation (such as mental illness or traumatic stress)?"
        },
        {
            id: "participantGroup_expectationsHeader",
            dataType: "none",
            displayType: "header",
            displayPrompt: "Expectations"
        },
        {
            id: "participantGroup_performing",
            dataType: "string",
            dataOptions: ["unknown","very unimportant","somewhat unimportant","somewhat important","very important","mixed"],
            required: true,
            displayType: "select",
            displayName: "Performance",
            displayPrompt: "For these participants, how important is performing well (with \"high marks\")?"
        },
        {
            id: "participantGroup_conforming",
            dataType: "string",
            dataOptions: ["unknown","very unimportant","somewhat unimportant","somewhat important","very important","mixed"],
            required: true,
            displayType: "select",
            displayName: "Conformance",
            displayPrompt: "For these participants, how important is conforming (to what is \"normal\" or expected)?"
        },
        {
            id: "participantGroup_promoting",
            dataType: "string",
            dataOptions: ["unknown","very unimportant","somewhat unimportant","somewhat important","very important","mixed"],
            required: true,
            displayType: "select",
            displayName: "Self-promotion",
            displayPrompt: "For these participants, how important is self-promotion (competing with others)?"
        },
        {
            id: "participantGroup_venting",
            dataType: "string",
            dataOptions: ["unknown","very unimportant","somewhat unimportant","somewhat important","very important","mixed"],
            required: true,
            displayType: "select",
            displayName: "Speaking out",
            displayPrompt: "For these participants, how important is speaking out (having a say, venting, sounding off)?"
        },
        {
            id: "participantGroup_feelingsHeader",
            dataType: "none",
            displayType: "header",
            displayPrompt: "Feelings about the project"
        },
        {
            id: "participantGroup_interest",
            dataType: "string",
            dataOptions: ["unknown","very little","a little","some","a lot","extremely","mixed"],
            required: true,
            displayType: "select",
            displayName: "Motivated",
            displayPrompt: "How motivated are these participants to participate in the project?"
        },
        {
            id: "participantGroup_feelings_project",
            dataType: "string",
            dataOptions: ["unknown","negative","neutral","positive","mixed"],
            required: true,
            displayType: "select",
            displayName: "Feelings about project",
            displayPrompt: "How are these participants likely to feel about the project?"
        },
        {
            id: "participantGroup_feelings_facilitator",
            dataType: "string",
            dataOptions: ["unknown","negative","neutral","positive","mixed"],
            required: true,
            displayType: "select",
            displayName: "Feelings about you",
            displayPrompt: "How do these participants feel about you?"
        },
        {
            id: "participantGroup_feelings_stories",
            dataType: "string",
            dataOptions: ["unknown","negative","neutral","positive","mixed"],
            required: true,
            displayType: "select",
            displayName: "Feel about stories",
            displayPrompt: "How do these participants feel about the idea of collecting stories?"
        },
        {
            id: "participantGroup_topicHeader",
            dataType: "none",
            displayType: "header",
            displayPrompt: "Feelings about the topic"
        },
        {
            id: "participantGroup_topic_feeling",
            dataType: "string",
            dataOptions: ["unknown","strongly negative","negative","neutral","positive","strongly positive","mixed"],
            required: true,
            displayType: "select",
            displayName: "Experiences with topic",
            displayPrompt: "What experiences have these participants had with the project's topic?"
        },
        {
            id: "participantGroup_topic_private",
            dataType: "string",
            dataOptions: ["unknown","very private","medium","not private","mixed"],
            required: true,
            displayType: "select",
            displayName: "How private",
            displayPrompt: "How private do these participants consider the topic to be?"
        },
        {
            id: "participantGroup_topic_articulate",
            dataType: "string",
            dataOptions: ["unknown","hard","medium","easy","mixed"],
            required: true,
            displayType: "select",
            displayName: "Articulation",
            displayPrompt: "How hard will it be for these participants to articulate their feelings about the topic?"
        },
        {
            id: "participantGroup_topic_timeframe",
            dataType: "string",
            dataOptions: ["unknown","hours","days","months","years","decades","mixed"],
            required: true,
            displayType: "select",
            displayName: "Time period",
            displayPrompt: "How long of a time period do you need these participants to look back on?"
        }
    ];
});
