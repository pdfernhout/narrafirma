"use strict";

define(
		[
		    {
		        "id": "headerpage_dashboard",
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
		        "id": "headerpage_planning",
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
		        "id": "page_projectAspects",
		        "name": "Consider project aspects",
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
		            },
		            {
		                "id": "aspectsTable",
		                "text": "Please answer these questions about each participant group.",
		                "type": "page_aspectsTable",
		                "options": "participants_firstGroupName,participants_secondGroupName,participants_thirdGroupName",
		                "lineNumber": 116
		            }
		        ]
		    },
		    {
		        "id": "page_aspectsTable",
		        "name": "Aspects table",
		        "lineNumber": 118,
		        "description": "",
		        "isHeader": false,
		        "type": "questionsTable",
		        "questions": [
		            {
		                "id": "aspects_statusHeader",
		                "text": "Status",
		                "type": "header",
		                "lineNumber": 120
		            },
		            {
		                "id": "aspects_status",
		                "text": "What is the status of these participants in the community or organization?",
		                "type": "select",
		                "options": "unknown;very low;low;moderate;high;very high;mixed",
		                "lineNumber": 121
		            },
		            {
		                "id": "aspects_confidence",
		                "text": "How much self-confidence do these participants have?",
		                "type": "select",
		                "options": "unknown;very low;low;medium;high;very high;mixed",
		                "lineNumber": 122
		            },
		            {
		                "id": "aspects_abilityHeader",
		                "text": "Ability",
		                "type": "header",
		                "lineNumber": 124
		            },
		            {
		                "id": "aspects_time",
		                "text": "How much free time do these participants have?",
		                "type": "select",
		                "options": "unknown;very little;little;some;a lot;mixed",
		                "lineNumber": 125
		            },
		            {
		                "id": "aspects_education",
		                "text": "What is the education level of these participants?",
		                "type": "select",
		                "options": "unknown;illiterate;minimal;moderate;high;very high;mixed",
		                "lineNumber": 126
		            },
		            {
		                "id": "aspects_physicalDisabilities",
		                "text": "Do these participants have physical limitations that will impact their participation?",
		                "type": "select",
		                "options": "unknown;none;minimal;moderate;strong;mixed",
		                "lineNumber": 127
		            },
		            {
		                "id": "aspects_emotionalImpairments",
		                "text": "Do these participants have emotional impairments that will impact their participation (such as mental illness or traumatic stress)?",
		                "type": "select",
		                "options": "unknown;none;minimal;moderate;strong;mixed",
		                "lineNumber": 128
		            },
		            {
		                "id": "aspects_expectationsHeader",
		                "text": "Expectations",
		                "type": "header",
		                "lineNumber": 130
		            },
		            {
		                "id": "aspects_performing",
		                "text": "For these participants, how important is performing well (with \"high marks\")?",
		                "type": "select",
		                "options": "unknown;very unimportant;somewhat unimportant;somewhat important;very important;mixed",
		                "lineNumber": 131
		            },
		            {
		                "id": "aspects_conforming",
		                "text": "For these participants, how important is conforming (to what is \"normal\" or expected)?",
		                "type": "select",
		                "options": "unknown;very unimportant;somewhat unimportant;somewhat important;very important;mixed",
		                "lineNumber": 132
		            },
		            {
		                "id": "aspects_promoting",
		                "text": "For these participants, how important is self-promotion (competing with others)?",
		                "type": "select",
		                "options": "unknown;very unimportant;somewhat unimportant;somewhat important;very important;mixed",
		                "lineNumber": 133
		            },
		            {
		                "id": "aspects_venting",
		                "text": "For these participants, how important is speaking out (having a say, venting, sounding off)?",
		                "type": "select",
		                "options": "unknown;very unimportant;somewhat unimportant;somewhat important;very important;mixed",
		                "lineNumber": 134
		            },
		            {
		                "id": "aspects_feelingsHeader",
		                "text": "Feelings about the project",
		                "type": "header",
		                "lineNumber": 136
		            },
		            {
		                "id": "aspects_interest",
		                "text": "How motivated are these participants to participate in the project?",
		                "type": "select",
		                "options": "unknown;very little;a little;some;a lot;extremely;mixed",
		                "lineNumber": 137
		            },
		            {
		                "id": "aspects_feelings_project",
		                "text": "How are these participants likely to feel about the project?",
		                "type": "select",
		                "options": "unknown;negative;neutral;positive;mixed",
		                "lineNumber": 138
		            },
		            {
		                "id": "aspects_feelings_facilitator",
		                "text": "How do these participants feel about you?",
		                "type": "select",
		                "options": "unknown;negative;neutral;positive;mixed",
		                "lineNumber": 139
		            },
		            {
		                "id": "aspects_feelings_stories",
		                "text": "How do these participants feel about the idea of collecting stories?",
		                "type": "select",
		                "options": "unknown;negative;neutral;positive;mixed",
		                "lineNumber": 140
		            },
		            {
		                "id": "aspects_topicHeader",
		                "text": "Feelings about the topic",
		                "type": "header",
		                "lineNumber": 142
		            },
		            {
		                "id": "aspects_topic_feeling",
		                "text": "What experiences have these participants had with the project's topic?",
		                "type": "select",
		                "options": "unknown;strongly negative;negative;neutral;positive;strongly positive;mixed",
		                "lineNumber": 143
		            },
		            {
		                "id": "aspects_topic_private",
		                "text": "How private do these participants consider the topic to be?",
		                "type": "select",
		                "options": "unknown;very private;medium;not private;mixed",
		                "lineNumber": 144
		            },
		            {
		                "id": "aspects_topic_articulate",
		                "text": "How hard will it be for these participants to articulate their feelings about the topic?",
		                "type": "select",
		                "options": "unknown;hard;medium;easy;mixed",
		                "lineNumber": 145
		            },
		            {
		                "id": "aspects_topic_timeframe",
		                "text": "How long of a time period do you need these participants to look back on?",
		                "type": "select",
		                "options": "unknown;hours;days;months;years;decades;mixed",
		                "lineNumber": 146
		            }
		        ]
		    },
		    {
		        "id": "page_projectStories",
		        "name": "Tell project stories",
		        "lineNumber": 148,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "projectStoryList",
		                "text": "Project story list",
		                "type": "grid",
		                "options": "page_projectStory",
		                "lineNumber": 150
		            }
		        ]
		    },
		    {
		        "id": "page_projectStory",
		        "name": "Project story",
		        "lineNumber": 152,
		        "description": "",
		        "isHeader": false,
		        "type": "popup",
		        "questions": [
		            {
		                "id": "projectStory_scenario",
		                "text": "Start by choosing a scenario that starts your project story.",
		                "type": "select",
		                "options": "ask me anything;magic ears;fly on the wall;project aspects;my own scenario type",
		                "lineNumber": 154
		            },
		            {
		                "id": "projectStory_outcome",
		                "text": "Now choose an outcome for your story.",
		                "type": "select",
		                "options": "colossal success;miserable failure;acceptable outcome;my own outcome",
		                "lineNumber": 155
		            },
		            {
		                "id": "projectStory_text",
		                "text": "Now tell your project story as a future history (as though it has already happened).",
		                "type": "textarea",
		                "lineNumber": 156
		            },
		            {
		                "id": "projectStory_name",
		                "text": "Please name your project story.",
		                "type": "text",
		                "lineNumber": 157
		            },
		            {
		                "id": "projectStory_feelAbout",
		                "text": "How do you feel about this story?",
		                "type": "textarea",
		                "lineNumber": 158
		            },
		            {
		                "id": "projectStory_surprise",
		                "text": "What surprised you about this story?",
		                "type": "textarea",
		                "lineNumber": 159
		            },
		            {
		                "id": "projectStory_dangers",
		                "text": "Describe any opportunities or dangers you see in this story.",
		                "type": "textarea",
		                "lineNumber": 160
		            }
		        ]
		    },
		    {
		        "id": "page_projectStoryElements",
		        "name": "Create project story elements",
		        "lineNumber": 162,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "storyElementsInstructions",
		                "text": "Here are some instructions on how to create story elements from your project stories.\n<ol>\n<li>Choose one or two types of story element (characters, situations, values, themes, relationships, motivations, beliefs, conflicts).</li>\n<li>For each story, come up with as many answers to that element's question as you can. Write the answers on sticky notes.</li>\n<li>The questions are:</li>\n<ul>\n<li>Characters: Who is doing things in this story?</li>\n<li>Situations: What is going on in this story?</li>\n<li>Values: What matters to the characters in this story?</li>\n<li>Themes: What is this story about?</li>\n<li>Relationships: How are the characters related in this story?</li>\n<li>Motivations: Why do the characters do what they do in this story?</li>\n<li>Beliefs: What do people believe in this story?</li>\n<li>Conflicts: Who or what stands in opposition in this story?</li>\n</ul>\n<li>Once you have answered the question(s) you chose for each story, cluster the sticky notes into groups. Place like with like.</li>\n<li>Give each group of sticky notes a name.</li>\n<li>Clear a \"halo\" of space around each group's name.</li>\n<li>In the halo, write 2-5 good and bad attributes (advantages and disadvantages, opportunities and dangers) of each group of sticky notes.</li>\n<li>Copy or move the new good/bad attributes to a new space. Mix them all together.</li>\n<li>Cluster the attributes into groups.</li>\n<li>Name the groups. These are your story elements.</li>\n</ol>",
		                "type": "label",
		                "lineNumber": 164
		            },
		            {
		                "id": "storyElements",
		                "text": "Project story elements",
		                "type": "grid",
		                "options": "page_addStoryElement",
		                "lineNumber": 188
		            }
		        ]
		    },
		    {
		        "id": "page_addStoryElement",
		        "name": "Add story element",
		        "lineNumber": 190,
		        "description": "",
		        "isHeader": false,
		        "type": "popup",
		        "questions": [
		            {
		                "id": "storyElementName",
		                "text": "What is the name of the story element?",
		                "type": "text",
		                "lineNumber": 192
		            },
		            {
		                "id": "storyElementType",
		                "text": "What type of story element is this?",
		                "type": "select",
		                "options": "character;situation;value;theme;relationship;motivation;belief;conflict",
		                "lineNumber": 193
		            },
		            {
		                "id": "storyElementDescription",
		                "text": "You can describe it more fully here.",
		                "type": "textarea",
		                "lineNumber": 194
		            },
		            {
		                "id": "storyElementPhoto",
		                "text": "You can enter a photograph of the element here.",
		                "type": "imageUploader",
		                "lineNumber": 195
		            }
		        ]
		    },
		    {
		        "id": "page_assessStorySharing",
		        "name": "Assess story sharing",
		        "lineNumber": 197,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "quiz_intro",
		                "text": "On this page you can answer questions about your community or organization to assess its story sharing culture.\nBefore you answer these questions, you should spend some time listening to people share stories together\nin the places where they normally gather.",
		                "type": "label",
		                "lineNumber": 199
		            },
		            {
		                "id": "quiz_narrativeFreedom",
		                "text": "Narrative freedom",
		                "type": "header",
		                "lineNumber": 203
		            },
		            {
		                "id": "quiz_counterStories",
		                "text": "As you listened to people talk, how often did you hear a person respond to a story with another story that countered it in some way?",
		                "type": "select",
		                "options": "unknown;never;seldom;sometimes;often",
		                "lineNumber": 204
		            },
		            {
		                "id": "quiz_authority",
		                "text": "When someone who was obviously in authority was telling stories, how much time and attention did they get?",
		                "type": "select",
		                "options": "unknown;enthrallment;strong listening;partial listening;nothing special",
		                "lineNumber": 205
		            },
		            {
		                "id": "quiz_mistakes",
		                "text": "How many times did you hear people tell stories about mistakes?",
		                "type": "select",
		                "options": "unknown;never;seldom;sometimes;often",
		                "lineNumber": 206
		            },
		            {
		                "id": "quiz_silencing",
		                "text": "When somebody started telling a story and another person stopped them, how did they stop them?",
		                "type": "select",
		                "options": "unknown;warning;caution;request;joke",
		                "lineNumber": 207
		            },
		            {
		                "id": "quiz_conflict",
		                "text": "When somebody was telling a story and another person disagreed with the storyteller, how did they disagree?",
		                "type": "select",
		                "options": "unknown;demand;criticism;comment;joke",
		                "lineNumber": 208
		            },
		            {
		                "id": "quiz_narrativeFlow",
		                "text": "Narrative flow",
		                "type": "header",
		                "lineNumber": 210
		            },
		            {
		                "id": "quiz_remindings",
		                "text": "When you listened to people telling stories, did you ever hear people say \"that reminds me of the time\" and then tell a story in response?",
		                "type": "select",
		                "options": "unknown;never;seldom;sometimes;often",
		                "lineNumber": 211
		            },
		            {
		                "id": "quiz_retellings",
		                "text": "How often did you hear people pass on stories they heard from other people?",
		                "type": "select",
		                "options": "unknown;never;seldom;sometimes;often",
		                "lineNumber": 212
		            },
		            {
		                "id": "quiz_folklore",
		                "text": "How much evidence did you find for a narrative folklore in your community or organization?",
		                "type": "select",
		                "options": "unknown;none;little;some;strong",
		                "lineNumber": 213
		            },
		            {
		                "id": "quiz_storyTypes",
		                "text": "Did you hear comic stories, tragic stories, epic stories, and funny stories?",
		                "type": "select",
		                "options": "unknown;no;maybe;I think so;definitely",
		                "lineNumber": 214
		            },
		            {
		                "id": "quiz_sensemaking",
		                "text": "Did you ever see people share stories as they prepared to make decisions?",
		                "type": "select",
		                "options": "unknown;never;seldom;sometimes;often",
		                "lineNumber": 215
		            },
		            {
		                "id": "quiz_narrativeKnowledge",
		                "text": "Narrative knowledge",
		                "type": "header",
		                "lineNumber": 217
		            },
		            {
		                "id": "quiz_realStories",
		                "text": "Did you see people tell stories that were recountings of events based on emotional experiences from particular perspectives?",
		                "type": "select",
		                "options": "unknown;never;seldom;sometimes;often",
		                "lineNumber": 218
		            },
		            {
		                "id": "quiz_negotiations",
		                "text": "How lively were the negotiations you heard going on between storytellers and audiences?",
		                "type": "select",
		                "options": "unknown;never;seldom;sometimes;often",
		                "lineNumber": 219
		            },
		            {
		                "id": "quiz_cotelling",
		                "text": "Did you ever see two or more people tell a story together?",
		                "type": "select",
		                "options": "unknown;never;seldom;sometimes;often",
		                "lineNumber": 220
		            },
		            {
		                "id": "quiz_blunders",
		                "text": "How often did you see someone start telling the wrong story to the wrong people at the wrong time?",
		                "type": "select",
		                "options": "unknown;often;sometimes;seldom;never",
		                "lineNumber": 221
		            },
		            {
		                "id": "quiz_accounting",
		                "text": "Did you see people account for their actions and choices by telling each other stories?",
		                "type": "select",
		                "options": "unknown;never;seldom;sometimes;often",
		                "lineNumber": 222
		            },
		            {
		                "id": "quiz_narrativeUnity",
		                "text": "Narrative unity",
		                "type": "header",
		                "lineNumber": 224
		            },
		            {
		                "id": "quiz_commonStories",
		                "text": "How easy would it be to create a list of stories any member of your community or organization could be expected to know?",
		                "type": "select",
		                "options": "unknown;impossible;difficult;doable;easy",
		                "lineNumber": 225
		            },
		            {
		                "id": "quiz_sacredStories",
		                "text": "How easy would it be to create a list of sacred stories, those important to understanding the community or organization?",
		                "type": "select",
		                "options": "unknown;impossible;difficult;doable;easy",
		                "lineNumber": 226
		            },
		            {
		                "id": "quiz_condensedStories",
		                "text": "How easy would it be to create a list of condensed stories, in the form of proverbs or references?",
		                "type": "select",
		                "options": "unknown;impossible;difficult;doable;easy",
		                "lineNumber": 227
		            },
		            {
		                "id": "quiz_intermingling",
		                "text": "How often were the stories you heard intermingled with each other?",
		                "type": "select",
		                "options": "unknown;never;seldom;sometimes;often",
		                "lineNumber": 228
		            },
		            {
		                "id": "quiz_culture",
		                "text": "How easy would it be to describe the unique storytelling culture of your community or organization?",
		                "type": "select",
		                "options": "unknown;impossible;difficult;doable;easy",
		                "lineNumber": 229
		            },
		            {
		                "id": "FIXME_231",
		                "text": "// should have results overall and for each category of question",
		                "type": "label",
		                "options": null,
		                "lineNumber": 231
		            },
		            {
		                "id": "quiz_result",
		                "text": "This is your combined test result.",
		                "type": "quizScoreResult",
		                "lineNumber": 232
		            },
		            {
		                "id": "quiz_notes",
		                "text": "Here you can record some notes or comments about this assessment.",
		                "type": "textarea",
		                "lineNumber": 234
		            }
		        ]
		    },
		    {
		        "id": "page_revisePNIPlanningQuestions",
		        "name": "Revise PNI Planning questions",
		        "lineNumber": 236,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "improvePlanningDrafts",
		                "text": "Please review and improve your draft answers based on your consideration of project aspects and your project stories.",
		                "type": "label",
		                "lineNumber": 238
		            },
		            {
		                "id": "planning_goal",
		                "text": "What is the goal of the project? Why are you doing it?",
		                "type": "textarea",
		                "options": "planning_goal",
		                "lineNumber": 240
		            },
		            {
		                "id": "FIXME_241",
		                "text": "What relationships are important to the project?",
		                "type": "textarea",
		                "options": "planning_relationships",
		                "lineNumber": 241
		            },
		            {
		                "id": "FIXME_242",
		                "text": "What is the focus of the project? What is it about?",
		                "type": "textarea",
		                "options": "planning_focus",
		                "lineNumber": 242
		            },
		            {
		                "id": "FIXME_243",
		                "text": "What range(s) of experience will the project cover?",
		                "type": "textarea",
		                "options": "planning_range",
		                "lineNumber": 243
		            },
		            {
		                "id": "planning_scope",
		                "text": "What is the project's scope? (number of people, number of stories, number of questions about stories)",
		                "type": "textarea",
		                "options": "planning_draft_scope",
		                "lineNumber": 244
		            },
		            {
		                "id": "planning_emphasis",
		                "text": "Which phases of PNI will be important to the project? (indicate most and least important phases)",
		                "type": "textarea",
		                "options": "planning_draft_emphasis",
		                "lineNumber": 245
		            }
		        ]
		    },
		    {
		        "id": "page_writeProjectSynopsis",
		        "name": "Write project synopsis",
		        "lineNumber": 247,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "projectSynopsis",
		                "text": "Please summarize your project in one or two sentences.",
		                "type": "textarea",
		                "lineNumber": 249
		            }
		        ]
		    },
		    {
		        "id": "page_readPlanningReport",
		        "name": "Read planning report",
		        "lineNumber": 251,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "planningReport",
		                "text": "Project planning report",
		                "type": "report",
		                "options": "planning",
		                "lineNumber": 253
		            },
		            {
		                "id": "FIXME_255",
		                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
		                "type": "label",
		                "options": null,
		                "lineNumber": 255
		            },
		            {
		                "id": "FIXME_256",
		                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
		                "type": "label",
		                "options": null,
		                "lineNumber": 256
		            },
		            {
		                "id": "FIXME_257",
		                "text": "//                                                   COLLECTION DESIGN",
		                "type": "label",
		                "options": null,
		                "lineNumber": 257
		            },
		            {
		                "id": "FIXME_258",
		                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
		                "type": "label",
		                "options": null,
		                "lineNumber": 258
		            },
		            {
		                "id": "FIXME_259",
		                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
		                "type": "label",
		                "options": null,
		                "lineNumber": 259
		            }
		        ]
		    },
		    {
		        "id": "headerpage_collectionDesign",
		        "name": "Collection design",
		        "lineNumber": 261,
		        "description": "",
		        "isHeader": true,
		        "questions": [
		            {
		                "id": "FIXME_262",
		                "text": "// Collection venues - X venues chosen",
		                "type": "label",
		                "options": null,
		                "lineNumber": 262
		            },
		            {
		                "id": "FIXME_263",
		                "text": "// Story eliciting questions - x questions written",
		                "type": "label",
		                "options": null,
		                "lineNumber": 263
		            },
		            {
		                "id": "FIXME_264",
		                "text": "// Questions about stories - x questions written",
		                "type": "label",
		                "options": null,
		                "lineNumber": 264
		            },
		            {
		                "id": "FIXME_265",
		                "text": "// Questions about people - x stories written",
		                "type": "label",
		                "options": null,
		                "lineNumber": 265
		            },
		            {
		                "id": "FIXME_266",
		                "text": "// Question form - [ ] designed [ ] committed",
		                "type": "label",
		                "options": null,
		                "lineNumber": 266
		            }
		        ]
		    },
		    {
		        "id": "page_chooseCollectionVenues",
		        "name": "Choose collection venues",
		        "lineNumber": 268,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "venuesIntro",
		                "text": "On this page you will choose story collection venues, or ways to collect stories.",
		                "type": "label",
		                "lineNumber": 270
		            },
		            {
		                "id": "venueRecommendations",
		                "text": "Venue recommendations",
		                "type": "recommendationTable",
		                "options": "venues",
		                "lineNumber": 272
		            },
		            {
		                "id": "venuesTable",
		                "text": "Please answer these questions about your collection venues for each participant group.",
		                "type": "page_venuesTable",
		                "options": "participants_firstGroupName,participants_secondGroupName,participants_thirdGroupName",
		                "lineNumber": 274
		            }
		        ]
		    },
		    {
		        "id": "page_venuesTable",
		        "name": "Aspects table",
		        "lineNumber": 276,
		        "description": "",
		        "isHeader": false,
		        "type": "questionsTable",
		        "questions": [
		            {
		                "id": "primaryVenue",
		                "text": "Choose a primary means of story collection for this group.",
		                "type": "select",
		                "options": "individual interviews;group interviews;peer interviews;group story sessions;surveys;journals;narrative incident reports;gleaned stories",
		                "lineNumber": 278
		            },
		            {
		                "id": "primaryVenue_plans",
		                "text": "Describe your story collection plans for this group and venue.",
		                "type": "textarea",
		                "lineNumber": 279
		            },
		            {
		                "id": "secondaryVenue",
		                "text": "If you want to collect stories in a second way for this same group, choose one of these options.",
		                "type": "select",
		                "options": "individual interviews;group interviews;peer interviews;group story sessions;surveys;journals;narrative incident reports;gleaned stories",
		                "lineNumber": 280
		            },
		            {
		                "id": "secondaryVenue_plans",
		                "text": "Describe your secondary story collection for this group and venue.",
		                "type": "textarea",
		                "lineNumber": 281
		            }
		        ]
		    },
		    {
		        "id": "page_writeStoryElicitingQuestions",
		        "name": "Write story eliciting questions",
		        "lineNumber": 283,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "elicitingQuestionsList",
		                "text": "Story eliciting questions",
		                "type": "grid",
		                "options": "page_addElicitingQuestion",
		                "lineNumber": 285
		            }
		        ]
		    },
		    {
		        "id": "page_addElicitingQuestion",
		        "name": "Add story eliciting question",
		        "lineNumber": 287,
		        "description": "",
		        "isHeader": false,
		        "type": "popup",
		        "questions": [
		            {
		                "id": "elicitingQuestionRecommendations",
		                "text": "Recommendations for eliciting questions",
		                "type": "recommendationTable",
		                "options": "elicitingQuestions",
		                "lineNumber": 289
		            },
		            {
		                "id": "elicitingQuestion",
		                "text": "Enter a question with which to ask people to tell stories.",
		                "type": "textarea",
		                "lineNumber": 291
		            },
		            {
		                "id": "elicitingQuestionTemplates",
		                "text": "Or choose a question from this list.",
		                "type": "templateList",
		                "options": "elicitingQuestions",
		                "lineNumber": 293
		            }
		        ]
		    },
		    {
		        "id": "page_writeQuestionsAboutStories",
		        "name": "Write questions about stories",
		        "lineNumber": 295,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "storyQuestionsList",
		                "text": "Questions about stories",
		                "type": "grid",
		                "options": "page_addStoryQuestion",
		                "lineNumber": 297
		            }
		        ]
		    },
		    {
		        "id": "page_addStoryQuestion",
		        "name": "Add story question",
		        "lineNumber": 299,
		        "description": "",
		        "isHeader": false,
		        "type": "popup",
		        "questions": [
		            {
		                "id": "storyQuestionRecommendations",
		                "text": "Recommendations for story questions",
		                "type": "recommendationTable",
		                "options": "storyQuestions",
		                "lineNumber": 301
		            },
		            {
		                "id": "storyQuestion",
		                "text": "Enter a question to ask people about their stories.",
		                "type": "textarea",
		                "lineNumber": 303
		            },
		            {
		                "id": "storyQuestionTemplates",
		                "text": "Or choose a question from this list.",
		                "type": "templateList",
		                "options": "storyQuestions",
		                "lineNumber": 305
		            }
		        ]
		    },
		    {
		        "id": "page_writeQuestionsAboutParticipants",
		        "name": "Write questions about participants",
		        "lineNumber": 307,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "participantQuestionsList",
		                "text": "Questions about participants",
		                "type": "grid",
		                "options": "page_addParticipantQuestion",
		                "lineNumber": 309
		            }
		        ]
		    },
		    {
		        "id": "page_addParticipantQuestion",
		        "name": "Add participant question",
		        "lineNumber": 311,
		        "description": "",
		        "isHeader": false,
		        "type": "popup",
		        "questions": [
		            {
		                "id": "participantQuestionRecommendations",
		                "text": "Recommendations for participant questions",
		                "type": "recommendationTable",
		                "options": "participantQuestions",
		                "lineNumber": 313
		            },
		            {
		                "id": "participantQuestion",
		                "text": "Enter a question to ask people about themselves.",
		                "type": "textarea",
		                "lineNumber": 315
		            },
		            {
		                "id": "participantQuestionTemplates",
		                "text": "Or choose a question from this list.",
		                "type": "templateList",
		                "options": "participantQuestions",
		                "lineNumber": 317
		            }
		        ]
		    },
		    {
		        "id": "page_designQuestionForm",
		        "name": "Design question form",
		        "lineNumber": 319,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "questionFormTitle",
		                "text": "Please enter a title for the form.",
		                "type": "text",
		                "lineNumber": 321
		            },
		            {
		                "id": "questionFormLogo",
		                "text": "You can upload a logo or ather image to show at the top of the form.",
		                "type": "imageUploader",
		                "lineNumber": 322
		            },
		            {
		                "id": "questionFormIntro",
		                "text": "Please enter an introduction to be shown at the start of the form, after the title",
		                "type": "textarea",
		                "lineNumber": 323
		            },
		            {
		                "id": "questionFormEndText",
		                "text": "Please enter any text to be shown at the end of the form",
		                "type": "textarea",
		                "lineNumber": 324
		            }
		        ]
		    },
		    {
		        "id": "page_planStoryCollectionSessions",
		        "name": "Plan story collection sessions",
		        "lineNumber": 326,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "collectionSessionIntro",
		                "text": "If you don't plan to collect stories in group sessions, you can skip this page.",
		                "type": "label",
		                "lineNumber": 328
		            },
		            {
		                "id": "collectionSessionRecommendations",
		                "text": "Recommendations for story collection sessions",
		                "type": "recommendationTable",
		                "options": "collectionSessions",
		                "lineNumber": 330
		            },
		            {
		                "id": "storyCollectionSessionsList",
		                "text": "Story collection sessions",
		                "type": "grid",
		                "options": "page_addStoryCollectionSession",
		                "lineNumber": 332
		            }
		        ]
		    },
		    {
		        "id": "page_addStoryCollectionSession",
		        "name": "Design story collection session",
		        "lineNumber": 334,
		        "description": "",
		        "isHeader": false,
		        "type": "popup",
		        "questions": [
		            {
		                "id": "collectionSessionRepetitions",
		                "text": "How many repetitions of the session will there be?",
		                "type": "text",
		                "lineNumber": 336
		            },
		            {
		                "id": "collectionSessionLength",
		                "text": "How long will this session be?",
		                "type": "text",
		                "lineNumber": 337
		            },
		            {
		                "id": "collectionSessionTime",
		                "text": "When will it take place?",
		                "type": "text",
		                "lineNumber": 338
		            },
		            {
		                "id": "collectionSessionLocation",
		                "text": "Where will it take place?",
		                "type": "text",
		                "lineNumber": 339
		            },
		            {
		                "id": "collectionSessionSize",
		                "text": "How many people will be invited to each repetition of this session?",
		                "type": "text",
		                "lineNumber": 340
		            },
		            {
		                "id": "collectionSessionGroups",
		                "text": "From which participant group(s) will people be invited?",
		                "type": "checkBoxesWithPull",
		                "options": "participantGroups",
		                "lineNumber": 341
		            },
		            {
		                "id": "collectionSessionAgenda",
		                "text": "Session agenda",
		                "type": "grid",
		                "options": "page_addCollectionSessionActivity",
		                "lineNumber": 343
		            },
		            {
		                "id": "printCollectionSessionAgenda",
		                "text": "Print session agenda",
		                "type": "button",
		                "lineNumber": 344
		            },
		            {
		                "id": "collectionSessionMaterials",
		                "text": "What materials will this session require?",
		                "type": "textarea",
		                "lineNumber": 346
		            },
		            {
		                "id": "collectionSessionDetails",
		                "text": "Enter other details about this session.",
		                "type": "textarea",
		                "lineNumber": 347
		            }
		        ]
		    },
		    {
		        "id": "page_addCollectionSessionActivity",
		        "name": "Add story collection session activity",
		        "lineNumber": 349,
		        "description": "",
		        "isHeader": false,
		        "type": "popup",
		        "questions": [
		            {
		                "id": "collectionSessionActivity",
		                "text": "What type of activity is this?",
		                "type": "select",
		                "options": "ice-breaker;sharing stories (no task);sharing stories (simple task);discussing stories;twice-told stories exercise;timeline exercise;landscape exercise;my own exercise;other",
		                "lineNumber": 351
		            },
		            {
		                "id": "collectionActivityPlan",
		                "text": "Describe the plan for this activity.",
		                "type": "textarea",
		                "lineNumber": 352
		            },
		            {
		                "id": "collectionActivityOptionalParts",
		                "text": "Describe optional elaborations you might or might not use in this activity.",
		                "type": "textarea",
		                "lineNumber": 353
		            },
		            {
		                "id": "collectionActivityTime",
		                "text": "How long will this activity take?",
		                "type": "text",
		                "lineNumber": 354
		            },
		            {
		                "id": "collectionActivityRecording",
		                "text": "How will stories be recorded during this activity?",
		                "type": "textarea",
		                "lineNumber": 355
		            },
		            {
		                "id": "collectionActivityMaterials",
		                "text": "What materials will be provided for this activity?",
		                "type": "textarea",
		                "lineNumber": 356
		            },
		            {
		                "id": "collectionActivitySpaces",
		                "text": "What spaces will be used for this activity?",
		                "type": "textarea",
		                "lineNumber": 357
		            },
		            {
		                "id": "collectionActivityFacilitation",
		                "text": "What sort of facilitation will be necessary for this activity?",
		                "type": "textarea",
		                "lineNumber": 358
		            }
		        ]
		    },
		    {
		        "id": "readCollectionDesignReport",
		        "name": "Read collection design report",
		        "lineNumber": 360,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "collectionDesignReport",
		                "text": "Collection design report",
		                "type": "report",
		                "options": "collectionDesign",
		                "lineNumber": 362
		            },
		            {
		                "id": "FIXME_364",
		                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
		                "type": "label",
		                "options": null,
		                "lineNumber": 364
		            },
		            {
		                "id": "FIXME_365",
		                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
		                "type": "label",
		                "options": null,
		                "lineNumber": 365
		            },
		            {
		                "id": "FIXME_366",
		                "text": "//                                                  COLLECTION PROCESS",
		                "type": "label",
		                "options": null,
		                "lineNumber": 366
		            },
		            {
		                "id": "FIXME_367",
		                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
		                "type": "label",
		                "options": null,
		                "lineNumber": 367
		            },
		            {
		                "id": "FIXME_368",
		                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
		                "type": "label",
		                "options": null,
		                "lineNumber": 368
		            }
		        ]
		    },
		    {
		        "id": "headerpage_collectionProcess",
		        "name": "Collection process",
		        "lineNumber": 370,
		        "description": "",
		        "isHeader": true,
		        "questions": [
		            {
		                "id": "FIXME_371",
		                "text": "// Online story collection is [ ] enabled",
		                "type": "label",
		                "options": null,
		                "lineNumber": 371
		            },
		            {
		                "id": "FIXME_372",
		                "text": "// Number of stories entered - x",
		                "type": "label",
		                "options": null,
		                "lineNumber": 372
		            },
		            {
		                "id": "FIXME_373",
		                "text": "// Number of participants who told stories - x",
		                "type": "label",
		                "options": null,
		                "lineNumber": 373
		            }
		        ]
		    },
		    {
		        "id": "page_finalizeQuestionForms",
		        "name": "Finalize question forms",
		        "lineNumber": 375,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "finalizeLabel",
		                "text": "On this page you will finalize your questions for story collection. Once you have started your story collection,\nyou should not make changes to your questions. You will still be able to make changes after you click the \"Finalize\" button,\nbut the system will ask you to confirm each change.",
		                "type": "label",
		                "lineNumber": 377
		            },
		            {
		                "id": "printStoryForm",
		                "text": "Print story form",
		                "type": "button",
		                "lineNumber": 381
		            },
		            {
		                "id": "copyStoryFormURL",
		                "text": "Copy story form web link",
		                "type": "button",
		                "lineNumber": 383
		            },
		            {
		                "id": "finalizeStoryForm",
		                "text": "Finalize story form",
		                "type": "button",
		                "lineNumber": 385
		            }
		        ]
		    },
		    {
		        "id": "page_startStoryCollection",
		        "name": "Start story collection",
		        "lineNumber": 387,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "startCollectionLabel",
		                "text": "If you are doing story collection over the internet, click this button to make the web form \"live\" and able\nto be used by people other than yourself.",
		                "type": "label",
		                "lineNumber": 389
		            },
		            {
		                "id": "enableWebStoryForm",
		                "text": "Enable web story form",
		                "type": "button",
		                "lineNumber": 392
		            },
		            {
		                "id": "FIXME_394",
		                "text": "Copy story form web link",
		                "type": "button",
		                "lineNumber": 394
		            }
		        ]
		    },
		    {
		        "id": "page_storyCollectionFormForParticipants",
		        "name": "Participate in the story collection",
		        "lineNumber": 396,
		        "description": "",
		        "isHeader": false,
		        "type": "participantStoryForm",
		        "questions": [
		            {
		                "id": "FIXME_398",
		                "text": "// the info shown here is what was designed - how to specify that",
		                "type": "label",
		                "options": null,
		                "lineNumber": 398
		            }
		        ]
		    },
		    {
		        "id": "page_enterStories",
		        "name": "Enter stories",
		        "lineNumber": 400,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "FIXME_402",
		                "text": "// this page is the same as the \"participate\" page above, but only the admin can see it",
		                "type": "label",
		                "options": null,
		                "lineNumber": 402
		            },
		            {
		                "id": "FIXME_403",
		                "text": "// and the normal tabs are shown on the page",
		                "type": "label",
		                "options": null,
		                "lineNumber": 403
		            },
		            {
		                "id": "FIXME_405",
		                "text": "// the info shown here is what was designed - how to specify that",
		                "type": "label",
		                "options": null,
		                "lineNumber": 405
		            }
		        ]
		    },
		    {
		        "id": "page_reviewIncomingStories",
		        "name": "Review incoming stories",
		        "lineNumber": 407,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "collectedStoriesDuringCollection",
		                "text": "Collected stories",
		                "type": "storyBrowser",
		                "lineNumber": 409
		            }
		        ]
		    },
		    {
		        "id": "page_stopStoryCollection",
		        "name": "Stop story collection",
		        "lineNumber": 411,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "stopCollectionLabel",
		                "text": "If you are doing story collection over the internet, click this button to make the web form\nunavailable to anyone but yourself.",
		                "type": "label",
		                "lineNumber": 413
		            },
		            {
		                "id": "disableWebStoryForm",
		                "text": "Disable web story form",
		                "type": "button",
		                "lineNumber": 416
		            }
		        ]
		    },
		    {
		        "id": "page_enterCollectionSessionRecords",
		        "name": "Enter story collection session records",
		        "lineNumber": 418,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "collectionRecordsLabel",
		                "text": "Note: If you did not hold any story collection sessions, you can skip this page.",
		                "type": "label",
		                "lineNumber": 420
		            },
		            {
		                "id": "collectionSessions",
		                "text": "Story collection sessions",
		                "type": "grid",
		                "options": "page_addCollectionSessionRecord",
		                "lineNumber": 422
		            }
		        ]
		    },
		    {
		        "id": "page_addCollectionSessionRecord",
		        "name": "Add story collection session record",
		        "lineNumber": 424,
		        "description": "",
		        "isHeader": false,
		        "type": "popup",
		        "questions": [
		            {
		                "id": "collectionSessionConstructions",
		                "text": "Group constructions",
		                "type": "grid",
		                "options": "page_newCollectionSessionConstruction",
		                "lineNumber": 426
		            },
		            {
		                "id": "collectionSessionNotes",
		                "text": "Story collection session notes",
		                "type": "page_newCollectionSessionNotes",
		                "lineNumber": 428
		            }
		        ]
		    },
		    {
		        "id": "page_newCollectionSessionConstruction",
		        "name": "Story collection construction",
		        "lineNumber": 430,
		        "description": "",
		        "isHeader": false,
		        "type": "popup",
		        "questions": [
		            {
		                "id": "collectionSessionConstructionName",
		                "text": "Name",
		                "type": "text",
		                "lineNumber": 432
		            },
		            {
		                "id": "collectionSessionContructionText",
		                "text": "Description",
		                "type": "textarea",
		                "lineNumber": 433
		            },
		            {
		                "id": "collectionSessionConstructionLink",
		                "text": "Link to audio or video",
		                "type": "text",
		                "lineNumber": 434
		            },
		            {
		                "id": "collectionSessionConstructionImages",
		                "text": "Images",
		                "type": "grid",
		                "options": "page_newCollectionConstructionImage",
		                "lineNumber": 435
		            }
		        ]
		    },
		    {
		        "id": "page_newCollectionConstructionImage",
		        "name": "Story collection construction image",
		        "lineNumber": 437,
		        "description": "",
		        "isHeader": false,
		        "type": "popup",
		        "questions": [
		            {
		                "id": "collectionSessionConstrucctionImage",
		                "text": "Image",
		                "type": "imageUploader",
		                "lineNumber": 439
		            },
		            {
		                "id": "collectionSessionConstructionImageName",
		                "text": "Name",
		                "type": "text",
		                "lineNumber": 440
		            },
		            {
		                "id": "collectionSessionConstructionImageNotes",
		                "text": "Notes on this image",
		                "type": "textarea",
		                "lineNumber": 441
		            }
		        ]
		    },
		    {
		        "id": "page_newCollectionSessionNotes",
		        "name": "Story collection session notes",
		        "lineNumber": 443,
		        "description": "",
		        "isHeader": false,
		        "type": "popup",
		        "questions": [
		            {
		                "id": "collectionSessionNotesName",
		                "text": "Name",
		                "type": "text",
		                "lineNumber": 445
		            },
		            {
		                "id": "collectionSessionNotesText",
		                "text": "Notes",
		                "type": "textarea",
		                "lineNumber": 446
		            },
		            {
		                "id": "collectionSessionNotesImages",
		                "text": "Images",
		                "type": "grid",
		                "options": "page_newCollectionSessionImage",
		                "lineNumber": 447
		            }
		        ]
		    },
		    {
		        "id": "page_newCollectionSessionImage",
		        "name": "Story collection session notes image",
		        "lineNumber": 449,
		        "description": "",
		        "isHeader": false,
		        "type": "popup",
		        "questions": [
		            {
		                "id": "collectionSessionNotesImage",
		                "text": "Image",
		                "type": "imageUploader",
		                "lineNumber": 451
		            },
		            {
		                "id": "collectionSessionImageName",
		                "text": "Name",
		                "type": "text",
		                "lineNumber": 452
		            },
		            {
		                "id": "collectionSessionNotesImageNotes",
		                "text": "Notes on this image",
		                "type": "textarea",
		                "lineNumber": 453
		            }
		        ]
		    },
		    {
		        "id": "page_answerQuestionsAboutCollectionSessions",
		        "name": "Reflect on story collection sessions",
		        "lineNumber": 455,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "collectionSessionQuestionsLabel",
		                "text": "Note: If there are no sessions in this list, enter them in the \"Enter story collection session records\" screen first.",
		                "type": "label",
		                "lineNumber": 457
		            },
		            {
		                "id": "FIXME_459",
		                "text": "// this list should populate with names of sessions given in \"enter story collection sessions records\" screen.",
		                "type": "label",
		                "options": null,
		                "lineNumber": 459
		            },
		            {
		                "id": "FIXME_460",
		                "text": "/// there should be NO add button... but the edit button should go to the popup specified here",
		                "type": "label",
		                "options": null,
		                "lineNumber": 460
		            },
		            {
		                "id": "FIXME_461",
		                "text": "Story collection sessions",
		                "type": "grid",
		                "options": "page_answerQuestionsAboutCollectionSession",
		                "lineNumber": 461
		            }
		        ]
		    },
		    {
		        "id": "page_answerQuestionsAboutCollectionSession",
		        "name": "Reflect on story collection session",
		        "lineNumber": 463,
		        "description": "",
		        "isHeader": false,
		        "type": "popup",
		        "questions": [
		            {
		                "id": "collectionReflectChangeBehavior",
		                "text": "How did the behavior of the participants change from the start to the end of the session?",
		                "type": "textarea",
		                "lineNumber": 465
		            },
		            {
		                "id": "collectionReflectChangeEmotions",
		                "text": "How did their emotions change?",
		                "type": "textarea",
		                "lineNumber": 466
		            },
		            {
		                "id": "collectionReflectChangeYourEmotions",
		                "text": "How did your emotions change?",
		                "type": "textarea",
		                "lineNumber": 467
		            },
		            {
		                "id": "collectionReflectInteractionsParticipants",
		                "text": "Describe the interactions between participants (including changes during the session).",
		                "type": "textarea",
		                "lineNumber": 468
		            },
		            {
		                "id": "collectionReflectInteractionsFacilitators",
		                "text": "Describe interactions between participants and facilitators (including change).",
		                "type": "textarea",
		                "lineNumber": 469
		            },
		            {
		                "id": "collectionReflectStories",
		                "text": "What did you notice about the stories people told, retold, chose, and worked with during the session?",
		                "type": "textarea",
		                "lineNumber": 470
		            },
		            {
		                "id": "collectionReflectStoryOfSession",
		                "text": "What is the story of what happened during this session?",
		                "type": "textarea",
		                "lineNumber": 471
		            },
		            {
		                "id": "collectionReflectSpecial",
		                "text": "What was special about these people in this place on this day?",
		                "type": "textarea",
		                "lineNumber": 472
		            },
		            {
		                "id": "collectionReflectAsExpected",
		                "text": "What parts of your plans went as you expected? What parts didn't?",
		                "type": "textarea",
		                "lineNumber": 473
		            },
		            {
		                "id": "collectionReflectWorkedWell",
		                "text": "What parts of your plans worked out well?",
		                "type": "textarea",
		                "lineNumber": 474
		            },
		            {
		                "id": "collectionReflectWorkedBadly",
		                "text": "What parts didn't work out well?",
		                "type": "textarea",
		                "lineNumber": 475
		            },
		            {
		                "id": "collectionReflectNewIdeas",
		                "text": "What new ideas did you gain from the participants in this session?",
		                "type": "textarea",
		                "lineNumber": 476
		            },
		            {
		                "id": "collectionReflectProjectChanged",
		                "text": "How has the project changed as a result of this session?",
		                "type": "textarea",
		                "lineNumber": 477
		            },
		            {
		                "id": "collectionReflectExtra",
		                "text": "What else do you want most to remember about this session?",
		                "type": "textarea",
		                "lineNumber": 478
		            }
		        ]
		    },
		    {
		        "id": "page_readCollectionProcessReport",
		        "name": "Read collection process report",
		        "lineNumber": 480,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "collectionProcessReport",
		                "text": "Collection process report",
		                "type": "report",
		                "options": "collectionProcess",
		                "lineNumber": 482
		            },
		            {
		                "id": "FIXME_484",
		                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
		                "type": "label",
		                "options": null,
		                "lineNumber": 484
		            },
		            {
		                "id": "FIXME_485",
		                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
		                "type": "label",
		                "options": null,
		                "lineNumber": 485
		            },
		            {
		                "id": "FIXME_486",
		                "text": "//                                                       CATALYSIS",
		                "type": "label",
		                "options": null,
		                "lineNumber": 486
		            },
		            {
		                "id": "FIXME_487",
		                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
		                "type": "label",
		                "options": null,
		                "lineNumber": 487
		            },
		            {
		                "id": "FIXME_488",
		                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
		                "type": "label",
		                "options": null,
		                "lineNumber": 488
		            }
		        ]
		    },
		    {
		        "id": "headerpage_catalysis",
		        "name": "Catalysis",
		        "lineNumber": 490,
		        "description": "",
		        "isHeader": true,
		        "questions": [
		            {
		                "id": "FIXME_491",
		                "text": "// Observations - x",
		                "type": "label",
		                "options": null,
		                "lineNumber": 491
		            },
		            {
		                "id": "FIXME_492",
		                "text": "// Interpretations - x",
		                "type": "label",
		                "options": null,
		                "lineNumber": 492
		            },
		            {
		                "id": "FIXME_493",
		                "text": "// Ideas - x",
		                "type": "label",
		                "options": null,
		                "lineNumber": 493
		            },
		            {
		                "id": "FIXME_494",
		                "text": "// Perspectives - x",
		                "type": "label",
		                "options": null,
		                "lineNumber": 494
		            }
		        ]
		    },
		    {
		        "id": "page_browseStories",
		        "name": "Browse stories",
		        "lineNumber": 496,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "collectedStoriesAfterCollection",
		                "text": "Collected stories",
		                "type": "storyBrowser",
		                "options": "addObservation:\"page_addToObservation\";addExcerpt:\"page_addToExcerpt\"",
		                "lineNumber": 498
		            }
		        ]
		    },
		    {
		        "id": "page_addToObservation",
		        "name": "Add to observation",
		        "lineNumber": 500,
		        "description": "",
		        "isHeader": false,
		        "type": "popup",
		        "questions": [
		            {
		                "id": "addObservationsLabel",
		                "text": "Note: You should not add any observations that depend on patterns among stories until after\nall stories have been entered.",
		                "type": "label",
		                "lineNumber": 502
		            },
		            {
		                "id": "observationsList",
		                "text": "Choose an observation from this list to which to add the selected result, or create a new observation.",
		                "type": "observationsList",
		                "lineNumber": 505
		            },
		            {
		                "id": "addResultToExistingObservation",
		                "text": "Add result to selected observation",
		                "type": "button",
		                "lineNumber": 507
		            },
		            {
		                "id": "createNewObservationWithResult",
		                "text": "Create new observation with this result",
		                "type": "button",
		                "options": "page_createNewObservation",
		                "lineNumber": 508
		            }
		        ]
		    },
		    {
		        "id": "page_createNewObservation",
		        "name": "Create new observation",
		        "lineNumber": 510,
		        "description": "",
		        "isHeader": false,
		        "type": "popup",
		        "questions": [
		            {
		                "id": "observationName",
		                "text": "Please give this observation a name.",
		                "type": "text",
		                "lineNumber": 512
		            }
		        ]
		    },
		    {
		        "id": "page_addToExcerpt",
		        "name": "Add to excerpt",
		        "lineNumber": 514,
		        "description": "",
		        "isHeader": false,
		        "type": "popup",
		        "questions": [
		            {
		                "id": "excerptsList",
		                "text": "Choose an excerpt from this list to which to add the selected text, or create a new excerpt.",
		                "type": "excerptsList",
		                "lineNumber": 516
		            },
		            {
		                "id": "addTextToExistingExcerpt",
		                "text": "Add text to selected excerpt",
		                "type": "button",
		                "lineNumber": 518
		            },
		            {
		                "id": "createNewExcerptWithText",
		                "text": "Create new excerpt with this text",
		                "type": "button",
		                "options": "page_createNewExcerpt",
		                "lineNumber": 519
		            }
		        ]
		    },
		    {
		        "id": "page_createNewExcerpt",
		        "name": "Create new excerpt",
		        "lineNumber": 521,
		        "description": "",
		        "isHeader": false,
		        "type": "popup",
		        "questions": [
		            {
		                "id": "excerptName",
		                "text": "Please give this excerpt a name.",
		                "type": "text",
		                "lineNumber": 523
		            },
		            {
		                "id": "excerptText",
		                "text": "You can edit the excerpt here.",
		                "type": "textarea",
		                "lineNumber": 525
		            },
		            {
		                "id": "excerptNotes",
		                "text": "You can enter some notes about the excerpt here.",
		                "type": "textarea",
		                "lineNumber": 527
		            }
		        ]
		    },
		    {
		        "id": "page_themeStories",
		        "name": "Theme stories",
		        "lineNumber": 529,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "themeStories",
		                "text": "Theme stories",
		                "type": "storyThemer",
		                "lineNumber": 531
		            }
		        ]
		    },
		    {
		        "id": "page_browseGraphs",
		        "name": "Browse graphs",
		        "lineNumber": 533,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "graphBrowser",
		                "text": "Graph browser",
		                "type": "graphBrowser",
		                "lineNumber": 535
		            }
		        ]
		    },
		    {
		        "id": "page_reviewTrends",
		        "name": "Review trends",
		        "lineNumber": 537,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "statTests",
		                "text": "Which statistical tests do you want to consider?",
		                "type": "checkBoxes",
		                "options": "chi-squared (differences between counts);t-test (differences between means);correlation",
		                "lineNumber": 539
		            },
		            {
		                "id": "minSubsetSize",
		                "text": "How large should subset counts be to be considered for comparison?",
		                "type": "select",
		                "options": "20;30;40;50",
		                "lineNumber": 540
		            },
		            {
		                "id": "significanceThreshold",
		                "text": "What significance threshold do you want reported?",
		                "type": "select",
		                "options": "0.05;0.01",
		                "lineNumber": 541
		            },
		            {
		                "id": "trendResults",
		                "text": "How many results do you want to see per test type?",
		                "type": "select",
		                "options": "5;10;15;20;25;30",
		                "lineNumber": 542
		            },
		            {
		                "id": "FIXME_544",
		                "text": "// when user changes any of the options above, the trend report below should update",
		                "type": "label",
		                "options": null,
		                "lineNumber": 544
		            },
		            {
		                "id": "trendsReport",
		                "text": "Trends report",
		                "type": "trendsReport",
		                "lineNumber": 545
		            }
		        ]
		    },
		    {
		        "id": "page_reviewExcerpts",
		        "name": "Review excerpts",
		        "lineNumber": 547,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "FIXME_549",
		                "text": "Collected excerpts",
		                "type": "grid",
		                "options": "page_createNewExcerpt",
		                "lineNumber": 549
		            }
		        ]
		    },
		    {
		        "id": "page_interpretObservations",
		        "name": "Interpret observations",
		        "lineNumber": 551,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "FIXME_553",
		                "text": "Collected observations",
		                "type": "grid",
		                "options": "page_editObservation",
		                "lineNumber": 553
		            }
		        ]
		    },
		    {
		        "id": "page_editObservation",
		        "name": "Edit observation",
		        "lineNumber": 555,
		        "description": "",
		        "isHeader": false,
		        "type": "popup",
		        "questions": [
		            {
		                "id": "FIXME_557",
		                "text": "Observation name",
		                "type": "text",
		                "lineNumber": 557
		            },
		            {
		                "id": "observation",
		                "text": "Observation",
		                "type": "textarea",
		                "lineNumber": 558
		            },
		            {
		                "id": "observationResultsList",
		                "text": "Results",
		                "type": "grid",
		                "lineNumber": 560
		            },
		            {
		                "id": "firstInterpName",
		                "text": "First interpretation name",
		                "type": "text",
		                "lineNumber": 562
		            },
		            {
		                "id": "firstInterpText",
		                "text": "First interpretation text",
		                "type": "textarea",
		                "lineNumber": 563
		            },
		            {
		                "id": "firstInterpIdea",
		                "text": "First interpretation idea",
		                "type": "textarea",
		                "lineNumber": 564
		            },
		            {
		                "id": "FIXME_565",
		                "text": "Excerpts for first interpretation",
		                "type": "grid",
		                "options": "page_selectExcerpt",
		                "lineNumber": 565
		            },
		            {
		                "id": "opposingInterpName",
		                "text": "Opposing interpretation name",
		                "type": "text",
		                "lineNumber": 567
		            },
		            {
		                "id": "opposingInterpText",
		                "text": "Opposing interpretation text",
		                "type": "textarea",
		                "lineNumber": 568
		            },
		            {
		                "id": "opposingInterpIdea",
		                "text": "Opposing interpretation idea",
		                "type": "textarea",
		                "lineNumber": 569
		            },
		            {
		                "id": "FIXME_570",
		                "text": "Excerpts for opposing interpretation",
		                "type": "grid",
		                "options": "page_selectExcerpt",
		                "lineNumber": 570
		            }
		        ]
		    },
		    {
		        "id": "page_selectExcerpt",
		        "name": "Select excerpt",
		        "lineNumber": 572,
		        "description": "",
		        "isHeader": false,
		        "type": "popup",
		        "questions": [
		            {
		                "id": "FIXME_574",
		                "text": "Collected excerpts",
		                "type": "grid",
		                "options": "page_createNewExcerpt",
		                "lineNumber": 574
		            },
		            {
		                "id": "FIXME_576",
		                "text": "// when they click this button the selected excerpt should be added to the list whose \"add\" button they clicked",
		                "type": "label",
		                "options": null,
		                "lineNumber": 576
		            },
		            {
		                "id": "addExcerptToInterpretation",
		                "text": "Add selected excerpt to interpretation",
		                "type": "button",
		                "lineNumber": 577
		            }
		        ]
		    },
		    {
		        "id": "page_clusterInterpretations",
		        "name": "Cluster interpretations",
		        "lineNumber": 579,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "clusterInterpLabel",
		                "text": "Note: Do not cluster your interpretations unless you are sure you have finished collecting them.",
		                "type": "label",
		                "lineNumber": 581
		            },
		            {
		                "id": "FIXME_583",
		                "text": "// ideally, when they are done with this, the circles marked as group names",
		                "type": "label",
		                "options": null,
		                "lineNumber": 583
		            },
		            {
		                "id": "FIXME_584",
		                "text": "// will get copied into the perspectives list seen in the next page",
		                "type": "label",
		                "options": null,
		                "lineNumber": 584
		            },
		            {
		                "id": "clusterInterpretations",
		                "text": "Cluster interpretations into perspectives",
		                "type": "clusterSpace",
		                "options": "interpretations",
		                "lineNumber": 585
		            }
		        ]
		    },
		    {
		        "id": "page_describePerspectives",
		        "name": "Describe perspectives",
		        "lineNumber": 587,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "perspectivesList",
		                "text": "Perspectives",
		                "type": "grid",
		                "options": "page_addPerspective",
		                "lineNumber": 589
		            }
		        ]
		    },
		    {
		        "id": "page_addPerspective",
		        "name": "Add or change perspective",
		        "lineNumber": 591,
		        "description": "",
		        "isHeader": false,
		        "type": "popup",
		        "questions": [
		            {
		                "id": "perspectiveName",
		                "text": "Perspective name",
		                "type": "text",
		                "lineNumber": 593
		            },
		            {
		                "id": "perspectiveDescription",
		                "text": "Describe this perspective.",
		                "type": "textarea",
		                "lineNumber": 594
		            },
		            {
		                "id": "FIXME_596",
		                "text": "// note, this grid should combine all the results linked to observations linked to interpretations linked to this perspective",
		                "type": "label",
		                "options": null,
		                "lineNumber": 596
		            },
		            {
		                "id": "FIXME_597",
		                "text": "// perspective",
		                "type": "label",
		                "options": null,
		                "lineNumber": 597
		            },
		            {
		                "id": "FIXME_598",
		                "text": "//      interpretation",
		                "type": "label",
		                "options": null,
		                "lineNumber": 598
		            },
		            {
		                "id": "FIXME_599",
		                "text": "//           observation",
		                "type": "label",
		                "options": null,
		                "lineNumber": 599
		            },
		            {
		                "id": "FIXME_600",
		                "text": "//                result",
		                "type": "label",
		                "options": null,
		                "lineNumber": 600
		            },
		            {
		                "id": "FIXME_601",
		                "text": "Choose an observation result that exemplifies this perspective.",
		                "type": "grid",
		                "lineNumber": 601
		            },
		            {
		                "id": "FIXME_603",
		                "text": "// similarly, this should be a list of all the excerpts linked to interpretations linked to this perspective",
		                "type": "label",
		                "options": null,
		                "lineNumber": 603
		            },
		            {
		                "id": "FIXME_604",
		                "text": "// perspective",
		                "type": "label",
		                "options": null,
		                "lineNumber": 604
		            },
		            {
		                "id": "FIXME_605",
		                "text": "//     interpretation",
		                "type": "label",
		                "options": null,
		                "lineNumber": 605
		            },
		            {
		                "id": "FIXME_606",
		                "text": "//         excerpt",
		                "type": "label",
		                "options": null,
		                "lineNumber": 606
		            },
		            {
		                "id": "FIXME_607",
		                "text": "Choose one or more excerpts to illustrate this perspective",
		                "type": "grid",
		                "lineNumber": 607
		            }
		        ]
		    },
		    {
		        "id": "page_readCatalysisReport",
		        "name": "Read catalysis report",
		        "lineNumber": 609,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "catalysisReport",
		                "text": "Catalysis report",
		                "type": "report",
		                "options": "catalysis",
		                "lineNumber": 611
		            },
		            {
		                "id": "FIXME_613",
		                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
		                "type": "label",
		                "options": null,
		                "lineNumber": 613
		            },
		            {
		                "id": "FIXME_614",
		                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
		                "type": "label",
		                "options": null,
		                "lineNumber": 614
		            },
		            {
		                "id": "FIXME_615",
		                "text": "//                                                       SENSEMAKING",
		                "type": "label",
		                "options": null,
		                "lineNumber": 615
		            },
		            {
		                "id": "FIXME_616",
		                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
		                "type": "label",
		                "options": null,
		                "lineNumber": 616
		            },
		            {
		                "id": "FIXME_617",
		                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
		                "type": "label",
		                "options": null,
		                "lineNumber": 617
		            }
		        ]
		    },
		    {
		        "id": "headerpage_sensemaking",
		        "name": "Sensemaking",
		        "lineNumber": 619,
		        "description": "",
		        "isHeader": true,
		        "questions": [
		            {
		                "id": "FIXME_620",
		                "text": "// Planning sessions - x of x questions answered",
		                "type": "label",
		                "options": null,
		                "lineNumber": 620
		            },
		            {
		                "id": "FIXME_621",
		                "text": "// Write session agenda - x of x questions answered",
		                "type": "label",
		                "options": null,
		                "lineNumber": 621
		            },
		            {
		                "id": "FIXME_622",
		                "text": "// Print story cards - x cards printed (or checkmark)",
		                "type": "label",
		                "options": null,
		                "lineNumber": 622
		            },
		            {
		                "id": "FIXME_623",
		                "text": "// Post-session review - x of x questions answered",
		                "type": "label",
		                "options": null,
		                "lineNumber": 623
		            }
		        ]
		    },
		    {
		        "id": "page_planSensemakingSessions",
		        "name": "Plan sensemaking sessions",
		        "lineNumber": 625,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "sensemakingSessionRecommendations",
		                "text": "Recommendations for sensemaking sessions",
		                "type": "recommendationTable",
		                "options": "sensemakingSessions",
		                "lineNumber": 627
		            },
		            {
		                "id": "sensemakingSessions",
		                "text": "Sensemaking sessions",
		                "type": "grid",
		                "options": "page_addSensemakingSessionPlan",
		                "lineNumber": 629
		            }
		        ]
		    },
		    {
		        "id": "page_addSensemakingSessionPlan",
		        "name": "Enter sensemaking session plan",
		        "lineNumber": 631,
		        "description": "",
		        "isHeader": false,
		        "type": "popup",
		        "questions": [
		            {
		                "id": "sensemakingSessionRepetitions",
		                "text": "How many repetitions of the session will there be?",
		                "type": "text",
		                "lineNumber": 633
		            },
		            {
		                "id": "sensemakingSessionLength",
		                "text": "How long will this session be?",
		                "type": "text",
		                "lineNumber": 634
		            },
		            {
		                "id": "sensemakingSessionTime",
		                "text": "When will it take place?",
		                "type": "text",
		                "lineNumber": 635
		            },
		            {
		                "id": "sensemakingSessionLocation",
		                "text": "Where will it take place?",
		                "type": "text",
		                "lineNumber": 636
		            },
		            {
		                "id": "sensemakingSessionSize",
		                "text": "How many people will be invited to each repetition of this session?",
		                "type": "text",
		                "lineNumber": 637
		            },
		            {
		                "id": "sensemakingSessionGroups",
		                "text": "From which participant group(s) will people be invited?",
		                "type": "checkBoxesWithPull",
		                "options": "participantGroups",
		                "lineNumber": 638
		            },
		            {
		                "id": "sensemakingSessionAgenda",
		                "text": "Session agenda",
		                "type": "grid",
		                "options": "page_addSensemakingSessionActivity",
		                "lineNumber": 640
		            },
		            {
		                "id": "printSensemakingSessionAgenda",
		                "text": "Print session agenda",
		                "type": "button",
		                "lineNumber": 641
		            },
		            {
		                "id": "sensemakingSessionMaterials",
		                "text": "What materials will this session require?",
		                "type": "textarea",
		                "lineNumber": 643
		            },
		            {
		                "id": "sensemakingSessionDetails",
		                "text": "Enter other details about this session.",
		                "type": "textarea",
		                "lineNumber": 644
		            }
		        ]
		    },
		    {
		        "id": "page_addSensemakingSessionActivity",
		        "name": "Add sensemaking session activity",
		        "lineNumber": 646,
		        "description": "",
		        "isHeader": false,
		        "type": "popup",
		        "questions": [
		            {
		                "id": "sensemakingSessionActivity",
		                "text": "What type of activity is this?",
		                "type": "select",
		                "options": "ice-breaker;encountering stories (no task);encountering stories (simple task);discussing stories;twice-told stories exercise;timeline exercise;landscape exercise;story elements exercise;composite stories exercise;my own exercise;other",
		                "lineNumber": 648
		            },
		            {
		                "id": "sensemakingActivityPlan",
		                "text": "Describe the plan for this activity.",
		                "type": "textarea",
		                "lineNumber": 649
		            },
		            {
		                "id": "sensemakingActivityOptionalParts",
		                "text": "Describe optional elaborations you might or might not use in this activity.",
		                "type": "textarea",
		                "lineNumber": 650
		            },
		            {
		                "id": "sensemakingActivityTime",
		                "text": "How long will this activity take?",
		                "type": "text",
		                "lineNumber": 651
		            },
		            {
		                "id": "sensemakingActivityRecording",
		                "text": "Will new stories be recorded during this activity, and if so, how?",
		                "type": "textarea",
		                "lineNumber": 652
		            },
		            {
		                "id": "sensemakingActivityMaterials",
		                "text": "What materials will be provided for this activity?",
		                "type": "textarea",
		                "lineNumber": 653
		            },
		            {
		                "id": "sensemakingActivitySpaces",
		                "text": "What spaces will be used for this activity?",
		                "type": "textarea",
		                "lineNumber": 654
		            },
		            {
		                "id": "sensemakingActivityFacilitation",
		                "text": "What sort of facilitation will be necessary for this activity?",
		                "type": "textarea",
		                "lineNumber": 655
		            }
		        ]
		    },
		    {
		        "id": "page_enterSensemakingSessionRecords",
		        "name": "Enter sensemaking session records",
		        "lineNumber": 657,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "FIXME_659",
		                "text": "Sensemaking sessions",
		                "type": "grid",
		                "options": "page_addSensemakingSessionRecord",
		                "lineNumber": 659
		            }
		        ]
		    },
		    {
		        "id": "page_addSensemakingSessionRecord",
		        "name": "Add sensemaking session record",
		        "lineNumber": 661,
		        "description": "",
		        "isHeader": false,
		        "type": "popup",
		        "questions": [
		            {
		                "id": "sensemakingSessionOutcomes",
		                "text": "Session outcomes (like discoveries and ideas)",
		                "type": "grid",
		                "options": "page_newSensemakingSessionOutcome",
		                "lineNumber": 663
		            },
		            {
		                "id": "sensemakingSessionSummaries",
		                "text": "Group constructions",
		                "type": "grid",
		                "options": "page_newSensemakingSessionConstruction",
		                "lineNumber": 665
		            },
		            {
		                "id": "sensemakingSessionImages",
		                "text": "Session notes",
		                "type": "page_newSensemakingSessionNotes",
		                "lineNumber": 667
		            }
		        ]
		    },
		    {
		        "id": "page_newSensemakingSessionOutcome",
		        "name": "Sensemaking session outcome",
		        "lineNumber": 669,
		        "description": "",
		        "isHeader": false,
		        "type": "popup",
		        "questions": [
		            {
		                "id": "sensemakingSessionOutcomeType",
		                "text": "Type",
		                "type": "select",
		                "options": "discovery;opportunity;issue;idea;recommendation;perspective;dilemma;other",
		                "lineNumber": 671
		            },
		            {
		                "id": "sensemakingSessionOutcomeName",
		                "text": "Name",
		                "type": "text",
		                "lineNumber": 672
		            },
		            {
		                "id": "sensemakingSessionOutcomeText",
		                "text": "Description",
		                "type": "textarea",
		                "lineNumber": 673
		            }
		        ]
		    },
		    {
		        "id": "page_newSensemakingSessionConstruction",
		        "name": "Sensemaking construction",
		        "lineNumber": 675,
		        "description": "",
		        "isHeader": false,
		        "type": "popup",
		        "questions": [
		            {
		                "id": "sensemakingSessionConstructionName",
		                "text": "Name",
		                "type": "text",
		                "lineNumber": 677
		            },
		            {
		                "id": "sensemakingSessionContructionText",
		                "text": "Description",
		                "type": "textarea",
		                "lineNumber": 678
		            },
		            {
		                "id": "sensemakingSessionConstructionLink",
		                "text": "Link to audio or video",
		                "type": "text",
		                "lineNumber": 679
		            },
		            {
		                "id": "sensemakingSessionConstructionImages",
		                "text": "Images",
		                "type": "grid",
		                "options": "page_newSensemakingConstructionImage",
		                "lineNumber": 680
		            }
		        ]
		    },
		    {
		        "id": "page_newSensemakingConstructionImage",
		        "name": "Sensemaking construction image",
		        "lineNumber": 682,
		        "description": "",
		        "isHeader": false,
		        "type": "popup",
		        "questions": [
		            {
		                "id": "sensemakingSessionConstrucctionImage",
		                "text": "Image",
		                "type": "imageUploader",
		                "lineNumber": 684
		            },
		            {
		                "id": "sensemakingSessionConstructionImageName",
		                "text": "Name",
		                "type": "text",
		                "lineNumber": 685
		            },
		            {
		                "id": "sensemakingSessionConstructionImageNotes",
		                "text": "Notes on this image",
		                "type": "textarea",
		                "lineNumber": 686
		            }
		        ]
		    },
		    {
		        "id": "page_newSensemakingSessionNotes",
		        "name": "Sensemaking session notes",
		        "lineNumber": 688,
		        "description": "",
		        "isHeader": false,
		        "type": "popup",
		        "questions": [
		            {
		                "id": "sensemakingSessionNotesName",
		                "text": "Name",
		                "type": "text",
		                "lineNumber": 690
		            },
		            {
		                "id": "sensemakingSessionNotesText",
		                "text": "Notes",
		                "type": "textarea",
		                "lineNumber": 691
		            },
		            {
		                "id": "sensemakingSessionNotesImages",
		                "text": "Images",
		                "type": "grid",
		                "options": "page_newSensemakingSessionImage",
		                "lineNumber": 692
		            }
		        ]
		    },
		    {
		        "id": "page_newSensemakingSessionImage",
		        "name": "Sensemaking session notes image",
		        "lineNumber": 694,
		        "description": "",
		        "isHeader": false,
		        "type": "popup",
		        "questions": [
		            {
		                "id": "sensemakingSessionNotesImage",
		                "text": "Image",
		                "type": "imageUploader",
		                "lineNumber": 696
		            },
		            {
		                "id": "sensemakingSessionImageName",
		                "text": "Name",
		                "type": "text",
		                "lineNumber": 697
		            },
		            {
		                "id": "sensemakingSessionNotesImageNotes",
		                "text": "Notes on this image",
		                "type": "textarea",
		                "lineNumber": 698
		            }
		        ]
		    },
		    {
		        "id": "page_answerQuestionsAboutSensemakingSessions",
		        "name": "Reflect on sensemaking sessions",
		        "lineNumber": 700,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "sensemakingSessionQuestionsLabel",
		                "text": "Note: If there are no sessions in this list, enter them in the \"Enter sensemaking session records\" screen first.",
		                "type": "label",
		                "lineNumber": 702
		            },
		            {
		                "id": "FIXME_704",
		                "text": "// this list should populate with names of sessions given in \"enter sensemaking sessions records\" screen.",
		                "type": "label",
		                "options": null,
		                "lineNumber": 704
		            },
		            {
		                "id": "FIXME_705",
		                "text": "/// there should be NO add button... but the edit button should go to the popup specified here",
		                "type": "label",
		                "options": null,
		                "lineNumber": 705
		            },
		            {
		                "id": "FIXME_706",
		                "text": "Sensemaking sessions",
		                "type": "grid",
		                "options": "page_answerQuestionsAboutSensemakingSession",
		                "lineNumber": 706
		            }
		        ]
		    },
		    {
		        "id": "page_answerQuestionsAboutSensemakingSession",
		        "name": "Reflect on session",
		        "lineNumber": 708,
		        "description": "",
		        "isHeader": false,
		        "type": "popup",
		        "questions": [
		            {
		                "id": "senseReflectChangeBehavior",
		                "text": "How did the behavior of the participants change from the start to the end of the session?",
		                "type": "textarea",
		                "lineNumber": 710
		            },
		            {
		                "id": "senseReflectChangeEmotions",
		                "text": "How did their emotions change?",
		                "type": "textarea",
		                "lineNumber": 711
		            },
		            {
		                "id": "senseReflectChangeYourEmotions",
		                "text": "How did your emotions change?",
		                "type": "textarea",
		                "lineNumber": 712
		            },
		            {
		                "id": "senseReflectInteractionsParticipants",
		                "text": "Describe the interactions between participants (including changes during the session).",
		                "type": "textarea",
		                "lineNumber": 713
		            },
		            {
		                "id": "senseReflectInteractionsFacilitators",
		                "text": "Describe interactions between participants and facilitators (including change).",
		                "type": "textarea",
		                "lineNumber": 714
		            },
		            {
		                "id": "senseReflectStories",
		                "text": "What did you notice about the stories people told, retold, chose, worked with, and built during the session?",
		                "type": "textarea",
		                "lineNumber": 715
		            },
		            {
		                "id": "senseReflectStoryOfSession",
		                "text": "What is the story of what happened during this session?",
		                "type": "textarea",
		                "lineNumber": 716
		            },
		            {
		                "id": "senseReflectSpecial",
		                "text": "What was special about these people in this place on this day?",
		                "type": "textarea",
		                "lineNumber": 717
		            },
		            {
		                "id": "senseReflectAsExpected",
		                "text": "What parts of your plans went as you expected? What parts didn't?",
		                "type": "textarea",
		                "lineNumber": 718
		            },
		            {
		                "id": "senseReflectWorkedWell",
		                "text": "What parts of your plans worked out well?",
		                "type": "textarea",
		                "lineNumber": 719
		            },
		            {
		                "id": "senseReflectWorkedBadly",
		                "text": "What parts didn't work out well?",
		                "type": "textarea",
		                "lineNumber": 720
		            },
		            {
		                "id": "senseReflectNewIdeas",
		                "text": "What new ideas did you gain from the participants in this session?",
		                "type": "textarea",
		                "lineNumber": 721
		            },
		            {
		                "id": "senseReflectProjectChanged",
		                "text": "How has the project changed as a result of this session?",
		                "type": "textarea",
		                "lineNumber": 722
		            },
		            {
		                "id": "senseReflectExtra",
		                "text": "What else do you want most to remember about this session?",
		                "type": "textarea",
		                "lineNumber": 723
		            }
		        ]
		    },
		    {
		        "id": "page_readSensemakingReport",
		        "name": "Read sensemaking report",
		        "lineNumber": 725,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "sensemakingReport",
		                "text": "Sensemaking report",
		                "type": "report",
		                "options": "sensemaking",
		                "lineNumber": 727
		            },
		            {
		                "id": "FIXME_729",
		                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
		                "type": "label",
		                "options": null,
		                "lineNumber": 729
		            },
		            {
		                "id": "FIXME_730",
		                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
		                "type": "label",
		                "options": null,
		                "lineNumber": 730
		            },
		            {
		                "id": "FIXME_731",
		                "text": "//                                                       INTERVENTION",
		                "type": "label",
		                "options": null,
		                "lineNumber": 731
		            },
		            {
		                "id": "FIXME_732",
		                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
		                "type": "label",
		                "options": null,
		                "lineNumber": 732
		            },
		            {
		                "id": "FIXME_733",
		                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
		                "type": "label",
		                "options": null,
		                "lineNumber": 733
		            }
		        ]
		    },
		    {
		        "id": "FIXME_735",
		        "name": "Intervention - checklist",
		        "lineNumber": 735,
		        "description": "Choose interventions - x planned\nAnswer questions about interventions - x questions answered\n",
		        "isHeader": true,
		        "questions": []
		    },
		    {
		        "id": "FIXME_739",
		        "name": "Choose interventions - answer questions about which interventions to use",
		        "lineNumber": 739,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "FIXME_741",
		                "text": "// recommendations based on groups in planning",
		                "type": "label",
		                "options": null,
		                "lineNumber": 741
		            },
		            {
		                "id": "FIXME_743",
		                "text": "// questions help to choose interventions",
		                "type": "label",
		                "options": null,
		                "lineNumber": 743
		            },
		            {
		                "id": "FIXME_744",
		                "text": "// cfk stopped here",
		                "type": "label",
		                "options": null,
		                "lineNumber": 744
		            }
		        ]
		    },
		    {
		        "id": "FIXME_746",
		        "name": "Answer questions about interventions - answer questions about interventions used",
		        "lineNumber": 746,
		        "description": "",
		        "isHeader": false,
		        "questions": []
		    },
		    {
		        "id": "FIXME_747",
		        "name": "Read intervention report - text with all stuff entered",
		        "lineNumber": 747,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "FIXME_749",
		                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
		                "type": "label",
		                "options": null,
		                "lineNumber": 749
		            },
		            {
		                "id": "FIXME_750",
		                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
		                "type": "label",
		                "options": null,
		                "lineNumber": 750
		            },
		            {
		                "id": "FIXME_751",
		                "text": "//                                                       RETURN",
		                "type": "label",
		                "options": null,
		                "lineNumber": 751
		            },
		            {
		                "id": "FIXME_752",
		                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
		                "type": "label",
		                "options": null,
		                "lineNumber": 752
		            },
		            {
		                "id": "FIXME_753",
		                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
		                "type": "label",
		                "options": null,
		                "lineNumber": 753
		            }
		        ]
		    },
		    {
		        "id": "FIXME_755",
		        "name": "Return - checklist",
		        "lineNumber": 755,
		        "description": "",
		        "isHeader": true,
		        "questions": []
		    },
		    {
		        "id": "FIXME_757",
		        "name": "Gather feedback - enter what people said (mostly textareas)",
		        "lineNumber": 757,
		        "description": "",
		        "isHeader": false,
		        "questions": []
		    },
		    {
		        "id": "FIXME_758",
		        "name": "Answer questions about project - answer questions about project (mostly textareas)",
		        "lineNumber": 758,
		        "description": "",
		        "isHeader": false,
		        "questions": []
		    },
		    {
		        "id": "FIXME_759",
		        "name": "Prepare project presentation - enter things you want to tell people about project (to be shown to steering committee)",
		        "lineNumber": 759,
		        "description": "",
		        "isHeader": false,
		        "questions": []
		    },
		    {
		        "id": "FIXME_760",
		        "name": "Read return report - text with all stuff entered",
		        "lineNumber": 760,
		        "description": "",
		        "isHeader": false,
		        "questions": []
		    },
		    {
		        "id": "FIXME_762",
		        "name": "Project report - text summary (everything in the six stage reports appended)",
		        "lineNumber": 762,
		        "description": "",
		        "isHeader": true,
		        "questions": []
		    }
		]
);