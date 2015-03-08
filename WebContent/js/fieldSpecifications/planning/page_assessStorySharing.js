define([], function() {
    "use strict";
    return [
        {
            id: "page_assessStorySharing",
            displayName: "Assess story sharing",
            displayType: "page",
            section: "planning",
            modelClass: "ProjectModel"
        },
        {
            id: "assessment_intro",
            dataType: "none",
            displayType: "label",
            displayPrompt: "On this page you can answer questions about your community or organization to assess its story sharing culture.\nBefore you answer these questions, you should spend some time listening to people share stories together\nin the places where they normally gather."
        },
        {
            id: "assessment_narrativeFreedom",
            dataType: "none",
            displayType: "header",
            displayPrompt: "Narrative freedom"
        },
        {
            id: "assessment_counterStories",
            dataType: "string",
            dataOptions: ["unknown","never","seldom","sometimes","often"],
            required: true,
            displayType: "select",
            displayName: "Countering",
            displayPrompt: "As you listened to people talk, how often did you hear a person respond to a story with another story that countered it in some way?"
        },
        {
            id: "assessment_authority",
            dataType: "string",
            dataOptions: ["unknown","enthrallment","strong listening","partial listening","nothing special"],
            required: true,
            displayType: "select",
            displayName: "Authority",
            displayPrompt: "When someone who was obviously in authority was telling stories, how much time and attention did they get?"
        },
        {
            id: "assessment_mistakes",
            dataType: "string",
            dataOptions: ["unknown","never","seldom","sometimes","often"],
            required: true,
            displayType: "select",
            displayName: "Mistakes",
            displayPrompt: "How many times did you hear people tell stories about mistakes?"
        },
        {
            id: "assessment_silencing",
            dataType: "string",
            dataOptions: ["unknown","warning","caution","request","joke"],
            required: true,
            displayType: "select",
            displayName: "Stepping in",
            displayPrompt: "When somebody started telling a story and another person stopped them, how did they stop them?"
        },
        {
            id: "assessment_conflict",
            dataType: "string",
            dataOptions: ["unknown","demand","criticism","comment","joke"],
            required: true,
            displayType: "select",
            displayName: "Disagreement",
            displayPrompt: "When somebody was telling a story and another person disagreed with the storyteller, how did they disagree?"
        },
        {
            id: "assessment_narrativeFlow",
            dataType: "none",
            displayType: "header",
            displayPrompt: "Narrative flow"
        },
        {
            id: "assessment_remindings",
            dataType: "string",
            dataOptions: ["unknown","never","seldom","sometimes","often"],
            required: true,
            displayType: "select",
            displayName: "Reminding",
            displayPrompt: "When you listened to people telling stories, did you ever hear people say \"that reminds me of the time\" and then tell a story in response?"
        },
        {
            id: "assessment_retellings",
            dataType: "string",
            dataOptions: ["unknown","never","seldom","sometimes","often"],
            required: true,
            displayType: "select",
            displayName: "Passing on stories",
            displayPrompt: "How often did you hear people pass on stories they heard from other people?"
        },
        {
            id: "assessment_folklore",
            dataType: "string",
            dataOptions: ["unknown","none","little","some","strong"],
            required: true,
            displayType: "select",
            displayName: "Folklore",
            displayPrompt: "How much evidence did you find for a narrative folklore in your community or organization?"
        },
        {
            id: "assessment_storyTypes",
            dataType: "string",
            dataOptions: ["unknown","no","maybe","I think so","definitely"],
            required: true,
            displayType: "select",
            displayName: "Story types",
            displayPrompt: "Did you hear comic stories, tragic stories, epic stories, and funny stories?"
        },
        {
            id: "assessment_sensemaking",
            dataType: "string",
            dataOptions: ["unknown","never","seldom","sometimes","often"],
            required: true,
            displayType: "select",
            displayName: "Decision making",
            displayPrompt: "Did you ever see people share stories as they prepared to make decisions?"
        },
        {
            id: "assessment_narrativeKnowledge",
            dataType: "none",
            displayType: "header",
            displayPrompt: "Narrative knowledge"
        },
        {
            id: "assessment_realStories",
            dataType: "string",
            dataOptions: ["unknown","never","seldom","sometimes","often"],
            required: true,
            displayType: "select",
            displayName: "Recountings of events",
            displayPrompt: "Did you see people tell stories that were recountings of events based on emotional experiences from particular perspectives?"
        },
        {
            id: "assessment_negotiations",
            dataType: "string",
            dataOptions: ["unknown","never","seldom","sometimes","often"],
            required: true,
            displayType: "select",
            displayName: "Vitality",
            displayPrompt: "How lively were the negotiations you heard going on between storytellers and audiences?"
        },
        {
            id: "assessment_cotelling",
            dataType: "string",
            dataOptions: ["unknown","never","seldom","sometimes","often"],
            required: true,
            displayType: "select",
            displayName: "Sharing storytelling",
            displayPrompt: "Did you ever see two or more people tell a story together?"
        },
        {
            id: "assessment_blunders",
            dataType: "string",
            dataOptions: ["unknown","often","sometimes","seldom","never"],
            required: true,
            displayType: "select",
            displayName: "Blunders",
            displayPrompt: "How often did you see someone start telling the wrong story to the wrong people at the wrong time?"
        },
        {
            id: "assessment_accounting",
            dataType: "string",
            dataOptions: ["unknown","never","seldom","sometimes","often"],
            required: true,
            displayType: "select",
            displayName: "Accountability",
            displayPrompt: "Did you see people account for their actions and choices by telling each other stories?"
        },
        {
            id: "assessment_narrativeUnity",
            dataType: "none",
            displayType: "header",
            displayPrompt: "Narrative unity"
        },
        {
            id: "assessment_commonStories",
            dataType: "string",
            dataOptions: ["unknown","impossible","difficult","doable","easy"],
            required: true,
            displayType: "select",
            displayName: "Common stories",
            displayPrompt: "How easy would it be to create a list of stories any member of your community or organization could be expected to know?"
        },
        {
            id: "assessment_sacredStories",
            dataType: "string",
            dataOptions: ["unknown","impossible","difficult","doable","easy"],
            required: true,
            displayType: "select",
            displayName: "Sacred stories",
            displayPrompt: "How easy would it be to create a list of sacred stories, those important to understanding the community or organization?"
        },
        {
            id: "assessment_condensedStories",
            dataType: "string",
            dataOptions: ["unknown","impossible","difficult","doable","easy"],
            required: true,
            displayType: "select",
            displayName: "Condensed stories",
            displayPrompt: "How easy would it be to create a list of condensed stories, in the form of proverbs or references?"
        },
        {
            id: "assessment_intermingling",
            dataType: "string",
            dataOptions: ["unknown","never","seldom","sometimes","often"],
            required: true,
            displayType: "select",
            displayName: "Intermingling",
            displayPrompt: "How often were the stories you heard intermingled with each other?"
        },
        {
            id: "assessment_culture",
            dataType: "string",
            dataOptions: ["unknown","impossible","difficult","doable","easy"],
            required: true,
            displayType: "select",
            displayName: "Culture",
            displayPrompt: "How easy would it be to describe the unique storytelling culture of your community or organization?"
        },
        {
            id: "assessment_result_header",
            dataType: "none",
            displayType: "header",
            displayPrompt: "Narrative score results"
        },
        {
            id: "assessment_result_freedomSubscore",
            dataType: "none",
            displayType: "quizScoreResult",
            displayConfiguration: ["assessment_counterStories","assessment_authority","assessment_mistakes","assessment_silencing","assessment_conflict"],
            displayPrompt: "Narrative freedom subscore:"
        },
        {
            id: "assessment_result_flowSubscore",
            dataType: "none",
            displayType: "quizScoreResult",
            displayConfiguration: ["assessment_remindings","assessment_retellings","assessment_folklore","assessment_storyTypes","assessment_sensemaking"],
            displayPrompt: "Narrative flow subscore:"
        },
        {
            id: "assessment_result_knowledgeSubscore",
            dataType: "none",
            displayType: "quizScoreResult",
            displayConfiguration: ["assessment_realStories","assessment_negotiations","assessment_cotelling","assessment_blunders","assessment_accounting"],
            displayPrompt: "Narrative knowledge subscore:"
        },
        {
            id: "assessment_result_unitySubscore",
            dataType: "none",
            displayType: "quizScoreResult",
            displayConfiguration: ["assessment_commonStories","assessment_sacredStories","assessment_condensedStories","assessment_intermingling","assessment_culture"],
            displayPrompt: "Narrative unity subscore:"
        },
        {
            id: "assessment_result_grandTotal",
            dataType: "none",
            displayType: "quizScoreResult",
            displayConfiguration: ["assessment_counterStories","assessment_authority","assessment_mistakes","assessment_silencing","assessment_conflict","assessment_remindings","assessment_retellings","assessment_folklore","assessment_storyTypes","assessment_sensemaking","assessment_realStories","assessment_negotiations","assessment_cotelling","assessment_blunders","assessment_accounting","assessment_commonStories","assessment_sacredStories","assessment_condensedStories","assessment_intermingling","assessment_culture"],
            displayPrompt: "This is your combined test result:"
        },
        {
            id: "assessment_notes",
            dataType: "string",
            displayType: "textarea",
            displayName: "Notes",
            displayPrompt: "Here you can record some notes or comments about this assessment."
        }
    ];
});
