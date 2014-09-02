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
                "id": "FIXME_60",
                "text": "// all checklists combined",
                "type": "label",
                "options": null,
                "lineNumber": 60
            },
            {
                "id": "FIXME_62",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 62
            },
            {
                "id": "FIXME_63",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 63
            },
            {
                "id": "FIXME_64",
                "text": "//                                                       PLANNING",
                "type": "label",
                "options": null,
                "lineNumber": 64
            },
            {
                "id": "FIXME_65",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 65
            },
            {
                "id": "FIXME_66",
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
                "id": "FIXME_69",
                "text": "// Project facts - x of x questions answered",
                "type": "label",
                "options": null,
                "lineNumber": 69
            },
            {
                "id": "FIXME_70",
                "text": "// Planning questions - [ ] draft",
                "type": "label",
                "options": null,
                "lineNumber": 70
            },
            {
                "id": "FIXME_71",
                "text": "// Project aspects - x of x questions answered",
                "type": "label",
                "options": null,
                "lineNumber": 71
            },
            {
                "id": "FIXME_72",
                "text": "// Project stories - x stories told",
                "type": "label",
                "options": null,
                "lineNumber": 72
            },
            {
                "id": "FIXME_73",
                "text": "// Project story elements - x elements entered",
                "type": "label",
                "options": null,
                "lineNumber": 73
            },
            {
                "id": "FIXME_74",
                "text": "// Story sharing assessment - x of 20 questions answered",
                "type": "label",
                "options": null,
                "lineNumber": 74
            },
            {
                "id": "FIXME_75",
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
                "id": "storyElements",
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
                "id": "FIXME_238",
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
                "id": "FIXME_262",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 262
            },
            {
                "id": "FIXME_263",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 263
            },
            {
                "id": "FIXME_264",
                "text": "//                                                   COLLECTION DESIGN",
                "type": "label",
                "options": null,
                "lineNumber": 264
            },
            {
                "id": "FIXME_265",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 265
            },
            {
                "id": "FIXME_266",
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
                "id": "FIXME_269",
                "text": "// Collection venues - X venues chosen",
                "type": "label",
                "options": null,
                "lineNumber": 269
            },
            {
                "id": "FIXME_270",
                "text": "// Story eliciting questions - x questions written",
                "type": "label",
                "options": null,
                "lineNumber": 270
            },
            {
                "id": "FIXME_271",
                "text": "// Questions about stories - x questions written",
                "type": "label",
                "options": null,
                "lineNumber": 271
            },
            {
                "id": "FIXME_272",
                "text": "// Questions about people - x stories written",
                "type": "label",
                "options": null,
                "lineNumber": 272
            },
            {
                "id": "FIXME_273",
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
                "id": "storyCollectionSessionsList",
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
                "id": "collectionSessionAgenda",
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
                "id": "FIXME_380",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 380
            },
            {
                "id": "FIXME_381",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 381
            },
            {
                "id": "FIXME_382",
                "text": "//                                                  COLLECTION PROCESS",
                "type": "label",
                "options": null,
                "lineNumber": 382
            },
            {
                "id": "FIXME_383",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 383
            },
            {
                "id": "FIXME_384",
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
                "id": "FIXME_387",
                "text": "// Online story collection is [ ] enabled",
                "type": "label",
                "options": null,
                "lineNumber": 387
            },
            {
                "id": "FIXME_388",
                "text": "// Number of stories entered - x",
                "type": "label",
                "options": null,
                "lineNumber": 388
            },
            {
                "id": "FIXME_389",
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
                "id": "FIXME_414",
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
                "id": "FIXME_418",
                "text": "// this page is the same as the \"participate\" page above, but only the admin can see it",
                "type": "label",
                "options": null,
                "lineNumber": 418
            },
            {
                "id": "FIXME_419",
                "text": "// and the normal tabs are shown on the page",
                "type": "label",
                "options": null,
                "lineNumber": 419
            },
            {
                "id": "FIXME_421",
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
                "id": "collectionSessions",
                "text": "These are the story collection sessions you planned to hold.",
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
                "id": "collectionSessionConstructions",
                "text": "These are the group constructions you have entered for this session so far.",
                "type": "grid",
                "options": "page_newCollectionSessionConstruction",
                "lineNumber": 442
            },
            {
                "id": "collectionSessionNotes",
                "text": "These are the notes you have entered for this story collection session so far.",
                "type": "page_newCollectionSessionNotes",
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
                "id": "collectionSessionConstructionImages",
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
                "id": "collectionSessionConstrucctionImage",
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
                "id": "collectionSessionNotesImages",
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
                "id": "collectionSessionQuestionsLabel",
                "text": "Note: If there are no sessions in this list, enter them in the \"Enter story collection session records\" screen first.",
                "type": "label",
                "lineNumber": 474
            },
            {
                "id": "FIXME_476",
                "text": "// this list should populate with names of sessions given in \"enter story collection sessions records\" screen.",
                "type": "label",
                "options": null,
                "lineNumber": 476
            },
            {
                "id": "FIXME_477",
                "text": "/// there should be NO add button... but the edit button should go to the popup specified here",
                "type": "label",
                "options": null,
                "lineNumber": 477
            },
            {
                "id": "FIXME_478",
                "text": "Story collection sessions",
                "type": "grid",
                "options": "page_answerQuestionsAboutCollectionSession",
                "lineNumber": 478
            }
        ]
    },
    {
        "id": "page_answerQuestionsAboutCollectionSession",
        "name": "Reflect on story collection session",
        "lineNumber": 480,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "collectionReflectChangeLabel",
                "text": "Change",
                "type": "header",
                "lineNumber": 482
            },
            {
                "id": "collectionReflectChangeEmotions",
                "text": "How did the perceptions of the participants change from the start to the end of the session?",
                "shortText": "Change in participant perceptions",
                "type": "textarea",
                "lineNumber": 483
            },
            {
                "id": "collectionReflectChangeYourEmotions",
                "text": "How did <i>your</i> perceptions change?",
                "shortText": "Change in facilitator perceptions",
                "type": "textarea",
                "lineNumber": 484
            },
            {
                "id": "collectionReflectProjectChanged",
                "text": "How has the overall project changed as a result of this session?",
                "shortText": "Changes to the project",
                "type": "textarea",
                "lineNumber": 485
            },
            {
                "id": "collectionReflectInteractionsLabel",
                "text": "Interactions",
                "type": "header",
                "lineNumber": 487
            },
            {
                "id": "collectionReflectInteractionsParticipants",
                "text": "Describe the interactions between participants in this session.",
                "shortText": "Interactions among participants",
                "type": "textarea",
                "lineNumber": 488
            },
            {
                "id": "collectionReflectInteractionsFacilitators",
                "text": "Describe interactions between participants and facilitators.",
                "shortText": "Interactions between participants and facilitators",
                "type": "textarea",
                "lineNumber": 489
            },
            {
                "id": "collectionReflectStories",
                "text": "What did you notice about the stories people told, retold, chose, and worked with during the session?",
                "shortText": "Stories",
                "type": "textarea",
                "lineNumber": 490
            },
            {
                "id": "collectionReflectLearningLabel",
                "text": "Learning",
                "type": "header",
                "lineNumber": 492
            },
            {
                "id": "collectionReflectSpecial",
                "text": "What was special about these people in this place on this day?",
                "shortText": "Unique features",
                "type": "textarea",
                "lineNumber": 493
            },
            {
                "id": "collectionReflectSurprise",
                "text": "What surprised you about this session?",
                "shortText": "Surprise",
                "type": "textarea",
                "lineNumber": 494
            },
            {
                "id": "collectionReflectWorkedWellAndNot",
                "text": "Which parts of your plans for this session worked out well? Which parts didn't?",
                "shortText": "Worked and didn't work",
                "type": "textarea",
                "lineNumber": 495
            },
            {
                "id": "collectionReflectNewIdeas",
                "text": "What new ideas did you gain from this session? What did you learn from it?",
                "shortText": "New ideas",
                "type": "textarea",
                "lineNumber": 496
            },
            {
                "id": "collectionReflectExtra",
                "text": "What else do you want to remember about this session?",
                "shortText": "Other",
                "type": "textarea",
                "lineNumber": 497
            }
        ]
    },
    {
        "id": "page_readCollectionProcessReport",
        "name": "Read collection process report",
        "lineNumber": 499,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "collectionProcessReport",
                "text": "Collection process report",
                "type": "report",
                "options": "collectionProcess",
                "lineNumber": 501
            },
            {
                "id": "FIXME_503",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 503
            },
            {
                "id": "FIXME_504",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 504
            },
            {
                "id": "FIXME_505",
                "text": "//                                                       CATALYSIS",
                "type": "label",
                "options": null,
                "lineNumber": 505
            },
            {
                "id": "FIXME_506",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 506
            },
            {
                "id": "FIXME_507",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 507
            }
        ]
    },
    {
        "id": "page_catalysis",
        "name": "Catalysis",
        "lineNumber": 509,
        "description": "",
        "isHeader": true,
        "questions": [
            {
                "id": "FIXME_510",
                "text": "// Observations - x",
                "type": "label",
                "options": null,
                "lineNumber": 510
            },
            {
                "id": "FIXME_511",
                "text": "// Interpretations - x",
                "type": "label",
                "options": null,
                "lineNumber": 511
            },
            {
                "id": "FIXME_512",
                "text": "// Ideas - x",
                "type": "label",
                "options": null,
                "lineNumber": 512
            },
            {
                "id": "FIXME_513",
                "text": "// Perspectives - x",
                "type": "label",
                "options": null,
                "lineNumber": 513
            }
        ]
    },
    {
        "id": "page_browseStories",
        "name": "Browse stories",
        "lineNumber": 515,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "collectedStoriesAfterCollection",
                "text": "Collected stories",
                "type": "storyBrowser",
                "options": "addObservation:\"page_addToObservation\";addExcerpt:\"page_addToExcerpt\"",
                "lineNumber": 517
            }
        ]
    },
    {
        "id": "page_addToObservation",
        "name": "Add to observation",
        "lineNumber": 519,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "addObservationsLabel",
                "text": "Note: You should not add any observations that depend on patterns among stories until after\nall stories have been entered.",
                "type": "label",
                "lineNumber": 521
            },
            {
                "id": "observationsList",
                "text": "Choose an observation from this list to which to add the selected result, or create a new observation.",
                "type": "observationsList",
                "lineNumber": 524
            },
            {
                "id": "addResultToExistingObservation",
                "text": "Add result to selected observation",
                "type": "button",
                "lineNumber": 526
            },
            {
                "id": "createNewObservationWithResult",
                "text": "Create new observation with this result",
                "type": "button",
                "options": "page_createNewObservation",
                "lineNumber": 527
            }
        ]
    },
    {
        "id": "page_createNewObservation",
        "name": "Create new observation",
        "lineNumber": 529,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "observationName",
                "text": "Please give this observation a name.",
                "type": "text",
                "lineNumber": 531
            }
        ]
    },
    {
        "id": "page_addToExcerpt",
        "name": "Add to excerpt",
        "lineNumber": 533,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "excerptsList",
                "text": "Choose an excerpt from this list to which to add the selected text, or create a new excerpt.",
                "type": "excerptsList",
                "lineNumber": 535
            },
            {
                "id": "addTextToExistingExcerpt",
                "text": "Add text to selected excerpt",
                "type": "button",
                "lineNumber": 537
            },
            {
                "id": "createNewExcerptWithText",
                "text": "Create new excerpt with this text",
                "type": "button",
                "options": "page_createNewExcerpt",
                "lineNumber": 538
            }
        ]
    },
    {
        "id": "page_createNewExcerpt",
        "name": "Create new excerpt",
        "lineNumber": 540,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "excerptName",
                "text": "Please give this excerpt a name.",
                "type": "text",
                "lineNumber": 542
            },
            {
                "id": "excerptText",
                "text": "You can edit the excerpt here.",
                "type": "textarea",
                "lineNumber": 544
            },
            {
                "id": "excerptNotes",
                "text": "You can enter some notes about the excerpt here.",
                "type": "textarea",
                "lineNumber": 546
            }
        ]
    },
    {
        "id": "page_themeStories",
        "name": "Theme stories",
        "lineNumber": 548,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "themeStories",
                "text": "Theme stories",
                "type": "storyThemer",
                "lineNumber": 550
            }
        ]
    },
    {
        "id": "page_browseGraphs",
        "name": "Browse graphs",
        "lineNumber": 552,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "graphBrowser",
                "text": "Graph browser",
                "type": "graphBrowser",
                "lineNumber": 554
            }
        ]
    },
    {
        "id": "page_reviewTrends",
        "name": "Review trends",
        "lineNumber": 556,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "statTests",
                "text": "Which statistical tests do you want to consider?",
                "type": "checkBoxes",
                "options": "chi-squared (differences between counts);t-test (differences between means);correlation",
                "lineNumber": 558
            },
            {
                "id": "minSubsetSize",
                "text": "How large should subset counts be to be considered for comparison?",
                "type": "select",
                "options": "20;30;40;50",
                "lineNumber": 559
            },
            {
                "id": "significanceThreshold",
                "text": "What significance threshold do you want reported?",
                "type": "select",
                "options": "0.05;0.01",
                "lineNumber": 560
            },
            {
                "id": "trendResults",
                "text": "How many results do you want to see per test type?",
                "type": "select",
                "options": "5;10;15;20;25;30",
                "lineNumber": 561
            },
            {
                "id": "FIXME_563",
                "text": "// when user changes any of the options above, the trend report below should update",
                "type": "label",
                "options": null,
                "lineNumber": 563
            },
            {
                "id": "trendsReport",
                "text": "Trends report",
                "type": "trendsReport",
                "lineNumber": 564
            }
        ]
    },
    {
        "id": "page_reviewExcerpts",
        "name": "Review excerpts",
        "lineNumber": 566,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "FIXME_568",
                "text": "Collected excerpts",
                "type": "grid",
                "options": "page_createNewExcerpt",
                "lineNumber": 568
            }
        ]
    },
    {
        "id": "page_interpretObservations",
        "name": "Interpret observations",
        "lineNumber": 570,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "FIXME_572",
                "text": "Collected observations",
                "type": "grid",
                "options": "page_editObservation",
                "lineNumber": 572
            }
        ]
    },
    {
        "id": "page_editObservation",
        "name": "Edit observation",
        "lineNumber": 574,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "FIXME_576",
                "text": "Please give this observation a name.",
                "shortText": "Observation name",
                "type": "text",
                "lineNumber": 576
            },
            {
                "id": "observation",
                "text": "Please describe this observation.",
                "shortText": "Observation",
                "type": "textarea",
                "lineNumber": 577
            },
            {
                "id": "observationResultsList",
                "text": "These are the results you selected to include in this observation.",
                "shortText": "Results",
                "type": "grid",
                "lineNumber": 579
            },
            {
                "id": "firstInterpText",
                "text": "What is your first interpretation about this observation?",
                "shortText": "First interpretation",
                "type": "textarea",
                "lineNumber": 581
            },
            {
                "id": "firstInterpName",
                "text": "Enter a name for this interpretation.",
                "shortText": "First interpretation name",
                "type": "text",
                "lineNumber": 582
            },
            {
                "id": "firstInterpIdea",
                "text": "If you like, you can record an idea that follows from this interpretation.",
                "shortText": "First interpretation idea",
                "type": "textarea",
                "lineNumber": 583
            },
            {
                "id": "firstInterpExcerptsList",
                "text": "You can add excerpts to this interpretation.",
                "shortText": "Excerpts for first interpretation",
                "type": "grid",
                "options": "page_selectExcerpt",
                "lineNumber": 584
            },
            {
                "id": "opposingInterpText",
                "text": "Now enter an interpretation that does not agree with your first interpretation.",
                "shortText": "Opposing interpretation",
                "type": "textarea",
                "lineNumber": 586
            },
            {
                "id": "opposingInterpName",
                "text": "Please name this interpretation.",
                "shortText": "Opposing interpretation name",
                "type": "text",
                "lineNumber": 587
            },
            {
                "id": "opposingInterpIdea",
                "text": "You can record an idea that follows from this interpretation.",
                "shortText": "Opposing interpretation idea",
                "type": "textarea",
                "lineNumber": 588
            },
            {
                "id": "opposingInterpExcerptsList",
                "text": "Choose some excerpts to exemplify this interpretation.",
                "shortText": "Excerpts for opposing interpretation",
                "type": "grid",
                "options": "page_selectExcerpt",
                "lineNumber": 589
            },
            {
                "id": "thirdInterpText",
                "text": "If you like, enter one more interpretation.",
                "shortText": "Third interpretation",
                "type": "textarea",
                "lineNumber": 591
            },
            {
                "id": "thirdInterpName",
                "text": "Please name this interpretation.",
                "shortText": "Third interpretation name",
                "type": "text",
                "lineNumber": 592
            },
            {
                "id": "thirdInterpIdea",
                "text": "You can record an idea that follows from this interpretation.",
                "shortText": "Third interpretation idea",
                "type": "textarea",
                "lineNumber": 593
            },
            {
                "id": "thirdInterpExcerptsList",
                "text": "Choose some excerpts to exemplify this interpretation.",
                "shortText": "Excerpts for third interpretation",
                "type": "grid",
                "options": "page_selectExcerpt",
                "lineNumber": 594
            }
        ]
    },
    {
        "id": "page_selectExcerpt",
        "name": "Select excerpt",
        "lineNumber": 596,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "FIXME_598",
                "text": "Collected excerpts",
                "type": "grid",
                "options": "page_createNewExcerpt",
                "lineNumber": 598
            },
            {
                "id": "FIXME_600",
                "text": "// when they click this button the selected excerpt should be added to the list whose \"add\" button they clicked",
                "type": "label",
                "options": null,
                "lineNumber": 600
            },
            {
                "id": "FIXME_601",
                "text": "// it should know which interpretation to tie the excerpt to",
                "type": "label",
                "options": null,
                "lineNumber": 601
            },
            {
                "id": "addExcerptToInterpretation",
                "text": "Add selected excerpt to interpretation",
                "type": "button",
                "lineNumber": 602
            }
        ]
    },
    {
        "id": "page_clusterInterpretations",
        "name": "Cluster interpretations",
        "lineNumber": 604,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "clusterInterpLabel",
                "text": "Note: Do not cluster your interpretations unless you are sure you have finished collecting them.",
                "type": "label",
                "lineNumber": 606
            },
            {
                "id": "FIXME_608",
                "text": "// ideally, when they are done with this, the circles marked as group names",
                "type": "label",
                "options": null,
                "lineNumber": 608
            },
            {
                "id": "FIXME_609",
                "text": "// will get copied into the perspectives list seen in the next page",
                "type": "label",
                "options": null,
                "lineNumber": 609
            },
            {
                "id": "clusterInterpretations",
                "text": "Cluster interpretations into perspectives",
                "type": "clusterSpace",
                "options": "interpretations",
                "lineNumber": 610
            }
        ]
    },
    {
        "id": "page_describePerspectives",
        "name": "Describe perspectives",
        "lineNumber": 612,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "perspectivesList",
                "text": "Perspectives",
                "type": "grid",
                "options": "page_addPerspective",
                "lineNumber": 614
            }
        ]
    },
    {
        "id": "page_addPerspective",
        "name": "Add or change perspective",
        "lineNumber": 616,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "perspectiveName",
                "text": "Please give this perspective a name.",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 618
            },
            {
                "id": "perspectiveDescription",
                "text": "Describe this perspective.",
                "shortText": "Perspective",
                "type": "textarea",
                "lineNumber": 619
            },
            {
                "id": "FIXME_621",
                "text": "// note, this grid should combine all the results linked to observations linked to interpretations linked to this perspective",
                "type": "label",
                "options": null,
                "lineNumber": 621
            },
            {
                "id": "FIXME_622",
                "text": "// perspective",
                "type": "label",
                "options": null,
                "lineNumber": 622
            },
            {
                "id": "FIXME_623",
                "text": "//      interpretation",
                "type": "label",
                "options": null,
                "lineNumber": 623
            },
            {
                "id": "FIXME_624",
                "text": "//           observation",
                "type": "label",
                "options": null,
                "lineNumber": 624
            },
            {
                "id": "FIXME_625",
                "text": "//                result",
                "type": "label",
                "options": null,
                "lineNumber": 625
            },
            {
                "id": "FIXME_626",
                "text": "Choose an observation result that exemplifies this perspective.",
                "shortText": "Observation",
                "type": "grid",
                "lineNumber": 626
            },
            {
                "id": "FIXME_628",
                "text": "// similarly, this should be a list of all the excerpts linked to interpretations linked to this perspective",
                "type": "label",
                "options": null,
                "lineNumber": 628
            },
            {
                "id": "FIXME_629",
                "text": "// perspective",
                "type": "label",
                "options": null,
                "lineNumber": 629
            },
            {
                "id": "FIXME_630",
                "text": "//     interpretation",
                "type": "label",
                "options": null,
                "lineNumber": 630
            },
            {
                "id": "FIXME_631",
                "text": "//         excerpt",
                "type": "label",
                "options": null,
                "lineNumber": 631
            },
            {
                "id": "FIXME_632",
                "text": "Choose one or more excerpts to illustrate this perspective",
                "shortText": "Excerpts",
                "type": "grid",
                "options": "page_selectExcerpt",
                "lineNumber": 632
            }
        ]
    },
    {
        "id": "page_readCatalysisReport",
        "name": "Read catalysis report",
        "lineNumber": 634,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "catalysisReport",
                "text": "Catalysis report",
                "type": "report",
                "options": "catalysis",
                "lineNumber": 636
            },
            {
                "id": "FIXME_638",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 638
            },
            {
                "id": "FIXME_639",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 639
            },
            {
                "id": "FIXME_640",
                "text": "//                                                       SENSEMAKING",
                "type": "label",
                "options": null,
                "lineNumber": 640
            },
            {
                "id": "FIXME_641",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 641
            },
            {
                "id": "FIXME_642",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 642
            }
        ]
    },
    {
        "id": "page_sensemaking",
        "name": "Sensemaking",
        "lineNumber": 644,
        "description": "",
        "isHeader": true,
        "questions": [
            {
                "id": "FIXME_645",
                "text": "// Planning sessions - x of x questions answered",
                "type": "label",
                "options": null,
                "lineNumber": 645
            },
            {
                "id": "FIXME_646",
                "text": "// Write session agenda - x of x questions answered",
                "type": "label",
                "options": null,
                "lineNumber": 646
            },
            {
                "id": "FIXME_647",
                "text": "// Print story cards - x cards printed (or checkmark)",
                "type": "label",
                "options": null,
                "lineNumber": 647
            },
            {
                "id": "FIXME_648",
                "text": "// Post-session review - x of x questions answered",
                "type": "label",
                "options": null,
                "lineNumber": 648
            }
        ]
    },
    {
        "id": "page_planSensemakingSessions",
        "name": "Plan sensemaking sessions",
        "lineNumber": 650,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "sensemakingSessionRecommendations",
                "text": "Recommendations for sensemaking sessions",
                "type": "recommendationTable",
                "options": "sensemakingSessions",
                "lineNumber": 652
            },
            {
                "id": "sensemakingSessions",
                "text": "Sensemaking sessions",
                "type": "grid",
                "options": "page_addSensemakingSessionPlan",
                "lineNumber": 654
            }
        ]
    },
    {
        "id": "page_addSensemakingSessionPlan",
        "name": "Enter sensemaking session plan",
        "lineNumber": 656,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "sensemakingSessionName",
                "text": "Please give this session plan a name.",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 658
            },
            {
                "id": "sensemakingSessionRepetitions",
                "text": "How many repetitions of the session will there be?",
                "shortText": "Repetitions",
                "type": "text",
                "lineNumber": 659
            },
            {
                "id": "sensemakingSessionLength",
                "text": "How long will this session be?",
                "shortText": "Length",
                "type": "text",
                "lineNumber": 660
            },
            {
                "id": "sensemakingSessionTime",
                "text": "When will it take place?",
                "shortText": "Time",
                "type": "text",
                "lineNumber": 661
            },
            {
                "id": "sensemakingSessionLocation",
                "text": "Where will it take place?",
                "shortText": "Location",
                "type": "text",
                "lineNumber": 662
            },
            {
                "id": "sensemakingSessionSize",
                "text": "How many people will be invited to each repetition of this session?",
                "shortText": "Number of people",
                "type": "text",
                "lineNumber": 663
            },
            {
                "id": "sensemakingSessionGroups",
                "text": "From which participant group(s) will people be invited?",
                "shortText": "Participant groups",
                "type": "checkBoxesWithPull",
                "options": "participantGroups",
                "lineNumber": 664
            },
            {
                "id": "sensemakingSessionMaterials",
                "text": "What materials will this session require?",
                "shortText": "Materials",
                "type": "textarea",
                "lineNumber": 665
            },
            {
                "id": "sensemakingSessionDetails",
                "text": "Enter other details about this session.",
                "shortText": "Other",
                "type": "textarea",
                "lineNumber": 666
            },
            {
                "id": "sensemakingSessionAgenda",
                "text": "These are the activities added to this session plan so far.",
                "type": "grid",
                "options": "page_addSensemakingSessionActivity",
                "lineNumber": 668
            },
            {
                "id": "printSensemakingSessionAgenda",
                "text": "Print session agenda",
                "type": "button",
                "lineNumber": 670
            }
        ]
    },
    {
        "id": "page_addSensemakingSessionActivity",
        "name": "Add sensemaking session activity",
        "lineNumber": 672,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "sensemakingSessionActivityName",
                "text": "Please give this activity a name.",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 674
            },
            {
                "id": "sensemakingSessionActivity",
                "text": "What type of activity is this?",
                "shortText": "Type",
                "type": "select",
                "options": "ice-breaker;encountering stories (no task);encountering stories (simple task);discussing stories;twice-told stories exercise;timeline exercise;landscape exercise;story elements exercise;composite stories exercise;my own exercise;other",
                "lineNumber": 675
            },
            {
                "id": "sensemakingActivityPlan",
                "text": "Describe the plan for this activity.",
                "shortText": "Plan",
                "type": "textarea",
                "lineNumber": 676
            },
            {
                "id": "sensemakingActivityOptionalParts",
                "text": "Describe optional elaborations you might or might not use in this activity.",
                "shortText": "Optional elaborations",
                "type": "textarea",
                "lineNumber": 677
            },
            {
                "id": "sensemakingActivityTime",
                "text": "How long will this activity take?",
                "shortText": "Length",
                "type": "text",
                "lineNumber": 678
            },
            {
                "id": "sensemakingActivityRecording",
                "text": "Will new stories be recorded during this activity, and if so, how?",
                "shortText": "New stories",
                "type": "textarea",
                "lineNumber": 679
            },
            {
                "id": "sensemakingActivityMaterials",
                "text": "What materials will be provided for this activity?",
                "shortText": "Materials",
                "type": "textarea",
                "lineNumber": 680
            },
            {
                "id": "sensemakingActivitySpaces",
                "text": "What spaces will be used for this activity?",
                "shortText": "Spaces",
                "type": "textarea",
                "lineNumber": 681
            },
            {
                "id": "sensemakingActivityFacilitation",
                "text": "What sort of facilitation will be necessary for this activity?",
                "shortText": "Facilitation",
                "type": "textarea",
                "lineNumber": 682
            }
        ]
    },
    {
        "id": "page_enterSensemakingSessionRecords",
        "name": "Enter sensemaking session records",
        "lineNumber": 684,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "FIXME_686",
                "text": "Sensemaking sessions",
                "type": "grid",
                "options": "page_addSensemakingSessionRecord",
                "lineNumber": 686
            }
        ]
    },
    {
        "id": "page_addSensemakingSessionRecord",
        "name": "Add sensemaking session record",
        "lineNumber": 688,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "sensemakingSessionOutcomes",
                "text": "Session outcomes (like discoveries and ideas)",
                "type": "grid",
                "options": "page_newSensemakingSessionOutcome",
                "lineNumber": 690
            },
            {
                "id": "sensemakingSessionSummaries",
                "text": "Group constructions",
                "type": "grid",
                "options": "page_newSensemakingSessionConstruction",
                "lineNumber": 692
            },
            {
                "id": "sensemakingSessionImages",
                "text": "Session notes",
                "type": "page_newSensemakingSessionNotes",
                "lineNumber": 694
            }
        ]
    },
    {
        "id": "page_newSensemakingSessionOutcome",
        "name": "Sensemaking session outcome",
        "lineNumber": 696,
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
                "lineNumber": 698
            },
            {
                "id": "sensemakingSessionOutcomeName",
                "text": "Please give this outcome a name.",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 699
            },
            {
                "id": "sensemakingSessionOutcomeText",
                "text": "Describe the outcome.",
                "shortText": "Description",
                "type": "textarea",
                "lineNumber": 700
            }
        ]
    },
    {
        "id": "page_newSensemakingSessionConstruction",
        "name": "Sensemaking construction",
        "lineNumber": 702,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "sensemakingSessionConstructionName",
                "text": "Please give this construction a name.",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 704
            },
            {
                "id": "sensemakingSessionConstructionType",
                "text": "What type of construction is it?",
                "shortText": "Type",
                "type": "select",
                "options": "timeline;landscape;story elements;composite story;other",
                "lineNumber": 705
            },
            {
                "id": "sensemakingSessionContructionText",
                "text": "Please decribe the construction (or include a description given by participants).",
                "shortText": "Description",
                "type": "textarea",
                "lineNumber": 706
            },
            {
                "id": "sensemakingSessionConstructionLink",
                "text": "You can include a link to an audio or video description here.",
                "shortText": "Audio/video link",
                "type": "text",
                "lineNumber": 707
            },
            {
                "id": "sensemakingSessionConstructionImages",
                "text": "These are the images you have entered for the construction so far.",
                "type": "grid",
                "options": "page_newSensemakingConstructionImage",
                "lineNumber": 709
            }
        ]
    },
    {
        "id": "page_newSensemakingConstructionImage",
        "name": "Sensemaking construction image",
        "lineNumber": 711,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "sensemakingSessionConstrucctionImage",
                "text": "Upload an image for this construction.",
                "shortText": "Image",
                "type": "imageUploader",
                "lineNumber": 713
            },
            {
                "id": "sensemakingSessionConstructionImageName",
                "text": "Please give this image a name.",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 714
            },
            {
                "id": "sensemakingSessionConstructionImageNotes",
                "text": "Make any notes you'd like to record on this image here.",
                "shortText": "Notes",
                "type": "textarea",
                "lineNumber": 715
            }
        ]
    },
    {
        "id": "page_newSensemakingSessionNotes",
        "name": "Sensemaking session notes",
        "lineNumber": 717,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "sensemakingSessionNotesName",
                "text": "Please give this set of notes a name.",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 719
            },
            {
                "id": "sensemakingSessionNotesText",
                "text": "Enter your notes here.",
                "shortText": "Notes",
                "type": "textarea",
                "lineNumber": 720
            },
            {
                "id": "sensemakingSessionNotesImages",
                "text": "These are the images you have entered for this set of notes so far.",
                "shortText": "Images",
                "type": "grid",
                "options": "page_newSensemakingSessionImage",
                "lineNumber": 721
            }
        ]
    },
    {
        "id": "page_newSensemakingSessionImage",
        "name": "Sensemaking session notes image",
        "lineNumber": 723,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "sensemakingSessionNotesImage",
                "text": "Upload your image here.",
                "shortText": "Image",
                "type": "imageUploader",
                "lineNumber": 725
            },
            {
                "id": "sensemakingSessionImageName",
                "text": "Please give this image a name.",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 726
            },
            {
                "id": "sensemakingSessionNotesImageNotes",
                "text": "You can enter some notes about this image.",
                "shortText": "Notes",
                "type": "textarea",
                "lineNumber": 727
            }
        ]
    },
    {
        "id": "page_answerQuestionsAboutSensemakingSessions",
        "name": "Reflect on sensemaking sessions",
        "lineNumber": 729,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "sensemakingSessionQuestionsLabel",
                "text": "Note: If there are no sessions in this list, enter them in the \"Enter sensemaking session records\" screen first.",
                "type": "label",
                "lineNumber": 731
            },
            {
                "id": "FIXME_733",
                "text": "// this list should populate with names of sessions given in \"enter sensemaking sessions records\" screen.",
                "type": "label",
                "options": null,
                "lineNumber": 733
            },
            {
                "id": "FIXME_734",
                "text": "/// there should be NO add button... but the edit button should go to the popup specified here",
                "type": "label",
                "options": null,
                "lineNumber": 734
            },
            {
                "id": "FIXME_735",
                "text": "Sensemaking sessions",
                "type": "grid",
                "options": "page_answerQuestionsAboutSensemakingSession",
                "lineNumber": 735
            }
        ]
    },
    {
        "id": "page_answerQuestionsAboutSensemakingSession",
        "name": "Reflect on session",
        "lineNumber": 737,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "sensemakingReflectChangeLabel",
                "text": "Change",
                "type": "header",
                "lineNumber": 739
            },
            {
                "id": "sensemakingReflectChangeEmotions",
                "text": "How did the perceptions of the participants change from the start to the end of the session?",
                "shortText": "Change in participant perceptions",
                "type": "textarea",
                "lineNumber": 740
            },
            {
                "id": "sensemakingReflectChangeYourEmotions",
                "text": "How did <i>your</i> perceptions change?",
                "shortText": "Change in facilitator perceptions",
                "type": "textarea",
                "lineNumber": 741
            },
            {
                "id": "sensemakingReflectProjectChanged",
                "text": "How has the overall project changed as a result of this session?",
                "shortText": "Changes to the project",
                "type": "textarea",
                "lineNumber": 742
            },
            {
                "id": "sensemakingReflectInteractionsLabel",
                "text": "Interactions",
                "type": "header",
                "lineNumber": 744
            },
            {
                "id": "sensemakingReflectInteractionsParticipants",
                "text": "Describe the interactions between participants in this session.",
                "shortText": "Interactions among participants",
                "type": "textarea",
                "lineNumber": 745
            },
            {
                "id": "sensemakingReflectInteractionsFacilitators",
                "text": "Describe interactions between participants and facilitators.",
                "shortText": "Interactions between participants and facilitators",
                "type": "textarea",
                "lineNumber": 746
            },
            {
                "id": "sensemakingReflectStories",
                "text": "What did you notice about the stories people told, retold, chose, and worked with during the session?",
                "shortText": "Stories",
                "type": "textarea",
                "lineNumber": 747
            },
            {
                "id": "sensemakingReflectLearningLabel",
                "text": "Learning",
                "type": "header",
                "lineNumber": 749
            },
            {
                "id": "sensemakingReflectSpecial",
                "text": "What was special about these people in this place on this day?",
                "shortText": "Unique features",
                "type": "textarea",
                "lineNumber": 750
            },
            {
                "id": "sensemakingReflectSurprise",
                "text": "What surprised you about this session?",
                "shortText": "Surprise",
                "type": "textarea",
                "lineNumber": 751
            },
            {
                "id": "sensemakingReflectWorkedWellAndNot",
                "text": "Which parts of your plans for this session worked out well? Which parts didn't?",
                "shortText": "Worked and didn't work",
                "type": "textarea",
                "lineNumber": 752
            },
            {
                "id": "sensemakingReflectNewIdeas",
                "text": "What new ideas did you gain from this session? What did you learn from it?",
                "shortText": "New ideas",
                "type": "textarea",
                "lineNumber": 753
            },
            {
                "id": "sensemakingReflectExtra",
                "text": "What else do you want to remember about this session?",
                "shortText": "Other",
                "type": "textarea",
                "lineNumber": 754
            }
        ]
    },
    {
        "id": "page_readSensemakingReport",
        "name": "Read sensemaking report",
        "lineNumber": 756,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "sensemakingReport",
                "text": "Sensemaking report",
                "type": "report",
                "options": "sensemaking",
                "lineNumber": 758
            },
            {
                "id": "FIXME_760",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 760
            },
            {
                "id": "FIXME_761",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 761
            },
            {
                "id": "FIXME_762",
                "text": "//                                                       INTERVENTION",
                "type": "label",
                "options": null,
                "lineNumber": 762
            },
            {
                "id": "FIXME_763",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 763
            },
            {
                "id": "FIXME_764",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 764
            }
        ]
    },
    {
        "id": "page_intervention",
        "name": "Intervention",
        "lineNumber": 766,
        "description": "",
        "isHeader": true,
        "questions": [
            {
                "id": "FIXME_767",
                "text": "// Choose interventions - x planned",
                "type": "label",
                "options": null,
                "lineNumber": 767
            },
            {
                "id": "FIXME_768",
                "text": "// Answer questions about interventions - x questions answered",
                "type": "label",
                "options": null,
                "lineNumber": 768
            }
        ]
    },
    {
        "id": "page_projectOutcomesForIntervention",
        "name": "Answer questions about project outcomes",
        "lineNumber": 770,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "outcomesTable",
                "text": "In order to choose interventions that will be useful in your project, it will be helpful to think about some\nof the issues (positive and negative) you discovered in your project. Please answer these questions in reference to\nthe participant groups you set up in the project planning phase.",
                "type": "page_outcomesTable",
                "options": "participants_firstGroupName;participants_secondGroupName;participants_thirdGroupName",
                "lineNumber": 772
            }
        ]
    },
    {
        "id": "page_outcomesTable",
        "name": "Project outcomes",
        "lineNumber": 776,
        "description": "",
        "isHeader": false,
        "type": "questionsTable",
        "questions": [
            {
                "id": "outcomesHopesHeader",
                "text": "Hopes",
                "type": "header",
                "lineNumber": 778
            },
            {
                "id": "outcomesHeard",
                "text": "During your project, did the people in this group say they felt heard for the first time?",
                "type": "select",
                "options": "never;occasionally;sometimes;often;mixed",
                "lineNumber": 779
            },
            {
                "id": "outcomesInvolved",
                "text": "Did they say they felt involved for the first time?",
                "type": "select",
                "options": "never;occasionally;sometimes;often;mixed",
                "lineNumber": 780
            },
            {
                "id": "outcomesLearnedAboutComm",
                "text": "Did they say they learned a lot about their community or organization?",
                "type": "select",
                "options": "never;occasionally;sometimes;often;mixed",
                "lineNumber": 781
            },
            {
                "id": "outcomesVoicesHeader",
                "text": "Voices",
                "type": "header",
                "lineNumber": 783
            },
            {
                "id": "outcomesMoreStories",
                "text": "During your story collection, did these people seem to want to tell more stories than you collected?",
                "type": "select",
                "options": "never;occasionally;sometimes;often;mixed",
                "lineNumber": 784
            },
            {
                "id": "outcomesWantedToShareMore",
                "text": "Did you ever feel that they wanted to share more experiences with each other than they did?",
                "type": "select",
                "options": "never;occasionally;sometimes;often;mixed",
                "lineNumber": 785
            },
            {
                "id": "outcomesNeededToBeHeard",
                "text": "Did these people feel that some of the stories you collected \"needed to be heard\" by anyone?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed",
                "lineNumber": 786
            },
            {
                "id": "outcomesNobodyCares",
                "text": "Were there any issues that these people thought \"nobody cares\" about?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed",
                "lineNumber": 787
            },
            {
                "id": "outcomesNeedsHeader",
                "text": "Needs",
                "type": "header",
                "lineNumber": 789
            },
            {
                "id": "outcomesNobodyCanMeetNeeds",
                "text": "Do the people in this group have needs that <i>nobody</i> can meet?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed",
                "lineNumber": 790
            },
            {
                "id": "outcomesNeedNewStories",
                "text": "Do these people need to start telling themselves <i>new</i> stories?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed",
                "lineNumber": 791
            },
            {
                "id": "outcomesKeepExploring",
                "text": "Were there any issues about which the people in this group seemed to want to keep exploring?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed",
                "lineNumber": 792
            },
            {
                "id": "outcomesCrisisPoints",
                "text": "Did you discover any \"crisis points\" where people in this group needed help and didn't get it?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed",
                "lineNumber": 793
            },
            {
                "id": "outcomesBeyondWords",
                "text": "Did you find any issues for this group that were beyond words, that no amount of discussion could resolve?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed",
                "lineNumber": 794
            },
            {
                "id": "outcomesLearningHeader",
                "text": "Learning",
                "type": "header",
                "lineNumber": 796
            },
            {
                "id": "outcomesLearnedAboutTopic",
                "text": "Did these people say that they learned a lot about the topic by participating in the project?",
                "type": "select",
                "options": "never;occasionally;sometimes;often;mixed",
                "lineNumber": 797
            },
            {
                "id": "outcomesNewMembersStruggling",
                "text": "Did you notice that new members of the community or organization were having a harder time making sense of things?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed",
                "lineNumber": 798
            },
            {
                "id": "outcomesInfoWithoutUnderstanding",
                "text": "Were there any issues that these people found difficult to understand, even though abundant information was available?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed",
                "lineNumber": 799
            },
            {
                "id": "outcomesOverConfident",
                "text": "Did you discover any areas in which these people had more confidence than skill?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed",
                "lineNumber": 800
            },
            {
                "id": "outcomesCuriousAboutStoryWork",
                "text": "Did any of these participants express an interest in learning more about story work?",
                "type": "select",
                "options": "never;occasionally;sometimes;often;mixed",
                "lineNumber": 801
            }
        ]
    },
    {
        "id": "page_designInterventions",
        "name": "Design interventions",
        "lineNumber": 803,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "interventionRecommendations",
                "text": "Recommendations for interventions",
                "type": "recommendationTable",
                "options": "interventions",
                "lineNumber": 805
            },
            {
                "id": "interventionsList",
                "text": "These are the interventions you have designed so far.",
                "type": "grid",
                "options": "page_addIntervention",
                "lineNumber": 807
            }
        ]
    },
    {
        "id": "page_addIntervention",
        "name": "Design an intervention",
        "lineNumber": 809,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "interventionName",
                "text": "Please name this intervention.",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 811
            },
            {
                "id": "interventionType",
                "text": "What type of intervention will this be?",
                "shortText": "Type",
                "type": "select",
                "options": "narrative ombudsman;narrative suggestion box;story sharing space;narrative orientation;narrative learning resource;narrative simulation;narrative presentation;dramatic action;sensemaking space;sensemaking pyramid;narrative mentoring program;narrative therapy;participatory theatre;other",
                "lineNumber": 812
            },
            {
                "id": "interventionText",
                "text": "Please describe your plan for this intervention.",
                "shortText": "Description",
                "type": "text",
                "lineNumber": 813
            },
            {
                "id": "interventionLength",
                "text": "Over what span of time will this intervention take place?",
                "shortText": "Length",
                "type": "text",
                "lineNumber": 815
            },
            {
                "id": "interventionTime",
                "text": "When will the intervention start and stop?",
                "shortText": "Time",
                "type": "text",
                "lineNumber": 816
            },
            {
                "id": "interventionLocation",
                "text": "Where will the intervention take place?",
                "shortText": "Location",
                "type": "text",
                "lineNumber": 817
            },
            {
                "id": "interventionHelp",
                "text": "What sort of help will you need to carry out this intervention?",
                "shortText": "Help",
                "type": "textarea",
                "lineNumber": 819
            },
            {
                "id": "interventionPermission",
                "text": "What sorts of permission will you need to carry out this intervention?",
                "shortText": "Permission",
                "type": "textarea",
                "lineNumber": 820
            },
            {
                "id": "interventionParticipation",
                "text": "How will you get people to participate in this intervention?",
                "shortText": "Participation",
                "type": "textarea",
                "lineNumber": 821
            },
            {
                "id": "interventionMaterials",
                "text": "What physical materials will you need?",
                "shortText": "Materials",
                "type": "textarea",
                "lineNumber": 823
            },
            {
                "id": "interventionSpace",
                "text": "What spaces will you need to use?",
                "shortText": "Spaces",
                "type": "textarea",
                "lineNumber": 824
            },
            {
                "id": "interventionTech",
                "text": "What technological resources will you need?",
                "shortText": "Technology",
                "type": "textarea",
                "lineNumber": 825
            },
            {
                "id": "interventionRecording",
                "text": "How will record the results of this intervention?",
                "shortText": "Recording",
                "type": "textarea",
                "lineNumber": 826
            }
        ]
    },
    {
        "id": "page_recordInterventions",
        "name": "Enter intervention records",
        "lineNumber": 828,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "interventionsListForRecording",
                "text": "Interventions",
                "type": "grid",
                "options": "page_addInterventionRecord",
                "lineNumber": 830
            }
        ]
    },
    {
        "id": "page_addInterventionRecord",
        "name": "Add intervention notes",
        "lineNumber": 832,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "interventionNotesName",
                "text": "Please give this set of notes a name.",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 834
            },
            {
                "id": "interventionNotesText",
                "text": "Enter your notes here.",
                "shortText": "Notes",
                "type": "textarea",
                "lineNumber": 835
            },
            {
                "id": "interventionNotesImages",
                "text": "These are the images you have entered for this set of notes so far.",
                "shortText": "Images",
                "type": "grid",
                "options": "page_newInterventionImage",
                "lineNumber": 836
            }
        ]
    },
    {
        "id": "page_newInterventionImage",
        "name": "Intervention notes image",
        "lineNumber": 838,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "interventionNotesImage",
                "text": "Upload your image here.",
                "shortText": "Image",
                "type": "imageUploader",
                "lineNumber": 840
            },
            {
                "id": "interventionImageName",
                "text": "Please give this image a name.",
                "shortText": "Name",
                "type": "text",
                "lineNumber": 841
            },
            {
                "id": "interventionNotesImageNotes",
                "text": "You can enter some notes about this image.",
                "shortText": "Notes",
                "type": "textarea",
                "lineNumber": 842
            }
        ]
    },
    {
        "id": "page_answerQuestionsAboutInterventions",
        "name": "Reflect on interventions",
        "lineNumber": 844,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "interventionQuestionsLabel",
                "text": "Note: If there are no interventions in this list, enter them in the \"Enter intervention records\" screen first.",
                "type": "label",
                "lineNumber": 846
            },
            {
                "id": "FIXME_848",
                "text": "// this list should populate with names of interventions given in \"enter intervention records\" screen.",
                "type": "label",
                "options": null,
                "lineNumber": 848
            },
            {
                "id": "FIXME_849",
                "text": "/// there should be NO add button... but the edit button should go to the popup specified here",
                "type": "label",
                "options": null,
                "lineNumber": 849
            },
            {
                "id": "interventionsListForReflection",
                "text": "Interventions",
                "type": "grid",
                "options": "page_answerQuestionsAboutIntervention",
                "lineNumber": 850
            }
        ]
    },
    {
        "id": "page_answerQuestionsAboutIntervention",
        "name": "Reflect on intervention",
        "lineNumber": 852,
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "interventionReflectChangeLabel",
                "text": "Change",
                "type": "header",
                "lineNumber": 854
            },
            {
                "id": "interventionReflectChangeEmotions",
                "text": "How did the perceptions of the participants change from the start to the end of the intervention?",
                "shortText": "Change in participant perceptions",
                "type": "textarea",
                "lineNumber": 855
            },
            {
                "id": "interventionReflectChangeYourEmotions",
                "text": "How did <i>your</i> perceptions change?",
                "shortText": "Change in facilitator perceptions",
                "type": "textarea",
                "lineNumber": 856
            },
            {
                "id": "interventionReflectProjectChanged",
                "text": "How has the overall project changed as a result of this intervention?",
                "shortText": "Changes to the project",
                "type": "textarea",
                "lineNumber": 857
            },
            {
                "id": "interventionReflectInteractionsLabel",
                "text": "Interactions",
                "type": "header",
                "lineNumber": 859
            },
            {
                "id": "interventionReflectInteractionsParticipants",
                "text": "Describe the interactions between participants during this intervention.",
                "shortText": "Interactions among participants",
                "type": "textarea",
                "lineNumber": 860
            },
            {
                "id": "interventionReflectInteractionsFacilitators",
                "text": "Describe interactions between participants and facilitators.",
                "shortText": "Interactions between participants and facilitators",
                "type": "textarea",
                "lineNumber": 861
            },
            {
                "id": "interventionReflectStories",
                "text": "What did you notice about the stories people told, retold, chose, and worked with during the intervention?",
                "shortText": "Stories",
                "type": "textarea",
                "lineNumber": 862
            },
            {
                "id": "interventionReflectLearningLabel",
                "text": "Learning",
                "type": "header",
                "lineNumber": 864
            },
            {
                "id": "interventionReflectSpecial",
                "text": "What was special about this intervention?",
                "shortText": "Unique features",
                "type": "textarea",
                "lineNumber": 865
            },
            {
                "id": "interventionReflectSurprise",
                "text": "What surprised you about this intervention?",
                "shortText": "Surprise",
                "type": "textarea",
                "lineNumber": 866
            },
            {
                "id": "interventionReflectWorkedWellAndNot",
                "text": "Which parts of your plans for this intervention worked out well? Which parts didn't?",
                "shortText": "Worked and didn't work",
                "type": "textarea",
                "lineNumber": 867
            },
            {
                "id": "interventionReflectNewIdeas",
                "text": "What new ideas did you gain from this intervention? What did you learn from it?",
                "shortText": "New ideas",
                "type": "textarea",
                "lineNumber": 868
            },
            {
                "id": "interventionReflectExtra",
                "text": "What else do you want to remember about this intervention?",
                "shortText": "Other",
                "type": "textarea",
                "lineNumber": 869
            }
        ]
    },
    {
        "id": "page_interventionReport",
        "name": "Read intervention report",
        "lineNumber": 871,
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "interventionReport",
                "text": "Intervention report",
                "type": "report",
                "options": "intervention",
                "lineNumber": 873
            },
            {
                "id": "FIXME_875",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 875
            },
            {
                "id": "FIXME_876",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 876
            },
            {
                "id": "FIXME_877",
                "text": "//                                                       RETURN",
                "type": "label",
                "options": null,
                "lineNumber": 877
            },
            {
                "id": "FIXME_878",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 878
            },
            {
                "id": "FIXME_879",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null,
                "lineNumber": 879
            }
        ]
    },
    {
        "id": "FIXME_881",
        "name": "Return - checklist",
        "lineNumber": 881,
        "description": "",
        "isHeader": true,
        "questions": []
    },
    {
        "id": "FIXME_883",
        "name": "Gather feedback - enter what people said (mostly textareas)",
        "lineNumber": 883,
        "description": "",
        "isHeader": false,
        "questions": []
    },
    {
        "id": "FIXME_884",
        "name": "Answer questions about project - answer questions about project (mostly textareas)",
        "lineNumber": 884,
        "description": "",
        "isHeader": false,
        "questions": []
    },
    {
        "id": "FIXME_885",
        "name": "Prepare project presentation - enter things you want to tell people about project (to be shown to steering committee)",
        "lineNumber": 885,
        "description": "",
        "isHeader": false,
        "questions": []
    },
    {
        "id": "FIXME_886",
        "name": "Read return report - text with all stuff entered",
        "lineNumber": 886,
        "description": "",
        "isHeader": false,
        "questions": []
    },
    {
        "id": "FIXME_888",
        "name": "Project report - text summary (everything in the six stage reports appended)",
        "lineNumber": 888,
        "description": "",
        "isHeader": true,
        "questions": []
    }
]);
