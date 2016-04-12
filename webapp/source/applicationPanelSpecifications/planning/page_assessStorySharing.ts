import kludgeForUseStrict = require("../../kludgeForUseStrict");
"use strict";

var panel: Panel = {
    id: "page_assessStorySharing",
    displayName: "Assess story sharing",
    tooltipText: "Consider how stories flow in your community or organization.",
    panelFields: [
        {
            id: "assessment_intro",
            valueType: "none",
            displayType: "label",
            displayPrompt: "On this page you can assess the <strong>story sharing culture</strong> of your community or organization. (This page is not connected to the recommendations system, but it can help you plan your project, especially if you are unsure about your participants.)"
        },
        {
            id: "assessment_intro_more",
            valueType: "none",
            displayType: "label",
            displayPrompt: "Before you answer these questions, you should spend some time <strong>listening to people</strong> sharing stories together in the places where they normally gather."
        },
        {
            id: "assessment_narrativeFreedom",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Narrative freedom"
        },
        {
            id: "assessment_counterStories",
            valueType: "string",
            valueOptions: [
                 "never",
                "seldom",
                "sometimes",
                "often",
                "I don't know"
           ],
            displayType: "select",
            displayName: "Countering",
            displayPrompt: "As you listened to people talk, how often did you hear a person respond to a story with another story that <strong>countered</strong> it in some way?"
        },
        {
            id: "assessment_authority",
            valueType: "string",
            valueOptions: [
                "enthrallment",
                "strong listening",
                "partial listening",
                "nothing special",
                "I don't know"
            ],
            displayType: "select",
            displayName: "Authority",
            displayPrompt: "When someone who was obviously in <strong>authority</strong> was telling stories, how much time and attention did they get?"
        },
        {
            id: "assessment_mistakes",
            valueType: "string",
            valueOptions: [
                "never",
                "seldom",
                "sometimes",
                "often",
                "I don't know"
            ],
            displayType: "select",
            displayName: "Mistakes",
            displayPrompt: "How many times did you hear people tell stories about <strong>mistakes</strong>?"
        },
        {
            id: "assessment_silencing",
            valueType: "string",
            valueOptions: [
                "warning",
                "caution",
                "request",
                "joke",
                "I don't know"
            ],
            displayType: "select",
            displayName: "Stepping in",
            displayPrompt: "When somebody started telling a story and another person <strong>stopped</strong> them, <em>how</em> did they stop them?"
        },
        {
            id: "assessment_conflict",
            valueType: "string",
            valueOptions: [
                "demand",
                "criticism",
                "comment",
                "joke",
                "I don't know"
            ],
            displayType: "select",
            displayName: "Disagreement",
            displayPrompt: "When somebody was telling a story and another person <strong>disagreed</strong> with the storyteller, <em>how</em> did they disagree?"
        },
        {
            id: "assessment_narrativeFlow",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Narrative flow"
        },
        {
            id: "assessment_remindings",
            valueType: "string",
            valueOptions: [
                "never",
                "seldom",
                "sometimes",
                "often",
                "I don't know"
            ],
            displayType: "select",
            displayName: "Reminding",
            displayPrompt: "When you listened to people telling stories, did you ever hear people say \"that reminds me of the time\" and then tell a story <strong>in response</strong>?"
        },
        {
            id: "assessment_retellings",
            valueType: "string",
            valueOptions: [
                "never",
                "seldom",
                "sometimes",
                "often",
                "I don't know"
            ],
            displayType: "select",
            displayName: "Passing on stories",
            displayPrompt: "How often did you hear people <strong>pass on</strong> stories they heard from other people?"
        },
        {
            id: "assessment_folklore",
            valueType: "string",
            valueOptions: [
                "none",
                "little",
                "some",
                "strong",
                "I don't know"
            ],
            displayType: "select",
            displayName: "Folklore",
            displayPrompt: "How much evidence did you find for a <strong>narrative folklore</strong> in your community or organization?"
        },
        {
            id: "assessment_storyTypes",
            valueType: "string",
            valueOptions: [
                "no",
                "maybe",
                "I think so",
                "definitely",
                "I don't know"
            ],
            displayType: "select",
            displayName: "Story types",
            displayPrompt: "Did you hear these story <strong>genres</strong>: comic stories, tragic stories, epic stories, and funny stories?"
        },
        {
            id: "assessment_sensemaking",
            valueType: "string",
            valueOptions: [
                "never",
                "seldom",
                "sometimes",
                "often",
                "I don't know"
            ],
            displayType: "select",
            displayName: "Decision making",
            displayPrompt: "Did you ever see people sharing stories as they prepared to make <strong>decisions</strong>?"
        },
        {
            id: "assessment_narrativeKnowledge",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Narrative knowledge"
        },
        {
            id: "assessment_realStories",
            valueType: "string",
            valueOptions: [
                "never",
                "seldom",
                "sometimes",
                "often",
                "I don't know"
            ],
            displayType: "select",
            displayName: "Recountings of events",
            displayPrompt: "Did you see people tell stories that were <strong>recountings of events</strong> based on emotional experiences from particular perspectives?"
        },
        {
            id: "assessment_negotiations",
            valueType: "string",
            valueOptions: [
                "never",
                "seldom",
                "sometimes",
                "often",
                "I don't know"
            ],
            displayType: "select",
            displayName: "Vitality",
            displayPrompt: "How often did you see <strong>negotiations</strong> between storytellers and audiences?"
        },
        {
            id: "assessment_cotelling",
            valueType: "string",
            valueOptions: [
                "never",
                "seldom",
                "sometimes",
                "often",
                "I don't know"
            ],
            displayType: "select",
            displayName: "Sharing storytelling",
            displayPrompt: "Did you ever see two or more people tell a story <strong>together</strong>?"
        },
        {
            id: "assessment_blunders",
            valueType: "string",
            valueOptions: [
                "often",
                "sometimes",
                "seldom",
                "never",
                "I don't know"
            ],
            displayType: "select",
            displayName: "Blunders",
            displayPrompt: "How often did you see someone start telling the <strong>wrong</strong> story, to the wrong people, at the wrong time?"
        },
        {
            id: "assessment_accounting",
            valueType: "string",
            valueOptions: [
                "never",
                "seldom",
                "sometimes",
                "often",
                "I don't know"
            ],
            displayType: "select",
            displayName: "Accountability",
            displayPrompt: "Did you see people <strong>account</strong> for their actions and choices by telling each other stories?"
        },
        {
            id: "assessment_narrativeUnity",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Narrative unity"
        },
        {
            id: "assessment_commonStories",
            valueType: "string",
            valueOptions: [
                "impossible",
                "difficult",
                "doable",
                "easy",
                "I don't know"
            ],
            displayType: "select",
            displayName: "Common stories",
            displayPrompt: "How easy would it be to create a list of <strong>common stories</strong>, those any member of your community or organization could be expected to know?"
        },
        {
            id: "assessment_sacredStories",
            valueType: "string",
            valueOptions: [
                "impossible",
                "difficult",
                "doable",
                "easy",
                "I don't know"
            ],
            displayType: "select",
            displayName: "Sacred stories",
            displayPrompt: "How easy would it be to create a list of <strong>sacred stories</strong>, those important to understanding the community or organization?"
        },
        {
            id: "assessment_condensedStories",
            valueType: "string",
            valueOptions: [
                "impossible",
                "difficult",
                "doable",
                "easy",
                "I don't know"
            ],
            displayType: "select",
            displayName: "Condensed stories",
            displayPrompt: "How easy would it be to create a list of <strong>condensed stories</strong>, in the form of proverbs or references?"
        },
        {
            id: "assessment_intermingling",
            valueType: "string",
            valueOptions: [
                "never",
                "seldom",
                "sometimes",
                "often",
                "I don't know"
            ],
            displayType: "select",
            displayName: "Intermingling",
            displayPrompt: "How often were the stories you heard <strong>intermingled</strong> with each other?"
        },
        {
            id: "assessment_culture",
            valueType: "string",
            valueOptions: [
                "impossible",
                "difficult",
                "doable",
                "easy",
                "I don't know"
            ],
            displayType: "select",
            displayName: "Culture",
            displayPrompt: "How easy would it be to describe the unique story sharing <strong>culture</strong> of your community or organization?"
        },
        {
            id: "assessment_result_header",
            valueType: "none",
            displayType: "header",
            displayPrompt: "Your score"
        },
        {
            id: "assessment_result_freedomSubscore",
            valueType: "none",
            displayType: "quizScoreResult",
            displayConfiguration: [
                "assessment_counterStories",
                "assessment_authority",
                "assessment_mistakes",
                "assessment_silencing",
                "assessment_conflict"
            ],
            displayPrompt: "Narrative <strong>freedom</strong>:"
        },
        {
            id: "assessment_result_flowSubscore",
            valueType: "none",
            displayType: "quizScoreResult",
            displayConfiguration: [
                "assessment_remindings",
                "assessment_retellings",
                "assessment_folklore",
                "assessment_storyTypes",
                "assessment_sensemaking"
            ],
            displayPrompt: "Narrative <strong>flow</strong>:"
        },
        {
            id: "assessment_result_knowledgeSubscore",
            valueType: "none",
            displayType: "quizScoreResult",
            displayConfiguration: [
                "assessment_realStories",
                "assessment_negotiations",
                "assessment_cotelling",
                "assessment_blunders",
                "assessment_accounting"
            ],
            displayPrompt: "Narrative <strong>knowledge</strong>:"
        },
        {
            id: "assessment_result_unitySubscore",
            valueType: "none",
            displayType: "quizScoreResult",
            displayConfiguration: [
                "assessment_commonStories",
                "assessment_sacredStories",
                "assessment_condensedStories",
                "assessment_intermingling",
                "assessment_culture"
            ],
            displayPrompt: "Narrative <strong>unity</strong>:"
        },
        {
            id: "assessment_result_grandTotal",
            valueType: "none",
            displayType: "quizScoreResult",
            displayConfiguration: [
                "assessment_counterStories",
                "assessment_authority",
                "assessment_mistakes",
                "assessment_silencing",
                "assessment_conflict",
                "assessment_remindings",
                "assessment_retellings",
                "assessment_folklore",
                "assessment_storyTypes",
                "assessment_sensemaking",
                "assessment_realStories",
                "assessment_negotiations",
                "assessment_cotelling",
                "assessment_blunders",
                "assessment_accounting",
                "assessment_commonStories",
                "assessment_sacredStories",
                "assessment_condensedStories",
                "assessment_intermingling",
                "assessment_culture"
            ],
            displayPrompt: "Combined score:"
        },
        {
            id: "assessment_notes",
            valueType: "string",
            displayType: "textarea",
            displayName: "Notes",
            displayPrompt: "Here you can record some <strong>notes</strong> or comments about this assessment."
        }
    ]
};

export = panel;

