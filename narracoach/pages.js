"use strict";

define(
		[
		    {
		        "id": "FIXME_11",
		        "name": "Dashboard",
		        "lineNumber": 11,
		        "description": "",
		        "isHeader": true,
		        "questions": [
		            {
		                "id": "FIXME_12",
		                "text": "// all checklists combined",
		                "type": "label",
		                "options": null,
		                "lineNumber": 12
		            }
		        ]
		    },
		    {
		        "id": "headerpage_planning",
		        "name": "Planning",
		        "lineNumber": 14,
		        "description": "",
		        "isHeader": true,
		        "questions": [
		            {
		                "id": "FIXME_15",
		                "text": "// Project facts - x of x questions answered",
		                "type": "label",
		                "options": null,
		                "lineNumber": 15
		            },
		            {
		                "id": "FIXME_16",
		                "text": "// Planning questions - [ ] draft",
		                "type": "label",
		                "options": null,
		                "lineNumber": 16
		            },
		            {
		                "id": "FIXME_17",
		                "text": "// Project aspects - x of x questions answered",
		                "type": "label",
		                "options": null,
		                "lineNumber": 17
		            },
		            {
		                "id": "FIXME_18",
		                "text": "// Project stories - x stories told",
		                "type": "label",
		                "options": null,
		                "lineNumber": 18
		            },
		            {
		                "id": "FIXME_19",
		                "text": "// Project story elements - x elements entered",
		                "type": "label",
		                "options": null,
		                "lineNumber": 19
		            },
		            {
		                "id": "FIXME_20",
		                "text": "// Story sharing assessment - x of 20 questions answered",
		                "type": "label",
		                "options": null,
		                "lineNumber": 20
		            },
		            {
		                "id": "FIXME_21",
		                "text": "// Project synopsis - [ ] complete",
		                "type": "label",
		                "options": null,
		                "lineNumber": 21
		            }
		        ]
		    },
		    {
		        "id": "page_projectFacts",
		        "name": "Enter project facts",
		        "lineNumber": 23,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "projectFacts",
		                "text": "On this page you will enter some facts about your project. The things you enter here will appear in your reports.",
		                "type": "label",
		                "lineNumber": 25
		            },
		            {
		                "id": "projectTitle",
		                "text": "What is the project's title?",
		                "type": "text",
		                "lineNumber": 27
		            },
		            {
		                "id": "communityOrOrganizationName",
		                "text": "What is the name of your community or organization?",
		                "type": "text",
		                "lineNumber": 28
		            },
		            {
		                "id": "projectFacilitators",
		                "text": "Who is facilitating the project? (names and titles)",
		                "type": "text",
		                "lineNumber": 29
		            },
		            {
		                "id": "projectStartAndEndDates",
		                "text": "What are the project's start and ending dates?",
		                "type": "text",
		                "lineNumber": 30
		            },
		            {
		                "id": "reportStartText",
		                "text": "Please enter any other information you want to appear at the top of project reports.",
		                "type": "textarea",
		                "lineNumber": 31
		            },
		            {
		                "id": "reportEndText",
		                "text": "Please enter any other information you want to appear at the bottom of project reports (as notes).",
		                "type": "textarea",
		                "lineNumber": 32
		            }
		        ]
		    },
		    {
		        "id": "page_planningQuestionsDraft",
		        "name": "Answer PNI Planning questions",
		        "lineNumber": 34,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "planning_draft",
		                "text": "On this page you will answer some questions about your project's goals, relationships, focus, range, scope, and emphasis.\nIf you don't have good answers for these questions right now, don't worry; you will have a chance to come back and work on these answers again later.",
		                "type": "label",
		                "lineNumber": 36
		            },
		            {
		                "id": "planning_draft_goal",
		                "text": "What is the goal of the project? Why are you doing it?",
		                "type": "textarea",
		                "lineNumber": 39
		            },
		            {
		                "id": "planning_draft_relationships",
		                "text": "What relationships are important to the project?",
		                "type": "textarea",
		                "lineNumber": 40
		            },
		            {
		                "id": "planning_draft_focus",
		                "text": "What is the focus of the project? What is it about?",
		                "type": "textarea",
		                "lineNumber": 41
		            },
		            {
		                "id": "planning_draft_range",
		                "text": "What range(s) of experience will the project cover?",
		                "type": "textarea",
		                "lineNumber": 42
		            },
		            {
		                "id": "planning_draft_scope",
		                "text": "What is the project's scope? (number of people, number of stories, number of questions about stories)",
		                "type": "textarea",
		                "lineNumber": 43
		            },
		            {
		                "id": "planning_draft_emphasis",
		                "text": "Which phases of PNI will be important to the project? (indicate most and least important phases)",
		                "type": "textarea",
		                "lineNumber": 44
		            }
		        ]
		    },
		    {
		        "id": "page_projectAspects",
		        "name": "Consider project aspects",
		        "lineNumber": 46,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "aboutParticipantGroups",
		                "text": "On this page you will think about groups of participants you want to involve in your project.\nExamples might be: doctors and patients; staff and customers; natives, immigrants, and tourists.\nNarraCoach supports planning for up to three groups of project participants.",
		                "type": "label",
		                "lineNumber": 48
		            },
		            {
		                "id": "participants_firstGroupName",
		                "text": "Please name the group of participants from whom the project most needs to hear.",
		                "type": "text",
		                "lineNumber": 52
		            },
		            {
		                "id": "participants_firstGroupDescription",
		                "text": "Please describe this group of participants.\nFor example, you might want to record any observations you have made about this group.\nWhat do you know about them?",
		                "type": "textarea",
		                "lineNumber": 53
		            },
		            {
		                "id": "participants_secondGroupName",
		                "text": "Please name the group of participants from whom the project needs to hear next.",
		                "type": "text",
		                "lineNumber": 57
		            },
		            {
		                "id": "participants_secondGroupDescription",
		                "text": "Please describe the second-most critical group of participants.",
		                "type": "textarea",
		                "lineNumber": 58
		            },
		            {
		                "id": "participants_thirdGroupName",
		                "text": "If there is a third group of participants from whom the project needs to hear, please name them.",
		                "type": "text",
		                "lineNumber": 59
		            },
		            {
		                "id": "participants_thirdGroupDescription",
		                "text": "Please describe the third-most critical group of participants.",
		                "type": "textarea",
		                "lineNumber": 60
		            },
		            {
		                "id": "aspectsTable",
		                "text": "Please answer these questions about each participant group.",
		                "type": "page_aspectsTable",
		                "options": "participants_firstGroupName,participants_secondGroupName,participants_thirdGroupName",
		                "lineNumber": 62
		            }
		        ]
		    },
		    {
		        "id": "page_aspectsTable",
		        "name": "Aspects table",
		        "lineNumber": 64,
		        "description": "",
		        "isHeader": false,
		        "type": "questionsTable",
		        "questions": [
		            {
		                "id": "aspects_statusHeader",
		                "text": "Status",
		                "type": "header",
		                "lineNumber": 66
		            },
		            {
		                "id": "aspects_status",
		                "text": "What is the status of these participants in the community or organization?",
		                "type": "select",
		                "options": "unknown;very low;low;moderate;high;very high;mixed",
		                "lineNumber": 67
		            },
		            {
		                "id": "aspects_confidence",
		                "text": "How much self-confidence do these participants have?",
		                "type": "select",
		                "options": "unknown;very low;low;medium;high;very high;mixed",
		                "lineNumber": 68
		            },
		            {
		                "id": "aspects_abilityHeader",
		                "text": "Ability",
		                "type": "header",
		                "lineNumber": 70
		            },
		            {
		                "id": "aspects_time",
		                "text": "How much free time do these participants have?",
		                "type": "select",
		                "options": "unknown;very little;little;some;much;mixed",
		                "lineNumber": 71
		            },
		            {
		                "id": "aspects_education",
		                "text": "What is the education level of these participants?",
		                "type": "select",
		                "options": "unknown;illiterate;minimal;moderate;high;very high;mixed",
		                "lineNumber": 72
		            },
		            {
		                "id": "aspects_physicalDisabilities",
		                "text": "Do these participants have physical limitations that will impact their participation?",
		                "type": "select",
		                "options": "unknown;none;minimal;moderate;strong;mixed",
		                "lineNumber": 73
		            },
		            {
		                "id": "aspects_emotionalImpairments",
		                "text": "Do these participants have emotional impairments that will impact their participation (such as mental illness or traumatic stress)?",
		                "type": "select",
		                "options": "unknown;none;minimal;moderate;strong;mixed",
		                "lineNumber": 74
		            },
		            {
		                "id": "aspects_expectationsHeader",
		                "text": "Expectations",
		                "type": "header",
		                "lineNumber": 76
		            },
		            {
		                "id": "aspects_performing",
		                "text": "For these participants, how important is performing well (with \"high marks\")?",
		                "type": "select",
		                "options": "unknown;very unimportant;somewhat unimportant;somewhat important;very important;mixed",
		                "lineNumber": 77
		            },
		            {
		                "id": "aspects_conforming",
		                "text": "For these participants, how important is conforming (to what is \"normal\" or expected)?",
		                "type": "select",
		                "options": "unknown;very unimportant;somewhat unimportant;somewhat important;very important;mixed",
		                "lineNumber": 78
		            },
		            {
		                "id": "aspects_promoting",
		                "text": "For these participants, how important is self-promotion (competing with others)?",
		                "type": "select",
		                "options": "unknown;very unimportant;somewhat unimportant;somewhat important;very important;mixed",
		                "lineNumber": 79
		            },
		            {
		                "id": "aspects_venting",
		                "text": "For these participants, how important is speaking out (having a say, venting, sounding off)?",
		                "type": "select",
		                "options": "unknown;very unimportant;somewhat unimportant;somewhat important;very important;mixed",
		                "lineNumber": 80
		            },
		            {
		                "id": "aspects_feelingsHeader",
		                "text": "Feelings about the project",
		                "type": "header",
		                "lineNumber": 82
		            },
		            {
		                "id": "aspects_interest",
		                "text": "How motivated are these participants to participate in the project?",
		                "type": "select",
		                "options": "unknown;very little;a little;some;a lot;extremely;mixed",
		                "lineNumber": 83
		            },
		            {
		                "id": "aspects_feelings_project",
		                "text": "How are these participants likely to feel about the project?",
		                "type": "select",
		                "options": "unknown;negative;neutral;positive;mixed",
		                "lineNumber": 84
		            },
		            {
		                "id": "aspects_feelings_facilitator",
		                "text": "How do these participants feel about you?",
		                "type": "select",
		                "options": "unknown;negative;neutral;positive;mixed",
		                "lineNumber": 85
		            },
		            {
		                "id": "aspects_feelings_stories",
		                "text": "How do these participants feel about the idea of collecting stories?",
		                "type": "select",
		                "options": "unknown;negative;neutral;positive;mixed",
		                "lineNumber": 86
		            },
		            {
		                "id": "aspects_topicHeader",
		                "text": "Feelings about the topic",
		                "type": "header",
		                "lineNumber": 88
		            },
		            {
		                "id": "aspects_topic_feeling",
		                "text": "What experiences have these participants had with the project's topic?",
		                "type": "select",
		                "options": "unknown;strongly negative;negative;neutral;positive;strongly positive;mixed",
		                "lineNumber": 89
		            },
		            {
		                "id": "aspects_topic_private",
		                "text": "How private do these participants consider the topic to be?",
		                "type": "select",
		                "options": "unknown;very private;medium;not private;mixed",
		                "lineNumber": 90
		            },
		            {
		                "id": "aspects_topic_articulate",
		                "text": "How hard will it be for these participants to articulate their feelings about the topic?",
		                "type": "select",
		                "options": "unknown;hard;medium;easy;mixed",
		                "lineNumber": 91
		            },
		            {
		                "id": "aspects_topic_timeframe",
		                "text": "How long of a time period do you need these participants to look back on?",
		                "type": "select",
		                "options": "unknown;hours;days;months;years;decades;mixed",
		                "lineNumber": 92
		            }
		        ]
		    },
		    {
		        "id": "page_projectStories",
		        "name": "Tell project stories",
		        "lineNumber": 94,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "projectStoryList",
		                "text": "Project story list",
		                "type": "grid",
		                "options": "page_projectStory",
		                "lineNumber": 96
		            }
		        ]
		    },
		    {
		        "id": "page_projectStory",
		        "name": "Project story",
		        "lineNumber": 98,
		        "description": "",
		        "isHeader": false,
		        "type": "popup",
		        "questions": [
		            {
		                "id": "projectStory_scenario",
		                "text": "Start by choosing a scenario that starts your project story.",
		                "type": "select",
		                "options": "ask me anything;magic ears;fly on the wall;project aspects;my own scenario type",
		                "lineNumber": 100
		            },
		            {
		                "id": "projectStory_outcome",
		                "text": "Now choose an outcome for your story.",
		                "type": "select",
		                "options": "colossal success;miserable failure;acceptable outcome;my own outcome",
		                "lineNumber": 101
		            },
		            {
		                "id": "projectStory_text",
		                "text": "Now tell your project story as a future history (as though it has already happened).",
		                "type": "textarea",
		                "lineNumber": 102
		            },
		            {
		                "id": "projectStory_name",
		                "text": "Please name your project story.",
		                "type": "text",
		                "lineNumber": 103
		            },
		            {
		                "id": "projectStory_feelAbout",
		                "text": "How do you feel about this story?",
		                "type": "textarea",
		                "lineNumber": 104
		            },
		            {
		                "id": "projectStory_surprise",
		                "text": "What surprised you about this story?",
		                "type": "textarea",
		                "lineNumber": 105
		            },
		            {
		                "id": "projectStory_dangers",
		                "text": "Describe any opportunities or dangers you see in this story.",
		                "type": "textarea",
		                "lineNumber": 106
		            }
		        ]
		    },
		    {
		        "id": "page_projectStoryElements",
		        "name": "Create project story elements",
		        "lineNumber": 108,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "storyElementsInstructions",
		                "text": "Here are some instructions on how to create story elements from your project stories.\n<ol>\n<li>Choose one or two types of story element (characters, situations, values, themes, relationships, motivations, beliefs, conflicts).</li>\n<li>For each story, come up with as many answers to that element's question as you can. Write the answers on sticky notes.</li>\n<li>The questions are:</li>\n<ul>\n<li>Characters: Who is doing things in this story?</li>\n<li>Situations: What is going on in this story?</li>\n<li>Values: What matters to the characters in this story?</li>\n<li>Themes: What is this story about?</li>\n<li>Relationships: How are the characters related in this story?</li>\n<li>Motivations: Why do the characters do what they do in this story?</li>\n<li>Beliefs: What do people believe in this story?</li>\n<li>Conflicts: Who or what stands in opposition in this story?</li>\n</ul>\n<li>Once you have answered the question(s) you chose for each story, cluster the sticky notes into groups. Place like with like.</li>\n<li>Give each group of sticky notes a name.</li>\n<li>Clear a \"halo\" of space around each group's name.</li>\n<li>In the halo, write 2-5 good and bad attributes (advantages and disadvantages, opportunities and dangers) of each group of sticky notes.</li>\n<li>Copy or move the new good/bad attributes to a new space. Mix them all together.</li>\n<li>Cluster the attributes into groups.</li>\n<li>Name the groups. These are your story elements.</li>\n</ol>",
		                "type": "label",
		                "lineNumber": 110
		            },
		            {
		                "id": "storyElements",
		                "text": "Project story elements",
		                "type": "grid",
		                "options": "page_addStoryElement",
		                "lineNumber": 134
		            }
		        ]
		    },
		    {
		        "id": "page_addStoryElement",
		        "name": "Add story element",
		        "lineNumber": 136,
		        "description": "",
		        "isHeader": false,
		        "type": "popup",
		        "questions": [
		            {
		                "id": "storyElementName",
		                "text": "What is the name of the story element?",
		                "type": "text",
		                "lineNumber": 138
		            },
		            {
		                "id": "storyElementType",
		                "text": "What type of story element is this?",
		                "type": "select",
		                "options": "character;situation;value;theme;relationship;motivation;belief;conflict",
		                "lineNumber": 139
		            },
		            {
		                "id": "storyElementDescription",
		                "text": "You can describe it more fully here.",
		                "type": "textarea",
		                "lineNumber": 140
		            },
		            {
		                "id": "storyElementPhoto",
		                "text": "You can enter a photograph of the element here.",
		                "type": "imageUploader",
		                "lineNumber": 141
		            }
		        ]
		    },
		    {
		        "id": "FIXME_143",
		        "name": "Assess story sharing",
		        "lineNumber": 143,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "quiz_intro",
		                "text": "On this page you can answer questions about your community or organization to assess its story sharing culture.\nBefore you answer these questions, you should spend some time listening to people share stories together\nin the places where they normally gather.",
		                "type": "label",
		                "lineNumber": 145
		            },
		            {
		                "id": "quiz_narrativeFreedom",
		                "text": "Narrative freedom",
		                "type": "header",
		                "lineNumber": 149
		            },
		            {
		                "id": "quiz_counterStories",
		                "text": "As you listened to people talk, how often did you hear a person respond to a story with another story that countered it in some way?",
		                "type": "select",
		                "options": "unknown;never;seldom;sometimes;often",
		                "lineNumber": 150
		            },
		            {
		                "id": "quiz_authority",
		                "text": "When someone who was obviously in authority was telling stories, how much time and attention did they get?",
		                "type": "select",
		                "options": "unknown;enthrallment;strong listening;partial listening;nothing special",
		                "lineNumber": 151
		            },
		            {
		                "id": "quiz_mistakes",
		                "text": "How many times did you hear people tell stories about mistakes?",
		                "type": "select",
		                "options": "unknown;never;seldom;sometimes;often",
		                "lineNumber": 152
		            },
		            {
		                "id": "quiz_silencing",
		                "text": "When somebody started telling a story and another person stopped them, how did they stop them?",
		                "type": "select",
		                "options": "unknown;warning;caution;request;joke",
		                "lineNumber": 153
		            },
		            {
		                "id": "quiz_conflict",
		                "text": "When somebody was telling a story and another person disagreed with the storyteller, how did they disagree?",
		                "type": "select",
		                "options": "unknown;demand;criticism;comment;joke",
		                "lineNumber": 154
		            },
		            {
		                "id": "quiz_narrativeFlow",
		                "text": "Narrative flow",
		                "type": "header",
		                "lineNumber": 156
		            },
		            {
		                "id": "quiz_remindings",
		                "text": "When you listened to people telling stories, did you ever hear people say �that reminds me of the time� and then tell a story in response?",
		                "type": "select",
		                "options": "unknown;never;seldom;sometimes;often",
		                "lineNumber": 157
		            },
		            {
		                "id": "quiz_retellings",
		                "text": "How often did you hear people pass on stories they heard from other people?",
		                "type": "select",
		                "options": "unknown;never;seldom;sometimes;often",
		                "lineNumber": 158
		            },
		            {
		                "id": "quiz_folklore",
		                "text": "How much evidence did you find for a narrative folklore in your community or organization?",
		                "type": "select",
		                "options": "unknown;none;little;some;strong",
		                "lineNumber": 159
		            },
		            {
		                "id": "quiz_storyTypes",
		                "text": "Did you hear comic stories, tragic stories, epic stories, and funny stories?",
		                "type": "select",
		                "options": "unknown;no;maybe;I think so;definitely",
		                "lineNumber": 160
		            },
		            {
		                "id": "quiz_sensemaking",
		                "text": "Did you ever see people share stories as they prepared to make decisions?",
		                "type": "select",
		                "options": "unknown;never;seldom;sometimes;often",
		                "lineNumber": 161
		            },
		            {
		                "id": "quiz_narrativeKnowledge",
		                "text": "Narrative knowledge",
		                "type": "header",
		                "lineNumber": 163
		            },
		            {
		                "id": "quiz_realStories",
		                "text": "Did you see people tell stories that were recountings of events based on emotional experiences from particular perspectives?",
		                "type": "select",
		                "options": "unknown;never;seldom;sometimes;often",
		                "lineNumber": 164
		            },
		            {
		                "id": "quiz_negotiations",
		                "text": "How lively were the negotiations you heard going on between storytellers and audiences?",
		                "type": "select",
		                "options": "unknown;never;seldom;sometimes;often",
		                "lineNumber": 165
		            },
		            {
		                "id": "quiz_cotelling",
		                "text": "Did you ever see two or more people tell a story together?",
		                "type": "select",
		                "options": "unknown;never;seldom;sometimes;often",
		                "lineNumber": 166
		            },
		            {
		                "id": "quiz_blunders",
		                "text": "How often did you see someone start telling the wrong story to the wrong people at the wrong time?",
		                "type": "select",
		                "options": "unknown;often;sometimes;seldom;never",
		                "lineNumber": 167
		            },
		            {
		                "id": "quiz_accounting",
		                "text": "Did you see people account for their actions and choices by telling each other stories?",
		                "type": "select",
		                "options": "unknown;never;seldom;sometimes;often",
		                "lineNumber": 168
		            },
		            {
		                "id": "quiz_narrativeUnity",
		                "text": "Narrative unity",
		                "type": "header",
		                "lineNumber": 170
		            },
		            {
		                "id": "quiz_commonStories",
		                "text": "How easy would it be to create a list of stories any member of your community or organization could be expected to know?",
		                "type": "select",
		                "options": "unknown;impossible;difficult;doable;easy",
		                "lineNumber": 171
		            },
		            {
		                "id": "quiz_sacredStories",
		                "text": "How easy would it be to create a list of sacred stories, those important to understanding the community or organization?",
		                "type": "select",
		                "options": "unknown;impossible;difficult;doable;easy",
		                "lineNumber": 172
		            },
		            {
		                "id": "quiz_condensedStories",
		                "text": "How easy would it be to create a list of condensed stories, in the form of proverbs or references?",
		                "type": "select",
		                "options": "unknown;impossible;difficult;doable;easy",
		                "lineNumber": 173
		            },
		            {
		                "id": "quiz_intermingling",
		                "text": "How often were the stories you heard intermingled with each other?",
		                "type": "select",
		                "options": "unknown;never;seldom;sometimes;often",
		                "lineNumber": 174
		            },
		            {
		                "id": "quiz_culture",
		                "text": "How easy would it be to describe the unique storytelling culture of your community or organization?",
		                "type": "select",
		                "options": "unknown;impossible;difficult;doable;easy",
		                "lineNumber": 175
		            },
		            {
		                "id": "FIXME_177",
		                "text": "// should have results overall and for each category of question",
		                "type": "label",
		                "options": null,
		                "lineNumber": 177
		            },
		            {
		                "id": "quiz_result",
		                "text": "This is your combined test result.",
		                "type": "quizScoreResult",
		                "lineNumber": 178
		            },
		            {
		                "id": "quiz_notes",
		                "text": "Here you can record some notes or comments about this assessment.",
		                "type": "textarea",
		                "lineNumber": 180
		            }
		        ]
		    },
		    {
		        "id": "FIXME_182",
		        "name": "Revise PNI Planning questions",
		        "lineNumber": 182,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "improvePlanningDrafts",
		                "text": "Please review and improve your draft answers based on your consideration of project aspects and your project stories.",
		                "type": "label",
		                "lineNumber": 184
		            },
		            {
		                "id": "planning_goal",
		                "text": "What is the goal of the project? Why are you doing it?",
		                "type": "textarea",
		                "options": "planning_goal",
		                "lineNumber": 186
		            },
		            {
		                "id": "FIXME_187",
		                "text": "What relationships are important to the project?",
		                "type": "textarea",
		                "options": "planning_relationships",
		                "lineNumber": 187
		            },
		            {
		                "id": "FIXME_188",
		                "text": "What is the focus of the project? What is it about?",
		                "type": "textarea",
		                "options": "planning_focus",
		                "lineNumber": 188
		            },
		            {
		                "id": "FIXME_189",
		                "text": "What range(s) of experience will the project cover?",
		                "type": "textarea",
		                "options": "planning_range",
		                "lineNumber": 189
		            },
		            {
		                "id": "planning_scope",
		                "text": "What is the project's scope? (number of people, number of stories, number of questions about stories)",
		                "type": "textarea",
		                "options": "planning_draft_scope",
		                "lineNumber": 190
		            },
		            {
		                "id": "planning_emphasis",
		                "text": "Which phases of PNI will be important to the project? (indicate most and least important phases)",
		                "type": "textarea",
		                "options": "planning_draft_emphasis",
		                "lineNumber": 191
		            }
		        ]
		    },
		    {
		        "id": "FIXME_193",
		        "name": "Write project synopsis",
		        "lineNumber": 193,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "projectSynopsis",
		                "text": "Please summarize your project in one or two sentences.",
		                "type": "textarea",
		                "lineNumber": 195
		            }
		        ]
		    },
		    {
		        "id": "FIXME_197",
		        "name": "Read planning report - text with all stuff entered",
		        "lineNumber": 197,
		        "description": "",
		        "isHeader": false,
		        "questions": []
		    },
		    {
		        "id": "FIXME_199",
		        "name": "Collection design",
		        "lineNumber": 199,
		        "description": "",
		        "isHeader": true,
		        "questions": [
		            {
		                "id": "FIXME_200",
		                "text": "// Collection venues - X venues chosen",
		                "type": "label",
		                "options": null,
		                "lineNumber": 200
		            },
		            {
		                "id": "FIXME_201",
		                "text": "// Story eliciting questions - x questions written",
		                "type": "label",
		                "options": null,
		                "lineNumber": 201
		            },
		            {
		                "id": "FIXME_202",
		                "text": "// Questions about stories - x questions written",
		                "type": "label",
		                "options": null,
		                "lineNumber": 202
		            },
		            {
		                "id": "FIXME_203",
		                "text": "// Questions about people - x stories written",
		                "type": "label",
		                "options": null,
		                "lineNumber": 203
		            },
		            {
		                "id": "FIXME_204",
		                "text": "// Question form - [ ] designed [ ] committed",
		                "type": "label",
		                "options": null,
		                "lineNumber": 204
		            }
		        ]
		    },
		    {
		        "id": "FIXME_206",
		        "name": "Choose collection venues",
		        "lineNumber": 206,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "venuesIntro",
		                "text": "On this page you will choose story collection venues, or ways to collect stories.",
		                "type": "label",
		                "lineNumber": 208
		            },
		            {
		                "id": "venueRecommendations",
		                "text": "Venue recommendations",
		                "type": "recommendationTable",
		                "options": "venues",
		                "lineNumber": 210
		            },
		            {
		                "id": "venuesTable",
		                "text": "Please answer these questions about your collection venues for each participant group.",
		                "type": "page_venuesTable",
		                "options": "participants_firstGroupName,participants_secondGroupName,participants_thirdGroupName",
		                "lineNumber": 212
		            }
		        ]
		    },
		    {
		        "id": "page_venuesTable",
		        "name": "Aspects table",
		        "lineNumber": 214,
		        "description": "",
		        "isHeader": false,
		        "type": "questionsTable",
		        "questions": [
		            {
		                "id": "primaryVenue",
		                "text": "Choose a primary means of story collection for this group.",
		                "type": "select",
		                "options": "individual interviews;group interviews;peer interviews;group story sessions;surveys;journals;narrative incident reports;gleaned stories",
		                "lineNumber": 216
		            },
		            {
		                "id": "primaryVenue_plans",
		                "text": "Describe your story collection plans for this group and venue.",
		                "type": "textarea",
		                "lineNumber": 217
		            },
		            {
		                "id": "secondaryVenue",
		                "text": "If you want to collect stories in a second way for this same group, choose one of these options.",
		                "type": "select",
		                "options": "individual interviews;group interviews;peer interviews;group story sessions;surveys;journals;narrative incident reports;gleaned stories",
		                "lineNumber": 218
		            },
		            {
		                "id": "secondaryVenue_plans",
		                "text": "Describe your secondary story collection for this group and venue.",
		                "type": "textarea",
		                "lineNumber": 219
		            }
		        ]
		    },
		    {
		        "id": "FIXME_221",
		        "name": "Write story eliciting questions - write questions (question list, recommendations, copy from templates, review project aspects and story elements, reorder questions in list)",
		        "lineNumber": 221,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "FIXME_223",
		                "text": "// list of questions with \"add\" button, popup",
		                "type": "label",
		                "options": null,
		                "lineNumber": 223
		            },
		            {
		                "id": "FIXME_225",
		                "text": "// need to help them choose which TYPE of eliciting questions",
		                "type": "label",
		                "options": null,
		                "lineNumber": 225
		            },
		            {
		                "id": "FIXME_226",
		                "text": "// they want to use - asking for times, directed and undirected, etc",
		                "type": "label",
		                "options": null,
		                "lineNumber": 226
		            },
		            {
		                "id": "FIXME_227",
		                "text": "// CFK write this list",
		                "type": "label",
		                "options": null,
		                "lineNumber": 227
		            },
		            {
		                "id": "FIXME_229",
		                "text": "// note that the story eliciting questions don't need a lot of",
		                "type": "label",
		                "options": null,
		                "lineNumber": 229
		            },
		            {
		                "id": "FIXME_230",
		                "text": "// extra info - they are just text strings, because all",
		                "type": "label",
		                "options": null,
		                "lineNumber": 230
		            },
		            {
		                "id": "FIXME_231",
		                "text": "// story eliciting questions are of one type",
		                "type": "label",
		                "options": null,
		                "lineNumber": 231
		            },
		            {
		                "id": "FIXME_233",
		                "text": "// template questions in separate file?",
		                "type": "label",
		                "options": null,
		                "lineNumber": 233
		            }
		        ]
		    },
		    {
		        "id": "FIXME_235",
		        "name": "Write questions about stories - write questions (question list, recommendations, copy from templates, review project aspects and story elements, reorder questions in list)",
		        "lineNumber": 235,
		        "description": "(already have prototype of this)\n",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "FIXME_237",
		                "text": "// need templates file for this",
		                "type": "label",
		                "options": null,
		                "lineNumber": 237
		            }
		        ]
		    },
		    {
		        "id": "FIXME_239",
		        "name": "Write questions about people - write questions (question list, recommendations, copy from templates, review project aspects and story elements, reorder questions in list)",
		        "lineNumber": 239,
		        "description": "(same structure as previous page, just calling up different data)\n",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "FIXME_241",
		                "text": "// need templates file for this",
		                "type": "label",
		                "options": null,
		                "lineNumber": 241
		            }
		        ]
		    },
		    {
		        "id": "FIXME_243",
		        "name": "Design question form - add more elements to form than questions (add intro, disclaimers, help info, etc)",
		        "lineNumber": 243,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "FIXME_245",
		                "text": "Please enter a title for the form.",
		                "type": "text",
		                "lineNumber": 245
		            },
		            {
		                "id": "FIXME_246",
		                "text": "Please enter an introduction to be shown at the start of the form, after the title",
		                "type": "textarea",
		                "lineNumber": 246
		            },
		            {
		                "id": "FIXME_247",
		                "text": "Please enter any text to be shown at the end of the form",
		                "type": "textarea",
		                "lineNumber": 247
		            }
		        ]
		    },
		    {
		        "id": "FIXME_249",
		        "name": "Commit question forms - review and print forms to hand out in story sessions or use in interviews, or give out URL",
		        "lineNumber": 249,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "FIXME_251",
		                "text": "// buttons: [Finalize form] [Copy form URL] [Print forms]",
		                "type": "label",
		                "options": null,
		                "lineNumber": 251
		            },
		            {
		                "id": "FIXME_252",
		                "text": "// buttons 2 and 3 are disabled until button 1 is clicked",
		                "type": "label",
		                "options": null,
		                "lineNumber": 252
		            },
		            {
		                "id": "FIXME_253",
		                "text": "// and there should be a confirm dialog",
		                "type": "label",
		                "options": null,
		                "lineNumber": 253
		            },
		            {
		                "id": "FIXME_254",
		                "text": "// once form is finalized quetsions cannot be changed - unless for typos - how to do that?",
		                "type": "label",
		                "options": null,
		                "lineNumber": 254
		            },
		            {
		                "id": "FIXME_255",
		                "text": "// should they be able to fix typos? how to keep them from invalidating data?",
		                "type": "label",
		                "options": null,
		                "lineNumber": 255
		            }
		        ]
		    },
		    {
		        "id": "FIXME_257",
		        "name": "Design story collection sessions - same as for sensemaign sessions only different",
		        "lineNumber": 257,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "FIXME_259",
		                "text": "// recommendations table based on descriptions of groups in planning",
		                "type": "label",
		                "options": null,
		                "lineNumber": 259
		            },
		            {
		                "id": "FIXME_261",
		                "text": "// list of sessions with \"add\" button",
		                "type": "label",
		                "options": null,
		                "lineNumber": 261
		            },
		            {
		                "id": "FIXME_262",
		                "text": "// for each session added:",
		                "type": "label",
		                "options": null,
		                "lineNumber": 262
		            },
		            {
		                "id": "FIXME_263",
		                "text": "How long will this session be?",
		                "type": "text",
		                "lineNumber": 263
		            },
		            {
		                "id": "FIXME_264",
		                "text": "When will it take place?",
		                "type": "text",
		                "lineNumber": 264
		            },
		            {
		                "id": "FIXME_265",
		                "text": "Where will it take place?",
		                "type": "text",
		                "lineNumber": 265
		            },
		            {
		                "id": "FIXME_266",
		                "text": "How many people will be invited to this session?",
		                "type": "text",
		                "lineNumber": 266
		            },
		            {
		                "id": "FIXME_267",
		                "text": "From which participant group(s) will people be invited? (one or more) (drop down)",
		                "lineNumber": 267
		            },
		            {
		                "id": "FIXME_268",
		                "text": "What materials will need to be made available?",
		                "type": "textarea",
		                "lineNumber": 268
		            },
		            {
		                "id": "FIXME_269",
		                "text": "Enter other details about this session.",
		                "type": "textarea",
		                "lineNumber": 269
		            }
		        ]
		    },
		    {
		        "id": "FIXME_271",
		        "name": "Write session agenda(s) - choose activities, rearrange (list of activities, copy from templates, rearrange, describe)",
		        "lineNumber": 271,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "FIXME_273",
		                "text": "// for each session in list",
		                "type": "label",
		                "options": null,
		                "lineNumber": 273
		            },
		            {
		                "id": "FIXME_274",
		                "text": "// list of activities with \"add\" button",
		                "type": "label",
		                "options": null,
		                "lineNumber": 274
		            },
		            {
		                "id": "FIXME_275",
		                "text": "// for each activity added:",
		                "type": "label",
		                "options": null,
		                "lineNumber": 275
		            },
		            {
		                "id": "FIXME_276",
		                "text": "Choose type of (drop down)\n- ice breaker\n- sharing stories (no exercise)\n- sharing stories with task\n- discussion of stories/patterns\n- exercise: twice-told stories\n- exercise: timelines\n- exercise: landscapes\n- other",
		                "lineNumber": 276
		            },
		            {
		                "id": "FIXME_285",
		                "text": "How long will this activity take?",
		                "type": "text",
		                "lineNumber": 285
		            },
		            {
		                "id": "FIXME_286",
		                "text": "What materials will be provided for this activity?",
		                "type": "textarea",
		                "lineNumber": 286
		            },
		            {
		                "id": "FIXME_287",
		                "text": "What spaces will be used for this activity?",
		                "type": "textarea",
		                "lineNumber": 287
		            },
		            {
		                "id": "FIXME_288",
		                "text": "Describe activity plan",
		                "type": "textarea",
		                "lineNumber": 288
		            },
		            {
		                "id": "FIXME_289",
		                "text": "Describe optional elaborations you might or might not use",
		                "type": "textarea",
		                "lineNumber": 289
		            },
		            {
		                "id": "FIXME_291",
		                "text": "// ability to move activities up and down in list",
		                "type": "label",
		                "options": null,
		                "lineNumber": 291
		            },
		            {
		                "id": "FIXME_292",
		                "text": "// button to print session agenda (simply) for facilitators",
		                "type": "label",
		                "options": null,
		                "lineNumber": 292
		            }
		        ]
		    },
		    {
		        "id": "FIXME_294",
		        "name": "Read collection design report - text with summary of venues and questions",
		        "lineNumber": 294,
		        "description": "",
		        "isHeader": false,
		        "questions": []
		    },
		    {
		        "id": "FIXME_296",
		        "name": "Collection process - checklist",
		        "lineNumber": 296,
		        "description": "Online story collection is [ ] enabled\nNumber of stories entered - x\nNumber of participants who told stories - x\n",
		        "isHeader": true,
		        "questions": []
		    },
		    {
		        "id": "FIXME_301",
		        "name": "Start story collection - make URL live",
		        "lineNumber": 301,
		        "description": "(just a button)\n",
		        "isHeader": false,
		        "questions": []
		    },
		    {
		        "id": "FIXME_304",
		        "name": "Enter stories - enter stories (show list of stories with add story button; if collecting stories over web participants will see only the \"add story\" window)",
		        "lineNumber": 304,
		        "description": "(already have this)\n",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "FIXME_306",
		                "text": "// note: need way to show \"menu\" of eliciting questions, participants can choose which question to answer (this choice gets recorded and stored with data)",
		                "type": "label",
		                "options": null,
		                "lineNumber": 306
		            }
		        ]
		    },
		    {
		        "id": "FIXME_308",
		        "name": "Review incoming stories - general story browser without catalysis functions",
		        "lineNumber": 308,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "FIXME_309",
		                "text": "// smalltalk like with answers to questions",
		                "type": "label",
		                "options": null,
		                "lineNumber": 309
		            }
		        ]
		    },
		    {
		        "id": "FIXME_311",
		        "name": "Stop story collection - stop URL working",
		        "lineNumber": 311,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "FIXME_312",
		                "text": "// just a button",
		                "type": "label",
		                "options": null,
		                "lineNumber": 312
		            }
		        ]
		    },
		    {
		        "id": "FIXME_314",
		        "name": "Read collection process report - text with summary of how many stories collected etc",
		        "lineNumber": 314,
		        "description": "",
		        "isHeader": false,
		        "questions": []
		    },
		    {
		        "id": "FIXME_316",
		        "name": "Catalysis - checklist",
		        "lineNumber": 316,
		        "description": "Observations - x\nInterpretations - x\nIdeas - x\nPerspectives - x\n",
		        "isHeader": true,
		        "questions": []
		    },
		    {
		        "id": "FIXME_322",
		        "name": "Add observations about stories - story browser (smalltalk-like browser with question answers; \"add observation\" button)",
		        "lineNumber": 322,
		        "description": "",
		        "isHeader": false,
		        "questions": []
		    },
		    {
		        "id": "FIXME_323",
		        "name": "Add observations about graphs - graph browser (pairwise comparison graph browser; \"add observation\" button)",
		        "lineNumber": 323,
		        "description": "",
		        "isHeader": false,
		        "questions": []
		    },
		    {
		        "id": "FIXME_324",
		        "name": "Add observations about trends - top trends list (most significant statistical differences; \"add observation\" button creates observation with image/text)",
		        "lineNumber": 324,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "FIXME_326",
		                "text": "// when click \"add observation\" get popup where they enter title and text to go with saved result",
		                "type": "label",
		                "options": null,
		                "lineNumber": 326
		            },
		            {
		                "id": "FIXME_327",
		                "text": "// \"add excerpt\" button - add selected text to list of excerpts",
		                "type": "label",
		                "options": null,
		                "lineNumber": 327
		            },
		            {
		                "id": "FIXME_329",
		                "text": "// maybe transition this to one tab with three sub-tabs (on top) later",
		                "type": "label",
		                "options": null,
		                "lineNumber": 329
		            },
		            {
		                "id": "FIXME_330",
		                "text": "// no questions in this part",
		                "type": "label",
		                "options": null,
		                "lineNumber": 330
		            },
		            {
		                "id": "FIXME_332",
		                "text": "// it should be possible to add more than one result to an observation,",
		                "type": "label",
		                "options": null,
		                "lineNumber": 332
		            },
		            {
		                "id": "FIXME_333",
		                "text": "// so when they click \"add observation\" they should choose between an existing one (in a list) and a new one)",
		                "type": "label",
		                "options": null,
		                "lineNumber": 333
		            }
		        ]
		    },
		    {
		        "id": "FIXME_335",
		        "name": "Interpret observations - edit observations in list (\"edit\" each to open form with title, text, interpretations (2 or more), example stories or excerpts, graph result (from \"add obs\" button))",
		        "lineNumber": 335,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "FIXME_337",
		                "text": "Observation name",
		                "type": "text",
		                "lineNumber": 337
		            },
		            {
		                "id": "FIXME_338",
		                "text": "Observation",
		                "type": "textarea",
		                "lineNumber": 338
		            },
		            {
		                "id": "FIXME_339",
		                "text": "Result(s) - saved info from thing they clicked on",
		                "lineNumber": 339
		            },
		            {
		                "id": "FIXME_341",
		                "text": "First interpretation name",
		                "type": "text",
		                "lineNumber": 341
		            },
		            {
		                "id": "FIXME_342",
		                "text": "First interpretation text",
		                "type": "textarea",
		                "lineNumber": 342
		            },
		            {
		                "id": "FIXME_343",
		                "text": "Stories or excerpts for first interpretation",
		                "type": "textarea",
		                "lineNumber": 343
		            },
		            {
		                "id": "FIXME_344",
		                "text": "First idea",
		                "type": "textarea",
		                "lineNumber": 344
		            },
		            {
		                "id": "FIXME_346",
		                "text": "Opposing interpretation name",
		                "lineNumber": 346
		            },
		            {
		                "id": "FIXME_347",
		                "text": "Opposing interpretation",
		                "type": "textarea",
		                "lineNumber": 347
		            },
		            {
		                "id": "FIXME_348",
		                "text": "Stories or excerpts for opposing interpretation",
		                "type": "textarea",
		                "lineNumber": 348
		            },
		            {
		                "id": "FIXME_349",
		                "text": "Oppposing idea",
		                "type": "textarea",
		                "lineNumber": 349
		            }
		        ]
		    },
		    {
		        "id": "FIXME_351",
		        "name": "Cluster interpretations - list of interps, cluster (space or grid, drag interps together, name groups)",
		        "lineNumber": 351,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "FIXME_352",
		                "text": "// some kind of \"are you really ready to cluster\" confirmation before they do this, because adding new interps afterward will mess up clustering",
		                "type": "label",
		                "options": null,
		                "lineNumber": 352
		            },
		            {
		                "id": "FIXME_353",
		                "text": "// no questions here",
		                "type": "label",
		                "options": null,
		                "lineNumber": 353
		            },
		            {
		                "id": "FIXME_354",
		                "text": "// (if this works well we could copy it for the story elements",
		                "type": "label",
		                "options": null,
		                "lineNumber": 354
		            },
		            {
		                "id": "FIXME_355",
		                "text": "// exercise in the planning stage...)",
		                "type": "label",
		                "options": null,
		                "lineNumber": 355
		            }
		        ]
		    },
		    {
		        "id": "FIXME_357",
		        "name": "Read catalysis report - text with clustered interpretations and all info for them (including pictures)",
		        "lineNumber": 357,
		        "description": "",
		        "isHeader": false,
		        "questions": []
		    },
		    {
		        "id": "FIXME_359",
		        "name": "Sensemaking - checklist",
		        "lineNumber": 359,
		        "description": "",
		        "isHeader": true,
		        "questions": [
		            {
		                "id": "FIXME_360",
		                "text": "//Planning sessions - x of x questions answered",
		                "type": "label",
		                "options": null,
		                "lineNumber": 360
		            },
		            {
		                "id": "FIXME_361",
		                "text": "//Write session agenda - x of x questions answered",
		                "type": "label",
		                "options": null,
		                "lineNumber": 361
		            },
		            {
		                "id": "FIXME_362",
		                "text": "//Print story cards - x cards printed (or checkmark)",
		                "type": "label",
		                "options": null,
		                "lineNumber": 362
		            },
		            {
		                "id": "FIXME_363",
		                "text": "//Post-session review - x of x questions answered",
		                "type": "label",
		                "options": null,
		                "lineNumber": 363
		            }
		        ]
		    },
		    {
		        "id": "FIXME_365",
		        "name": "Plan sensemaking sessions - answer questions about how many, when, etc (with recommendations)",
		        "lineNumber": 365,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "FIXME_367",
		                "text": "// recommendations table based on descriptions of groups in planning",
		                "type": "label",
		                "options": null,
		                "lineNumber": 367
		            },
		            {
		                "id": "FIXME_369",
		                "text": "// list of sessions with \"add\" button",
		                "type": "label",
		                "options": null,
		                "lineNumber": 369
		            },
		            {
		                "id": "FIXME_370",
		                "text": "// for each session added:",
		                "type": "label",
		                "options": null,
		                "lineNumber": 370
		            },
		            {
		                "id": "FIXME_371",
		                "text": "How long will this session be?",
		                "type": "text",
		                "lineNumber": 371
		            },
		            {
		                "id": "FIXME_372",
		                "text": "When will it take place?",
		                "type": "text",
		                "lineNumber": 372
		            },
		            {
		                "id": "FIXME_373",
		                "text": "Where will it take place?",
		                "type": "text",
		                "lineNumber": 373
		            },
		            {
		                "id": "FIXME_374",
		                "text": "How many people will be invited to this session?",
		                "type": "text",
		                "lineNumber": 374
		            },
		            {
		                "id": "FIXME_375",
		                "text": "From which participant group(s) will people be invited? (one or more) (drop down)",
		                "lineNumber": 375
		            },
		            {
		                "id": "FIXME_376",
		                "text": "What materials will need to be made available?",
		                "type": "textarea",
		                "lineNumber": 376
		            },
		            {
		                "id": "FIXME_377",
		                "text": "Enter other details about this session.",
		                "type": "textarea",
		                "lineNumber": 377
		            }
		        ]
		    },
		    {
		        "id": "FIXME_379",
		        "name": "Write session agenda(s) - choose activities, rearrange (list of activities, copy from templates, rearrange, describe)",
		        "lineNumber": 379,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "FIXME_381",
		                "text": "// for each session in list",
		                "type": "label",
		                "options": null,
		                "lineNumber": 381
		            },
		            {
		                "id": "FIXME_382",
		                "text": "// list of activities with \"add\" button",
		                "type": "label",
		                "options": null,
		                "lineNumber": 382
		            },
		            {
		                "id": "FIXME_383",
		                "text": "// for each activity added:",
		                "type": "label",
		                "options": null,
		                "lineNumber": 383
		            },
		            {
		                "id": "FIXME_384",
		                "text": "Choose type of (drop down)\n- ice breaker\n- encountering stories (no exercise)\n- encountering stories with task\n- exploring patterns in story cards\n- discussion of stories/patterns\n- exercise: twice-told stories\n- exercise: timelines\n- exercise: landscapes\n- exercise: story elements\n- exercise: composite stories\n- list making\n- wrap-up\n- other",
		                "lineNumber": 384
		            },
		            {
		                "id": "FIXME_398",
		                "text": "How long will this activity take?",
		                "type": "text",
		                "lineNumber": 398
		            },
		            {
		                "id": "FIXME_399",
		                "text": "What materials will be provided for this activity?",
		                "type": "textarea",
		                "lineNumber": 399
		            },
		            {
		                "id": "FIXME_400",
		                "text": "What spaces will be used for this activity?",
		                "type": "textarea",
		                "lineNumber": 400
		            },
		            {
		                "id": "FIXME_401",
		                "text": "Describe activity plan",
		                "type": "textarea",
		                "lineNumber": 401
		            },
		            {
		                "id": "FIXME_402",
		                "text": "Describe optional elaborations you might or might not use",
		                "type": "textarea",
		                "lineNumber": 402
		            },
		            {
		                "id": "FIXME_404",
		                "text": "// ability to move activities up and down in list",
		                "type": "label",
		                "options": null,
		                "lineNumber": 404
		            },
		            {
		                "id": "FIXME_405",
		                "text": "// button to print session agenda (simply) for facilitators",
		                "type": "label",
		                "options": null,
		                "lineNumber": 405
		            },
		            {
		                "id": "FIXME_406",
		                "text": "// button to print story cards - choose how many per page, etc",
		                "type": "label",
		                "options": null,
		                "lineNumber": 406
		            },
		            {
		                "id": "FIXME_408",
		                "text": "// session 1 - friday 2 pm",
		                "type": "label",
		                "options": null,
		                "lineNumber": 408
		            },
		            {
		                "id": "FIXME_409",
		                "text": "//      activity 1 - ice breaker",
		                "type": "label",
		                "options": null,
		                "lineNumber": 409
		            },
		            {
		                "id": "FIXME_410",
		                "text": "//      activity 2 - encounter stories",
		                "type": "label",
		                "options": null,
		                "lineNumber": 410
		            },
		            {
		                "id": "FIXME_411",
		                "text": "// session 2 - monday 2 pm",
		                "type": "label",
		                "options": null,
		                "lineNumber": 411
		            },
		            {
		                "id": "FIXME_412",
		                "text": "//      activity 1 - encounter stories",
		                "type": "label",
		                "options": null,
		                "lineNumber": 412
		            },
		            {
		                "id": "FIXME_413",
		                "text": "//      activity 2 - twice told stories",
		                "type": "label",
		                "options": null,
		                "lineNumber": 413
		            }
		        ]
		    },
		    {
		        "id": "FIXME_415",
		        "name": "Enter session records - add pictures, audio, video, transcripts, lists of things people ended up with, pivot/voice/discovery stories",
		        "lineNumber": 415,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "FIXME_417",
		                "text": "// this is per session",
		                "type": "label",
		                "options": null,
		                "lineNumber": 417
		            },
		            {
		                "id": "FIXME_419",
		                "text": "Enter any lists of outcomes people arrived at during this session.",
		                "lineNumber": 419
		            },
		            {
		                "id": "FIXME_420",
		                "text": "// list with 'add\" button",
		                "type": "label",
		                "options": null,
		                "lineNumber": 420
		            },
		            {
		                "id": "FIXME_421",
		                "text": "// pg 375 in book",
		                "type": "label",
		                "options": null,
		                "lineNumber": 421
		            },
		            {
		                "id": "FIXME_422",
		                "text": "// for each outcome, title, type and text (not complicated)",
		                "type": "label",
		                "options": null,
		                "lineNumber": 422
		            },
		            {
		                "id": "FIXME_423",
		                "text": "// types are:\n- discovery\n- opportunity\n- issue\n- idea\n- recommendation\n- perspective\n- dilemma",
		                "type": "label",
		                "options": null,
		                "lineNumber": 423
		            },
		            {
		                "id": "FIXME_432",
		                "text": "Enter any summaries prepared by session participants",
		                "lineNumber": 432
		            },
		            {
		                "id": "FIXME_433",
		                "text": "// text, audio, image, video",
		                "type": "label",
		                "options": null,
		                "lineNumber": 433
		            },
		            {
		                "id": "FIXME_434",
		                "text": "// how to connect audio/video to content? link to it?",
		                "type": "label",
		                "options": null,
		                "lineNumber": 434
		            },
		            {
		                "id": "FIXME_435",
		                "text": "// if we host it, how much can people upload? how long will we keep it around?",
		                "type": "label",
		                "options": null,
		                "lineNumber": 435
		            },
		            {
		                "id": "FIXME_436",
		                "text": "// limits on number and size of images",
		                "type": "label",
		                "options": null,
		                "lineNumber": 436
		            },
		            {
		                "id": "FIXME_438",
		                "text": "Describe any constructions created during the session.",
		                "lineNumber": 438
		            },
		            {
		                "id": "FIXME_439",
		                "text": "// text, audio, image, video",
		                "type": "label",
		                "options": null,
		                "lineNumber": 439
		            },
		            {
		                "id": "FIXME_441",
		                "text": "Enter any notes you took during the session",
		                "lineNumber": 441
		            },
		            {
		                "id": "FIXME_442",
		                "text": "// textarea but could be audio or video or image also",
		                "type": "label",
		                "options": null,
		                "lineNumber": 442
		            },
		            {
		                "id": "FIXME_444",
		                "text": "Enter any additional info about the session",
		                "lineNumber": 444
		            },
		            {
		                "id": "FIXME_445",
		                "text": "// could be anything",
		                "type": "label",
		                "options": null,
		                "lineNumber": 445
		            }
		        ]
		    },
		    {
		        "id": "FIXME_447",
		        "name": "Answer questions about sessions - bunch of questions about what happened (all textareas, can be multiple for multiple sessions)",
		        "lineNumber": 447,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "FIXME_449",
		                "text": "// for each session in list, click \"review\" or something button\n@@Change",
		                "type": "label",
		                "options": null,
		                "lineNumber": 449
		            },
		            {
		                "id": "FIXME_453",
		                "text": "How did the behavior of the participants change from the start to the end of the session?",
		                "type": "textarea",
		                "lineNumber": 453
		            },
		            {
		                "id": "FIXME_454",
		                "text": "How did their emotions change?",
		                "type": "textarea",
		                "lineNumber": 454
		            },
		            {
		                "id": "FIXME_455",
		                "text": "How did your emotions change?\n@@Interactions",
		                "type": "textarea",
		                "lineNumber": 455
		            },
		            {
		                "id": "FIXME_459",
		                "text": "Describe the interactions between participants (including changes during the session).",
		                "type": "textarea",
		                "lineNumber": 459
		            },
		            {
		                "id": "FIXME_460",
		                "text": "Describe interactions between participants and facilitators (including change).\n@@Stories",
		                "type": "textarea",
		                "lineNumber": 460
		            },
		            {
		                "id": "FIXME_464",
		                "text": "What did you notice about the stories people told, retold, chose, worked with, and built during the session?\n@@Context",
		                "type": "textarea",
		                "lineNumber": 464
		            },
		            {
		                "id": "FIXME_468",
		                "text": "What is the story of what happened during this session?",
		                "type": "textarea",
		                "lineNumber": 468
		            },
		            {
		                "id": "FIXME_469",
		                "text": "What was special about these people in this place on this day?\n@@Methods",
		                "type": "textarea",
		                "lineNumber": 469
		            },
		            {
		                "id": "FIXME_473",
		                "text": "What parts of your plans went as you expected? WHat parts didn't?",
		                "type": "textarea",
		                "lineNumber": 473
		            },
		            {
		                "id": "FIXME_474",
		                "text": "What parts of your plans worked out well? WHat parts didn't work out well?",
		                "type": "textarea",
		                "lineNumber": 474
		            },
		            {
		                "id": "FIXME_475",
		                "text": "What new ideas did you gain from the participants in this session?\n@@Project",
		                "type": "textarea",
		                "lineNumber": 475
		            },
		            {
		                "id": "FIXME_479",
		                "text": "How has the project changed as a result of this session?\n@@Summary",
		                "type": "textarea",
		                "lineNumber": 479
		            },
		            {
		                "id": "FIXME_483",
		                "text": "What do you want most to remember about this session?",
		                "type": "textarea",
		                "lineNumber": 483
		            }
		        ]
		    },
		    {
		        "id": "FIXME_485",
		        "name": "Read sensemaking report - text with all stuff entered",
		        "lineNumber": 485,
		        "description": "",
		        "isHeader": false,
		        "questions": []
		    },
		    {
		        "id": "FIXME_487",
		        "name": "Intervention - checklist",
		        "lineNumber": 487,
		        "description": "Choose interventions - x planned\nAnswer questions about interventions - x questions answered\n",
		        "isHeader": true,
		        "questions": []
		    },
		    {
		        "id": "FIXME_491",
		        "name": "Choose interventions - answer questions about which interventions to use",
		        "lineNumber": 491,
		        "description": "",
		        "isHeader": false,
		        "questions": [
		            {
		                "id": "FIXME_493",
		                "text": "// recommendations based on groups in planning",
		                "type": "label",
		                "options": null,
		                "lineNumber": 493
		            },
		            {
		                "id": "FIXME_495",
		                "text": "// questions help to choose interventions",
		                "type": "label",
		                "options": null,
		                "lineNumber": 495
		            },
		            {
		                "id": "FIXME_496",
		                "text": "// cfk stopped here",
		                "type": "label",
		                "options": null,
		                "lineNumber": 496
		            }
		        ]
		    },
		    {
		        "id": "FIXME_498",
		        "name": "Answer questions about interventions - answer questions about interventions used",
		        "lineNumber": 498,
		        "description": "",
		        "isHeader": false,
		        "questions": []
		    },
		    {
		        "id": "FIXME_499",
		        "name": "Read intervention report - text with all stuff entered",
		        "lineNumber": 499,
		        "description": "",
		        "isHeader": false,
		        "questions": []
		    },
		    {
		        "id": "FIXME_501",
		        "name": "Return - checklist",
		        "lineNumber": 501,
		        "description": "",
		        "isHeader": true,
		        "questions": []
		    },
		    {
		        "id": "FIXME_503",
		        "name": "Gather feedback - enter what people said (mostly textareas)",
		        "lineNumber": 503,
		        "description": "",
		        "isHeader": false,
		        "questions": []
		    },
		    {
		        "id": "FIXME_504",
		        "name": "Answer questions about project - answer questions about project (mostly textareas)",
		        "lineNumber": 504,
		        "description": "",
		        "isHeader": false,
		        "questions": []
		    },
		    {
		        "id": "FIXME_505",
		        "name": "Prepare project presentation - enter things you want to tell people about project (to be shown to steering committee)",
		        "lineNumber": 505,
		        "description": "",
		        "isHeader": false,
		        "questions": []
		    },
		    {
		        "id": "FIXME_506",
		        "name": "Read return report - text with all stuff entered",
		        "lineNumber": 506,
		        "description": "",
		        "isHeader": false,
		        "questions": []
		    },
		    {
		        "id": "FIXME_508",
		        "name": "Project report - text summary (everything in the six stage reports appended)",
		        "lineNumber": 508,
		        "description": "",
		        "isHeader": true,
		        "questions": []
		    }
		]
);