"use strict";
define(
[
    {
        "id": "page_dashboard",
        "name": "Dashboard",
        "lineNumber": 59,
        "description": "",
        "isHeader": true,
        "questions": [
            {
                "id": "COMMENT_60",
                "text": "// all checklists combined",
                "type": "label",
                "options": null,
                "lineNumber": 60
            },
            {
                "id": "COMMENT_62",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 62
            },
            {
                "id": "COMMENT_63",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 63
            },
            {
                "id": "COMMENT_64",
                "text": "//                                                       PLANNING",
                "type": "label",
                "options": null,
                "lineNumber": 64
            },
            {
                "id": "COMMENT_65",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 65
            },
            {
                "id": "COMMENT_66",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 66
            }
        ]
    },
    {
        "id": "page_planning",
        "name": "Planning",
        "lineNumber": 68,
        "description": "",
        "isHeader": true,
        "questions": [
            {
                "id": "COMMENT_69",
                "text": "// Project facts - x of x questions answered",
                "type": "label",
                "options": null,
                "lineNumber": 69
            },
            {
                "id": "COMMENT_70",
                "text": "// Planning questions - [ ] draft",
                "type": "label",
                "options": null,
                "lineNumber": 70
            },
            {
                "id": "COMMENT_71",
                "text": "// Project aspects - x of x questions answered",
                "type": "label",
                "options": null,
                "lineNumber": 71
            },
            {
                "id": "COMMENT_72",
                "text": "// Project stories - x stories told",
                "type": "label",
                "options": null,
                "lineNumber": 72
            },
            {
                "id": "COMMENT_73",
                "text": "// Project story elements - x elements entered",
                "type": "label",
                "options": null,
                "lineNumber": 73
            },
            {
                "id": "COMMENT_74",
                "text": "// Story sharing assessment - x of 20 questions answered",
                "type": "label",
                "options": null,
                "lineNumber": 74
            },
            {
                "id": "COMMENT_75",
                "text": "// Project synopsis - [ ] complete",
                "type": "label",
                "options": null,
                "lineNumber": 75
            }
        ]
    },
    {
        "id": "page_projectFacts",
        "name": "Enter project facts",
        "lineNumber": 77,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "projectFacts",
                "text": "On this page you will enter some facts about your project. The things you enter here will appear in your reports.",
                "type": "label",
                "lineNumber": 79
            },
            {
                "id": "projectTitle",
                "text": "What is the project's title?",
                "type": "text",
                "lineNumber": 81
            },
            {
                "id": "communityOrOrganizationName",
                "text": "What is the name of your community or organization?",
                "type": "text",
                "lineNumber": 82
            },
            {
                "id": "projectFacilitators",
                "text": "Who is facilitating the project? (names and titles)",
                "type": "text",
                "lineNumber": 83
            },
            {
                "id": "projectStartAndEndDates",
                "text": "What are the project's start and ending dates?",
                "type": "text",
                "lineNumber": 84
            },
            {
                "id": "reportStartText",
                "text": "Please enter any other information you want to appear at the top of project reports.",
                "type": "textarea",
                "lineNumber": 85
            },
            {
                "id": "reportEndText",
                "text": "Please enter any other information you want to appear at the bottom of project reports (as notes).",
                "type": "textarea",
                "lineNumber": 86
            }
        ]
    },
    {
        "id": "page_planningQuestionsDraft",
        "name": "Answer PNI Planning questions",
        "lineNumber": 88,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "planning_draft",
                "text": "On this page you will answer some questions about your project's goals, relationships, focus, range, scope, and emphasis.\nIf you don't have good answers for these questions right now, don't worry; you will have a chance to come back and work on these answers again later.",
                "type": "label",
                "lineNumber": 90
            },
            {
                "id": "planning_draft_goal",
                "text": "What is the goal of the project? Why are you doing it?",
                "type": "textarea",
                "lineNumber": 93
            },
            {
                "id": "planning_draft_relationships",
                "text": "What relationships are important to the project?",
                "type": "textarea",
                "lineNumber": 94
            },
            {
                "id": "planning_draft_focus",
                "text": "What is the focus of the project? What is it about?",
                "type": "textarea",
                "lineNumber": 95
            },
            {
                "id": "planning_draft_range",
                "text": "What range(s) of experience will the project cover?",
                "type": "textarea",
                "lineNumber": 96
            },
            {
                "id": "planning_draft_scope",
                "text": "What is the project's scope? (number of people, number of stories, number of questions about stories)",
                "type": "textarea",
                "lineNumber": 97
            },
            {
                "id": "planning_draft_emphasis",
                "text": "Which phases of PNI will be important to the project? (indicate most and least important phases)",
                "type": "textarea",
                "lineNumber": 98
            }
        ]
    },
    {
        "id": "page_participantGroups",
        "name": "Describe participant groups",
        "lineNumber": 100,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "aboutParticipantGroups",
                "text": "On this page you will think about groups of participants you want to involve in your project.\nExamples might be: doctors and patients; staff and customers; natives, immigrants, and tourists.\nNarraCoach supports planning for up to three groups of project participants.",
                "type": "label",
                "lineNumber": 102
            },
            {
                "id": "participants_firstGroupName",
                "text": "Please name the group of participants from whom the project most needs to hear.",
                "type": "text",
                "lineNumber": 106
            },
            {
                "id": "participants_firstGroupDescription",
                "text": "Please describe this group of participants.\nFor example, you might want to record any observations you have made about this group.\nWhat do you know about them?",
                "type": "textarea",
                "lineNumber": 107
            },
            {
                "id": "participants_secondGroupName",
                "text": "Please name the group of participants from whom the project needs to hear next.",
                "type": "text",
                "lineNumber": 111
            },
            {
                "id": "participants_secondGroupDescription",
                "text": "Please describe the second-most critical group of participants.",
                "type": "textarea",
                "lineNumber": 112
            },
            {
                "id": "participants_thirdGroupName",
                "text": "If there is a third group of participants from whom the project needs to hear, please name them.",
                "type": "text",
                "lineNumber": 113
            },
            {
                "id": "participants_thirdGroupDescription",
                "text": "Please describe the third-most critical group of participants.",
                "type": "textarea",
                "lineNumber": 114
            }
        ]
    },
    {
        "id": "page_projectAspects",
        "name": "Consider project aspects",
        "lineNumber": 116,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "aspectsTable",
                "text": "Please answer these questions about each participant group.",
                "type": "page_aspectsTable",
                "options": "participants_firstGroupName;participants_secondGroupName;participants_thirdGroupName",
                "lineNumber": 118
            }
        ]
    },
    {
        "id": "page_aspectsTable",
        "name": "Project aspects",
        "lineNumber": 120,
        "description": "",
        "isHeader": false,
        "type": "questionsTable",
        "questions": [
            {
                "id": "aspects_statusHeader",
                "text": "Status",
                "type": "header",
                "lineNumber": 122
            },
            {
                "id": "aspects_status",
                "text": "What is the status of these participants in the community or organization?",
                "type": "select",
                "options": "unknown;very low;low;moderate;high;very high;mixed",
                "lineNumber": 123
            },
            {
                "id": "aspects_confidence",
                "text": "How much self-confidence do these participants have?",
                "type": "select",
                "options": "unknown;very low;low;medium;high;very high;mixed",
                "lineNumber": 124
            },
            {
                "id": "aspects_abilityHeader",
                "text": "Ability",
                "type": "header",
                "lineNumber": 126
            },
            {
                "id": "aspects_time",
                "text": "How much free time do these participants have?",
                "type": "select",
                "options": "unknown;very little;little;some;a lot;mixed",
                "lineNumber": 127
            },
            {
                "id": "aspects_education",
                "text": "What is the education level of these participants?",
                "type": "select",
                "options": "unknown;illiterate;minimal;moderate;high;very high;mixed",
                "lineNumber": 128
            },
            {
                "id": "aspects_physicalDisabilities",
                "text": "Do these participants have physical limitations that will impact their participation?",
                "type": "select",
                "options": "unknown;none;minimal;moderate;strong;mixed",
                "lineNumber": 129
            },
            {
                "id": "aspects_emotionalImpairments",
                "text": "Do these participants have emotional impairments that will impact their participation (such as mental illness or traumatic stress)?",
                "type": "select",
                "options": "unknown;none;minimal;moderate;strong;mixed",
                "lineNumber": 130
            },
            {
                "id": "aspects_expectationsHeader",
                "text": "Expectations",
                "type": "header",
                "lineNumber": 132
            },
            {
                "id": "aspects_performing",
                "text": "For these participants, how important is performing well (with \"high marks\")?",
                "type": "select",
                "options": "unknown;very unimportant;somewhat unimportant;somewhat important;very important;mixed",
                "lineNumber": 133
            },
            {
                "id": "aspects_conforming",
                "text": "For these participants, how important is conforming (to what is \"normal\" or expected)?",
                "type": "select",
                "options": "unknown;very unimportant;somewhat unimportant;somewhat important;very important;mixed",
                "lineNumber": 134
            },
            {
                "id": "aspects_promoting",
                "text": "For these participants, how important is self-promotion (competing with others)?",
                "type": "select",
                "options": "unknown;very unimportant;somewhat unimportant;somewhat important;very important;mixed",
                "lineNumber": 135
            },
            {
                "id": "aspects_venting",
                "text": "For these participants, how important is speaking out (having a say, venting, sounding off)?",
                "type": "select",
                "options": "unknown;very unimportant;somewhat unimportant;somewhat important;very important;mixed",
                "lineNumber": 136
            },
            {
                "id": "aspects_feelingsHeader",
                "text": "Feelings about the project",
                "type": "header",
                "lineNumber": 138
            },
            {
                "id": "aspects_interest",
                "text": "How motivated are these participants to participate in the project?",
                "type": "select",
                "options": "unknown;very little;a little;some;a lot;extremely;mixed",
                "lineNumber": 139
            },
            {
                "id": "aspects_feelings_project",
                "text": "How are these participants likely to feel about the project?",
                "type": "select",
                "options": "unknown;negative;neutral;positive;mixed",
                "lineNumber": 140
            },
            {
                "id": "aspects_feelings_facilitator",
                "text": "How do these participants feel about you?",
                "type": "select",
                "options": "unknown;negative;neutral;positive;mixed",
                "lineNumber": 141
            },
            {
                "id": "aspects_feelings_stories",
                "text": "How do these participants feel about the idea of collecting stories?",
                "type": "select",
                "options": "unknown;negative;neutral;positive;mixed",
                "lineNumber": 142
            },
            {
                "id": "aspects_topicHeader",
                "text": "Feelings about the topic",
                "type": "header",
                "lineNumber": 144
            },
            {
                "id": "aspects_topic_feeling",
                "text": "What experiences have these participants had with the project's topic?",
                "type": "select",
                "options": "unknown;strongly negative;negative;neutral;positive;strongly positive;mixed",
                "lineNumber": 145
            },
            {
                "id": "aspects_topic_private",
                "text": "How private do these participants consider the topic to be?",
                "type": "select",
                "options": "unknown;very private;medium;not private;mixed",
                "lineNumber": 146
            },
            {
                "id": "aspects_topic_articulate",
                "text": "How hard will it be for these participants to articulate their feelings about the topic?",
                "type": "select",
                "options": "unknown;hard;medium;easy;mixed",
                "lineNumber": 147
            },
            {
                "id": "aspects_topic_timeframe",
                "text": "How long of a time period do you need these participants to look back on?",
                "type": "select",
                "options": "unknown;hours;days;months;years;decades;mixed",
                "lineNumber": 148
            },
            {
                "id": "aspects_youHeader",
                "text": "About you",
                "type": "header",
                "lineNumber": 150
            },
            {
                "id": "aspects_you_experience",
                "text": "How much experience do you have facilitating PNI projects?",
                "type": "select",
                "options": "none;a little;some;a lot",
                "lineNumber": 151
            },
            {
                "id": "aspects_you_help",
                "text": "How much help will you have carrying out this project?",
                "type": "select",
                "options": "none;a little;some;a lot",
                "lineNumber": 152
            },
            {
                "id": "aspects_you_tech",
                "text": "How many technological resources will you have for carrying out this project?",
                "type": "select",
                "options": "none;a little;some;a lot",
                "lineNumber": 153
            }
        ]
    },
    {
        "id": "page_projectStories",
        "name": "Tell project stories",
        "lineNumber": 155,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "projectStoryList",
                "text": "These are the project stories you have told so far.",
                "type": "grid",
                "options": "page_projectStory",
                "lineNumber": 157
            }
        ]
    },
    {
        "id": "page_projectStory",
        "name": "Project story",
        "lineNumber": 159,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "projectStory_scenario",
                "text": "Start by choosing a scenario that starts your project story.",
                "shortText": "Scenario",
                "type": "select",
                "options": "ask me anything;magic ears;fly on the wall;project aspects;my own scenario type",
                "lineNumber": 161
            },
            {
                "id": "projectStory_outcome",
                "text": "Now choose an outcome for your story.",
                "shortText": "Outcome",
                "type": "select",
                "options": "colossal success;miserable failure;acceptable outcome;my own outcome",
                "lineNumber": 162
            },
            {
                "id": "projectStory_text",
                "text": "Now tell your project story as a future history (as though it has already happened).",
                "shortText": "Story",
                "type": "textarea",
                "lineNumber": 163
            },
            {
                "id": "projectStory_name",
                "text": "Please name your project story.",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 164
            },
            {
                "id": "projectStory_feelAbout",
                "text": "How do you feel about this story?",
                "shortText": "Feel about",
                "type": "textarea",
                "lineNumber": 165
            },
            {
                "id": "projectStory_surprise",
                "text": "What surprised you about this story?",
                "shortText": "Surprised",
                "type": "textarea",
                "lineNumber": 166
            },
            {
                "id": "projectStory_dangers",
                "text": "Describe any opportunities or dangers you see in this story.",
                "shortText": "Opportunities or dangers",
                "type": "textarea",
                "lineNumber": 167
            }
        ]
    },
    {
        "id": "page_projectStoryElements",
        "name": "Create project story elements",
        "lineNumber": 169,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "storyElementsInstructions",
                "text": "Here are some instructions on how to create story elements from your project stories.\n<ol>\n<li>Choose one or two types of story element (characters, situations, values, themes, relationships, motivations, beliefs, conflicts).</li>\n<li>For each story, come up with as many answers to that element's question as you can. Write the answers on sticky notes.</li>\n<li>The questions are:</li>\n<ul>\n<li>Characters: Who is doing things in this story?</li>\n<li>Situations: What is going on in this story?</li>\n<li>Values: What matters to the characters in this story?</li>\n<li>Themes: What is this story about?</li>\n<li>Relationships: How are the characters related in this story?</li>\n<li>Motivations: Why do the characters do what they do in this story?</li>\n<li>Beliefs: What do people believe in this story?</li>\n<li>Conflicts: Who or what stands in opposition in this story?</li>\n</ul>\n<li>Once you have answered the question(s) you chose for each story, cluster the sticky notes into groups. Place like with like.</li>\n<li>Give each group of sticky notes a name.</li>\n<li>Clear a \"halo\" of space around each group's name.</li>\n<li>In the halo, write 2-5 good and bad attributes (advantages and disadvantages, opportunities and dangers) of each group of sticky notes.</li>\n<li>Copy or move the new good/bad attributes to a new space. Mix them all together.</li>\n<li>Cluster the attributes into groups.</li>\n<li>Name the groups. These are your story elements.</li>\n</ol>",
                "type": "label",
                "lineNumber": 171
            },
            {
                "id": "projectStoryElementsList",
                "text": "These are the project story elements you have entered so far.",
                "type": "grid",
                "options": "page_addStoryElement",
                "lineNumber": 195
            }
        ]
    },
    {
        "id": "page_addStoryElement",
        "name": "Add story element",
        "lineNumber": 197,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "storyElementName",
                "text": "What is the name of the story element?",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 199
            },
            {
                "id": "storyElementType",
                "text": "What type of story element is this?",
                "shortText": "Type",
                "type": "select",
                "options": "character;situation;value;theme;relationship;motivation;belief;conflict",
                "lineNumber": 200
            },
            {
                "id": "storyElementDescription",
                "text": "You can describe it more fully here.",
                "shortText": "Description",
                "type": "textarea",
                "lineNumber": 201
            },
            {
                "id": "storyElementPhoto",
                "text": "You can enter a photograph of the element here.",
                "shortText": "Image",
                "type": "imageUploader",
                "lineNumber": 202
            }
        ]
    },
    {
        "id": "page_assessStorySharing",
        "name": "Assess story sharing",
        "lineNumber": 204,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "quiz_intro",
                "text": "On this page you can answer questions about your community or organization to assess its story sharing culture.\nBefore you answer these questions, you should spend some time listening to people share stories together\nin the places where they normally gather.",
                "type": "label",
                "lineNumber": 206
            },
            {
                "id": "quiz_narrativeFreedom",
                "text": "Narrative freedom",
                "type": "header",
                "lineNumber": 210
            },
            {
                "id": "quiz_counterStories",
                "text": "As you listened to people talk, how often did you hear a person respond to a story with another story that countered it in some way?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often",
                "lineNumber": 211
            },
            {
                "id": "quiz_authority",
                "text": "When someone who was obviously in authority was telling stories, how much time and attention did they get?",
                "type": "select",
                "options": "unknown;enthrallment;strong listening;partial listening;nothing special",
                "lineNumber": 212
            },
            {
                "id": "quiz_mistakes",
                "text": "How many times did you hear people tell stories about mistakes?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often",
                "lineNumber": 213
            },
            {
                "id": "quiz_silencing",
                "text": "When somebody started telling a story and another person stopped them, how did they stop them?",
                "type": "select",
                "options": "unknown;warning;caution;request;joke",
                "lineNumber": 214
            },
            {
                "id": "quiz_conflict",
                "text": "When somebody was telling a story and another person disagreed with the storyteller, how did they disagree?",
                "type": "select",
                "options": "unknown;demand;criticism;comment;joke",
                "lineNumber": 215
            },
            {
                "id": "quiz_narrativeFlow",
                "text": "Narrative flow",
                "type": "header",
                "lineNumber": 217
            },
            {
                "id": "quiz_remindings",
                "text": "When you listened to people telling stories, did you ever hear people say \"that reminds me of the time\" and then tell a story in response?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often",
                "lineNumber": 218
            },
            {
                "id": "quiz_retellings",
                "text": "How often did you hear people pass on stories they heard from other people?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often",
                "lineNumber": 219
            },
            {
                "id": "quiz_folklore",
                "text": "How much evidence did you find for a narrative folklore in your community or organization?",
                "type": "select",
                "options": "unknown;none;little;some;strong",
                "lineNumber": 220
            },
            {
                "id": "quiz_storyTypes",
                "text": "Did you hear comic stories, tragic stories, epic stories, and funny stories?",
                "type": "select",
                "options": "unknown;no;maybe;I think so;definitely",
                "lineNumber": 221
            },
            {
                "id": "quiz_sensemaking",
                "text": "Did you ever see people share stories as they prepared to make decisions?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often",
                "lineNumber": 222
            },
            {
                "id": "quiz_narrativeKnowledge",
                "text": "Narrative knowledge",
                "type": "header",
                "lineNumber": 224
            },
            {
                "id": "quiz_realStories",
                "text": "Did you see people tell stories that were recountings of events based on emotional experiences from particular perspectives?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often",
                "lineNumber": 225
            },
            {
                "id": "quiz_negotiations",
                "text": "How lively were the negotiations you heard going on between storytellers and audiences?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often",
                "lineNumber": 226
            },
            {
                "id": "quiz_cotelling",
                "text": "Did you ever see two or more people tell a story together?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often",
                "lineNumber": 227
            },
            {
                "id": "quiz_blunders",
                "text": "How often did you see someone start telling the wrong story to the wrong people at the wrong time?",
                "type": "select",
                "options": "unknown;often;sometimes;seldom;never",
                "lineNumber": 228
            },
            {
                "id": "quiz_accounting",
                "text": "Did you see people account for their actions and choices by telling each other stories?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often",
                "lineNumber": 229
            },
            {
                "id": "quiz_narrativeUnity",
                "text": "Narrative unity",
                "type": "header",
                "lineNumber": 231
            },
            {
                "id": "quiz_commonStories",
                "text": "How easy would it be to create a list of stories any member of your community or organization could be expected to know?",
                "type": "select",
                "options": "unknown;impossible;difficult;doable;easy",
                "lineNumber": 232
            },
            {
                "id": "quiz_sacredStories",
                "text": "How easy would it be to create a list of sacred stories, those important to understanding the community or organization?",
                "type": "select",
                "options": "unknown;impossible;difficult;doable;easy",
                "lineNumber": 233
            },
            {
                "id": "quiz_condensedStories",
                "text": "How easy would it be to create a list of condensed stories, in the form of proverbs or references?",
                "type": "select",
                "options": "unknown;impossible;difficult;doable;easy",
                "lineNumber": 234
            },
            {
                "id": "quiz_intermingling",
                "text": "How often were the stories you heard intermingled with each other?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often",
                "lineNumber": 235
            },
            {
                "id": "quiz_culture",
                "text": "How easy would it be to describe the unique storytelling culture of your community or organization?",
                "type": "select",
                "options": "unknown;impossible;difficult;doable;easy",
                "lineNumber": 236
            },
            {
                "id": "COMMENT_238",
                "text": "// should have results overall and for each category of question",
                "type": "label",
                "options": null,
                "lineNumber": 238
            },
            {
                "id": "quiz_result",
                "text": "This is your combined test result.",
                "type": "quizScoreResult",
                "lineNumber": 239
            },
            {
                "id": "quiz_notes",
                "text": "Here you can record some notes or comments about this assessment.",
                "type": "textarea",
                "lineNumber": 241
            }
        ]
    },
    {
        "id": "page_revisePNIPlanningQuestions",
        "name": "Revise PNI Planning questions",
        "lineNumber": 243,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "improvePlanningDrafts",
                "text": "Please review and improve your draft answers based on your consideration of project aspects and your project stories.",
                "type": "label",
                "lineNumber": 245
            },
            {
                "id": "planning_goal",
                "text": "What is the goal of the project? Why are you doing it?",
                "type": "textarea",
                "options": "planning_goal",
                "lineNumber": 247
            },
            {
                "id": "FIXME_248",
                "text": "What relationships are important to the project?",
                "type": "textarea",
                "options": "planning_relationships",
                "lineNumber": 248
            },
            {
                "id": "FIXME_249",
                "text": "What is the focus of the project? What is it about?",
                "type": "textarea",
                "options": "planning_focus",
                "lineNumber": 249
            },
            {
                "id": "FIXME_250",
                "text": "What range(s) of experience will the project cover?",
                "type": "textarea",
                "options": "planning_range",
                "lineNumber": 250
            },
            {
                "id": "planning_scope",
                "text": "What is the project's scope? (number of people, number of stories, number of questions about stories)",
                "type": "textarea",
                "options": "planning_draft_scope",
                "lineNumber": 251
            },
            {
                "id": "planning_emphasis",
                "text": "Which phases of PNI will be important to the project? (indicate most and least important phases)",
                "type": "textarea",
                "options": "planning_draft_emphasis",
                "lineNumber": 252
            }
        ]
    },
    {
        "id": "page_writeProjectSynopsis",
        "name": "Write project synopsis",
        "lineNumber": 254,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "projectSynopsis",
                "text": "Please summarize your project in one or two sentences.",
                "type": "textarea",
                "lineNumber": 256
            }
        ]
    },
    {
        "id": "page_readPlanningReport",
        "name": "Read planning report",
        "lineNumber": 258,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "planningReport",
                "text": "Project planning report",
                "type": "report",
                "options": "planning",
                "lineNumber": 260
            },
            {
                "id": "COMMENT_262",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 262
            },
            {
                "id": "COMMENT_263",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 263
            },
            {
                "id": "COMMENT_264",
                "text": "//                                                   COLLECTION DESIGN",
                "type": "label",
                "options": null,
                "lineNumber": 264
            },
            {
                "id": "COMMENT_265",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 265
            },
            {
                "id": "COMMENT_266",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 266
            }
        ]
    },
    {
        "id": "page_collectionDesign",
        "name": "Collection design",
        "lineNumber": 268,
        "description": "",
        "isHeader": true,
        "questions": [
            {
                "id": "COMMENT_269",
                "text": "// Collection venues - X venues chosen",
                "type": "label",
                "options": null,
                "lineNumber": 269
            },
            {
                "id": "COMMENT_270",
                "text": "// Story eliciting questions - x questions written",
                "type": "label",
                "options": null,
                "lineNumber": 270
            },
            {
                "id": "COMMENT_271",
                "text": "// Questions about stories - x questions written",
                "type": "label",
                "options": null,
                "lineNumber": 271
            },
            {
                "id": "COMMENT_272",
                "text": "// Questions about people - x stories written",
                "type": "label",
                "options": null,
                "lineNumber": 272
            },
            {
                "id": "COMMENT_273",
                "text": "// Question form - [ ] designed [ ] committed",
                "type": "label",
                "options": null,
                "lineNumber": 273
            }
        ]
    },
    {
        "id": "page_chooseCollectionVenues",
        "name": "Choose collection venues",
        "lineNumber": 275,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "venuesIntro",
                "text": "On this page you will choose story collection venues, or ways to collect stories.",
                "type": "label",
                "lineNumber": 277
            },
            {
                "id": "venueRecommendations",
                "text": "Venue recommendations",
                "type": "recommendationTable",
                "options": "Venues",
                "lineNumber": 279
            },
            {
                "id": "venuesTable",
                "text": "Please answer these questions about your collection venues for each participant group.",
                "type": "page_venuesTable",
                "options": "participants_firstGroupName,participants_secondGroupName,participants_thirdGroupName",
                "lineNumber": 281
            }
        ]
    },
    {
        "id": "page_venuesTable",
        "name": "Aspects table",
        "lineNumber": 283,
        "description": "",
        "isHeader": false,
        "type": "questionsTable",
        "questions": [
            {
                "id": "primaryVenue",
                "text": "Choose a primary means of story collection for this group.",
                "type": "select",
                "options": "individual interviews;group interviews;peer interviews;group story sessions;surveys;journals;narrative incident reports;gleaned stories",
                "lineNumber": 285
            },
            {
                "id": "primaryVenue_plans",
                "text": "Describe your story collection plans for this group and venue.",
                "type": "textarea",
                "lineNumber": 286
            },
            {
                "id": "secondaryVenue",
                "text": "If you want to collect stories in a second way for this same group, choose one of these options.",
                "type": "select",
                "options": "individual interviews;group interviews;peer interviews;group story sessions;surveys;journals;narrative incident reports;gleaned stories",
                "lineNumber": 287
            },
            {
                "id": "secondaryVenue_plans",
                "text": "Describe your secondary story collection for this group and venue.",
                "type": "textarea",
                "lineNumber": 288
            }
        ]
    },
    {
        "id": "page_writeStoryElicitingQuestions",
        "name": "Write story eliciting questions",
        "lineNumber": 290,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "elicitingQuestionsList",
                "text": "These are the story eliciting questions you have entered so far.",
                "type": "grid",
                "options": "page_addElicitingQuestion",
                "lineNumber": 292
            }
        ]
    },
    {
        "id": "page_addElicitingQuestion",
        "name": "Add story eliciting question",
        "lineNumber": 294,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "elicitingQuestionRecommendations",
                "text": "Recommendations for eliciting questions",
                "type": "recommendationTable",
                "options": "Eliciting questions",
                "lineNumber": 296
            },
            {
                "id": "elicitingQuestion",
                "text": "Enter a question with which to ask people to tell stories.",
                "shortText": "Question",
                "type": "textarea",
                "lineNumber": 298
            },
            {
                "id": "elicitingQuestionType",
                "text": "What type of question is this?",
                "shortText": "Type",
                "type": "checkboxes",
                "options": "what happened;directed question;undirected questions;point in time;event;extreme;surprise;people, places, things;fictional scenario;other",
                "lineNumber": 299
            },
            {
                "id": "elicitingQuestionTemplates",
                "text": "Or choose a question from this list.",
                "type": "templateList",
                "options": "elicitingQuestions",
                "lineNumber": 301
            }
        ]
    },
    {
        "id": "page_writeQuestionsAboutStories",
        "name": "Write questions about stories",
        "lineNumber": 303,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "storyQuestionsList",
                "text": "These are the questions you will be asking people about stories.",
                "type": "grid",
                "options": "page_addStoryQuestion",
                "lineNumber": 305
            }
        ]
    },
    {
        "id": "page_addStoryQuestion",
        "name": "Add story question",
        "lineNumber": 307,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "storyQuestionRecommendations",
                "text": "Recommendations for story questions",
                "type": "recommendationTable",
                "options": "storyQuestions",
                "lineNumber": 309
            },
            {
                "id": "storyQuestionText",
                "text": "Enter a question to ask people about their stories.",
                "shortText": "Question",
                "type": "textarea",
                "lineNumber": 311
            },
            {
                "id": "storyQuestionType",
                "text": "What type of question is this?",
                "shortText": "Type",
                "type": "select",
                "options": "boolean;label;header;checkbox;checkboxes;text;textarea;select;radio;slider",
                "lineNumber": 312
            },
            {
                "id": "storyQuestionShortName",
                "text": "Enter a short name we can use to refer to the question. (This name must be unique to the project.)",
                "shortText": "Short name",
                "type": "text",
                "lineNumber": 313
            },
            {
                "id": "storyQuestionHelp",
                "text": "If you want to provide help to people answering the question, enter it here.",
                "shortText": "Help",
                "type": "textarea",
                "lineNumber": 314
            },
            {
                "id": "storyQuestionTemplates",
                "text": "Or choose a question from this list.",
                "type": "templateList",
                "options": "storyQuestions",
                "lineNumber": 316
            }
        ]
    },
    {
        "id": "page_writeQuestionsAboutParticipants",
        "name": "Write questions about participants",
        "lineNumber": 318,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "participantQuestionsList",
                "text": "These are the questions you will be asking people about themselves.",
                "type": "grid",
                "options": "page_addParticipantQuestion",
                "lineNumber": 320
            }
        ]
    },
    {
        "id": "page_addParticipantQuestion",
        "name": "Add participant question",
        "lineNumber": 322,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "participantQuestionRecommendations",
                "text": "Recommendations for participant questions",
                "type": "recommendationTable",
                "options": "participantQuestions",
                "lineNumber": 324
            },
            {
                "id": "participantQuestionText",
                "text": "Enter a question to ask people about themselves.",
                "shortText": "Question",
                "type": "textarea",
                "lineNumber": 326
            },
            {
                "id": "participantQuestionType",
                "text": "What type of question is this?",
                "shortText": "Type",
                "type": "select",
                "options": "boolean;label;header;checkbox;checkboxes;text;textarea;select;radio;slider",
                "lineNumber": 327
            },
            {
                "id": "participantQuestionShortName",
                "text": "Enter a short name we can use to refer to the question. (This name must be unique to the project.)",
                "shortText": "Short name",
                "type": "text",
                "lineNumber": 328
            },
            {
                "id": "participantQuestionHelp",
                "text": "If you want to provide help to people answering the question, enter it here.",
                "shortText": "Help",
                "type": "textarea",
                "lineNumber": 329
            },
            {
                "id": "participantQuestionTemplates",
                "text": "Or choose a question from this list.",
                "type": "templateList",
                "options": "participantQuestions",
                "lineNumber": 331
            }
        ]
    },
    {
        "id": "page_designQuestionForm",
        "name": "Design question form",
        "lineNumber": 333,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "questionFormTitle",
                "text": "Please enter a title for the form.",
                "type": "text",
                "lineNumber": 335
            },
            {
                "id": "questionFormLogo",
                "text": "You can upload a logo or ather image to show at the top of the form.",
                "type": "imageUploader",
                "lineNumber": 336
            },
            {
                "id": "questionFormIntro",
                "text": "Please enter an introduction to be shown at the start of the form, after the title",
                "type": "textarea",
                "lineNumber": 337
            },
            {
                "id": "questionFormEndText",
                "text": "Please enter any text to be shown at the end of the form",
                "type": "textarea",
                "lineNumber": 338
            }
        ]
    },
    {
        "id": "page_planStoryCollectionSessions",
        "name": "Plan story collection sessions",
        "lineNumber": 340,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "collectionSessionIntro",
                "text": "If you don't plan to collect stories in group sessions, you can skip this page.",
                "type": "label",
                "lineNumber": 342
            },
            {
                "id": "collectionSessionRecommendations",
                "text": "Recommendations for story collection sessions",
                "type": "recommendationTable",
                "options": "collectionSessions",
                "lineNumber": 344
            },
            {
                "id": "storyCollectionSessionPlansList",
                "text": "These are the collection sessions you have designed so far.",
                "type": "grid",
                "options": "page_addStoryCollectionSession",
                "lineNumber": 346
            }
        ]
    },
    {
        "id": "page_addStoryCollectionSession",
        "name": "Design story collection session",
        "lineNumber": 348,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "collectionSessionName",
                "text": "Please give this session plan a name.",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 350
            },
            {
                "id": "collectionSessionRepetitions",
                "text": "How many repetitions of the session will there be?",
                "shortText": "Repetitions",
                "type": "text",
                "lineNumber": 351
            },
            {
                "id": "collectionSessionLength",
                "text": "How long will this session be?",
                "shortText": "Length",
                "type": "text",
                "lineNumber": 352
            },
            {
                "id": "collectionSessionTime",
                "text": "When will it take place?",
                "shortText": "Time",
                "type": "text",
                "lineNumber": 353
            },
            {
                "id": "collectionSessionLocation",
                "text": "Where will it take place?",
                "shortText": "Location",
                "type": "text",
                "lineNumber": 354
            },
            {
                "id": "collectionSessionSize",
                "text": "How many people will be invited to each repetition of this session?",
                "shortText": "Number of people",
                "type": "text",
                "lineNumber": 355
            },
            {
                "id": "collectionSessionGroups",
                "text": "From which participant group(s) will people be invited?",
                "shortText": "Participant groups",
                "type": "checkBoxesWithPull",
                "options": "participantGroups",
                "lineNumber": 356
            },
            {
                "id": "collectionSessionMaterials",
                "text": "What materials will this session require?",
                "shortText": "Materials",
                "type": "textarea",
                "lineNumber": 357
            },
            {
                "id": "collectionSessionDetails",
                "text": "Enter other details about this session.",
                "shortText": "Other",
                "type": "textarea",
                "lineNumber": 358
            },
            {
                "id": "collectionSessionActivitiesList",
                "text": "These are the activities added to this session plan so far.",
                "type": "grid",
                "options": "page_addCollectionSessionActivity",
                "lineNumber": 360
            },
            {
                "id": "printCollectionSessionAgenda",
                "text": "Print session agenda",
                "type": "button",
                "lineNumber": 362
            }
        ]
    },
    {
        "id": "page_addCollectionSessionActivity",
        "name": "Add story collection session activity",
        "lineNumber": 364,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "collectionSessionActivityName",
                "text": "Please give this activity a name.",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 366
            },
            {
                "id": "collectionSessionActivityType",
                "text": "What type of activity is this?",
                "shortText": "Type",
                "type": "select",
                "options": "ice-breaker;sharing stories (no task);sharing stories (simple task);discussing stories;twice-told stories exercise;timeline exercise;landscape exercise;my own exercise;other",
                "lineNumber": 367
            },
            {
                "id": "collectionActivityPlan",
                "text": "Describe the plan for this activity.",
                "shortText": "Plan",
                "type": "textarea",
                "lineNumber": 368
            },
            {
                "id": "collectionActivityOptionalParts",
                "text": "Describe optional elaborations you might or might not use in this activity.",
                "shortText": "Optional elaborations",
                "type": "textarea",
                "lineNumber": 369
            },
            {
                "id": "collectionActivityTime",
                "text": "How long will this activity take?",
                "shortText": "Length",
                "type": "text",
                "lineNumber": 370
            },
            {
                "id": "collectionActivityRecording",
                "text": "How will stories be recorded during this activity?",
                "shortText": "Recording",
                "type": "textarea",
                "lineNumber": 371
            },
            {
                "id": "collectionActivityMaterials",
                "text": "What materials will be provided for this activity?",
                "shortText": "Materials",
                "type": "textarea",
                "lineNumber": 372
            },
            {
                "id": "collectionActivitySpaces",
                "text": "What spaces will be used for this activity?",
                "shortText": "Spaces",
                "type": "textarea",
                "lineNumber": 373
            },
            {
                "id": "collectionActivityFacilitation",
                "text": "What sort of facilitation will be necessary for this activity?",
                "shortText": "Facilitation",
                "type": "textarea",
                "lineNumber": 374
            }
        ]
    },
    {
        "id": "readCollectionDesignReport",
        "name": "Read collection design report",
        "lineNumber": 376,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "collectionDesignReport",
                "text": "Collection design report",
                "type": "report",
                "options": "collectionDesign",
                "lineNumber": 378
            },
            {
                "id": "COMMENT_380",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 380
            },
            {
                "id": "COMMENT_381",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 381
            },
            {
                "id": "COMMENT_382",
                "text": "//                                                  COLLECTION PROCESS",
                "type": "label",
                "options": null,
                "lineNumber": 382
            },
            {
                "id": "COMMENT_383",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 383
            },
            {
                "id": "COMMENT_384",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 384
            }
        ]
    },
    {
        "id": "page_collectionProcess",
        "name": "Collection process",
        "lineNumber": 386,
        "description": "",
        "isHeader": true,
        "questions": [
            {
                "id": "COMMENT_387",
                "text": "// Online story collection is [ ] enabled",
                "type": "label",
                "options": null,
                "lineNumber": 387
            },
            {
                "id": "COMMENT_388",
                "text": "// Number of stories entered - x",
                "type": "label",
                "options": null,
                "lineNumber": 388
            },
            {
                "id": "COMMENT_389",
                "text": "// Number of participants who told stories - x",
                "type": "label",
                "options": null,
                "lineNumber": 389
            }
        ]
    },
    {
        "id": "page_finalizeQuestionForms",
        "name": "Finalize question forms",
        "lineNumber": 391,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "finalizeLabel",
                "text": "On this page you will finalize your questions for story collection. Once you have started your story collection,\nyou should not make changes to your questions. You will still be able to make changes after you click the \"Finalize\" button,\nbut the system will ask you to confirm each change.",
                "type": "label",
                "lineNumber": 393
            },
            {
                "id": "printStoryForm",
                "text": "Print story form",
                "type": "button",
                "lineNumber": 397
            },
            {
                "id": "copyStoryFormURL",
                "text": "Copy story form web link",
                "type": "button",
                "lineNumber": 399
            },
            {
                "id": "finalizeStoryForm",
                "text": "Finalize story form",
                "type": "button",
                "lineNumber": 401
            }
        ]
    },
    {
        "id": "page_startStoryCollection",
        "name": "Start story collection",
        "lineNumber": 403,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "startCollectionLabel",
                "text": "If you are doing story collection over the internet, click this button to make the web form \"live\" and able\nto be used by people other than yourself.",
                "type": "label",
                "lineNumber": 405
            },
            {
                "id": "enableWebStoryForm",
                "text": "Enable web story form",
                "type": "button",
                "lineNumber": 408
            },
            {
                "id": "FIXME_410",
                "text": "Copy story form web link",
                "type": "button",
                "lineNumber": 410
            }
        ]
    },
    {
        "id": "page_storyCollectionFormForParticipants",
        "name": "Participate in the story collection",
        "lineNumber": 412,
        "description": "",
        "isHeader": false,
        "type": "participantStoryForm",
        "questions": [
            {
                "id": "COMMENT_414",
                "text": "// the info shown here is what was designed - how to specify that",
                "type": "label",
                "options": null,
                "lineNumber": 414
            }
        ]
    },
    {
        "id": "page_enterStories",
        "name": "Enter stories",
        "lineNumber": 416,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "COMMENT_418",
                "text": "// this page is the same as the \"participate\" page above, but only the admin can see it",
                "type": "label",
                "options": null,
                "lineNumber": 418
            },
            {
                "id": "COMMENT_419",
                "text": "// and the normal tabs are shown on the page",
                "type": "label",
                "options": null,
                "lineNumber": 419
            },
            {
                "id": "COMMENT_421",
                "text": "// the info shown here is what was designed - how to specify that",
                "type": "label",
                "options": null,
                "lineNumber": 421
            }
        ]
    },
    {
        "id": "page_reviewIncomingStories",
        "name": "Review incoming stories",
        "lineNumber": 423,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "collectedStoriesDuringCollection",
                "text": "Collected stories",
                "type": "storyBrowser",
                "lineNumber": 425
            }
        ]
    },
    {
        "id": "page_stopStoryCollection",
        "name": "Stop story collection",
        "lineNumber": 427,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "stopCollectionLabel",
                "text": "If you are doing story collection over the internet, click this button to make the web form\nunavailable to anyone but yourself.",
                "type": "label",
                "lineNumber": 429
            },
            {
                "id": "disableWebStoryForm",
                "text": "Disable web story form",
                "type": "button",
                "lineNumber": 432
            }
        ]
    },
    {
        "id": "page_enterCollectionSessionRecords",
        "name": "Enter story collection session records",
        "lineNumber": 434,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "collectionRecordsLabel",
                "text": "Note: If you did not hold any story collection sessions, you can skip this page.",
                "type": "label",
                "lineNumber": 436
            },
            {
                "id": "storyCollectionSessionRecordsList",
                "text": "These are the story collection records you have entered so far.",
                "type": "grid",
                "options": "page_addCollectionSessionRecord",
                "lineNumber": 438
            }
        ]
    },
    {
        "id": "page_addCollectionSessionRecord",
        "name": "Add story collection session record",
        "lineNumber": 440,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "collectionSessionConstructionsList",
                "text": "These are the group constructions you have entered for this session so far.",
                "type": "grid",
                "options": "page_newCollectionSessionConstruction",
                "lineNumber": 442
            },
            {
                "id": "collectionSessionNotesList",
                "text": "These are the notes you have entered for this story collection session so far.",
                "type": "grid",
                "options": "page_newCollectionSessionNotes",
                "lineNumber": 444
            }
        ]
    },
    {
        "id": "page_newCollectionSessionConstruction",
        "name": "Story collection construction",
        "lineNumber": 446,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "collectionSessionConstructionName",
                "text": "Please give this construction a name.",
                "type": "text",
                "lineNumber": 448
            },
            {
                "id": "collectionSessionConstructionType",
                "text": "What type of construction is it?",
                "type": "select",
                "options": "timeline;landscape;other",
                "lineNumber": 449
            },
            {
                "id": "collectionSessionContructionText",
                "text": "Please describe the construction (or include a description given by participants).",
                "type": "textarea",
                "lineNumber": 450
            },
            {
                "id": "collectionSessionConstructionLink",
                "text": "You can include a link to an audio or video description here.",
                "type": "text",
                "lineNumber": 451
            },
            {
                "id": "collectionSessionConstructionImagesList",
                "text": "These are the images you have entered for the construction so far.",
                "type": "grid",
                "options": "page_newCollectionConstructionImage",
                "lineNumber": 452
            }
        ]
    },
    {
        "id": "page_newCollectionConstructionImage",
        "name": "Collection construction image",
        "lineNumber": 454,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "collectionSessionConstructionImage",
                "text": "Upload an image for this construction.",
                "shortText": "Image",
                "type": "imageUploader",
                "lineNumber": 456
            },
            {
                "id": "collectionSessionConstructionImageName",
                "text": "Please give this image a name.",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 457
            },
            {
                "id": "collectionSessionConstructionImageNotes",
                "text": "Make any notes you'd like to record on this image here.",
                "shortText": "Notes",
                "type": "textarea",
                "lineNumber": 458
            }
        ]
    },
    {
        "id": "page_newCollectionSessionNotes",
        "name": "Collection session notes",
        "lineNumber": 460,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "collectionSessionNotesName",
                "text": "Please give this set of notes a name.",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 462
            },
            {
                "id": "collectionSessionNotesText",
                "text": "Enter your notes here.",
                "shortText": "Notes",
                "type": "textarea",
                "lineNumber": 463
            },
            {
                "id": "collectionSessionNoteImagesList",
                "text": "These are the images you have entered for this set of notes so far.",
                "shortText": "Images",
                "type": "grid",
                "options": "page_newCollectionSessionImage",
                "lineNumber": 464
            }
        ]
    },
    {
        "id": "page_newCollectionSessionImage",
        "name": "Collection session notes image",
        "lineNumber": 466,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "collectionSessionNotesImage",
                "text": "Upload your image here.",
                "shortText": "Image",
                "type": "imageUploader",
                "lineNumber": 468
            },
            {
                "id": "collectionSessionImageName",
                "text": "Please give this image a name.",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 469
            },
            {
                "id": "collectionSessionNotesImageNotes",
                "text": "You can enter some notes about this image.",
                "shortText": "Notes",
                "type": "textarea",
                "lineNumber": 470
            }
        ]
    },
    {
        "id": "page_answerQuestionsAboutCollectionSessions",
        "name": "Reflect on story collection sessions",
        "lineNumber": 472,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "storyCollectionSessionReflectionsList",
                "text": "These are session reflections you have entered so far.",
                "type": "grid",
                "options": "page_answerQuestionsAboutCollectionSession",
                "lineNumber": 474
            }
        ]
    },
    {
        "id": "page_answerQuestionsAboutCollectionSession",
        "name": "Reflect on story collection session",
        "lineNumber": 476,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "collectionReflectChangeLabel",
                "text": "Change",
                "type": "header",
                "lineNumber": 478
            },
            {
                "id": "collectionReflectChangeEmotions",
                "text": "How did the perceptions of the participants change from the start to the end of the session?",
                "shortText": "Change in participant perceptions",
                "type": "textarea",
                "lineNumber": 479
            },
            {
                "id": "collectionReflectChangeYourEmotions",
                "text": "How did <i>your</i> perceptions change?",
                "shortText": "Change in facilitator perceptions",
                "type": "textarea",
                "lineNumber": 480
            },
            {
                "id": "collectionReflectProjectChanged",
                "text": "How has the overall project changed as a result of this session?",
                "shortText": "Changes to the project",
                "type": "textarea",
                "lineNumber": 481
            },
            {
                "id": "collectionReflectInteractionsLabel",
                "text": "Interactions",
                "type": "header",
                "lineNumber": 483
            },
            {
                "id": "collectionReflectInteractionsParticipants",
                "text": "Describe the interactions between participants in this session.",
                "shortText": "Interactions among participants",
                "type": "textarea",
                "lineNumber": 484
            },
            {
                "id": "collectionReflectInteractionsFacilitators",
                "text": "Describe interactions between participants and facilitators.",
                "shortText": "Interactions between participants and facilitators",
                "type": "textarea",
                "lineNumber": 485
            },
            {
                "id": "collectionReflectStories",
                "text": "What did you notice about the stories people told, retold, chose, and worked with during the session?",
                "shortText": "Stories",
                "type": "textarea",
                "lineNumber": 486
            },
            {
                "id": "collectionReflectLearningLabel",
                "text": "Learning",
                "type": "header",
                "lineNumber": 488
            },
            {
                "id": "collectionReflectSpecial",
                "text": "What was special about these people in this place on this day?",
                "shortText": "Unique features",
                "type": "textarea",
                "lineNumber": 489
            },
            {
                "id": "collectionReflectSurprise",
                "text": "What surprised you about this session?",
                "shortText": "Surprise",
                "type": "textarea",
                "lineNumber": 490
            },
            {
                "id": "collectionReflectWorkedWellAndNot",
                "text": "Which parts of your plans for this session worked out well? Which parts didn't?",
                "shortText": "Worked and didn't work",
                "type": "textarea",
                "lineNumber": 491
            },
            {
                "id": "collectionReflectNewIdeas",
                "text": "What new ideas did you gain from this session? What did you learn from it?",
                "shortText": "New ideas",
                "type": "textarea",
                "lineNumber": 492
            },
            {
                "id": "collectionReflectExtra",
                "text": "What else do you want to remember about this session?",
                "shortText": "Other",
                "type": "textarea",
                "lineNumber": 493
            }
        ]
    },
    {
        "id": "page_readCollectionProcessReport",
        "name": "Read collection process report",
        "lineNumber": 495,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "collectionProcessReport",
                "text": "Collection process report",
                "type": "report",
                "options": "collectionProcess",
                "lineNumber": 497
            },
            {
                "id": "COMMENT_499",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 499
            },
            {
                "id": "COMMENT_500",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 500
            },
            {
                "id": "COMMENT_501",
                "text": "//                                                       CATALYSIS",
                "type": "label",
                "options": null,
                "lineNumber": 501
            },
            {
                "id": "COMMENT_502",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 502
            },
            {
                "id": "COMMENT_503",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 503
            }
        ]
    },
    {
        "id": "page_catalysis",
        "name": "Catalysis",
        "lineNumber": 505,
        "description": "",
        "isHeader": true,
        "questions": [
            {
                "id": "COMMENT_506",
                "text": "// Observations - x",
                "type": "label",
                "options": null,
                "lineNumber": 506
            },
            {
                "id": "COMMENT_507",
                "text": "// Interpretations - x",
                "type": "label",
                "options": null,
                "lineNumber": 507
            },
            {
                "id": "COMMENT_508",
                "text": "// Ideas - x",
                "type": "label",
                "options": null,
                "lineNumber": 508
            },
            {
                "id": "COMMENT_509",
                "text": "// Perspectives - x",
                "type": "label",
                "options": null,
                "lineNumber": 509
            }
        ]
    },
    {
        "id": "page_browseStories",
        "name": "Browse stories",
        "lineNumber": 511,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "collectedStoriesAfterCollection",
                "text": "Collected stories",
                "type": "storyBrowser",
                "options": "addObservation:\"page_addToObservation\";addExcerpt:\"page_addToExcerpt\"",
                "lineNumber": 513
            }
        ]
    },
    {
        "id": "page_addToObservation",
        "name": "Add to observation",
        "lineNumber": 515,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "addObservationsLabel",
                "text": "Note: You should not add any observations that depend on patterns among stories until after\nall stories have been entered.",
                "type": "label",
                "lineNumber": 517
            },
            {
                "id": "observationsList",
                "text": "Choose an observation from this list to which to add the selected result, or create a new observation.",
                "type": "observationsList",
                "lineNumber": 520
            },
            {
                "id": "addResultToExistingObservation",
                "text": "Add result to selected observation",
                "type": "button",
                "lineNumber": 522
            },
            {
                "id": "createNewObservationWithResult",
                "text": "Create new observation with this result",
                "type": "button",
                "options": "page_createNewObservation",
                "lineNumber": 523
            }
        ]
    },
    {
        "id": "page_createNewObservation",
        "name": "Create new observation",
        "lineNumber": 525,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "observationName",
                "text": "Please give this observation a name.",
                "type": "text",
                "lineNumber": 527
            }
        ]
    },
    {
        "id": "page_addToExcerpt",
        "name": "Add to excerpt",
        "lineNumber": 529,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "excerptsList",
                "text": "Choose an excerpt from this list to which to add the selected text, or create a new excerpt.",
                "type": "excerptsList",
                "lineNumber": 531
            },
            {
                "id": "addTextToExistingExcerpt",
                "text": "Add text to selected excerpt",
                "type": "button",
                "lineNumber": 533
            },
            {
                "id": "createNewExcerptWithText",
                "text": "Create new excerpt with this text",
                "type": "button",
                "options": "page_createNewExcerpt",
                "lineNumber": 534
            }
        ]
    },
    {
        "id": "page_createNewExcerpt",
        "name": "Create new excerpt",
        "lineNumber": 536,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "excerptName",
                "text": "Please give this excerpt a name.",
                "type": "text",
                "lineNumber": 538
            },
            {
                "id": "excerptText",
                "text": "You can edit the excerpt here.",
                "type": "textarea",
                "lineNumber": 540
            },
            {
                "id": "excerptNotes",
                "text": "You can enter some notes about the excerpt here.",
                "type": "textarea",
                "lineNumber": 542
            }
        ]
    },
    {
        "id": "page_themeStories",
        "name": "Theme stories",
        "lineNumber": 544,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "themeStories",
                "text": "Theme stories",
                "type": "storyThemer",
                "lineNumber": 546
            }
        ]
    },
    {
        "id": "page_browseGraphs",
        "name": "Browse graphs",
        "lineNumber": 548,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "graphBrowser",
                "text": "Graph browser",
                "type": "graphBrowser",
                "lineNumber": 550
            }
        ]
    },
    {
        "id": "page_reviewTrends",
        "name": "Review trends",
        "lineNumber": 552,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "statTests",
                "text": "Which statistical tests do you want to consider?",
                "type": "checkBoxes",
                "options": "chi-squared (differences between counts);t-test (differences between means);correlation",
                "lineNumber": 554
            },
            {
                "id": "minSubsetSize",
                "text": "How large should subset counts be to be considered for comparison?",
                "type": "select",
                "options": "20;30;40;50",
                "lineNumber": 555
            },
            {
                "id": "significanceThreshold",
                "text": "What significance threshold do you want reported?",
                "type": "select",
                "options": "0.05;0.01",
                "lineNumber": 556
            },
            {
                "id": "trendResults",
                "text": "How many results do you want to see per test type?",
                "type": "select",
                "options": "5;10;15;20;25;30",
                "lineNumber": 557
            },
            {
                "id": "COMMENT_559",
                "text": "// when user changes any of the options above, the trend report below should update",
                "type": "label",
                "options": null,
                "lineNumber": 559
            },
            {
                "id": "trendsReport",
                "text": "Trends report",
                "type": "trendsReport",
                "lineNumber": 560
            }
        ]
    },
    {
        "id": "page_reviewExcerpts",
        "name": "Review excerpts",
        "lineNumber": 562,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "FIXME_564",
                "text": "Collected excerpts",
                "type": "grid",
                "options": "page_createNewExcerpt",
                "lineNumber": 564
            }
        ]
    },
    {
        "id": "page_interpretObservations",
        "name": "Interpret observations",
        "lineNumber": 566,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "FIXME_568",
                "text": "Collected observations",
                "type": "grid",
                "options": "page_editObservation",
                "lineNumber": 568
            }
        ]
    },
    {
        "id": "page_editObservation",
        "name": "Edit observation",
        "lineNumber": 570,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "FIXME_572",
                "text": "Please give this observation a name.",
                "shortText": "Observation name",
                "type": "text",
                "lineNumber": 572
            },
            {
                "id": "observation",
                "text": "Please describe this observation.",
                "shortText": "Observation",
                "type": "textarea",
                "lineNumber": 573
            },
            {
                "id": "observationResultsList",
                "text": "These are the results you selected to include in this observation.",
                "shortText": "Results",
                "type": "grid",
                "lineNumber": 575
            },
            {
                "id": "observationInterpretationsList",
                "text": "These are the interpretations you have created for this observation.",
                "shortText": "Interpretations",
                "type": "grid",
                "options": "page_addInterpretation",
                "lineNumber": 577
            }
        ]
    },
    {
        "id": "page_addInterpretation",
        "name": "Create interpretation",
        "lineNumber": 579,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "interpretationText",
                "text": "What is your interpretation about this observation?",
                "shortText": "Interpretation",
                "type": "textarea",
                "lineNumber": 581
            },
            {
                "id": "interpretationName",
                "text": "Enter a name for this interpretation.",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 582
            },
            {
                "id": "firstInterpIdea",
                "text": "If you like, you can record an idea that follows from this interpretation.",
                "shortText": "Idea",
                "type": "textarea",
                "lineNumber": 583
            },
            {
                "id": "interpretationExcerptsList",
                "text": "You can add excerpts to this interpretation.",
                "shortText": "Excerpts",
                "type": "grid",
                "options": "page_selectExcerpt",
                "lineNumber": 584
            }
        ]
    },
    {
        "id": "page_selectExcerpt",
        "name": "Select excerpt",
        "lineNumber": 586,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "FIXME_588",
                "text": "Collected excerpts",
                "type": "grid",
                "options": "page_createNewExcerpt",
                "lineNumber": 588
            },
            {
                "id": "COMMENT_590",
                "text": "// when they click this button the selected excerpt should be added to the list whose \"add\" button they clicked",
                "type": "label",
                "options": null,
                "lineNumber": 590
            },
            {
                "id": "COMMENT_591",
                "text": "// it should know which interpretation to tie the excerpt to",
                "type": "label",
                "options": null,
                "lineNumber": 591
            },
            {
                "id": "addExcerptToInterpretation",
                "text": "Add selected excerpt to interpretation",
                "type": "button",
                "lineNumber": 592
            }
        ]
    },
    {
        "id": "page_clusterInterpretations",
        "name": "Cluster interpretations",
        "lineNumber": 594,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "clusterInterpLabel",
                "text": "Note: Do not cluster your interpretations unless you are sure you have finished collecting them.",
                "type": "label",
                "lineNumber": 596
            },
            {
                "id": "COMMENT_598",
                "text": "// ideally, when they are done with this, the circles marked as group names",
                "type": "label",
                "options": null,
                "lineNumber": 598
            },
            {
                "id": "COMMENT_599",
                "text": "// will get copied into the perspectives list seen in the next page",
                "type": "label",
                "options": null,
                "lineNumber": 599
            },
            {
                "id": "clusterInterpretations",
                "text": "Cluster interpretations into perspectives",
                "type": "clusterSpace",
                "options": "interpretations",
                "lineNumber": 600
            }
        ]
    },
    {
        "id": "page_describePerspectives",
        "name": "Describe perspectives",
        "lineNumber": 602,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "perspectivesList",
                "text": "Perspectives",
                "type": "grid",
                "options": "page_addPerspective",
                "lineNumber": 604
            }
        ]
    },
    {
        "id": "page_addPerspective",
        "name": "Add or change perspective",
        "lineNumber": 606,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "perspectiveName",
                "text": "Please give this perspective a name.",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 608
            },
            {
                "id": "perspectiveDescription",
                "text": "Describe this perspective.",
                "shortText": "Perspective",
                "type": "textarea",
                "lineNumber": 609
            },
            {
                "id": "perspectiveResultsList",
                "text": "Results linked to this perspective",
                "type": "grid",
                "options": "page_addResultToPerspective",
                "lineNumber": 611
            },
            {
                "id": "perspectiveExcerptsList",
                "text": "Excerpts linked to this perspective",
                "type": "grid",
                "options": "page_addExcerptToPerspective",
                "lineNumber": 613
            },
            {
                "id": "perspectiveInterpretationsList",
                "text": "Interpretations linked to this perspective",
                "type": "grid",
                "options": "page_annotateInterpretationForPerspective",
                "lineNumber": 615
            }
        ]
    },
    {
        "id": "page_addResultToPerspective",
        "name": "Add result to perspective",
        "lineNumber": 617,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "COMMENT_619",
                "text": "// this popup should show all the results linked to observations linked to interpretations linked to this perspective",
                "type": "label",
                "options": null,
                "lineNumber": 619
            },
            {
                "id": "COMMENT_620",
                "text": "// perspective",
                "type": "label",
                "options": null,
                "lineNumber": 620
            },
            {
                "id": "COMMENT_621",
                "text": "//      interpretation",
                "type": "label",
                "options": null,
                "lineNumber": 621
            },
            {
                "id": "COMMENT_622",
                "text": "//           observation",
                "type": "label",
                "options": null,
                "lineNumber": 622
            },
            {
                "id": "COMMENT_623",
                "text": "//                result",
                "type": "label",
                "options": null,
                "lineNumber": 623
            },
            {
                "id": "resultsForThisPerspectiveList",
                "text": "Choose a result that exemplifies this perspective.",
                "type": "grid",
                "lineNumber": 624
            },
            {
                "id": "resultLinkedToPerspectiveNotes",
                "text": "Enter any notes you want to remember about this result here.",
                "type": "textarea",
                "lineNumber": 625
            }
        ]
    },
    {
        "id": "page_addExcerptToPerspective",
        "name": "Add excerpt to perspective",
        "lineNumber": 627,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "COMMENT_629",
                "text": "// similarly, this should be a list of all the excerpts linked to interpretations linked to this perspective",
                "type": "label",
                "options": null,
                "lineNumber": 629
            },
            {
                "id": "COMMENT_630",
                "text": "// perspective",
                "type": "label",
                "options": null,
                "lineNumber": 630
            },
            {
                "id": "COMMENT_631",
                "text": "//     interpretation",
                "type": "label",
                "options": null,
                "lineNumber": 631
            },
            {
                "id": "COMMENT_632",
                "text": "//         excerpt",
                "type": "label",
                "options": null,
                "lineNumber": 632
            },
            {
                "id": "excerptsForThisPerspectiveList",
                "text": "Choose an excerpt that exemplifies this perspective.",
                "type": "grid",
                "lineNumber": 633
            },
            {
                "id": "excerptLinkedToPerspectiveNotes",
                "text": "Enter any notes you want to remember about this excerpt.",
                "type": "textarea",
                "lineNumber": 634
            }
        ]
    },
    {
        "id": "page_annotateInterpretationForPerspective",
        "name": "Annotate interpretation for perspective",
        "lineNumber": 636,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "interpretationLinkedToPerspectiveNotes",
                "text": "Enter any notes you want to remember about this interpretation as it is linked to this perspective.",
                "type": "textarea",
                "lineNumber": 638
            }
        ]
    },
    {
        "id": "page_readCatalysisReport",
        "name": "Read catalysis report",
        "lineNumber": 640,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "catalysisReport",
                "text": "Catalysis report",
                "type": "report",
                "options": "catalysis",
                "lineNumber": 642
            },
            {
                "id": "COMMENT_644",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 644
            },
            {
                "id": "COMMENT_645",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 645
            },
            {
                "id": "COMMENT_646",
                "text": "//                                                       SENSEMAKING",
                "type": "label",
                "options": null,
                "lineNumber": 646
            },
            {
                "id": "COMMENT_647",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 647
            },
            {
                "id": "COMMENT_648",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 648
            }
        ]
    },
    {
        "id": "page_sensemaking",
        "name": "Sensemaking",
        "lineNumber": 650,
        "description": "",
        "isHeader": true,
        "questions": [
            {
                "id": "COMMENT_651",
                "text": "// Planning sessions - x of x questions answered",
                "type": "label",
                "options": null,
                "lineNumber": 651
            },
            {
                "id": "COMMENT_652",
                "text": "// Write session agenda - x of x questions answered",
                "type": "label",
                "options": null,
                "lineNumber": 652
            },
            {
                "id": "COMMENT_653",
                "text": "// Print story cards - x cards printed (or checkmark)",
                "type": "label",
                "options": null,
                "lineNumber": 653
            },
            {
                "id": "COMMENT_654",
                "text": "// Post-session review - x of x questions answered",
                "type": "label",
                "options": null,
                "lineNumber": 654
            }
        ]
    },
    {
        "id": "page_planSensemakingSessions",
        "name": "Plan sensemaking sessions",
        "lineNumber": 656,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "sensemakingSessionRecommendations",
                "text": "Recommendations for sensemaking sessions",
                "type": "recommendationTable",
                "options": "sensemakingSessions",
                "lineNumber": 658
            },
            {
                "id": "sensemakingSessionPlansList",
                "text": "Sensemaking sessions",
                "type": "grid",
                "options": "page_addSensemakingSessionPlan",
                "lineNumber": 660
            }
        ]
    },
    {
        "id": "page_addSensemakingSessionPlan",
        "name": "Enter sensemaking session plan",
        "lineNumber": 662,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "sensemakingSessionName",
                "text": "Please give this session plan a name.",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 664
            },
            {
                "id": "sensemakingSessionRepetitions",
                "text": "How many repetitions of the session will there be?",
                "shortText": "Repetitions",
                "type": "text",
                "lineNumber": 665
            },
            {
                "id": "sensemakingSessionLength",
                "text": "How long will this session be?",
                "shortText": "Length",
                "type": "text",
                "lineNumber": 666
            },
            {
                "id": "sensemakingSessionTime",
                "text": "When will it take place?",
                "shortText": "Time",
                "type": "text",
                "lineNumber": 667
            },
            {
                "id": "sensemakingSessionLocation",
                "text": "Where will it take place?",
                "shortText": "Location",
                "type": "text",
                "lineNumber": 668
            },
            {
                "id": "sensemakingSessionSize",
                "text": "How many people will be invited to each repetition of this session?",
                "shortText": "Number of people",
                "type": "text",
                "lineNumber": 669
            },
            {
                "id": "sensemakingSessionGroups",
                "text": "From which participant group(s) will people be invited?",
                "shortText": "Participant groups",
                "type": "checkBoxesWithPull",
                "options": "participantGroups",
                "lineNumber": 670
            },
            {
                "id": "sensemakingSessionMaterials",
                "text": "What materials will this session require?",
                "shortText": "Materials",
                "type": "textarea",
                "lineNumber": 671
            },
            {
                "id": "sensemakingSessionDetails",
                "text": "Enter other details about this session.",
                "shortText": "Other",
                "type": "textarea",
                "lineNumber": 672
            },
            {
                "id": "sensemakingSessionActivitiesList",
                "text": "These are the activities added to this session plan so far.",
                "type": "grid",
                "options": "page_addSensemakingSessionActivity",
                "lineNumber": 674
            },
            {
                "id": "printSensemakingSessionAgenda",
                "text": "Print session agenda",
                "type": "button",
                "lineNumber": 676
            }
        ]
    },
    {
        "id": "page_addSensemakingSessionActivity",
        "name": "Add sensemaking session activity",
        "lineNumber": 678,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "sensemakingSessionActivityName",
                "text": "Please give this activity a name.",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 680
            },
            {
                "id": "sensemakingSessionActivity",
                "text": "What type of activity is this?",
                "shortText": "Type",
                "type": "select",
                "options": "ice-breaker;encountering stories (no task);encountering stories (simple task);discussing stories;twice-told stories exercise;timeline exercise;landscape exercise;story elements exercise;composite stories exercise;my own exercise;other",
                "lineNumber": 681
            },
            {
                "id": "sensemakingActivityPlan",
                "text": "Describe the plan for this activity.",
                "shortText": "Plan",
                "type": "textarea",
                "lineNumber": 682
            },
            {
                "id": "sensemakingActivityOptionalParts",
                "text": "Describe optional elaborations you might or might not use in this activity.",
                "shortText": "Optional elaborations",
                "type": "textarea",
                "lineNumber": 683
            },
            {
                "id": "sensemakingActivityTime",
                "text": "How long will this activity take?",
                "shortText": "Length",
                "type": "text",
                "lineNumber": 684
            },
            {
                "id": "sensemakingActivityRecording",
                "text": "Will new stories be recorded during this activity, and if so, how?",
                "shortText": "New stories",
                "type": "textarea",
                "lineNumber": 685
            },
            {
                "id": "sensemakingActivityMaterials",
                "text": "What materials will be provided for this activity?",
                "shortText": "Materials",
                "type": "textarea",
                "lineNumber": 686
            },
            {
                "id": "sensemakingActivitySpaces",
                "text": "What spaces will be used for this activity?",
                "shortText": "Spaces",
                "type": "textarea",
                "lineNumber": 687
            },
            {
                "id": "sensemakingActivityFacilitation",
                "text": "What sort of facilitation will be necessary for this activity?",
                "shortText": "Facilitation",
                "type": "textarea",
                "lineNumber": 688
            }
        ]
    },
    {
        "id": "page_enterSensemakingSessionRecords",
        "name": "Enter sensemaking session records",
        "lineNumber": 690,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "sensemakingSessionRecordsList",
                "text": "Sensemaking sessions",
                "type": "grid",
                "options": "page_addSensemakingSessionRecord",
                "lineNumber": 692
            }
        ]
    },
    {
        "id": "page_addSensemakingSessionRecord",
        "name": "Add sensemaking session record",
        "lineNumber": 694,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "FIXME_696",
                "text": "Please give this session record a name.",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 696
            },
            {
                "id": "COMMENT_698",
                "text": "// no add button on this grid, must add from story browser below",
                "type": "label",
                "options": null,
                "lineNumber": 698
            },
            {
                "id": "sensemakingSessionResonantStoriesList",
                "text": "Resonant stories (pivot, voice, discovery)",
                "type": "grid",
                "lineNumber": 699
            },
            {
                "id": "showHideCollectedStories",
                "text": "hide collected stories",
                "shortText": "Show",
                "type": "toggleButton",
                "options": "showCollectedStoriesInSensemakingSessionRecordScreen",
                "lineNumber": 701
            },
            {
                "id": "storiesToMarkAsResonantDuringSensemaking",
                "text": "Collected stories",
                "type": "storyBrowser",
                "options": "addResonantStory:\"page_addResonantStory\"",
                "lineNumber": 702
            },
            {
                "id": "sensemakingSessionOutcomesList",
                "text": "Session outcomes (like discoveries and ideas)",
                "type": "grid",
                "options": "page_newSensemakingSessionOutcome",
                "lineNumber": 704
            },
            {
                "id": "sensemakingSessionConstructionsList",
                "text": "Group constructions",
                "type": "grid",
                "options": "page_newSensemakingSessionConstruction",
                "lineNumber": 706
            },
            {
                "id": "sensemakingSessionNotesList",
                "text": "Session notes",
                "type": "grid",
                "options": "page_newSensemakingSessionNotes",
                "lineNumber": 708
            }
        ]
    },
    {
        "id": "page_addResonantStory",
        "name": "Add resonant story",
        "lineNumber": 710,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "resonantStoryType",
                "text": "Which type of resonant story is this?",
                "type": "select",
                "options": "pivot;voice;discovery;other",
                "lineNumber": 712
            },
            {
                "id": "resonantStoryReason",
                "text": "Why did this story stand out?",
                "type": "textarea",
                "lineNumber": 713
            },
            {
                "id": "resonantStoryWhom",
                "text": "For which participant groups was this story important?",
                "type": "checkBoxesWithPull",
                "options": "participantGroups",
                "lineNumber": 714
            },
            {
                "id": "resonantStoryNotes",
                "text": "Would you like to make any other notes about this story?",
                "type": "textarea",
                "lineNumber": 715
            }
        ]
    },
    {
        "id": "page_newSensemakingSessionOutcome",
        "name": "Sensemaking session outcome",
        "lineNumber": 717,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "sensemakingSessionOutcomeType",
                "text": "What type of session outcome is this?",
                "shortText": "Type",
                "type": "select",
                "options": "discovery;opportunity;issue;idea;recommendation;perspective;dilemma;other",
                "lineNumber": 719
            },
            {
                "id": "sensemakingSessionOutcomeName",
                "text": "Please give this outcome a name.",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 720
            },
            {
                "id": "sensemakingSessionOutcomeText",
                "text": "Describe the outcome.",
                "shortText": "Description",
                "type": "textarea",
                "lineNumber": 721
            }
        ]
    },
    {
        "id": "page_newSensemakingSessionConstruction",
        "name": "Sensemaking construction",
        "lineNumber": 723,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "sensemakingSessionConstructionName",
                "text": "Please give this construction a name.",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 725
            },
            {
                "id": "sensemakingSessionConstructionType",
                "text": "What type of construction is it?",
                "shortText": "Type",
                "type": "select",
                "options": "timeline;landscape;story elements;composite story;other",
                "lineNumber": 726
            },
            {
                "id": "sensemakingSessionContructionText",
                "text": "Please decribe the construction (or include a description given by participants).",
                "shortText": "Description",
                "type": "textarea",
                "lineNumber": 727
            },
            {
                "id": "sensemakingSessionConstructionLink",
                "text": "You can include a link to an audio or video description here.",
                "shortText": "Audio/video link",
                "type": "text",
                "lineNumber": 728
            },
            {
                "id": "sensemakingSessionConstructionImages",
                "text": "These are the images you have entered for the construction so far.",
                "type": "grid",
                "options": "page_newSensemakingConstructionImage",
                "lineNumber": 730
            }
        ]
    },
    {
        "id": "page_newSensemakingConstructionImage",
        "name": "Sensemaking construction image",
        "lineNumber": 732,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "sensemakingSessionConstructionImage",
                "text": "Upload an image for this construction.",
                "shortText": "Image",
                "type": "imageUploader",
                "lineNumber": 734
            },
            {
                "id": "sensemakingSessionConstructionImageName",
                "text": "Please give this image a name.",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 735
            },
            {
                "id": "sensemakingSessionConstructionImageNotes",
                "text": "Make any notes you'd like to record on this image here.",
                "shortText": "Notes",
                "type": "textarea",
                "lineNumber": 736
            }
        ]
    },
    {
        "id": "page_newSensemakingSessionNotes",
        "name": "Sensemaking session notes",
        "lineNumber": 738,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "sensemakingSessionNotesName",
                "text": "Please give this set of notes a name.",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 740
            },
            {
                "id": "sensemakingSessionNotesText",
                "text": "Enter your notes here.",
                "shortText": "Notes",
                "type": "textarea",
                "lineNumber": 741
            },
            {
                "id": "sensemakingSessionNoteImages",
                "text": "These are the images you have entered for this set of notes so far.",
                "shortText": "Images",
                "type": "grid",
                "options": "page_newSensemakingSessionImage",
                "lineNumber": 742
            }
        ]
    },
    {
        "id": "page_newSensemakingSessionImage",
        "name": "Sensemaking session notes image",
        "lineNumber": 744,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "sensemakingSessionNotesImage",
                "text": "Upload your image here.",
                "shortText": "Image",
                "type": "imageUploader",
                "lineNumber": 746
            },
            {
                "id": "sensemakingSessionImageName",
                "text": "Please give this image a name.",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 747
            },
            {
                "id": "sensemakingSessionNotesImageNotes",
                "text": "You can enter some notes about this image.",
                "shortText": "Notes",
                "type": "textarea",
                "lineNumber": 748
            }
        ]
    },
    {
        "id": "page_answerQuestionsAboutSensemakingSessions",
        "name": "Reflect on sensemaking sessions",
        "lineNumber": 750,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "FIXME_752",
                "text": "Please give this set of reflections a name.",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 752
            },
            {
                "id": "sensemakingSessionReflectionsList",
                "text": "Sensemaking session reflections",
                "type": "grid",
                "options": "page_answerQuestionsAboutSensemakingSession",
                "lineNumber": 754
            }
        ]
    },
    {
        "id": "page_answerQuestionsAboutSensemakingSession",
        "name": "Reflect on session",
        "lineNumber": 756,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "sensemakingReflectChangeLabel",
                "text": "Change",
                "type": "header",
                "lineNumber": 758
            },
            {
                "id": "sensemakingReflectChangeEmotions",
                "text": "How did the perceptions of the participants change from the start to the end of the session?",
                "shortText": "Change in participant perceptions",
                "type": "textarea",
                "lineNumber": 759
            },
            {
                "id": "sensemakingReflectChangeYourEmotions",
                "text": "How did <i>your</i> perceptions change?",
                "shortText": "Change in facilitator perceptions",
                "type": "textarea",
                "lineNumber": 760
            },
            {
                "id": "sensemakingReflectProjectChanged",
                "text": "How has the overall project changed as a result of this session?",
                "shortText": "Changes to the project",
                "type": "textarea",
                "lineNumber": 761
            },
            {
                "id": "sensemakingReflectInteractionsLabel",
                "text": "Interactions",
                "type": "header",
                "lineNumber": 763
            },
            {
                "id": "sensemakingReflectInteractionsParticipants",
                "text": "Describe the interactions between participants in this session.",
                "shortText": "Interactions among participants",
                "type": "textarea",
                "lineNumber": 764
            },
            {
                "id": "sensemakingReflectInteractionsFacilitators",
                "text": "Describe interactions between participants and facilitators.",
                "shortText": "Interactions between participants and facilitators",
                "type": "textarea",
                "lineNumber": 765
            },
            {
                "id": "sensemakingReflectStories",
                "text": "What did you notice about the stories people told, retold, chose, and worked with during the session?",
                "shortText": "Stories",
                "type": "textarea",
                "lineNumber": 766
            },
            {
                "id": "sensemakingReflectLearningLabel",
                "text": "Learning",
                "type": "header",
                "lineNumber": 768
            },
            {
                "id": "sensemakingReflectSpecial",
                "text": "What was special about these people in this place on this day?",
                "shortText": "Unique features",
                "type": "textarea",
                "lineNumber": 769
            },
            {
                "id": "sensemakingReflectSurprise",
                "text": "What surprised you about this session?",
                "shortText": "Surprise",
                "type": "textarea",
                "lineNumber": 770
            },
            {
                "id": "sensemakingReflectWorkedWellAndNot",
                "text": "Which parts of your plans for this session worked out well? Which parts didn't?",
                "shortText": "Worked and didn't work",
                "type": "textarea",
                "lineNumber": 771
            },
            {
                "id": "sensemakingReflectNewIdeas",
                "text": "What new ideas did you gain from this session? What did you learn from it?",
                "shortText": "New ideas",
                "type": "textarea",
                "lineNumber": 772
            },
            {
                "id": "sensemakingReflectExtra",
                "text": "What else do you want to remember about this session?",
                "shortText": "Other",
                "type": "textarea",
                "lineNumber": 773
            }
        ]
    },
    {
        "id": "page_readSensemakingReport",
        "name": "Read sensemaking report",
        "lineNumber": 775,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "sensemakingReport",
                "text": "Sensemaking report",
                "type": "report",
                "options": "sensemaking",
                "lineNumber": 777
            },
            {
                "id": "COMMENT_779",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 779
            },
            {
                "id": "COMMENT_780",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 780
            },
            {
                "id": "COMMENT_781",
                "text": "//                                                       INTERVENTION",
                "type": "label",
                "options": null,
                "lineNumber": 781
            },
            {
                "id": "COMMENT_782",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 782
            },
            {
                "id": "COMMENT_783",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 783
            }
        ]
    },
    {
        "id": "page_intervention",
        "name": "Intervention",
        "lineNumber": 785,
        "description": "",
        "isHeader": true,
        "questions": [
            {
                "id": "COMMENT_786",
                "text": "// Choose interventions - x planned",
                "type": "label",
                "options": null,
                "lineNumber": 786
            },
            {
                "id": "COMMENT_787",
                "text": "// Answer questions about interventions - x questions answered",
                "type": "label",
                "options": null,
                "lineNumber": 787
            },
            {
                "id": "COMMENT_789",
                "text": "//* You can enter some general notes on intervention in this project here. [interventionGeneralNotes|textarea]",
                "type": "label",
                "options": null,
                "lineNumber": 789
            },
            {
                "id": "COMMENT_791",
                "text": "//* The intervention section is [interventionOpenOrClosedLabel|label]",
                "type": "label",
                "options": null,
                "lineNumber": 791
            },
            {
                "id": "COMMENT_793",
                "text": "//* open|closed [interventionOpenOrClosedState|lookupLabel|interventionOpen]",
                "type": "label",
                "options": null,
                "lineNumber": 793
            },
            {
                "id": "COMMENT_795",
                "text": "//* Open the intervention section|Close the intervention section [toggleButton|interventionOpen]",
                "type": "label",
                "options": null,
                "lineNumber": 795
            }
        ]
    },
    {
        "id": "page_projectOutcomesForIntervention;interventionOpen",
        "name": "Answer questions about project outcomes",
        "lineNumber": 797,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "outcomesTable",
                "text": "In order to choose interventions that will be useful in your project, it will be helpful to think about some\nof the issues (positive and negative) you discovered in your project. Please answer these questions in reference to\nthe participant groups you set up in the project planning phase.",
                "type": "questionsTable",
                "options": "page_outcomesTable",
                "lineNumber": 799
            }
        ]
    },
    {
        "id": "page_outcomesTable",
        "name": "Project outcomes",
        "lineNumber": 803,
        "description": "",
        "isHeader": false,
        "type": "questionsTable",
        "questions": [
            {
                "id": "outcomesHopesHeader",
                "text": "Hopes",
                "type": "header",
                "lineNumber": 805
            },
            {
                "id": "outcomesHeard",
                "text": "During your project, did the people in this group say they felt heard for the first time?",
                "type": "select",
                "options": "never;occasionally;sometimes;often;mixed",
                "lineNumber": 806
            },
            {
                "id": "outcomesInvolved",
                "text": "Did they say they felt involved for the first time?",
                "type": "select",
                "options": "never;occasionally;sometimes;often;mixed",
                "lineNumber": 807
            },
            {
                "id": "outcomesLearnedAboutComm",
                "text": "Did they say they learned a lot about their community or organization?",
                "type": "select",
                "options": "never;occasionally;sometimes;often;mixed",
                "lineNumber": 808
            },
            {
                "id": "outcomesVoicesHeader",
                "text": "Voices",
                "type": "header",
                "lineNumber": 810
            },
            {
                "id": "outcomesMoreStories",
                "text": "During your story collection, did these people seem to want to tell more stories than you collected?",
                "type": "select",
                "options": "never;occasionally;sometimes;often;mixed",
                "lineNumber": 811
            },
            {
                "id": "outcomesWantedToShareMore",
                "text": "Did you ever feel that they wanted to share more experiences with each other than they did?",
                "type": "select",
                "options": "never;occasionally;sometimes;often;mixed",
                "lineNumber": 812
            },
            {
                "id": "outcomesNeededToBeHeard",
                "text": "Did these people feel that some of the stories you collected \"needed to be heard\" by anyone?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed",
                "lineNumber": 813
            },
            {
                "id": "outcomesNobodyCares",
                "text": "Were there any issues that these people thought \"nobody cares\" about?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed",
                "lineNumber": 814
            },
            {
                "id": "outcomesNeedsHeader",
                "text": "Needs",
                "type": "header",
                "lineNumber": 816
            },
            {
                "id": "outcomesNobodyCanMeetNeeds",
                "text": "Do the people in this group have needs that <i>nobody</i> can meet?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed",
                "lineNumber": 817
            },
            {
                "id": "outcomesNeedNewStories",
                "text": "Do these people need to start telling themselves <i>new</i> stories?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed",
                "lineNumber": 818
            },
            {
                "id": "outcomesKeepExploring",
                "text": "Were there any issues about which the people in this group seemed to want to keep exploring?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed",
                "lineNumber": 819
            },
            {
                "id": "outcomesCrisisPoints",
                "text": "Did you discover any \"crisis points\" where people in this group needed help and didn't get it?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed",
                "lineNumber": 820
            },
            {
                "id": "outcomesBeyondWords",
                "text": "Did you find any issues for this group that were beyond words, that no amount of discussion could resolve?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed",
                "lineNumber": 821
            },
            {
                "id": "outcomesLearningHeader",
                "text": "Learning",
                "type": "header",
                "lineNumber": 823
            },
            {
                "id": "outcomesLearnedAboutTopic",
                "text": "Did these people say that they learned a lot about the topic by participating in the project?",
                "type": "select",
                "options": "never;occasionally;sometimes;often;mixed",
                "lineNumber": 824
            },
            {
                "id": "outcomesNewMembersStruggling",
                "text": "Did you notice that new members of the community or organization were having a harder time making sense of things?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed",
                "lineNumber": 825
            },
            {
                "id": "outcomesInfoWithoutUnderstanding",
                "text": "Were there any issues that these people found difficult to understand, even though abundant information was available?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed",
                "lineNumber": 826
            },
            {
                "id": "outcomesOverConfident",
                "text": "Did you discover any areas in which these people had more confidence than skill?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed",
                "lineNumber": 827
            },
            {
                "id": "outcomesCuriousAboutStoryWork",
                "text": "Did any of these participants express an interest in learning more about story work?",
                "type": "select",
                "options": "never;occasionally;sometimes;often;mixed",
                "lineNumber": 828
            }
        ]
    },
    {
        "id": "page_designInterventions",
        "name": "Design interventions",
        "lineNumber": 830,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "interventionRecommendations",
                "text": "Recommendations for interventions",
                "type": "recommendationTable",
                "options": "interventions",
                "lineNumber": 832
            },
            {
                "id": "interventionsList",
                "text": "These are the interventions you have designed so far.",
                "type": "grid",
                "options": "page_addIntervention",
                "lineNumber": 834
            }
        ]
    },
    {
        "id": "page_addIntervention",
        "name": "Design an intervention",
        "lineNumber": 836,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "interventionName",
                "text": "Please name this intervention.",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 838
            },
            {
                "id": "interventionType",
                "text": "What type of intervention will this be?",
                "shortText": "Type",
                "type": "select",
                "options": "narrative ombudsman;narrative suggestion box;story sharing space;narrative orientation;narrative learning resource;narrative simulation;narrative presentation;dramatic action;sensemaking space;sensemaking pyramid;narrative mentoring program;narrative therapy;participatory theatre;other",
                "lineNumber": 839
            },
            {
                "id": "interventionText",
                "text": "Please describe your plan for this intervention.",
                "shortText": "Description",
                "type": "text",
                "lineNumber": 840
            },
            {
                "id": "interventionLength",
                "text": "Over what span of time will this intervention take place?",
                "shortText": "Length",
                "type": "text",
                "lineNumber": 842
            },
            {
                "id": "interventionTime",
                "text": "When will the intervention start and stop?",
                "shortText": "Time",
                "type": "text",
                "lineNumber": 843
            },
            {
                "id": "interventionLocation",
                "text": "Where will the intervention take place?",
                "shortText": "Location",
                "type": "text",
                "lineNumber": 844
            },
            {
                "id": "interventionHelp",
                "text": "What sort of help will you need to carry out this intervention?",
                "shortText": "Help",
                "type": "textarea",
                "lineNumber": 846
            },
            {
                "id": "interventionPermission",
                "text": "What sorts of permission will you need to carry out this intervention?",
                "shortText": "Permission",
                "type": "textarea",
                "lineNumber": 847
            },
            {
                "id": "interventionParticipation",
                "text": "How will you get people to participate in this intervention?",
                "shortText": "Participation",
                "type": "textarea",
                "lineNumber": 848
            },
            {
                "id": "interventionMaterials",
                "text": "What physical materials will you need?",
                "shortText": "Materials",
                "type": "textarea",
                "lineNumber": 850
            },
            {
                "id": "interventionSpace",
                "text": "What spaces will you need to use?",
                "shortText": "Spaces",
                "type": "textarea",
                "lineNumber": 851
            },
            {
                "id": "interventionTech",
                "text": "What technological resources will you need?",
                "shortText": "Technology",
                "type": "textarea",
                "lineNumber": 852
            },
            {
                "id": "interventionRecording",
                "text": "How will record the results of this intervention?",
                "shortText": "Recording",
                "type": "textarea",
                "lineNumber": 853
            }
        ]
    },
    {
        "id": "page_recordInterventions",
        "name": "Enter intervention records",
        "lineNumber": 855,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "FIXME_857",
                "text": "Interventions",
                "type": "grid",
                "options": "page_addInterventionRecord",
                "lineNumber": 857
            }
        ]
    },
    {
        "id": "page_addInterventionRecord",
        "name": "Add intervention notes",
        "lineNumber": 859,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "interventionNotesName",
                "text": "Please give this intervention record a name.",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 861
            },
            {
                "id": "interventionNotesText",
                "text": "Enter your notes here.",
                "shortText": "Notes",
                "type": "textarea",
                "lineNumber": 862
            },
            {
                "id": "interventionRecordImages",
                "text": "These are the images you have entered for this set of notes so far.",
                "shortText": "Images",
                "type": "grid",
                "options": "page_newInterventionImage",
                "lineNumber": 863
            }
        ]
    },
    {
        "id": "page_newInterventionImage",
        "name": "Intervention notes image",
        "lineNumber": 865,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "interventionNotesImage",
                "text": "Upload your image here.",
                "shortText": "Image",
                "type": "imageUploader",
                "lineNumber": 867
            },
            {
                "id": "interventionImageName",
                "text": "Please give this image a name.",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 868
            },
            {
                "id": "interventionNotesImageNotes",
                "text": "You can enter some notes about this image.",
                "shortText": "Notes",
                "type": "textarea",
                "lineNumber": 869
            }
        ]
    },
    {
        "id": "page_answerQuestionsAboutInterventions",
        "name": "Reflect on interventions",
        "lineNumber": 871,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "interventionQuestionsLabel",
                "text": "Note: If there are no interventions in this list, enter them in the \"Enter intervention records\" screen first.",
                "type": "label",
                "lineNumber": 873
            },
            {
                "id": "COMMENT_875",
                "text": "// this list should populate with names of interventions given in \"enter intervention records\" screen.",
                "type": "label",
                "options": null,
                "lineNumber": 875
            },
            {
                "id": "COMMENT_876",
                "text": "/// there should be NO add button... but the edit button should go to the popup specified here",
                "type": "label",
                "options": null,
                "lineNumber": 876
            },
            {
                "id": "FIXME_877",
                "text": "Interventions",
                "type": "grid",
                "options": "page_answerQuestionsAboutIntervention",
                "lineNumber": 877
            }
        ]
    },
    {
        "id": "page_answerQuestionsAboutIntervention",
        "name": "Reflect on intervention",
        "lineNumber": 879,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "FIXME_881",
                "text": "Please name this set of reflections on an intervention.",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 881
            },
            {
                "id": "interventionReflectChangeLabel",
                "text": "Change",
                "type": "header",
                "lineNumber": 883
            },
            {
                "id": "interventionReflectChangeEmotions",
                "text": "How did the perceptions of the participants change from the start to the end of the intervention?",
                "shortText": "Change in participant perceptions",
                "type": "textarea",
                "lineNumber": 884
            },
            {
                "id": "interventionReflectChangeYourEmotions",
                "text": "How did <i>your</i> perceptions change?",
                "shortText": "Change in facilitator perceptions",
                "type": "textarea",
                "lineNumber": 885
            },
            {
                "id": "interventionReflectProjectChanged",
                "text": "How has the overall project changed as a result of this intervention?",
                "shortText": "Changes to the project",
                "type": "textarea",
                "lineNumber": 886
            },
            {
                "id": "interventionReflectInteractionsLabel",
                "text": "Interactions",
                "type": "header",
                "lineNumber": 888
            },
            {
                "id": "interventionReflectInteractionsParticipants",
                "text": "Describe the interactions between participants during this intervention.",
                "shortText": "Interactions among participants",
                "type": "textarea",
                "lineNumber": 889
            },
            {
                "id": "interventionReflectInteractionsFacilitators",
                "text": "Describe interactions between participants and facilitators.",
                "shortText": "Interactions between participants and facilitators",
                "type": "textarea",
                "lineNumber": 890
            },
            {
                "id": "interventionReflectStories",
                "text": "What did you notice about the stories people told, retold, chose, and worked with during the intervention?",
                "shortText": "Stories",
                "type": "textarea",
                "lineNumber": 891
            },
            {
                "id": "interventionReflectLearningLabel",
                "text": "Learning",
                "type": "header",
                "lineNumber": 893
            },
            {
                "id": "interventionReflectSpecial",
                "text": "What was special about this intervention?",
                "shortText": "Unique features",
                "type": "textarea",
                "lineNumber": 894
            },
            {
                "id": "interventionReflectSurprise",
                "text": "What surprised you about this intervention?",
                "shortText": "Surprise",
                "type": "textarea",
                "lineNumber": 895
            },
            {
                "id": "interventionReflectWorkedWellAndNot",
                "text": "Which parts of your plans for this intervention worked out well? Which parts didn't?",
                "shortText": "Worked and didn't work",
                "type": "textarea",
                "lineNumber": 896
            },
            {
                "id": "interventionReflectNewIdeas",
                "text": "What new ideas did you gain from this intervention? What did you learn from it?",
                "shortText": "New ideas",
                "type": "textarea",
                "lineNumber": 897
            },
            {
                "id": "interventionReflectExtra",
                "text": "What else do you want to remember about this intervention?",
                "shortText": "Other",
                "type": "textarea",
                "lineNumber": 898
            }
        ]
    },
    {
        "id": "page_interventionReport",
        "name": "Read intervention report",
        "lineNumber": 900,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "interventionReport",
                "text": "Intervention report",
                "type": "report",
                "options": "intervention",
                "lineNumber": 902
            },
            {
                "id": "COMMENT_904",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 904
            },
            {
                "id": "COMMENT_905",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 905
            },
            {
                "id": "COMMENT_906",
                "text": "//                                                       RETURN",
                "type": "label",
                "options": null,
                "lineNumber": 906
            },
            {
                "id": "COMMENT_907",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 907
            },
            {
                "id": "COMMENT_908",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 908
            }
        ]
    },
    {
        "id": "page_return",
        "name": "Return",
        "lineNumber": 910,
        "description": "",
        "isHeader": true,
        "questions": [
            {
                "id": "piecesOfFeedbackEntered",
                "text": "Pieces of feedback entered:",
                "type": "listCount",
                "options": "feedbackList",
                "lineNumber": 911
            },
            {
                "id": "questionsAnsweredAboutProject",
                "text": "Questions answered about project:",
                "type": "questionAnswerCountOfTotalOnPage",
                "options": "page_reflectOnProject",
                "lineNumber": 912
            },
            {
                "id": "elementsInProjectPresentation",
                "text": "Elements in project presentation:",
                "type": "listCount",
                "options": "projectPresentationElementsList",
                "lineNumber": 913
            },
            {
                "id": "presentationReportFinished",
                "text": "Presentation report finished:",
                "type": "questionAnswer",
                "options": "presentationReportFinished",
                "lineNumber": 914
            },
            {
                "id": "numberOfPeopleInterestedInFutureProjects",
                "text": "Number of people interested in future projects:",
                "type": "listCount",
                "options": "interestedPeopleList",
                "lineNumber": 915
            },
            {
                "id": "requestsForHelp",
                "text": "Requests received about project:",
                "type": "listCount",
                "options": "projectRequestsList",
                "lineNumber": 916
            }
        ]
    },
    {
        "id": "page_gatherFeedback",
        "name": "Gather feedback",
        "lineNumber": 918,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "feedbackList",
                "text": "These are the pieces of feedback you have gathered so far.",
                "type": "grid",
                "options": "page_enterFeedbackPiece",
                "lineNumber": 920
            },
            {
                "id": "generalFeedback",
                "text": "If you would like to enter any general notes on the feedback you've seen to the project, write them here.",
                "type": "textarea",
                "lineNumber": 922
            }
        ]
    },
    {
        "id": "page_enterFeedbackPiece",
        "name": "Enter piece of feedback on project",
        "lineNumber": 924,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "feedbackText",
                "text": "What did someone say or do?",
                "shortText": "Feedback",
                "type": "textarea",
                "lineNumber": 926
            },
            {
                "id": "feedbackName",
                "text": "Please give this piece of feedback a name.",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 927
            },
            {
                "id": "feedbackType",
                "text": "What type of feedback is this?",
                "shortText": "Type",
                "type": "select",
                "options": "a story;a reference to something that came up in the project;a wish about the future;an opinion;a complaint;an action;other",
                "lineNumber": 928
            },
            {
                "id": "feedbackWho",
                "text": "Who said or did this?",
                "shortText": "Source",
                "type": "text",
                "lineNumber": 929
            },
            {
                "id": "feedbackQuestion",
                "text": "What did you say or do (if anything) that led to this feedback?",
                "shortText": "Prompt",
                "type": "text",
                "lineNumber": 930
            },
            {
                "id": "feedbackNotes",
                "text": "Please enter any other notes you have about this feedback.",
                "shortText": "Notes",
                "type": "textarea",
                "lineNumber": 931
            },
            {
                "id": "feedbackImage",
                "text": "You can upload an image to accompany your notes here.",
                "shortText": "Image",
                "type": "imageUploader",
                "lineNumber": 932
            }
        ]
    },
    {
        "id": "page_reflectOnProject",
        "name": "Reflect on the project",
        "lineNumber": 934,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "reflectProjectStories",
                "text": "What have you learned from the stories you heard in this project?",
                "type": "textarea",
                "lineNumber": 936
            },
            {
                "id": "reflectProjectFacilitation",
                "text": "What did you learn about your facilitation practice in this project?",
                "type": "textarea",
                "lineNumber": 937
            },
            {
                "id": "reflectProjectPlanning",
                "text": "What did you learn about project planning?",
                "type": "textarea",
                "lineNumber": 938
            },
            {
                "id": "reflectProjectOwnPNI",
                "text": "How has this project changed your own version of PNI?",
                "type": "textarea",
                "lineNumber": 939
            },
            {
                "id": "reflectProjectCommunity",
                "text": "What have you learned about your community or organization because of this project?",
                "type": "textarea",
                "lineNumber": 940
            },
            {
                "id": "reflectProjectPersonalStrengths",
                "text": "What did this project teach you about your personal strengths and weaknesses?",
                "type": "textarea",
                "lineNumber": 941
            },
            {
                "id": "reflectProjectTeam",
                "text": "What did this project teach you about your team?",
                "type": "textarea",
                "lineNumber": 942
            },
            {
                "id": "reflectProjectIdeas",
                "text": "Describe any new ideas that came up during this project.",
                "type": "textarea",
                "lineNumber": 943
            },
            {
                "id": "reflectProjectNotes",
                "text": "Enter any additional notes you'd like to remember about the project.",
                "type": "textarea",
                "lineNumber": 944
            },
            {
                "id": "reflectProjectImage",
                "text": "You can upload an image to accompany your notes here.",
                "type": "imageUploader",
                "lineNumber": 945
            }
        ]
    },
    {
        "id": "page_prepareProjectPresentation",
        "name": "Prepare outline of project presentation",
        "lineNumber": 947,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "projectPresentationElementsList",
                "text": "These are the elements in your presentation outline so far.",
                "type": "grid",
                "options": "page_addPresentationElement",
                "lineNumber": 949
            }
        ]
    },
    {
        "id": "page_addPresentationElement",
        "name": "Add element to project presentation outline",
        "lineNumber": 951,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "presentationElementName",
                "text": "What name would you like to give this element in your presentation?",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 953
            },
            {
                "id": "presentationElementStatement",
                "text": "How would you like to describe this element in your presentation?",
                "shortText": "Description",
                "type": "textarea",
                "lineNumber": 954
            },
            {
                "id": "presentationElementEvidence",
                "text": "What evidence does this element present that your project met its goals?",
                "shortText": "Evidence",
                "type": "textarea",
                "lineNumber": 955
            },
            {
                "id": "presentationElementQA",
                "text": "What questions do you anticipate about this element, and how would you like to answer them?",
                "shortText": "Q&A",
                "type": "textarea",
                "lineNumber": 956
            },
            {
                "id": "presentationElementNotes",
                "text": "Enter any other notes you want to remember about this element as you present it.",
                "shortText": "Notes",
                "type": "textarea",
                "lineNumber": 957
            },
            {
                "id": "presentationLabel",
                "text": "Now you can export your outline, open it in your word processor, and add material to it\nfrom any of the stage reports (or the final project report).",
                "type": "label",
                "lineNumber": 959
            },
            {
                "id": "exportPresentationOutline",
                "text": "Export this outline",
                "type": "button",
                "lineNumber": 962
            },
            {
                "id": "FIXME_964",
                "text": "Have you finished your presentation report?",
                "type": "select",
                "options": "yes;no;I'm not making a project presentation",
                "lineNumber": 964
            }
        ]
    },
    {
        "id": "page_interestedPeople",
        "name": "Interested people",
        "lineNumber": 966,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "interestedPeopleList",
                "text": "These are the people who have said they are interested in future projects.",
                "type": "grid",
                "options": "page_addInterestedPerson",
                "lineNumber": 968
            }
        ]
    },
    {
        "id": "page_addInterestedPerson",
        "name": "Add person interested in project",
        "lineNumber": 970,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "interestedPersonName",
                "text": "What is the person's name (and position if applicable)?",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 972
            },
            {
                "id": "interestedPersonContactDetails",
                "text": "Enter any contact details here.",
                "shortText": "Contact details",
                "type": "textarea",
                "lineNumber": 973
            },
            {
                "id": "interestedPersonType",
                "text": "How do they want to be connected to future projects?",
                "shortText": "Preference",
                "type": "select",
                "options": "they want to be informed;they want to be consulted;they want to collaborate;other",
                "lineNumber": 974
            },
            {
                "id": "interestedPersonNotes",
                "text": "Enter any notes about this person's interest in future projects here.",
                "shortText": "Notes",
                "type": "textarea",
                "lineNumber": 975
            }
        ]
    },
    {
        "id": "page_projectRequests",
        "name": "Respond to requests for post-project support",
        "lineNumber": 977,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "projectRequestsList",
                "text": "These are the requests you have entered so far.",
                "type": "grid",
                "options": "page_addNewProjectRequest",
                "lineNumber": 979
            }
        ]
    },
    {
        "id": "page_addNewProjectRequest",
        "name": "Enter project request",
        "lineNumber": 981,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "requestText",
                "text": "What was the request?",
                "shortText": "Request",
                "type": "textarea",
                "lineNumber": 983
            },
            {
                "id": "requestType",
                "text": "What type of request is this?",
                "shortText": "Type",
                "type": "select",
                "options": "help with their own projects;help with sustaining story exchange;help with examining this project's stories and results;help learning about story work;other",
                "lineNumber": 984
            },
            {
                "id": "requestMet",
                "text": "Do you consider this request to have been satisfied?",
                "shortText": "Satisfied",
                "type": "boolean",
                "lineNumber": 985
            },
            {
                "id": "requestWhatHappened",
                "text": "What has happened in relation to this request?",
                "shortText": "What happened",
                "type": "textarea",
                "lineNumber": 986
            },
            {
                "id": "requestNotes",
                "text": "Enter any notes about the request here.",
                "shortText": "Notes",
                "type": "textarea",
                "lineNumber": 987
            }
        ]
    },
    {
        "id": "page_returnReport",
        "name": "Read return report",
        "lineNumber": 989,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "returnReport",
                "text": "Return report",
                "type": "report",
                "options": "return",
                "lineNumber": 991
            }
        ]
    },
    {
        "id": "page_projectReport",
        "name": "Project report",
        "lineNumber": 993,
        "description": "",
        "isHeader": true,
        "questions": [
            {
                "id": "projectReport",
                "text": "Project report",
                "type": "report",
                "options": "project",
                "lineNumber": 995
            }
        ]
    }
]);
