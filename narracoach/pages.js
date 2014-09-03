"use strict";
define(
[
    {
        "id": "page_dashboard",
        "name": "Dashboard",
        "description": "",
        "isHeader": true,
        "questions": [
            {
                "id": "COMMENT_page_dashboard_1",
                "text": "// all checklists combined",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_dashboard_2",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_dashboard_3",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_dashboard_4",
                "text": "//                                                       PLANNING",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_dashboard_5",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_dashboard_6",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null
            }
        ]
    },
    {
        "id": "page_planning",
        "name": "Planning",
        "description": "",
        "isHeader": true,
        "questions": [
            {
                "id": "COMMENT_page_planning_1",
                "text": "// Project facts - x of x questions answered",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_planning_2",
                "text": "// Planning questions - [ ] draft",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_planning_3",
                "text": "// Project aspects - x of x questions answered",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_planning_4",
                "text": "// Project stories - x stories told",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_planning_5",
                "text": "// Project story elements - x elements entered",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_planning_6",
                "text": "// Story sharing assessment - x of 20 questions answered",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_planning_7",
                "text": "// Project synopsis - [ ] complete",
                "type": "label",
                "options": null
            }
        ]
    },
    {
        "id": "page_projectFacts",
        "name": "Enter project facts",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "projectFacts",
                "text": "On this page you will enter some facts about your project. The things you enter here will appear in your reports.",
                "type": "label"
            },
            {
                "id": "projectTitle",
                "text": "What is the project's title?",
                "type": "text"
            },
            {
                "id": "communityOrOrganizationName",
                "text": "What is the name of your community or organization?",
                "type": "text"
            },
            {
                "id": "projectFacilitators",
                "text": "Who is facilitating the project? (names and titles)",
                "type": "text"
            },
            {
                "id": "projectStartAndEndDates",
                "text": "What are the project's start and ending dates?",
                "type": "text"
            },
            {
                "id": "reportStartText",
                "text": "Please enter any other information you want to appear at the top of project reports.",
                "type": "textarea"
            },
            {
                "id": "reportEndText",
                "text": "Please enter any other information you want to appear at the bottom of project reports (as notes).",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "page_planningQuestionsDraft",
        "name": "Answer PNI Planning questions",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "planning_draft",
                "text": "On this page you will answer some questions about your project's goals, relationships, focus, range, scope, and emphasis.\nIf you don't have good answers for these questions right now, don't worry; you will have a chance to come back and work on these answers again later.",
                "type": "label"
            },
            {
                "id": "planning_draft_goal",
                "text": "What is the goal of the project? Why are you doing it?",
                "type": "textarea"
            },
            {
                "id": "planning_draft_relationships",
                "text": "What relationships are important to the project?",
                "type": "textarea"
            },
            {
                "id": "planning_draft_focus",
                "text": "What is the focus of the project? What is it about?",
                "type": "textarea"
            },
            {
                "id": "planning_draft_range",
                "text": "What range(s) of experience will the project cover?",
                "type": "textarea"
            },
            {
                "id": "planning_draft_scope",
                "text": "What is the project's scope? (number of people, number of stories, number of questions about stories)",
                "type": "textarea"
            },
            {
                "id": "planning_draft_emphasis",
                "text": "Which phases of PNI will be important to the project? (indicate most and least important phases)",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "page_participantGroups",
        "name": "Describe participant groups",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "aboutParticipantGroups",
                "text": "On this page you will think about groups of participants you want to involve in your project.\nExamples might be: doctors and patients; staff and customers; natives, immigrants, and tourists.\nNarraCoach supports planning for up to three groups of project participants.",
                "type": "label"
            },
            {
                "id": "participants_firstGroupName",
                "text": "Please name the group of participants from whom the project most needs to hear.",
                "type": "text"
            },
            {
                "id": "participants_firstGroupDescription",
                "text": "Please describe this group of participants.\nFor example, you might want to record any observations you have made about this group.\nWhat do you know about them?",
                "type": "textarea"
            },
            {
                "id": "participants_secondGroupName",
                "text": "Please name the group of participants from whom the project needs to hear next.",
                "type": "text"
            },
            {
                "id": "participants_secondGroupDescription",
                "text": "Please describe the second-most critical group of participants.",
                "type": "textarea"
            },
            {
                "id": "participants_thirdGroupName",
                "text": "If there is a third group of participants from whom the project needs to hear, please name them.",
                "type": "text"
            },
            {
                "id": "participants_thirdGroupDescription",
                "text": "Please describe the third-most critical group of participants.",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "page_projectAspects",
        "name": "Consider project aspects",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "aspectsTable",
                "text": "Please answer these questions about each participant group.",
                "type": "page_aspectsTable",
                "options": "participants_firstGroupName;participants_secondGroupName;participants_thirdGroupName"
            }
        ]
    },
    {
        "id": "page_aspectsTable",
        "name": "Project aspects",
        "description": "",
        "isHeader": false,
        "type": "questionsTable",
        "questions": [
            {
                "id": "aspects_statusHeader",
                "text": "Status",
                "type": "header"
            },
            {
                "id": "aspects_status",
                "text": "What is the status of these participants in the community or organization?",
                "type": "select",
                "options": "unknown;very low;low;moderate;high;very high;mixed"
            },
            {
                "id": "aspects_confidence",
                "text": "How much self-confidence do these participants have?",
                "type": "select",
                "options": "unknown;very low;low;medium;high;very high;mixed"
            },
            {
                "id": "aspects_abilityHeader",
                "text": "Ability",
                "type": "header"
            },
            {
                "id": "aspects_time",
                "text": "How much free time do these participants have?",
                "type": "select",
                "options": "unknown;very little;little;some;a lot;mixed"
            },
            {
                "id": "aspects_education",
                "text": "What is the education level of these participants?",
                "type": "select",
                "options": "unknown;illiterate;minimal;moderate;high;very high;mixed"
            },
            {
                "id": "aspects_physicalDisabilities",
                "text": "Do these participants have physical limitations that will impact their participation?",
                "type": "select",
                "options": "unknown;none;minimal;moderate;strong;mixed"
            },
            {
                "id": "aspects_emotionalImpairments",
                "text": "Do these participants have emotional impairments that will impact their participation (such as mental illness or traumatic stress)?",
                "type": "select",
                "options": "unknown;none;minimal;moderate;strong;mixed"
            },
            {
                "id": "aspects_expectationsHeader",
                "text": "Expectations",
                "type": "header"
            },
            {
                "id": "aspects_performing",
                "text": "For these participants, how important is performing well (with \"high marks\")?",
                "type": "select",
                "options": "unknown;very unimportant;somewhat unimportant;somewhat important;very important;mixed"
            },
            {
                "id": "aspects_conforming",
                "text": "For these participants, how important is conforming (to what is \"normal\" or expected)?",
                "type": "select",
                "options": "unknown;very unimportant;somewhat unimportant;somewhat important;very important;mixed"
            },
            {
                "id": "aspects_promoting",
                "text": "For these participants, how important is self-promotion (competing with others)?",
                "type": "select",
                "options": "unknown;very unimportant;somewhat unimportant;somewhat important;very important;mixed"
            },
            {
                "id": "aspects_venting",
                "text": "For these participants, how important is speaking out (having a say, venting, sounding off)?",
                "type": "select",
                "options": "unknown;very unimportant;somewhat unimportant;somewhat important;very important;mixed"
            },
            {
                "id": "aspects_feelingsHeader",
                "text": "Feelings about the project",
                "type": "header"
            },
            {
                "id": "aspects_interest",
                "text": "How motivated are these participants to participate in the project?",
                "type": "select",
                "options": "unknown;very little;a little;some;a lot;extremely;mixed"
            },
            {
                "id": "aspects_feelings_project",
                "text": "How are these participants likely to feel about the project?",
                "type": "select",
                "options": "unknown;negative;neutral;positive;mixed"
            },
            {
                "id": "aspects_feelings_facilitator",
                "text": "How do these participants feel about you?",
                "type": "select",
                "options": "unknown;negative;neutral;positive;mixed"
            },
            {
                "id": "aspects_feelings_stories",
                "text": "How do these participants feel about the idea of collecting stories?",
                "type": "select",
                "options": "unknown;negative;neutral;positive;mixed"
            },
            {
                "id": "aspects_topicHeader",
                "text": "Feelings about the topic",
                "type": "header"
            },
            {
                "id": "aspects_topic_feeling",
                "text": "What experiences have these participants had with the project's topic?",
                "type": "select",
                "options": "unknown;strongly negative;negative;neutral;positive;strongly positive;mixed"
            },
            {
                "id": "aspects_topic_private",
                "text": "How private do these participants consider the topic to be?",
                "type": "select",
                "options": "unknown;very private;medium;not private;mixed"
            },
            {
                "id": "aspects_topic_articulate",
                "text": "How hard will it be for these participants to articulate their feelings about the topic?",
                "type": "select",
                "options": "unknown;hard;medium;easy;mixed"
            },
            {
                "id": "aspects_topic_timeframe",
                "text": "How long of a time period do you need these participants to look back on?",
                "type": "select",
                "options": "unknown;hours;days;months;years;decades;mixed"
            },
            {
                "id": "aspects_youHeader",
                "text": "About you",
                "type": "header"
            },
            {
                "id": "aspects_you_experience",
                "text": "How much experience do you have facilitating PNI projects?",
                "type": "select",
                "options": "none;a little;some;a lot"
            },
            {
                "id": "aspects_you_help",
                "text": "How much help will you have carrying out this project?",
                "type": "select",
                "options": "none;a little;some;a lot"
            },
            {
                "id": "aspects_you_tech",
                "text": "How many technological resources will you have for carrying out this project?",
                "type": "select",
                "options": "none;a little;some;a lot"
            }
        ]
    },
    {
        "id": "page_projectStories",
        "name": "Tell project stories",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "projectStoryList",
                "text": "These are the project stories you have told so far.",
                "type": "grid",
                "options": "page_projectStory"
            }
        ]
    },
    {
        "id": "page_projectStory",
        "name": "Project story",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "projectStory_scenario",
                "text": "Start by choosing a scenario that starts your project story.",
                "shortText": "Scenario",
                "type": "select",
                "options": "ask me anything;magic ears;fly on the wall;project aspects;my own scenario type"
            },
            {
                "id": "projectStory_outcome",
                "text": "Now choose an outcome for your story.",
                "shortText": "Outcome",
                "type": "select",
                "options": "colossal success;miserable failure;acceptable outcome;my own outcome"
            },
            {
                "id": "projectStory_text",
                "text": "Now tell your project story as a future history (as though it has already happened).",
                "shortText": "Story",
                "type": "textarea"
            },
            {
                "id": "projectStory_name",
                "text": "Please name your project story.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "projectStory_feelAbout",
                "text": "How do you feel about this story?",
                "shortText": "Feel about",
                "type": "textarea"
            },
            {
                "id": "projectStory_surprise",
                "text": "What surprised you about this story?",
                "shortText": "Surprised",
                "type": "textarea"
            },
            {
                "id": "projectStory_dangers",
                "text": "Describe any opportunities or dangers you see in this story.",
                "shortText": "Opportunities or dangers",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "page_projectStoryElements",
        "name": "Create project story elements",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "storyElementsInstructions",
                "text": "Here are some instructions on how to create story elements from your project stories.\n<ol>\n<li>Choose one or two types of story element (characters, situations, values, themes, relationships, motivations, beliefs, conflicts).</li>\n<li>For each story, come up with as many answers to that element's question as you can. Write the answers on sticky notes.</li>\n<li>The questions are:</li>\n<ul>\n<li>Characters: Who is doing things in this story?</li>\n<li>Situations: What is going on in this story?</li>\n<li>Values: What matters to the characters in this story?</li>\n<li>Themes: What is this story about?</li>\n<li>Relationships: How are the characters related in this story?</li>\n<li>Motivations: Why do the characters do what they do in this story?</li>\n<li>Beliefs: What do people believe in this story?</li>\n<li>Conflicts: Who or what stands in opposition in this story?</li>\n</ul>\n<li>Once you have answered the question(s) you chose for each story, cluster the sticky notes into groups. Place like with like.</li>\n<li>Give each group of sticky notes a name.</li>\n<li>Clear a \"halo\" of space around each group's name.</li>\n<li>In the halo, write 2-5 good and bad attributes (advantages and disadvantages, opportunities and dangers) of each group of sticky notes.</li>\n<li>Copy or move the new good/bad attributes to a new space. Mix them all together.</li>\n<li>Cluster the attributes into groups.</li>\n<li>Name the groups. These are your story elements.</li>\n</ol>",
                "type": "label"
            },
            {
                "id": "projectStoryElementsList",
                "text": "These are the project story elements you have entered so far.",
                "type": "grid",
                "options": "page_addStoryElement"
            }
        ]
    },
    {
        "id": "page_addStoryElement",
        "name": "Add story element",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "storyElementName",
                "text": "What is the name of the story element?",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "storyElementType",
                "text": "What type of story element is this?",
                "shortText": "Type",
                "type": "select",
                "options": "character;situation;value;theme;relationship;motivation;belief;conflict"
            },
            {
                "id": "storyElementDescription",
                "text": "You can describe it more fully here.",
                "shortText": "Description",
                "type": "textarea"
            },
            {
                "id": "storyElementPhoto",
                "text": "You can enter a photograph of the element here.",
                "shortText": "Image",
                "type": "imageUploader"
            }
        ]
    },
    {
        "id": "page_assessStorySharing",
        "name": "Assess story sharing",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "quiz_intro",
                "text": "On this page you can answer questions about your community or organization to assess its story sharing culture.\nBefore you answer these questions, you should spend some time listening to people share stories together\nin the places where they normally gather.",
                "type": "label"
            },
            {
                "id": "quiz_narrativeFreedom",
                "text": "Narrative freedom",
                "type": "header"
            },
            {
                "id": "quiz_counterStories",
                "text": "As you listened to people talk, how often did you hear a person respond to a story with another story that countered it in some way?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often"
            },
            {
                "id": "quiz_authority",
                "text": "When someone who was obviously in authority was telling stories, how much time and attention did they get?",
                "type": "select",
                "options": "unknown;enthrallment;strong listening;partial listening;nothing special"
            },
            {
                "id": "quiz_mistakes",
                "text": "How many times did you hear people tell stories about mistakes?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often"
            },
            {
                "id": "quiz_silencing",
                "text": "When somebody started telling a story and another person stopped them, how did they stop them?",
                "type": "select",
                "options": "unknown;warning;caution;request;joke"
            },
            {
                "id": "quiz_conflict",
                "text": "When somebody was telling a story and another person disagreed with the storyteller, how did they disagree?",
                "type": "select",
                "options": "unknown;demand;criticism;comment;joke"
            },
            {
                "id": "quiz_narrativeFlow",
                "text": "Narrative flow",
                "type": "header"
            },
            {
                "id": "quiz_remindings",
                "text": "When you listened to people telling stories, did you ever hear people say \"that reminds me of the time\" and then tell a story in response?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often"
            },
            {
                "id": "quiz_retellings",
                "text": "How often did you hear people pass on stories they heard from other people?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often"
            },
            {
                "id": "quiz_folklore",
                "text": "How much evidence did you find for a narrative folklore in your community or organization?",
                "type": "select",
                "options": "unknown;none;little;some;strong"
            },
            {
                "id": "quiz_storyTypes",
                "text": "Did you hear comic stories, tragic stories, epic stories, and funny stories?",
                "type": "select",
                "options": "unknown;no;maybe;I think so;definitely"
            },
            {
                "id": "quiz_sensemaking",
                "text": "Did you ever see people share stories as they prepared to make decisions?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often"
            },
            {
                "id": "quiz_narrativeKnowledge",
                "text": "Narrative knowledge",
                "type": "header"
            },
            {
                "id": "quiz_realStories",
                "text": "Did you see people tell stories that were recountings of events based on emotional experiences from particular perspectives?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often"
            },
            {
                "id": "quiz_negotiations",
                "text": "How lively were the negotiations you heard going on between storytellers and audiences?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often"
            },
            {
                "id": "quiz_cotelling",
                "text": "Did you ever see two or more people tell a story together?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often"
            },
            {
                "id": "quiz_blunders",
                "text": "How often did you see someone start telling the wrong story to the wrong people at the wrong time?",
                "type": "select",
                "options": "unknown;often;sometimes;seldom;never"
            },
            {
                "id": "quiz_accounting",
                "text": "Did you see people account for their actions and choices by telling each other stories?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often"
            },
            {
                "id": "quiz_narrativeUnity",
                "text": "Narrative unity",
                "type": "header"
            },
            {
                "id": "quiz_commonStories",
                "text": "How easy would it be to create a list of stories any member of your community or organization could be expected to know?",
                "type": "select",
                "options": "unknown;impossible;difficult;doable;easy"
            },
            {
                "id": "quiz_sacredStories",
                "text": "How easy would it be to create a list of sacred stories, those important to understanding the community or organization?",
                "type": "select",
                "options": "unknown;impossible;difficult;doable;easy"
            },
            {
                "id": "quiz_condensedStories",
                "text": "How easy would it be to create a list of condensed stories, in the form of proverbs or references?",
                "type": "select",
                "options": "unknown;impossible;difficult;doable;easy"
            },
            {
                "id": "quiz_intermingling",
                "text": "How often were the stories you heard intermingled with each other?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often"
            },
            {
                "id": "quiz_culture",
                "text": "How easy would it be to describe the unique storytelling culture of your community or organization?",
                "type": "select",
                "options": "unknown;impossible;difficult;doable;easy"
            },
            {
                "id": "COMMENT_page_assessStorySharing_1",
                "text": "// should have results overall and for each category of question",
                "type": "label",
                "options": null
            },
            {
                "id": "quiz_result",
                "text": "This is your combined test result.",
                "type": "quizScoreResult"
            },
            {
                "id": "quiz_notes",
                "text": "Here you can record some notes or comments about this assessment.",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "page_revisePNIPlanningQuestions",
        "name": "Revise PNI Planning questions",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "improvePlanningDrafts",
                "text": "Please review and improve your draft answers based on your consideration of project aspects and your project stories.",
                "type": "label"
            },
            {
                "id": "planning_goal",
                "text": "What is the goal of the project? Why are you doing it?",
                "type": "textarea",
                "options": "planning_goal"
            },
            {
                "id": "FIXME_248",
                "text": "What relationships are important to the project?",
                "type": "textarea",
                "options": "planning_relationships"
            },
            {
                "id": "FIXME_249",
                "text": "What is the focus of the project? What is it about?",
                "type": "textarea",
                "options": "planning_focus"
            },
            {
                "id": "FIXME_250",
                "text": "What range(s) of experience will the project cover?",
                "type": "textarea",
                "options": "planning_range"
            },
            {
                "id": "planning_scope",
                "text": "What is the project's scope? (number of people, number of stories, number of questions about stories)",
                "type": "textarea",
                "options": "planning_draft_scope"
            },
            {
                "id": "planning_emphasis",
                "text": "Which phases of PNI will be important to the project? (indicate most and least important phases)",
                "type": "textarea",
                "options": "planning_draft_emphasis"
            }
        ]
    },
    {
        "id": "page_writeProjectSynopsis",
        "name": "Write project synopsis",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "projectSynopsis",
                "text": "Please summarize your project in one or two sentences.",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "page_readPlanningReport",
        "name": "Read planning report",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "planningReport",
                "text": "Project planning report",
                "type": "report",
                "options": "planning"
            },
            {
                "id": "COMMENT_page_readPlanningReport_1",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_readPlanningReport_2",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_readPlanningReport_3",
                "text": "//                                                   COLLECTION DESIGN",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_readPlanningReport_4",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_readPlanningReport_5",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null
            }
        ]
    },
    {
        "id": "page_collectionDesign",
        "name": "Collection design",
        "description": "",
        "isHeader": true,
        "questions": [
            {
                "id": "COMMENT_page_collectionDesign_1",
                "text": "// Collection venues - X venues chosen",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_collectionDesign_2",
                "text": "// Story eliciting questions - x questions written",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_collectionDesign_3",
                "text": "// Questions about stories - x questions written",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_collectionDesign_4",
                "text": "// Questions about people - x stories written",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_collectionDesign_5",
                "text": "// Question form - [ ] designed [ ] committed",
                "type": "label",
                "options": null
            }
        ]
    },
    {
        "id": "page_chooseCollectionVenues",
        "name": "Choose collection venues",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "venuesIntro",
                "text": "On this page you will choose story collection venues, or ways to collect stories.",
                "type": "label"
            },
            {
                "id": "venueRecommendations",
                "text": "Venue recommendations",
                "type": "recommendationTable",
                "options": "Venues"
            },
            {
                "id": "venuesTable",
                "text": "Please answer these questions about your collection venues for each participant group.",
                "type": "page_venuesTable",
                "options": "participants_firstGroupName,participants_secondGroupName,participants_thirdGroupName"
            }
        ]
    },
    {
        "id": "page_venuesTable",
        "name": "Aspects table",
        "description": "",
        "isHeader": false,
        "type": "questionsTable",
        "questions": [
            {
                "id": "primaryVenue",
                "text": "Choose a primary means of story collection for this group.",
                "type": "select",
                "options": "individual interviews;group interviews;peer interviews;group story sessions;surveys;journals;narrative incident reports;gleaned stories"
            },
            {
                "id": "primaryVenue_plans",
                "text": "Describe your story collection plans for this group and venue.",
                "type": "textarea"
            },
            {
                "id": "secondaryVenue",
                "text": "If you want to collect stories in a second way for this same group, choose one of these options.",
                "type": "select",
                "options": "individual interviews;group interviews;peer interviews;group story sessions;surveys;journals;narrative incident reports;gleaned stories"
            },
            {
                "id": "secondaryVenue_plans",
                "text": "Describe your secondary story collection for this group and venue.",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "page_writeStoryElicitingQuestions",
        "name": "Write story eliciting questions",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "elicitingQuestionsList",
                "text": "These are the story eliciting questions you have entered so far.",
                "type": "grid",
                "options": "page_addElicitingQuestion"
            }
        ]
    },
    {
        "id": "page_addElicitingQuestion",
        "name": "Add story eliciting question",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "elicitingQuestionRecommendations",
                "text": "Recommendations for eliciting questions",
                "type": "recommendationTable",
                "options": "Eliciting questions"
            },
            {
                "id": "elicitingQuestion",
                "text": "Enter a question with which to ask people to tell stories.",
                "shortText": "Question",
                "type": "textarea"
            },
            {
                "id": "elicitingQuestionType",
                "text": "What type of question is this?",
                "shortText": "Type",
                "type": "checkboxes",
                "options": "what happened;directed question;undirected questions;point in time;event;extreme;surprise;people, places, things;fictional scenario;other"
            },
            {
                "id": "elicitingQuestionTemplates",
                "text": "Or choose a question from this list.",
                "type": "templateList",
                "options": "elicitingQuestions"
            }
        ]
    },
    {
        "id": "page_writeQuestionsAboutStories",
        "name": "Write questions about stories",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "storyQuestionsList",
                "text": "These are the questions you will be asking people about stories.",
                "type": "grid",
                "options": "page_addStoryQuestion"
            }
        ]
    },
    {
        "id": "page_addStoryQuestion",
        "name": "Add story question",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "storyQuestionRecommendations",
                "text": "Recommendations for story questions",
                "type": "recommendationTable",
                "options": "storyQuestions"
            },
            {
                "id": "storyQuestionText",
                "text": "Enter a question to ask people about their stories.",
                "shortText": "Question",
                "type": "textarea"
            },
            {
                "id": "storyQuestionType",
                "text": "What type of question is this?",
                "shortText": "Type",
                "type": "select",
                "options": "boolean;label;header;checkbox;checkboxes;text;textarea;select;radio;slider"
            },
            {
                "id": "storyQuestionShortName",
                "text": "Enter a short name we can use to refer to the question. (This name must be unique to the project.)",
                "shortText": "Short name",
                "type": "text"
            },
            {
                "id": "storyQuestionHelp",
                "text": "If you want to provide help to people answering the question, enter it here.",
                "shortText": "Help",
                "type": "textarea"
            },
            {
                "id": "storyQuestionTemplates",
                "text": "Or choose a question from this list.",
                "type": "templateList",
                "options": "storyQuestions"
            }
        ]
    },
    {
        "id": "page_writeQuestionsAboutParticipants",
        "name": "Write questions about participants",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "participantQuestionsList",
                "text": "These are the questions you will be asking people about themselves.",
                "type": "grid",
                "options": "page_addParticipantQuestion"
            }
        ]
    },
    {
        "id": "page_addParticipantQuestion",
        "name": "Add participant question",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "participantQuestionRecommendations",
                "text": "Recommendations for participant questions",
                "type": "recommendationTable",
                "options": "participantQuestions"
            },
            {
                "id": "participantQuestionText",
                "text": "Enter a question to ask people about themselves.",
                "shortText": "Question",
                "type": "textarea"
            },
            {
                "id": "participantQuestionType",
                "text": "What type of question is this?",
                "shortText": "Type",
                "type": "select",
                "options": "boolean;label;header;checkbox;checkboxes;text;textarea;select;radio;slider"
            },
            {
                "id": "participantQuestionShortName",
                "text": "Enter a short name we can use to refer to the question. (This name must be unique to the project.)",
                "shortText": "Short name",
                "type": "text"
            },
            {
                "id": "participantQuestionHelp",
                "text": "If you want to provide help to people answering the question, enter it here.",
                "shortText": "Help",
                "type": "textarea"
            },
            {
                "id": "participantQuestionTemplates",
                "text": "Or choose a question from this list.",
                "type": "templateList",
                "options": "participantQuestions"
            }
        ]
    },
    {
        "id": "page_designQuestionForm",
        "name": "Design question form",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "questionFormTitle",
                "text": "Please enter a title for the form.",
                "type": "text"
            },
            {
                "id": "questionFormLogo",
                "text": "You can upload a logo or ather image to show at the top of the form.",
                "type": "imageUploader"
            },
            {
                "id": "questionFormIntro",
                "text": "Please enter an introduction to be shown at the start of the form, after the title",
                "type": "textarea"
            },
            {
                "id": "questionFormEndText",
                "text": "Please enter any text to be shown at the end of the form",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "page_planStoryCollectionSessions",
        "name": "Plan story collection sessions",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "collectionSessionIntro",
                "text": "If you don't plan to collect stories in group sessions, you can skip this page.",
                "type": "label"
            },
            {
                "id": "collectionSessionRecommendations",
                "text": "Recommendations for story collection sessions",
                "type": "recommendationTable",
                "options": "collectionSessions"
            },
            {
                "id": "storyCollectionSessionPlansList",
                "text": "These are the collection sessions you have designed so far.",
                "type": "grid",
                "options": "page_addStoryCollectionSession"
            }
        ]
    },
    {
        "id": "page_addStoryCollectionSession",
        "name": "Design story collection session",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "collectionSessionName",
                "text": "Please give this session plan a name.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "collectionSessionRepetitions",
                "text": "How many repetitions of the session will there be?",
                "shortText": "Repetitions",
                "type": "text"
            },
            {
                "id": "collectionSessionLength",
                "text": "How long will this session be?",
                "shortText": "Length",
                "type": "text"
            },
            {
                "id": "collectionSessionTime",
                "text": "When will it take place?",
                "shortText": "Time",
                "type": "text"
            },
            {
                "id": "collectionSessionLocation",
                "text": "Where will it take place?",
                "shortText": "Location",
                "type": "text"
            },
            {
                "id": "collectionSessionSize",
                "text": "How many people will be invited to each repetition of this session?",
                "shortText": "Number of people",
                "type": "text"
            },
            {
                "id": "collectionSessionGroups",
                "text": "From which participant group(s) will people be invited?",
                "shortText": "Participant groups",
                "type": "checkBoxesWithPull",
                "options": "participantGroups"
            },
            {
                "id": "collectionSessionMaterials",
                "text": "What materials will this session require?",
                "shortText": "Materials",
                "type": "textarea"
            },
            {
                "id": "collectionSessionDetails",
                "text": "Enter other details about this session.",
                "shortText": "Other",
                "type": "textarea"
            },
            {
                "id": "collectionSessionActivitiesList",
                "text": "These are the activities added to this session plan so far.",
                "type": "grid",
                "options": "page_addCollectionSessionActivity"
            },
            {
                "id": "printCollectionSessionAgenda",
                "text": "Print session agenda",
                "type": "button"
            }
        ]
    },
    {
        "id": "page_addCollectionSessionActivity",
        "name": "Add story collection session activity",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "collectionSessionActivityName",
                "text": "Please give this activity a name.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "collectionSessionActivityType",
                "text": "What type of activity is this?",
                "shortText": "Type",
                "type": "select",
                "options": "ice-breaker;sharing stories (no task);sharing stories (simple task);discussing stories;twice-told stories exercise;timeline exercise;landscape exercise;my own exercise;other"
            },
            {
                "id": "collectionActivityPlan",
                "text": "Describe the plan for this activity.",
                "shortText": "Plan",
                "type": "textarea"
            },
            {
                "id": "collectionActivityOptionalParts",
                "text": "Describe optional elaborations you might or might not use in this activity.",
                "shortText": "Optional elaborations",
                "type": "textarea"
            },
            {
                "id": "collectionActivityTime",
                "text": "How long will this activity take?",
                "shortText": "Length",
                "type": "text"
            },
            {
                "id": "collectionActivityRecording",
                "text": "How will stories be recorded during this activity?",
                "shortText": "Recording",
                "type": "textarea"
            },
            {
                "id": "collectionActivityMaterials",
                "text": "What materials will be provided for this activity?",
                "shortText": "Materials",
                "type": "textarea"
            },
            {
                "id": "collectionActivitySpaces",
                "text": "What spaces will be used for this activity?",
                "shortText": "Spaces",
                "type": "textarea"
            },
            {
                "id": "collectionActivityFacilitation",
                "text": "What sort of facilitation will be necessary for this activity?",
                "shortText": "Facilitation",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "readCollectionDesignReport",
        "name": "Read collection design report",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "collectionDesignReport",
                "text": "Collection design report",
                "type": "report",
                "options": "collectionDesign"
            },
            {
                "id": "COMMENT_readCollectionDesignReport_1",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_readCollectionDesignReport_2",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_readCollectionDesignReport_3",
                "text": "//                                                  COLLECTION PROCESS",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_readCollectionDesignReport_4",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_readCollectionDesignReport_5",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null
            }
        ]
    },
    {
        "id": "page_collectionProcess",
        "name": "Collection process",
        "description": "",
        "isHeader": true,
        "questions": [
            {
                "id": "COMMENT_page_collectionProcess_1",
                "text": "// Online story collection is [ ] enabled",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_collectionProcess_2",
                "text": "// Number of stories entered - x",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_collectionProcess_3",
                "text": "// Number of participants who told stories - x",
                "type": "label",
                "options": null
            }
        ]
    },
    {
        "id": "page_finalizeQuestionForms",
        "name": "Finalize question forms",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "finalizeLabel",
                "text": "On this page you will finalize your questions for story collection. Once you have started your story collection,\nyou should not make changes to your questions. You will still be able to make changes after you click the \"Finalize\" button,\nbut the system will ask you to confirm each change.",
                "type": "label"
            },
            {
                "id": "printStoryForm",
                "text": "Print story form",
                "type": "button"
            },
            {
                "id": "copyStoryFormURL",
                "text": "Copy story form web link",
                "type": "button"
            },
            {
                "id": "finalizeStoryForm",
                "text": "Finalize story form",
                "type": "button"
            }
        ]
    },
    {
        "id": "page_startStoryCollection",
        "name": "Start story collection",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "startCollectionLabel",
                "text": "If you are doing story collection over the internet, click this button to make the web form \"live\" and able\nto be used by people other than yourself.",
                "type": "label"
            },
            {
                "id": "enableWebStoryForm",
                "text": "Enable web story form",
                "type": "button"
            },
            {
                "id": "FIXME_410",
                "text": "Copy story form web link",
                "type": "button"
            }
        ]
    },
    {
        "id": "page_storyCollectionFormForParticipants",
        "name": "Participate in the story collection",
        "description": "",
        "isHeader": false,
        "type": "participantStoryForm",
        "questions": [
            {
                "id": "COMMENT_page_storyCollectionFormForParticipants_1",
                "text": "// the info shown here is what was designed - how to specify that",
                "type": "label",
                "options": null
            }
        ]
    },
    {
        "id": "page_enterStories",
        "name": "Enter stories",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "COMMENT_page_enterStories_1",
                "text": "// this page is the same as the \"participate\" page above, but only the admin can see it",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_enterStories_2",
                "text": "// and the normal tabs are shown on the page",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_enterStories_3",
                "text": "// the info shown here is what was designed - how to specify that",
                "type": "label",
                "options": null
            }
        ]
    },
    {
        "id": "page_reviewIncomingStories",
        "name": "Review incoming stories",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "collectedStoriesDuringCollection",
                "text": "Collected stories",
                "type": "storyBrowser"
            }
        ]
    },
    {
        "id": "page_stopStoryCollection",
        "name": "Stop story collection",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "stopCollectionLabel",
                "text": "If you are doing story collection over the internet, click this button to make the web form\nunavailable to anyone but yourself.",
                "type": "label"
            },
            {
                "id": "disableWebStoryForm",
                "text": "Disable web story form",
                "type": "button"
            }
        ]
    },
    {
        "id": "page_enterCollectionSessionRecords",
        "name": "Enter story collection session records",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "collectionRecordsLabel",
                "text": "Note: If you did not hold any story collection sessions, you can skip this page.",
                "type": "label"
            },
            {
                "id": "storyCollectionSessionRecordsList",
                "text": "These are the story collection records you have entered so far.",
                "type": "grid",
                "options": "page_addCollectionSessionRecord"
            }
        ]
    },
    {
        "id": "page_addCollectionSessionRecord",
        "name": "Add story collection session record",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "collectionSessionConstructionsList",
                "text": "These are the group constructions you have entered for this session so far.",
                "type": "grid",
                "options": "page_newCollectionSessionConstruction"
            },
            {
                "id": "collectionSessionNotesList",
                "text": "These are the notes you have entered for this story collection session so far.",
                "type": "grid",
                "options": "page_newCollectionSessionNotes"
            }
        ]
    },
    {
        "id": "page_newCollectionSessionConstruction",
        "name": "Story collection construction",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "collectionSessionConstructionName",
                "text": "Please give this construction a name.",
                "type": "text"
            },
            {
                "id": "collectionSessionConstructionType",
                "text": "What type of construction is it?",
                "type": "select",
                "options": "timeline;landscape;other"
            },
            {
                "id": "collectionSessionContructionText",
                "text": "Please describe the construction (or include a description given by participants).",
                "type": "textarea"
            },
            {
                "id": "collectionSessionConstructionLink",
                "text": "You can include a link to an audio or video description here.",
                "type": "text"
            },
            {
                "id": "collectionSessionConstructionImagesList",
                "text": "These are the images you have entered for the construction so far.",
                "type": "grid",
                "options": "page_newCollectionConstructionImage"
            }
        ]
    },
    {
        "id": "page_newCollectionConstructionImage",
        "name": "Collection construction image",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "collectionSessionConstructionImage",
                "text": "Upload an image for this construction.",
                "shortText": "Image",
                "type": "imageUploader"
            },
            {
                "id": "collectionSessionConstructionImageName",
                "text": "Please give this image a name.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "collectionSessionConstructionImageNotes",
                "text": "Make any notes you'd like to record on this image here.",
                "shortText": "Notes",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "page_newCollectionSessionNotes",
        "name": "Collection session notes",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "collectionSessionNotesName",
                "text": "Please give this set of notes a name.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "collectionSessionNotesText",
                "text": "Enter your notes here.",
                "shortText": "Notes",
                "type": "textarea"
            },
            {
                "id": "collectionSessionNoteImagesList",
                "text": "These are the images you have entered for this set of notes so far.",
                "shortText": "Images",
                "type": "grid",
                "options": "page_newCollectionSessionImage"
            }
        ]
    },
    {
        "id": "page_newCollectionSessionImage",
        "name": "Collection session notes image",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "collectionSessionNotesImage",
                "text": "Upload your image here.",
                "shortText": "Image",
                "type": "imageUploader"
            },
            {
                "id": "collectionSessionImageName",
                "text": "Please give this image a name.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "collectionSessionNotesImageNotes",
                "text": "You can enter some notes about this image.",
                "shortText": "Notes",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "page_answerQuestionsAboutCollectionSessions",
        "name": "Reflect on story collection sessions",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "storyCollectionSessionReflectionsList",
                "text": "These are session reflections you have entered so far.",
                "type": "grid",
                "options": "page_answerQuestionsAboutCollectionSession"
            }
        ]
    },
    {
        "id": "page_answerQuestionsAboutCollectionSession",
        "name": "Reflect on story collection session",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "collectionReflectChangeLabel",
                "text": "Change",
                "type": "header"
            },
            {
                "id": "collectionReflectChangeEmotions",
                "text": "How did the perceptions of the participants change from the start to the end of the session?",
                "shortText": "Change in participant perceptions",
                "type": "textarea"
            },
            {
                "id": "collectionReflectChangeYourEmotions",
                "text": "How did <i>your</i> perceptions change?",
                "shortText": "Change in facilitator perceptions",
                "type": "textarea"
            },
            {
                "id": "collectionReflectProjectChanged",
                "text": "How has the overall project changed as a result of this session?",
                "shortText": "Changes to the project",
                "type": "textarea"
            },
            {
                "id": "collectionReflectInteractionsLabel",
                "text": "Interactions",
                "type": "header"
            },
            {
                "id": "collectionReflectInteractionsParticipants",
                "text": "Describe the interactions between participants in this session.",
                "shortText": "Interactions among participants",
                "type": "textarea"
            },
            {
                "id": "collectionReflectInteractionsFacilitators",
                "text": "Describe interactions between participants and facilitators.",
                "shortText": "Interactions between participants and facilitators",
                "type": "textarea"
            },
            {
                "id": "collectionReflectStories",
                "text": "What did you notice about the stories people told, retold, chose, and worked with during the session?",
                "shortText": "Stories",
                "type": "textarea"
            },
            {
                "id": "collectionReflectLearningLabel",
                "text": "Learning",
                "type": "header"
            },
            {
                "id": "collectionReflectSpecial",
                "text": "What was special about these people in this place on this day?",
                "shortText": "Unique features",
                "type": "textarea"
            },
            {
                "id": "collectionReflectSurprise",
                "text": "What surprised you about this session?",
                "shortText": "Surprise",
                "type": "textarea"
            },
            {
                "id": "collectionReflectWorkedWellAndNot",
                "text": "Which parts of your plans for this session worked out well? Which parts didn't?",
                "shortText": "Worked and didn't work",
                "type": "textarea"
            },
            {
                "id": "collectionReflectNewIdeas",
                "text": "What new ideas did you gain from this session? What did you learn from it?",
                "shortText": "New ideas",
                "type": "textarea"
            },
            {
                "id": "collectionReflectExtra",
                "text": "What else do you want to remember about this session?",
                "shortText": "Other",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "page_readCollectionProcessReport",
        "name": "Read collection process report",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "collectionProcessReport",
                "text": "Collection process report",
                "type": "report",
                "options": "collectionProcess"
            },
            {
                "id": "COMMENT_page_readCollectionProcessReport_1",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_readCollectionProcessReport_2",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_readCollectionProcessReport_3",
                "text": "//                                                       CATALYSIS",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_readCollectionProcessReport_4",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_readCollectionProcessReport_5",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null
            }
        ]
    },
    {
        "id": "page_catalysis",
        "name": "Catalysis",
        "description": "",
        "isHeader": true,
        "questions": [
            {
                "id": "COMMENT_page_catalysis_1",
                "text": "// Observations - x",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_catalysis_2",
                "text": "// Interpretations - x",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_catalysis_3",
                "text": "// Ideas - x",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_catalysis_4",
                "text": "// Perspectives - x",
                "type": "label",
                "options": null
            }
        ]
    },
    {
        "id": "page_browseStories",
        "name": "Browse stories",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "collectedStoriesAfterCollection",
                "text": "Collected stories",
                "type": "storyBrowser",
                "options": "addObservation:\"page_addToObservation\";addExcerpt:\"page_addToExcerpt\""
            }
        ]
    },
    {
        "id": "page_addToObservation",
        "name": "Add to observation",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "addObservationsLabel",
                "text": "Note: You should not add any observations that depend on patterns among stories until after\nall stories have been entered.",
                "type": "label"
            },
            {
                "id": "observationsList",
                "text": "Choose an observation from this list to which to add the selected result, or create a new observation.",
                "type": "observationsList"
            },
            {
                "id": "addResultToExistingObservation",
                "text": "Add result to selected observation",
                "type": "button"
            },
            {
                "id": "createNewObservationWithResult",
                "text": "Create new observation with this result",
                "type": "button",
                "options": "page_createNewObservation"
            }
        ]
    },
    {
        "id": "page_createNewObservation",
        "name": "Create new observation",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "observationName",
                "text": "Please give this observation a name.",
                "type": "text"
            }
        ]
    },
    {
        "id": "page_addToExcerpt",
        "name": "Add to excerpt",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "excerptsList",
                "text": "Choose an excerpt from this list to which to add the selected text, or create a new excerpt.",
                "type": "excerptsList"
            },
            {
                "id": "addTextToExistingExcerpt",
                "text": "Add text to selected excerpt",
                "type": "button"
            },
            {
                "id": "createNewExcerptWithText",
                "text": "Create new excerpt with this text",
                "type": "button",
                "options": "page_createNewExcerpt"
            }
        ]
    },
    {
        "id": "page_createNewExcerpt",
        "name": "Create new excerpt",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "excerptName",
                "text": "Please give this excerpt a name.",
                "type": "text"
            },
            {
                "id": "excerptText",
                "text": "You can edit the excerpt here.",
                "type": "textarea"
            },
            {
                "id": "excerptNotes",
                "text": "You can enter some notes about the excerpt here.",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "page_themeStories",
        "name": "Theme stories",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "themeStories",
                "text": "Theme stories",
                "type": "storyThemer"
            }
        ]
    },
    {
        "id": "page_browseGraphs",
        "name": "Browse graphs",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "graphBrowser",
                "text": "Graph browser",
                "type": "graphBrowser"
            }
        ]
    },
    {
        "id": "page_reviewTrends",
        "name": "Review trends",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "statTests",
                "text": "Which statistical tests do you want to consider?",
                "type": "checkBoxes",
                "options": "chi-squared (differences between counts);t-test (differences between means);correlation"
            },
            {
                "id": "minSubsetSize",
                "text": "How large should subset counts be to be considered for comparison?",
                "type": "select",
                "options": "20;30;40;50"
            },
            {
                "id": "significanceThreshold",
                "text": "What significance threshold do you want reported?",
                "type": "select",
                "options": "0.05;0.01"
            },
            {
                "id": "trendResults",
                "text": "How many results do you want to see per test type?",
                "type": "select",
                "options": "5;10;15;20;25;30"
            },
            {
                "id": "COMMENT_page_reviewTrends_1",
                "text": "// when user changes any of the options above, the trend report below should update",
                "type": "label",
                "options": null
            },
            {
                "id": "trendsReport",
                "text": "Trends report",
                "type": "trendsReport"
            }
        ]
    },
    {
        "id": "page_reviewExcerpts",
        "name": "Review excerpts",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "FIXME_564",
                "text": "Collected excerpts",
                "type": "grid",
                "options": "page_createNewExcerpt"
            }
        ]
    },
    {
        "id": "page_interpretObservations",
        "name": "Interpret observations",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "FIXME_568",
                "text": "Collected observations",
                "type": "grid",
                "options": "page_editObservation"
            }
        ]
    },
    {
        "id": "page_editObservation",
        "name": "Edit observation",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "FIXME_572",
                "text": "Please give this observation a name.",
                "shortText": "Observation name",
                "type": "text"
            },
            {
                "id": "observation",
                "text": "Please describe this observation.",
                "shortText": "Observation",
                "type": "textarea"
            },
            {
                "id": "observationResultsList",
                "text": "These are the results you selected to include in this observation.",
                "shortText": "Results",
                "type": "grid"
            },
            {
                "id": "observationInterpretationsList",
                "text": "These are the interpretations you have created for this observation.",
                "shortText": "Interpretations",
                "type": "grid",
                "options": "page_addInterpretation"
            }
        ]
    },
    {
        "id": "page_addInterpretation",
        "name": "Create interpretation",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "interpretationText",
                "text": "What is your interpretation about this observation?",
                "shortText": "Interpretation",
                "type": "textarea"
            },
            {
                "id": "interpretationName",
                "text": "Enter a name for this interpretation.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "firstInterpIdea",
                "text": "If you like, you can record an idea that follows from this interpretation.",
                "shortText": "Idea",
                "type": "textarea"
            },
            {
                "id": "interpretationExcerptsList",
                "text": "You can add excerpts to this interpretation.",
                "shortText": "Excerpts",
                "type": "grid",
                "options": "page_selectExcerpt"
            }
        ]
    },
    {
        "id": "page_selectExcerpt",
        "name": "Select excerpt",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "FIXME_588",
                "text": "Collected excerpts",
                "type": "grid",
                "options": "page_createNewExcerpt"
            },
            {
                "id": "COMMENT_page_selectExcerpt_1",
                "text": "// when they click this button the selected excerpt should be added to the list whose \"add\" button they clicked",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_selectExcerpt_2",
                "text": "// it should know which interpretation to tie the excerpt to",
                "type": "label",
                "options": null
            },
            {
                "id": "addExcerptToInterpretation",
                "text": "Add selected excerpt to interpretation",
                "type": "button"
            }
        ]
    },
    {
        "id": "page_clusterInterpretations",
        "name": "Cluster interpretations",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "clusterInterpLabel",
                "text": "Note: Do not cluster your interpretations unless you are sure you have finished collecting them.",
                "type": "label"
            },
            {
                "id": "COMMENT_page_clusterInterpretations_1",
                "text": "// ideally, when they are done with this, the circles marked as group names",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_clusterInterpretations_2",
                "text": "// will get copied into the perspectives list seen in the next page",
                "type": "label",
                "options": null
            },
            {
                "id": "clusterInterpretations",
                "text": "Cluster interpretations into perspectives",
                "type": "clusterSpace",
                "options": "interpretations"
            }
        ]
    },
    {
        "id": "page_describePerspectives",
        "name": "Describe perspectives",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "perspectivesList",
                "text": "Perspectives",
                "type": "grid",
                "options": "page_addPerspective"
            }
        ]
    },
    {
        "id": "page_addPerspective",
        "name": "Add or change perspective",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "perspectiveName",
                "text": "Please give this perspective a name.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "perspectiveDescription",
                "text": "Describe this perspective.",
                "shortText": "Perspective",
                "type": "textarea"
            },
            {
                "id": "perspectiveResultsList",
                "text": "Results linked to this perspective",
                "type": "grid",
                "options": "page_addResultToPerspective"
            },
            {
                "id": "perspectiveExcerptsList",
                "text": "Excerpts linked to this perspective",
                "type": "grid",
                "options": "page_addExcerptToPerspective"
            },
            {
                "id": "perspectiveInterpretationsList",
                "text": "Interpretations linked to this perspective",
                "type": "grid",
                "options": "page_annotateInterpretationForPerspective"
            }
        ]
    },
    {
        "id": "page_addResultToPerspective",
        "name": "Add result to perspective",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "COMMENT_page_addResultToPerspective_1",
                "text": "// this popup should show all the results linked to observations linked to interpretations linked to this perspective",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_addResultToPerspective_2",
                "text": "// perspective",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_addResultToPerspective_3",
                "text": "//      interpretation",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_addResultToPerspective_4",
                "text": "//           observation",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_addResultToPerspective_5",
                "text": "//                result",
                "type": "label",
                "options": null
            },
            {
                "id": "resultsForThisPerspectiveList",
                "text": "Choose a result that exemplifies this perspective.",
                "type": "grid"
            },
            {
                "id": "resultLinkedToPerspectiveNotes",
                "text": "Enter any notes you want to remember about this result here.",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "page_addExcerptToPerspective",
        "name": "Add excerpt to perspective",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "COMMENT_page_addExcerptToPerspective_1",
                "text": "// similarly, this should be a list of all the excerpts linked to interpretations linked to this perspective",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_addExcerptToPerspective_2",
                "text": "// perspective",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_addExcerptToPerspective_3",
                "text": "//     interpretation",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_addExcerptToPerspective_4",
                "text": "//         excerpt",
                "type": "label",
                "options": null
            },
            {
                "id": "excerptsForThisPerspectiveList",
                "text": "Choose an excerpt that exemplifies this perspective.",
                "type": "grid"
            },
            {
                "id": "excerptLinkedToPerspectiveNotes",
                "text": "Enter any notes you want to remember about this excerpt.",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "page_annotateInterpretationForPerspective",
        "name": "Annotate interpretation for perspective",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "interpretationLinkedToPerspectiveNotes",
                "text": "Enter any notes you want to remember about this interpretation as it is linked to this perspective.",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "page_readCatalysisReport",
        "name": "Read catalysis report",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "catalysisReport",
                "text": "Catalysis report",
                "type": "report",
                "options": "catalysis"
            },
            {
                "id": "COMMENT_page_readCatalysisReport_1",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_readCatalysisReport_2",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_readCatalysisReport_3",
                "text": "//                                                       SENSEMAKING",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_readCatalysisReport_4",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_readCatalysisReport_5",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null
            }
        ]
    },
    {
        "id": "page_sensemaking",
        "name": "Sensemaking",
        "description": "",
        "isHeader": true,
        "questions": [
            {
                "id": "COMMENT_page_sensemaking_1",
                "text": "// Planning sessions - x of x questions answered",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_sensemaking_2",
                "text": "// Write session agenda - x of x questions answered",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_sensemaking_3",
                "text": "// Print story cards - x cards printed (or checkmark)",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_sensemaking_4",
                "text": "// Post-session review - x of x questions answered",
                "type": "label",
                "options": null
            }
        ]
    },
    {
        "id": "page_planSensemakingSessions",
        "name": "Plan sensemaking sessions",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "sensemakingSessionRecommendations",
                "text": "Recommendations for sensemaking sessions",
                "type": "recommendationTable",
                "options": "sensemakingSessions"
            },
            {
                "id": "sensemakingSessionPlansList",
                "text": "Sensemaking sessions",
                "type": "grid",
                "options": "page_addSensemakingSessionPlan"
            }
        ]
    },
    {
        "id": "page_addSensemakingSessionPlan",
        "name": "Enter sensemaking session plan",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "sensemakingSessionName",
                "text": "Please give this session plan a name.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "sensemakingSessionRepetitions",
                "text": "How many repetitions of the session will there be?",
                "shortText": "Repetitions",
                "type": "text"
            },
            {
                "id": "sensemakingSessionLength",
                "text": "How long will this session be?",
                "shortText": "Length",
                "type": "text"
            },
            {
                "id": "sensemakingSessionTime",
                "text": "When will it take place?",
                "shortText": "Time",
                "type": "text"
            },
            {
                "id": "sensemakingSessionLocation",
                "text": "Where will it take place?",
                "shortText": "Location",
                "type": "text"
            },
            {
                "id": "sensemakingSessionSize",
                "text": "How many people will be invited to each repetition of this session?",
                "shortText": "Number of people",
                "type": "text"
            },
            {
                "id": "sensemakingSessionGroups",
                "text": "From which participant group(s) will people be invited?",
                "shortText": "Participant groups",
                "type": "checkBoxesWithPull",
                "options": "participantGroups"
            },
            {
                "id": "sensemakingSessionMaterials",
                "text": "What materials will this session require?",
                "shortText": "Materials",
                "type": "textarea"
            },
            {
                "id": "sensemakingSessionDetails",
                "text": "Enter other details about this session.",
                "shortText": "Other",
                "type": "textarea"
            },
            {
                "id": "sensemakingSessionActivitiesList",
                "text": "These are the activities added to this session plan so far.",
                "type": "grid",
                "options": "page_addSensemakingSessionActivity"
            },
            {
                "id": "printSensemakingSessionAgenda",
                "text": "Print session agenda",
                "type": "button"
            }
        ]
    },
    {
        "id": "page_addSensemakingSessionActivity",
        "name": "Add sensemaking session activity",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "sensemakingSessionActivityName",
                "text": "Please give this activity a name.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "sensemakingSessionActivity",
                "text": "What type of activity is this?",
                "shortText": "Type",
                "type": "select",
                "options": "ice-breaker;encountering stories (no task);encountering stories (simple task);discussing stories;twice-told stories exercise;timeline exercise;landscape exercise;story elements exercise;composite stories exercise;my own exercise;other"
            },
            {
                "id": "sensemakingActivityPlan",
                "text": "Describe the plan for this activity.",
                "shortText": "Plan",
                "type": "textarea"
            },
            {
                "id": "sensemakingActivityOptionalParts",
                "text": "Describe optional elaborations you might or might not use in this activity.",
                "shortText": "Optional elaborations",
                "type": "textarea"
            },
            {
                "id": "sensemakingActivityTime",
                "text": "How long will this activity take?",
                "shortText": "Length",
                "type": "text"
            },
            {
                "id": "sensemakingActivityRecording",
                "text": "Will new stories be recorded during this activity, and if so, how?",
                "shortText": "New stories",
                "type": "textarea"
            },
            {
                "id": "sensemakingActivityMaterials",
                "text": "What materials will be provided for this activity?",
                "shortText": "Materials",
                "type": "textarea"
            },
            {
                "id": "sensemakingActivitySpaces",
                "text": "What spaces will be used for this activity?",
                "shortText": "Spaces",
                "type": "textarea"
            },
            {
                "id": "sensemakingActivityFacilitation",
                "text": "What sort of facilitation will be necessary for this activity?",
                "shortText": "Facilitation",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "page_enterSensemakingSessionRecords",
        "name": "Enter sensemaking session records",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "sensemakingSessionRecordsList",
                "text": "Sensemaking sessions",
                "type": "grid",
                "options": "page_addSensemakingSessionRecord"
            }
        ]
    },
    {
        "id": "page_addSensemakingSessionRecord",
        "name": "Add sensemaking session record",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "FIXME_696",
                "text": "Please give this session record a name.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "COMMENT_page_addSensemakingSessionRecord_1",
                "text": "// no add button on this grid, must add from story browser below",
                "type": "label",
                "options": null
            },
            {
                "id": "sensemakingSessionResonantStoriesList",
                "text": "Resonant stories (pivot, voice, discovery)",
                "type": "grid"
            },
            {
                "id": "showHideCollectedStories",
                "text": "hide collected stories",
                "shortText": "Show",
                "type": "toggleButton",
                "options": "showCollectedStoriesInSensemakingSessionRecordScreen"
            },
            {
                "id": "storiesToMarkAsResonantDuringSensemaking",
                "text": "Collected stories",
                "type": "storyBrowser",
                "options": "addResonantStory:\"page_addResonantStory\""
            },
            {
                "id": "sensemakingSessionOutcomesList",
                "text": "Session outcomes (like discoveries and ideas)",
                "type": "grid",
                "options": "page_newSensemakingSessionOutcome"
            },
            {
                "id": "sensemakingSessionConstructionsList",
                "text": "Group constructions",
                "type": "grid",
                "options": "page_newSensemakingSessionConstruction"
            },
            {
                "id": "sensemakingSessionNotesList",
                "text": "Session notes",
                "type": "grid",
                "options": "page_newSensemakingSessionNotes"
            }
        ]
    },
    {
        "id": "page_addResonantStory",
        "name": "Add resonant story",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "resonantStoryType",
                "text": "Which type of resonant story is this?",
                "type": "select",
                "options": "pivot;voice;discovery;other"
            },
            {
                "id": "resonantStoryReason",
                "text": "Why did this story stand out?",
                "type": "textarea"
            },
            {
                "id": "resonantStoryWhom",
                "text": "For which participant groups was this story important?",
                "type": "checkBoxesWithPull",
                "options": "participantGroups"
            },
            {
                "id": "resonantStoryNotes",
                "text": "Would you like to make any other notes about this story?",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "page_newSensemakingSessionOutcome",
        "name": "Sensemaking session outcome",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "sensemakingSessionOutcomeType",
                "text": "What type of session outcome is this?",
                "shortText": "Type",
                "type": "select",
                "options": "discovery;opportunity;issue;idea;recommendation;perspective;dilemma;other"
            },
            {
                "id": "sensemakingSessionOutcomeName",
                "text": "Please give this outcome a name.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "sensemakingSessionOutcomeText",
                "text": "Describe the outcome.",
                "shortText": "Description",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "page_newSensemakingSessionConstruction",
        "name": "Sensemaking construction",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "sensemakingSessionConstructionName",
                "text": "Please give this construction a name.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "sensemakingSessionConstructionType",
                "text": "What type of construction is it?",
                "shortText": "Type",
                "type": "select",
                "options": "timeline;landscape;story elements;composite story;other"
            },
            {
                "id": "sensemakingSessionContructionText",
                "text": "Please decribe the construction (or include a description given by participants).",
                "shortText": "Description",
                "type": "textarea"
            },
            {
                "id": "sensemakingSessionConstructionLink",
                "text": "You can include a link to an audio or video description here.",
                "shortText": "Audio/video link",
                "type": "text"
            },
            {
                "id": "sensemakingSessionConstructionImages",
                "text": "These are the images you have entered for the construction so far.",
                "type": "grid",
                "options": "page_newSensemakingConstructionImage"
            }
        ]
    },
    {
        "id": "page_newSensemakingConstructionImage",
        "name": "Sensemaking construction image",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "sensemakingSessionConstructionImage",
                "text": "Upload an image for this construction.",
                "shortText": "Image",
                "type": "imageUploader"
            },
            {
                "id": "sensemakingSessionConstructionImageName",
                "text": "Please give this image a name.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "sensemakingSessionConstructionImageNotes",
                "text": "Make any notes you'd like to record on this image here.",
                "shortText": "Notes",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "page_newSensemakingSessionNotes",
        "name": "Sensemaking session notes",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "sensemakingSessionNotesName",
                "text": "Please give this set of notes a name.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "sensemakingSessionNotesText",
                "text": "Enter your notes here.",
                "shortText": "Notes",
                "type": "textarea"
            },
            {
                "id": "sensemakingSessionNoteImages",
                "text": "These are the images you have entered for this set of notes so far.",
                "shortText": "Images",
                "type": "grid",
                "options": "page_newSensemakingSessionImage"
            }
        ]
    },
    {
        "id": "page_newSensemakingSessionImage",
        "name": "Sensemaking session notes image",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "sensemakingSessionNotesImage",
                "text": "Upload your image here.",
                "shortText": "Image",
                "type": "imageUploader"
            },
            {
                "id": "sensemakingSessionImageName",
                "text": "Please give this image a name.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "sensemakingSessionNotesImageNotes",
                "text": "You can enter some notes about this image.",
                "shortText": "Notes",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "page_answerQuestionsAboutSensemakingSessions",
        "name": "Reflect on sensemaking sessions",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "FIXME_752",
                "text": "Please give this set of reflections a name.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "sensemakingSessionReflectionsList",
                "text": "Sensemaking session reflections",
                "type": "grid",
                "options": "page_answerQuestionsAboutSensemakingSession"
            }
        ]
    },
    {
        "id": "page_answerQuestionsAboutSensemakingSession",
        "name": "Reflect on session",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "sensemakingReflectChangeLabel",
                "text": "Change",
                "type": "header"
            },
            {
                "id": "sensemakingReflectChangeEmotions",
                "text": "How did the perceptions of the participants change from the start to the end of the session?",
                "shortText": "Change in participant perceptions",
                "type": "textarea"
            },
            {
                "id": "sensemakingReflectChangeYourEmotions",
                "text": "How did <i>your</i> perceptions change?",
                "shortText": "Change in facilitator perceptions",
                "type": "textarea"
            },
            {
                "id": "sensemakingReflectProjectChanged",
                "text": "How has the overall project changed as a result of this session?",
                "shortText": "Changes to the project",
                "type": "textarea"
            },
            {
                "id": "sensemakingReflectInteractionsLabel",
                "text": "Interactions",
                "type": "header"
            },
            {
                "id": "sensemakingReflectInteractionsParticipants",
                "text": "Describe the interactions between participants in this session.",
                "shortText": "Interactions among participants",
                "type": "textarea"
            },
            {
                "id": "sensemakingReflectInteractionsFacilitators",
                "text": "Describe interactions between participants and facilitators.",
                "shortText": "Interactions between participants and facilitators",
                "type": "textarea"
            },
            {
                "id": "sensemakingReflectStories",
                "text": "What did you notice about the stories people told, retold, chose, and worked with during the session?",
                "shortText": "Stories",
                "type": "textarea"
            },
            {
                "id": "sensemakingReflectLearningLabel",
                "text": "Learning",
                "type": "header"
            },
            {
                "id": "sensemakingReflectSpecial",
                "text": "What was special about these people in this place on this day?",
                "shortText": "Unique features",
                "type": "textarea"
            },
            {
                "id": "sensemakingReflectSurprise",
                "text": "What surprised you about this session?",
                "shortText": "Surprise",
                "type": "textarea"
            },
            {
                "id": "sensemakingReflectWorkedWellAndNot",
                "text": "Which parts of your plans for this session worked out well? Which parts didn't?",
                "shortText": "Worked and didn't work",
                "type": "textarea"
            },
            {
                "id": "sensemakingReflectNewIdeas",
                "text": "What new ideas did you gain from this session? What did you learn from it?",
                "shortText": "New ideas",
                "type": "textarea"
            },
            {
                "id": "sensemakingReflectExtra",
                "text": "What else do you want to remember about this session?",
                "shortText": "Other",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "page_readSensemakingReport",
        "name": "Read sensemaking report",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "sensemakingReport",
                "text": "Sensemaking report",
                "type": "report",
                "options": "sensemaking"
            },
            {
                "id": "COMMENT_page_readSensemakingReport_1",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_readSensemakingReport_2",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_readSensemakingReport_3",
                "text": "//                                                       INTERVENTION",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_readSensemakingReport_4",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_readSensemakingReport_5",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null
            }
        ]
    },
    {
        "id": "page_intervention",
        "name": "Intervention",
        "description": "",
        "isHeader": true,
        "questions": [
            {
                "id": "COMMENT_page_intervention_1",
                "text": "// Choose interventions - x planned",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_intervention_2",
                "text": "// Answer questions about interventions - x questions answered",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_intervention_3",
                "text": "//* You can enter some general notes on intervention in this project here. [interventionGeneralNotes|textarea]",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_intervention_4",
                "text": "//* The intervention section is [interventionOpenOrClosedLabel|label]",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_intervention_5",
                "text": "//* open|closed [interventionOpenOrClosedState|lookupLabel|interventionOpen]",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_intervention_6",
                "text": "//* Open the intervention section|Close the intervention section [toggleButton|interventionOpen]",
                "type": "label",
                "options": null
            }
        ]
    },
    {
        "id": "page_projectOutcomesForIntervention;interventionOpen",
        "name": "Answer questions about project outcomes",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "outcomesTable",
                "text": "In order to choose interventions that will be useful in your project, it will be helpful to think about some\nof the issues (positive and negative) you discovered in your project. Please answer these questions in reference to\nthe participant groups you set up in the project planning phase.",
                "type": "questionsTable",
                "options": "page_outcomesTable"
            }
        ]
    },
    {
        "id": "page_outcomesTable",
        "name": "Project outcomes",
        "description": "",
        "isHeader": false,
        "type": "questionsTable",
        "questions": [
            {
                "id": "outcomesHopesHeader",
                "text": "Hopes",
                "type": "header"
            },
            {
                "id": "outcomesHeard",
                "text": "During your project, did the people in this group say they felt heard for the first time?",
                "type": "select",
                "options": "never;occasionally;sometimes;often;mixed"
            },
            {
                "id": "outcomesInvolved",
                "text": "Did they say they felt involved for the first time?",
                "type": "select",
                "options": "never;occasionally;sometimes;often;mixed"
            },
            {
                "id": "outcomesLearnedAboutComm",
                "text": "Did they say they learned a lot about their community or organization?",
                "type": "select",
                "options": "never;occasionally;sometimes;often;mixed"
            },
            {
                "id": "outcomesVoicesHeader",
                "text": "Voices",
                "type": "header"
            },
            {
                "id": "outcomesMoreStories",
                "text": "During your story collection, did these people seem to want to tell more stories than you collected?",
                "type": "select",
                "options": "never;occasionally;sometimes;often;mixed"
            },
            {
                "id": "outcomesWantedToShareMore",
                "text": "Did you ever feel that they wanted to share more experiences with each other than they did?",
                "type": "select",
                "options": "never;occasionally;sometimes;often;mixed"
            },
            {
                "id": "outcomesNeededToBeHeard",
                "text": "Did these people feel that some of the stories you collected \"needed to be heard\" by anyone?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed"
            },
            {
                "id": "outcomesNobodyCares",
                "text": "Were there any issues that these people thought \"nobody cares\" about?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed"
            },
            {
                "id": "outcomesNeedsHeader",
                "text": "Needs",
                "type": "header"
            },
            {
                "id": "outcomesNobodyCanMeetNeeds",
                "text": "Do the people in this group have needs that <i>nobody</i> can meet?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed"
            },
            {
                "id": "outcomesNeedNewStories",
                "text": "Do these people need to start telling themselves <i>new</i> stories?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed"
            },
            {
                "id": "outcomesKeepExploring",
                "text": "Were there any issues about which the people in this group seemed to want to keep exploring?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed"
            },
            {
                "id": "outcomesCrisisPoints",
                "text": "Did you discover any \"crisis points\" where people in this group needed help and didn't get it?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed"
            },
            {
                "id": "outcomesBeyondWords",
                "text": "Did you find any issues for this group that were beyond words, that no amount of discussion could resolve?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed"
            },
            {
                "id": "outcomesLearningHeader",
                "text": "Learning",
                "type": "header"
            },
            {
                "id": "outcomesLearnedAboutTopic",
                "text": "Did these people say that they learned a lot about the topic by participating in the project?",
                "type": "select",
                "options": "never;occasionally;sometimes;often;mixed"
            },
            {
                "id": "outcomesNewMembersStruggling",
                "text": "Did you notice that new members of the community or organization were having a harder time making sense of things?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed"
            },
            {
                "id": "outcomesInfoWithoutUnderstanding",
                "text": "Were there any issues that these people found difficult to understand, even though abundant information was available?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed"
            },
            {
                "id": "outcomesOverConfident",
                "text": "Did you discover any areas in which these people had more confidence than skill?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed"
            },
            {
                "id": "outcomesCuriousAboutStoryWork",
                "text": "Did any of these participants express an interest in learning more about story work?",
                "type": "select",
                "options": "never;occasionally;sometimes;often;mixed"
            }
        ]
    },
    {
        "id": "page_designInterventions",
        "name": "Design interventions",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "interventionRecommendations",
                "text": "Recommendations for interventions",
                "type": "recommendationTable",
                "options": "interventions"
            },
            {
                "id": "interventionsList",
                "text": "These are the interventions you have designed so far.",
                "type": "grid",
                "options": "page_addIntervention"
            }
        ]
    },
    {
        "id": "page_addIntervention",
        "name": "Design an intervention",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "interventionName",
                "text": "Please name this intervention.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "interventionType",
                "text": "What type of intervention will this be?",
                "shortText": "Type",
                "type": "select",
                "options": "narrative ombudsman;narrative suggestion box;story sharing space;narrative orientation;narrative learning resource;narrative simulation;narrative presentation;dramatic action;sensemaking space;sensemaking pyramid;narrative mentoring program;narrative therapy;participatory theatre;other"
            },
            {
                "id": "interventionText",
                "text": "Please describe your plan for this intervention.",
                "shortText": "Description",
                "type": "text"
            },
            {
                "id": "interventionLength",
                "text": "Over what span of time will this intervention take place?",
                "shortText": "Length",
                "type": "text"
            },
            {
                "id": "interventionTime",
                "text": "When will the intervention start and stop?",
                "shortText": "Time",
                "type": "text"
            },
            {
                "id": "interventionLocation",
                "text": "Where will the intervention take place?",
                "shortText": "Location",
                "type": "text"
            },
            {
                "id": "interventionHelp",
                "text": "What sort of help will you need to carry out this intervention?",
                "shortText": "Help",
                "type": "textarea"
            },
            {
                "id": "interventionPermission",
                "text": "What sorts of permission will you need to carry out this intervention?",
                "shortText": "Permission",
                "type": "textarea"
            },
            {
                "id": "interventionParticipation",
                "text": "How will you get people to participate in this intervention?",
                "shortText": "Participation",
                "type": "textarea"
            },
            {
                "id": "interventionMaterials",
                "text": "What physical materials will you need?",
                "shortText": "Materials",
                "type": "textarea"
            },
            {
                "id": "interventionSpace",
                "text": "What spaces will you need to use?",
                "shortText": "Spaces",
                "type": "textarea"
            },
            {
                "id": "interventionTech",
                "text": "What technological resources will you need?",
                "shortText": "Technology",
                "type": "textarea"
            },
            {
                "id": "interventionRecording",
                "text": "How will record the results of this intervention?",
                "shortText": "Recording",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "page_recordInterventions",
        "name": "Enter intervention records",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "FIXME_857",
                "text": "Interventions",
                "type": "grid",
                "options": "page_addInterventionRecord"
            }
        ]
    },
    {
        "id": "page_addInterventionRecord",
        "name": "Add intervention notes",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "interventionNotesName",
                "text": "Please give this intervention record a name.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "interventionNotesText",
                "text": "Enter your notes here.",
                "shortText": "Notes",
                "type": "textarea"
            },
            {
                "id": "interventionRecordImages",
                "text": "These are the images you have entered for this set of notes so far.",
                "shortText": "Images",
                "type": "grid",
                "options": "page_newInterventionImage"
            }
        ]
    },
    {
        "id": "page_newInterventionImage",
        "name": "Intervention notes image",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "interventionNotesImage",
                "text": "Upload your image here.",
                "shortText": "Image",
                "type": "imageUploader"
            },
            {
                "id": "interventionImageName",
                "text": "Please give this image a name.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "interventionNotesImageNotes",
                "text": "You can enter some notes about this image.",
                "shortText": "Notes",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "page_answerQuestionsAboutInterventions",
        "name": "Reflect on interventions",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "interventionQuestionsLabel",
                "text": "Note: If there are no interventions in this list, enter them in the \"Enter intervention records\" screen first.",
                "type": "label"
            },
            {
                "id": "COMMENT_page_answerQuestionsAboutInterventions_1",
                "text": "// this list should populate with names of interventions given in \"enter intervention records\" screen.",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_answerQuestionsAboutInterventions_2",
                "text": "/// there should be NO add button... but the edit button should go to the popup specified here",
                "type": "label",
                "options": null
            },
            {
                "id": "FIXME_877",
                "text": "Interventions",
                "type": "grid",
                "options": "page_answerQuestionsAboutIntervention"
            }
        ]
    },
    {
        "id": "page_answerQuestionsAboutIntervention",
        "name": "Reflect on intervention",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "FIXME_881",
                "text": "Please name this set of reflections on an intervention.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "interventionReflectChangeLabel",
                "text": "Change",
                "type": "header"
            },
            {
                "id": "interventionReflectChangeEmotions",
                "text": "How did the perceptions of the participants change from the start to the end of the intervention?",
                "shortText": "Change in participant perceptions",
                "type": "textarea"
            },
            {
                "id": "interventionReflectChangeYourEmotions",
                "text": "How did <i>your</i> perceptions change?",
                "shortText": "Change in facilitator perceptions",
                "type": "textarea"
            },
            {
                "id": "interventionReflectProjectChanged",
                "text": "How has the overall project changed as a result of this intervention?",
                "shortText": "Changes to the project",
                "type": "textarea"
            },
            {
                "id": "interventionReflectInteractionsLabel",
                "text": "Interactions",
                "type": "header"
            },
            {
                "id": "interventionReflectInteractionsParticipants",
                "text": "Describe the interactions between participants during this intervention.",
                "shortText": "Interactions among participants",
                "type": "textarea"
            },
            {
                "id": "interventionReflectInteractionsFacilitators",
                "text": "Describe interactions between participants and facilitators.",
                "shortText": "Interactions between participants and facilitators",
                "type": "textarea"
            },
            {
                "id": "interventionReflectStories",
                "text": "What did you notice about the stories people told, retold, chose, and worked with during the intervention?",
                "shortText": "Stories",
                "type": "textarea"
            },
            {
                "id": "interventionReflectLearningLabel",
                "text": "Learning",
                "type": "header"
            },
            {
                "id": "interventionReflectSpecial",
                "text": "What was special about this intervention?",
                "shortText": "Unique features",
                "type": "textarea"
            },
            {
                "id": "interventionReflectSurprise",
                "text": "What surprised you about this intervention?",
                "shortText": "Surprise",
                "type": "textarea"
            },
            {
                "id": "interventionReflectWorkedWellAndNot",
                "text": "Which parts of your plans for this intervention worked out well? Which parts didn't?",
                "shortText": "Worked and didn't work",
                "type": "textarea"
            },
            {
                "id": "interventionReflectNewIdeas",
                "text": "What new ideas did you gain from this intervention? What did you learn from it?",
                "shortText": "New ideas",
                "type": "textarea"
            },
            {
                "id": "interventionReflectExtra",
                "text": "What else do you want to remember about this intervention?",
                "shortText": "Other",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "page_interventionReport",
        "name": "Read intervention report",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "interventionReport",
                "text": "Intervention report",
                "type": "report",
                "options": "intervention"
            },
            {
                "id": "COMMENT_page_interventionReport_1",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_interventionReport_2",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_interventionReport_3",
                "text": "//                                                       RETURN",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_interventionReport_4",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_interventionReport_5",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null
            }
        ]
    },
    {
        "id": "page_return",
        "name": "Return",
        "description": "",
        "isHeader": true,
        "questions": [
            {
                "id": "piecesOfFeedbackEntered",
                "text": "Pieces of feedback entered:",
                "type": "listCount",
                "options": "feedbackList"
            },
            {
                "id": "questionsAnsweredAboutProject",
                "text": "Questions answered about project:",
                "type": "questionAnswerCountOfTotalOnPage",
                "options": "page_reflectOnProject"
            },
            {
                "id": "elementsInProjectPresentation",
                "text": "Elements in project presentation:",
                "type": "listCount",
                "options": "projectPresentationElementsList"
            },
            {
                "id": "presentationReportFinished",
                "text": "Presentation report finished:",
                "type": "questionAnswer",
                "options": "presentationReportFinished"
            },
            {
                "id": "numberOfPeopleInterestedInFutureProjects",
                "text": "Number of people interested in future projects:",
                "type": "listCount",
                "options": "interestedPeopleList"
            },
            {
                "id": "requestsForHelp",
                "text": "Requests received about project:",
                "type": "listCount",
                "options": "projectRequestsList"
            }
        ]
    },
    {
        "id": "page_gatherFeedback",
        "name": "Gather feedback",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "feedbackList",
                "text": "These are the pieces of feedback you have gathered so far.",
                "type": "grid",
                "options": "page_enterFeedbackPiece"
            },
            {
                "id": "generalFeedback",
                "text": "If you would like to enter any general notes on the feedback you've seen to the project, write them here.",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "page_enterFeedbackPiece",
        "name": "Enter piece of feedback on project",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "feedbackText",
                "text": "What did someone say or do?",
                "shortText": "Feedback",
                "type": "textarea"
            },
            {
                "id": "feedbackName",
                "text": "Please give this piece of feedback a name.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "feedbackType",
                "text": "What type of feedback is this?",
                "shortText": "Type",
                "type": "select",
                "options": "a story;a reference to something that came up in the project;a wish about the future;an opinion;a complaint;an action;other"
            },
            {
                "id": "feedbackWho",
                "text": "Who said or did this?",
                "shortText": "Source",
                "type": "text"
            },
            {
                "id": "feedbackQuestion",
                "text": "What did you say or do (if anything) that led to this feedback?",
                "shortText": "Prompt",
                "type": "text"
            },
            {
                "id": "feedbackNotes",
                "text": "Please enter any other notes you have about this feedback.",
                "shortText": "Notes",
                "type": "textarea"
            },
            {
                "id": "feedbackImage",
                "text": "You can upload an image to accompany your notes here.",
                "shortText": "Image",
                "type": "imageUploader"
            }
        ]
    },
    {
        "id": "page_reflectOnProject",
        "name": "Reflect on the project",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "reflectProjectStories",
                "text": "What have you learned from the stories you heard in this project?",
                "type": "textarea"
            },
            {
                "id": "reflectProjectFacilitation",
                "text": "What did you learn about your facilitation practice in this project?",
                "type": "textarea"
            },
            {
                "id": "reflectProjectPlanning",
                "text": "What did you learn about project planning?",
                "type": "textarea"
            },
            {
                "id": "reflectProjectOwnPNI",
                "text": "How has this project changed your own version of PNI?",
                "type": "textarea"
            },
            {
                "id": "reflectProjectCommunity",
                "text": "What have you learned about your community or organization because of this project?",
                "type": "textarea"
            },
            {
                "id": "reflectProjectPersonalStrengths",
                "text": "What did this project teach you about your personal strengths and weaknesses?",
                "type": "textarea"
            },
            {
                "id": "reflectProjectTeam",
                "text": "What did this project teach you about your team?",
                "type": "textarea"
            },
            {
                "id": "reflectProjectIdeas",
                "text": "Describe any new ideas that came up during this project.",
                "type": "textarea"
            },
            {
                "id": "reflectProjectNotes",
                "text": "Enter any additional notes you'd like to remember about the project.",
                "type": "textarea"
            },
            {
                "id": "reflectProjectImage",
                "text": "You can upload an image to accompany your notes here.",
                "type": "imageUploader"
            }
        ]
    },
    {
        "id": "page_prepareProjectPresentation",
        "name": "Prepare outline of project presentation",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "projectPresentationElementsList",
                "text": "These are the elements in your presentation outline so far.",
                "type": "grid",
                "options": "page_addPresentationElement"
            }
        ]
    },
    {
        "id": "page_addPresentationElement",
        "name": "Add element to project presentation outline",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "presentationElementName",
                "text": "What name would you like to give this element in your presentation?",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "presentationElementStatement",
                "text": "How would you like to describe this element in your presentation?",
                "shortText": "Description",
                "type": "textarea"
            },
            {
                "id": "presentationElementEvidence",
                "text": "What evidence does this element present that your project met its goals?",
                "shortText": "Evidence",
                "type": "textarea"
            },
            {
                "id": "presentationElementQA",
                "text": "What questions do you anticipate about this element, and how would you like to answer them?",
                "shortText": "Q&A",
                "type": "textarea"
            },
            {
                "id": "presentationElementNotes",
                "text": "Enter any other notes you want to remember about this element as you present it.",
                "shortText": "Notes",
                "type": "textarea"
            },
            {
                "id": "presentationLabel",
                "text": "Now you can export your outline, open it in your word processor, and add material to it\nfrom any of the stage reports (or the final project report).",
                "type": "label"
            },
            {
                "id": "exportPresentationOutline",
                "text": "Export this outline",
                "type": "button"
            },
            {
                "id": "FIXME_964",
                "text": "Have you finished your presentation report?",
                "type": "select",
                "options": "yes;no;I'm not making a project presentation"
            }
        ]
    },
    {
        "id": "page_interestedPeople",
        "name": "Interested people",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "interestedPeopleList",
                "text": "These are the people who have said they are interested in future projects.",
                "type": "grid",
                "options": "page_addInterestedPerson"
            }
        ]
    },
    {
        "id": "page_addInterestedPerson",
        "name": "Add person interested in project",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "interestedPersonName",
                "text": "What is the person's name (and position if applicable)?",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "interestedPersonContactDetails",
                "text": "Enter any contact details here.",
                "shortText": "Contact details",
                "type": "textarea"
            },
            {
                "id": "interestedPersonType",
                "text": "How do they want to be connected to future projects?",
                "shortText": "Preference",
                "type": "select",
                "options": "they want to be informed;they want to be consulted;they want to collaborate;other"
            },
            {
                "id": "interestedPersonNotes",
                "text": "Enter any notes about this person's interest in future projects here.",
                "shortText": "Notes",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "page_projectRequests",
        "name": "Respond to requests for post-project support",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "projectRequestsList",
                "text": "These are the requests you have entered so far.",
                "type": "grid",
                "options": "page_addNewProjectRequest"
            }
        ]
    },
    {
        "id": "page_addNewProjectRequest",
        "name": "Enter project request",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "requestText",
                "text": "What was the request?",
                "shortText": "Request",
                "type": "textarea"
            },
            {
                "id": "requestType",
                "text": "What type of request is this?",
                "shortText": "Type",
                "type": "select",
                "options": "help with their own projects;help with sustaining story exchange;help with examining this project's stories and results;help learning about story work;other"
            },
            {
                "id": "requestMet",
                "text": "Do you consider this request to have been satisfied?",
                "shortText": "Satisfied",
                "type": "boolean"
            },
            {
                "id": "requestWhatHappened",
                "text": "What has happened in relation to this request?",
                "shortText": "What happened",
                "type": "textarea"
            },
            {
                "id": "requestNotes",
                "text": "Enter any notes about the request here.",
                "shortText": "Notes",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "page_returnReport",
        "name": "Read return report",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "returnReport",
                "text": "Return report",
                "type": "report",
                "options": "return"
            }
        ]
    },
    {
        "id": "page_projectReport",
        "name": "Project report",
        "description": "",
        "isHeader": true,
        "questions": [
            {
                "id": "projectReport",
                "text": "Project report",
                "type": "report",
                "options": "project"
            }
        ]
    }
]);
