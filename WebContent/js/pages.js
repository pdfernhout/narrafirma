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
                "id": "mainDashboardLabel",
                "text": "Welcome to PNI Workbook. You can use this software to:\n<ul>\n<li>plan your PNI project</li>\n<li>decide how you will collect stories</li>\n<li>write questions about stories</li>\n<li>plan group story sessions (and record what went on in them)</li>\n<li>collect or enter stories (and answers to questions)</li>\n<li>look at patterns in collected stories and answers</li>\n<li>build catalytic material</li>\n<li>plan sensemaking sessions (and record what went on in them)</li>\n<li>plan interventions (and record what went on in them)</li>\n<li>gather project feedback</li>\n<li>reflect on the project</li>\n<li>present the project to others</li>\n<li>preserve what you learned so you can use it on the next project</li>\n</ul>\n<p>Note: When finished, this page will bring together all of the dashboard pages from\nthe phases of the project.</p>",
                "type": "label"
            },
            {
                "id": "project_testImage",
                "text": "This software is a companion for the book \"Working with Stories in  Your Community or Organization\" by Cynthia F. Kurtz",
                "type": "image",
                "options": "images/WWS_BookCover_front_small.png"
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
                "id": "project_projectPlanningLabel",
                "text": "In the planning phase of your PNI project, you will make decisions about how your project will proceed.\nYou will think about your goals, your topic, your participants, and any opportunities and dangers you might encounter during the project.",
                "type": "label"
            },
            {
                "id": "project_generalNotes_planning",
                "text": "You can enter some general notes on planning in this project here.",
                "shortText": "Project general notes",
                "type": "textarea"
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
                "text": "On this page you will enter some facts about your project. The information you enter here will appear in your reports.",
                "type": "label"
            },
            {
                "id": "project_title",
                "text": "What is the project's title?",
                "shortText": "Project title",
                "type": "text"
            },
            {
                "id": "project_communityOrOrganizationName",
                "text": "What is the name of your community or organization?",
                "shortText": "Community/organization name",
                "type": "text"
            },
            {
                "id": "project_topic",
                "text": "Enter a brief name for the project's primary topic.",
                "shortText": "Project topic",
                "type": "text"
            },
            {
                "id": "project_startAndEndDates",
                "text": "What are the project's starting and ending dates?",
                "shortText": "Project start and end",
                "type": "text"
            },
            {
                "id": "project_funders",
                "text": "Who is funding or otherwise supporting the project?",
                "shortText": "Project funders",
                "type": "textarea"
            },
            {
                "id": "project_facilitators",
                "text": "Who is facilitating the project?",
                "shortText": "Project facilitators",
                "type": "textarea"
            },
            {
                "id": "project_reportStartText",
                "text": "Enter any other information you want to appear at the top of project reports.",
                "shortText": "Report start text",
                "type": "textarea"
            },
            {
                "id": "project_reportEndText",
                "text": "Enter any other information you want to appear at the bottom of project reports.",
                "shortText": "Report end text",
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
                "id": "project_draftQuestionsLabel",
                "text": "On this page you will answer some questions about your project's goals, relationships, focus, range, scope, and emphasis.\nIf you don't have good answers for these questions right now, don't worry; you will have a chance to work on these answers again later.",
                "type": "label"
            },
            {
                "id": "project_PNIquestions_goal_draft",
                "text": "What is the goal of the project? Why are you doing it?",
                "type": "textarea"
            },
            {
                "id": "project_PNIquestions_relationships_draft",
                "text": "What relationships are important to the project?",
                "type": "textarea"
            },
            {
                "id": "project_PNIquestions_focus_draft",
                "text": "What is the focus of the project? What is it about?",
                "type": "textarea"
            },
            {
                "id": "project_PNIquestions_range_draft",
                "text": "What range(s) of experience will the project cover?",
                "type": "textarea"
            },
            {
                "id": "project_PNIquestions_scope_draft",
                "text": "What is the project's scope? (number of people, number of stories, number of questions about stories)",
                "type": "textarea"
            },
            {
                "id": "project_PNIquestions_emphasis_draft",
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
                "text": "On this page you will think about groups of participants you want to involve in your project.\nExamples might be: doctors and patients; staff and customers; natives, immigrants, and tourists.",
                "type": "label"
            },
            {
                "id": "project_participantGroupsList",
                "text": "Please add participant groups in the list below (typically up to three groups).",
                "type": "grid",
                "options": "page_addParticipantGroup"
            }
        ]
    },
    {
        "id": "page_addParticipantGroup",
        "name": "Participant group",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "participantGroup_name",
                "text": "Please name this group of participants (for example, \"doctors\", \"students\", \"staff\").",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "participantGroup_description",
                "text": "Please describe this group of participants.\nFor example, you might want to record any observations you have made about this group.\nWhat do you know about them?",
                "shortText": "Description",
                "type": "textarea"
            },
            {
                "id": "detailsAboutParticipantGroup",
                "text": "Details for the participant group.",
                "type": "label"
            },
            {
                "id": "participantGroupAspects_statusHeader",
                "text": "Status",
                "type": "header"
            },
            {
                "id": "participantGroupAspects_status",
                "text": "What is the status of these participants in the community or organization?",
                "type": "select",
                "options": "unknown;very low;low;moderate;high;very high;mixed"
            },
            {
                "id": "participantGroupAspects_confidence",
                "text": "How much self-confidence do these participants have?",
                "type": "select",
                "options": "unknown;very low;low;medium;high;very high;mixed"
            },
            {
                "id": "participantGroupAspects_abilityHeader",
                "text": "Ability",
                "type": "header"
            },
            {
                "id": "participantGroupAspects_time",
                "text": "How much free time do these participants have?",
                "type": "select",
                "options": "unknown;very little;little;some;a lot;mixed"
            },
            {
                "id": "participantGroupAspects_education",
                "text": "What is the education level of these participants?",
                "type": "select",
                "options": "unknown;illiterate;minimal;moderate;high;very high;mixed"
            },
            {
                "id": "participantGroupAspects_physicalDisabilities",
                "text": "Do these participants have physical limitations that will impact their participation?",
                "type": "select",
                "options": "unknown;none;minimal;moderate;strong;mixed"
            },
            {
                "id": "participantGroupAspects_emotionalImpairments",
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
                "id": "participantGroupAspects_performing",
                "text": "For these participants, how important is performing well (with \"high marks\")?",
                "type": "select",
                "options": "unknown;very unimportant;somewhat unimportant;somewhat important;very important;mixed"
            },
            {
                "id": "participantGroupAspects_conforming",
                "text": "For these participants, how important is conforming (to what is \"normal\" or expected)?",
                "type": "select",
                "options": "unknown;very unimportant;somewhat unimportant;somewhat important;very important;mixed"
            },
            {
                "id": "participantGroupAspects_promoting",
                "text": "For these participants, how important is self-promotion (competing with others)?",
                "type": "select",
                "options": "unknown;very unimportant;somewhat unimportant;somewhat important;very important;mixed"
            },
            {
                "id": "participantGroupAspects_venting",
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
                "id": "participantGroupAspects_interest",
                "text": "How motivated are these participants to participate in the project?",
                "type": "select",
                "options": "unknown;very little;a little;some;a lot;extremely;mixed"
            },
            {
                "id": "participantGroupAspects_feelings_project",
                "text": "How are these participants likely to feel about the project?",
                "type": "select",
                "options": "unknown;negative;neutral;positive;mixed"
            },
            {
                "id": "participantGroupAspects_feelings_facilitator",
                "text": "How do these participants feel about you?",
                "type": "select",
                "options": "unknown;negative;neutral;positive;mixed"
            },
            {
                "id": "participantGroupAspects_feelings_stories",
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
                "id": "participantGroupAspects_topic_feeling",
                "text": "What experiences have these participants had with the project's topic?",
                "type": "select",
                "options": "unknown;strongly negative;negative;neutral;positive;strongly positive;mixed"
            },
            {
                "id": "participantGroupAspects_topic_private",
                "text": "How private do these participants consider the topic to be?",
                "type": "select",
                "options": "unknown;very private;medium;not private;mixed"
            },
            {
                "id": "participantGroupAspects_topic_articulate",
                "text": "How hard will it be for these participants to articulate their feelings about the topic?",
                "type": "select",
                "options": "unknown;hard;medium;easy;mixed"
            },
            {
                "id": "participantGroupAspects_topic_timeframe",
                "text": "How long of a time period do you need these participants to look back on?",
                "type": "select",
                "options": "unknown;hours;days;months;years;decades;mixed"
            }
        ]
    },
    {
        "id": "page_aboutYou",
        "name": "About you",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "aspects_youHeader",
                "text": "About you",
                "type": "header"
            },
            {
                "id": "aboutYou_experience",
                "text": "How much experience do you have facilitating PNI projects?",
                "type": "select",
                "options": "none;a little;some;a lot"
            },
            {
                "id": "aboutYou_help",
                "text": "How much help will you have carrying out this project?",
                "type": "select",
                "options": "none;a little;some;a lot"
            },
            {
                "id": "aboutYou_tech",
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
                "id": "project_projectStoriesList",
                "text": "On this page you will tell yourself some stories about how your project might play out.\nThese \"project stories\" will help you think about how best to plan the project.",
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
                "text": "Start by choosing a scenario for your project story.",
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
        "id": "page_createProjectStoryElements",
        "name": "Create project story elements",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "storyElementsInstructions",
                "text": "Here are some instructions on how to create story elements from your project stories.\nCreating story elements helps you think about what is going on in the stories you told.\nYou can enter your story elements on the next page.\n<ol>\n<li>Choose one or two types of story element (characters, situations, values, themes, relationships, motivations, beliefs, conflicts).</li>\n<li>For each story, come up with as many answers to that element's question as you can. Write the answers on sticky notes.</li>\n<li>The questions are:</li>\n<ul>\n<li>Characters: Who is doing things in this story?</li>\n<li>Situations: What is going on in this story?</li>\n<li>Values: What matters to the characters in this story?</li>\n<li>Themes: What is this story about?</li>\n<li>Relationships: How are the characters related in this story?</li>\n<li>Motivations: Why do the characters do what they do in this story?</li>\n<li>Beliefs: What do people believe in this story?</li>\n<li>Conflicts: Who or what stands in opposition in this story?</li>\n</ul>\n<li>Once you have answered the question(s) you chose for each story, cluster the sticky notes into groups. Place like with like.</li>\n<li>Give each group of sticky notes a name.</li>\n<li>Clear a \"halo\" of space around each group's name.</li>\n<li>In the halo, write 2-5 good and bad attributes (advantages and disadvantages, opportunities and dangers) of each group of sticky notes.</li>\n<li>Copy or move the new good/bad attributes to a new space. Mix them all together.</li>\n<li>Cluster the attributes into groups.</li>\n<li>Name the groups. These are your story elements.</li>\n<li>You can enter your story elements on the next page.</li>\n</ol>",
                "type": "label"
            }
        ]
    },
    {
        "id": "page_enterProjectStoryElements",
        "name": "Enter project story elements",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "project_projectStoryElementsList",
                "text": "On this page you can enter the story elements you created on the previous page.",
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
                "id": "storyElement_name",
                "text": "What is the name of the story element?",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "storyElement_type",
                "text": "What type of story element is this?",
                "shortText": "Type",
                "type": "select",
                "options": "character;situation;value;theme;relationship;motivation;belief;conflict"
            },
            {
                "id": "storyElement_description",
                "text": "You can describe the story element more fully here.",
                "shortText": "Description",
                "type": "textarea"
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
                "id": "assessment_intro",
                "text": "On this page you can answer questions about your community or organization to assess its story sharing culture.\nBefore you answer these questions, you should spend some time listening to people share stories together\nin the places where they normally gather.",
                "type": "label"
            },
            {
                "id": "assessment_narrativeFreedom",
                "text": "Narrative freedom",
                "type": "header"
            },
            {
                "id": "assessment_counterStories",
                "text": "As you listened to people talk, how often did you hear a person respond to a story with another story that countered it in some way?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often"
            },
            {
                "id": "assessment_authority",
                "text": "When someone who was obviously in authority was telling stories, how much time and attention did they get?",
                "type": "select",
                "options": "unknown;enthrallment;strong listening;partial listening;nothing special"
            },
            {
                "id": "assessment_mistakes",
                "text": "How many times did you hear people tell stories about mistakes?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often"
            },
            {
                "id": "assessment_silencing",
                "text": "When somebody started telling a story and another person stopped them, how did they stop them?",
                "type": "select",
                "options": "unknown;warning;caution;request;joke"
            },
            {
                "id": "assessment_conflict",
                "text": "When somebody was telling a story and another person disagreed with the storyteller, how did they disagree?",
                "type": "select",
                "options": "unknown;demand;criticism;comment;joke"
            },
            {
                "id": "assessment_narrativeFlow",
                "text": "Narrative flow",
                "type": "header"
            },
            {
                "id": "assessment_remindings",
                "text": "When you listened to people telling stories, did you ever hear people say \"that reminds me of the time\" and then tell a story in response?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often"
            },
            {
                "id": "assessment_retellings",
                "text": "How often did you hear people pass on stories they heard from other people?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often"
            },
            {
                "id": "assessment_folklore",
                "text": "How much evidence did you find for a narrative folklore in your community or organization?",
                "type": "select",
                "options": "unknown;none;little;some;strong"
            },
            {
                "id": "assessment_storyTypes",
                "text": "Did you hear comic stories, tragic stories, epic stories, and funny stories?",
                "type": "select",
                "options": "unknown;no;maybe;I think so;definitely"
            },
            {
                "id": "assessment_sensemaking",
                "text": "Did you ever see people share stories as they prepared to make decisions?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often"
            },
            {
                "id": "assessment_narrativeKnowledge",
                "text": "Narrative knowledge",
                "type": "header"
            },
            {
                "id": "assessment_realStories",
                "text": "Did you see people tell stories that were recountings of events based on emotional experiences from particular perspectives?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often"
            },
            {
                "id": "assessment_negotiations",
                "text": "How lively were the negotiations you heard going on between storytellers and audiences?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often"
            },
            {
                "id": "assessment_cotelling",
                "text": "Did you ever see two or more people tell a story together?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often"
            },
            {
                "id": "assessment_blunders",
                "text": "How often did you see someone start telling the wrong story to the wrong people at the wrong time?",
                "type": "select",
                "options": "unknown;often;sometimes;seldom;never"
            },
            {
                "id": "assessment_accounting",
                "text": "Did you see people account for their actions and choices by telling each other stories?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often"
            },
            {
                "id": "assessment_narrativeUnity",
                "text": "Narrative unity",
                "type": "header"
            },
            {
                "id": "assessment_commonStories",
                "text": "How easy would it be to create a list of stories any member of your community or organization could be expected to know?",
                "type": "select",
                "options": "unknown;impossible;difficult;doable;easy"
            },
            {
                "id": "assessment_sacredStories",
                "text": "How easy would it be to create a list of sacred stories, those important to understanding the community or organization?",
                "type": "select",
                "options": "unknown;impossible;difficult;doable;easy"
            },
            {
                "id": "assessment_condensedStories",
                "text": "How easy would it be to create a list of condensed stories, in the form of proverbs or references?",
                "type": "select",
                "options": "unknown;impossible;difficult;doable;easy"
            },
            {
                "id": "assessment_intermingling",
                "text": "How often were the stories you heard intermingled with each other?",
                "type": "select",
                "options": "unknown;never;seldom;sometimes;often"
            },
            {
                "id": "assessment_culture",
                "text": "How easy would it be to describe the unique storytelling culture of your community or organization?",
                "type": "select",
                "options": "unknown;impossible;difficult;doable;easy"
            },
            {
                "id": "assessment_result_header",
                "text": "Narrative score results",
                "type": "header"
            },
            {
                "id": "assessment_result_freedomSubscore",
                "text": "Narrative freedom subscore:",
                "type": "quizScoreResult",
                "options": "assessment_counterStories;assessment_authority;assessment_mistakes;assessment_silencing;assessment_conflict"
            },
            {
                "id": "assessment_result_flowSubscore",
                "text": "Narrative flow subscore:",
                "type": "quizScoreResult",
                "options": "assessment_remindings;assessment_retellings;assessment_folklore;assessment_storyTypes;assessment_sensemaking"
            },
            {
                "id": "assessment_result_knowledgeSubscore",
                "text": "Narrative knowledge subscore:",
                "type": "quizScoreResult",
                "options": "assessment_realStories;assessment_negotiations;assessment_cotelling;assessment_blunders;assessment_accounting"
            },
            {
                "id": "assessment_result_unitySubscore",
                "text": "Narrative unity subscore:",
                "type": "quizScoreResult",
                "options": "assessment_commonStories;assessment_sacredStories;assessment_condensedStories;assessment_intermingling;assessment_culture"
            },
            {
                "id": "assessment_result_grandTotal",
                "text": "This is your combined test result:",
                "type": "quizScoreResult",
                "options": "assessment_counterStories;assessment_authority;assessment_mistakes;assessment_silencing;assessment_conflict;assessment_remindings;assessment_retellings;assessment_folklore;assessment_storyTypes;assessment_sensemaking;assessment_realStories;assessment_negotiations;assessment_cotelling;assessment_blunders;assessment_accounting;assessment_commonStories;assessment_sacredStories;assessment_condensedStories;assessment_intermingling;assessment_culture"
            },
            {
                "id": "assessment_notes",
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
                "text": "On this page you can review and improve your draft answers to the PNI planning questions\nbased on your consideration of project aspects and your project stories.",
                "type": "label"
            },
            {
                "id": "project_PNIquestions_copyDraftsButton",
                "text": "Copy the original draft versions into the answers below",
                "type": "button"
            },
            {
                "id": "project_PNIquestions_goal_final",
                "text": "What is the goal of the project? Why are you doing it?",
                "type": "textarea"
            },
            {
                "id": "project_PNIquestions_relationships_final",
                "text": "What relationships are important to the project?",
                "type": "textarea"
            },
            {
                "id": "project_PNIquestions_focus_final",
                "text": "What is the focus of the project? What is it about?",
                "type": "textarea"
            },
            {
                "id": "project_PNIquestions_range_final",
                "text": "What range(s) of experience will the project cover?",
                "type": "textarea"
            },
            {
                "id": "project_PNIquestions_scope_final",
                "text": "What is the project's scope? (number of people, number of stories, number of questions about stories)",
                "type": "textarea"
            },
            {
                "id": "project_PNIquestions_emphasis_final",
                "text": "Which phases of PNI will be important to the project? (indicate most and least important phases)",
                "type": "textarea"
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
                "id": "project_synopsis",
                "text": "On this page you can write your project synopsis, a one or two sentence summary of what matters most about your project.",
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
                "id": "project_readPlanningReportIntroductionLabel",
                "text": "This report shows all of the information entered in the pages grouped under \"Planning.\"",
                "type": "label"
            },
            {
                "id": "planningReport",
                "text": "Project planning report",
                "type": "report",
                "options": "planning"
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
                "id": "project_collectionDesignStartLabel",
                "text": "In the collection design phase of your PNI project, you will decide on story collection venues,\ncreate some story eliciting and story interpretation questions, design your story collection form, and plan any story collection sessions you want to hold.",
                "type": "label"
            },
            {
                "id": "project_generalNotes_collectionDesign",
                "text": "You can enter some general notes on collection design in this project here.",
                "type": "textarea"
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
                "id": "venueRecommendationsTable_unfinished",
                "text": "(Unfinished: This will be a table of venue recommendations\nrelated to the questions answered about participant groups.",
                "type": "label"
            },
            {
                "id": "mockup_recTable_venues",
                "text": "It will look something like this.)",
                "type": "image",
                "options": "images/mockups/mockupRecTable.png"
            },
            {
                "id": "venuesTable",
                "text": "Please answer these questions about your collection venues for each participant group.",
                "type": "questionsTable",
                "options": "page_venuesTable;participants_firstGroupName,participants_secondGroupName,participants_thirdGroupName"
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
                "id": "venue_primaryForGroup_type",
                "text": "Choose a primary means of story collection for this group.",
                "type": "select",
                "options": "individual interviews;group interviews;peer interviews;group story sessions;surveys;journals;narrative incident reports;gleaned stories;other"
            },
            {
                "id": "venue_primaryForGroup_plans",
                "text": "Describe your story collection plans for this group and venue.",
                "type": "textarea"
            },
            {
                "id": "venue_secondaryForGroup_type",
                "text": "If you want to collect stories in a second way for this same group, choose one of these options.",
                "type": "select",
                "options": "individual interviews;group interviews;peer interviews;group story sessions;surveys;journals;narrative incident reports;gleaned stories;other"
            },
            {
                "id": "venue_secondaryForGroup_plans",
                "text": "Describe your secondary story collection plans for this group and venue.",
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
                "id": "project_elicitingQuestionsLabel",
                "text": "On this page you will design the eliciting questions you use to ask people to tell stories.\nYou need at least one question for people to answer. Giving people more than one question to choose from\nis recommended.",
                "type": "label"
            },
            {
                "id": "project_elicitingQuestionsList",
                "text": "These are the questions you will be asking.",
                "type": "grid",
                "options": "page_addElicitingQuestion"
            },
            {
                "id": "elicitingQuestionRecommendations",
                "text": "Recommendations for eliciting questions",
                "type": "recommendationTable",
                "options": "Eliciting questions"
            },
            {
                "id": "elicitingRecommendationsTable_unfinished",
                "text": "(Unfinished: This will be a table of recommendations for eliciting questions\nrelated to the questions answered about participant groups.",
                "type": "label"
            },
            {
                "id": "mockup_recTable_eliciting",
                "text": "It will look something like this.)",
                "type": "image",
                "options": "images/mockups/mockupRecTable.png"
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
                "id": "elicitingQuestion_text",
                "text": "Enter a story-eliciting question.",
                "shortText": "Question",
                "type": "textarea"
            },
            {
                "id": "elicitingQuestion_type",
                "text": "What type of question is this?",
                "shortText": "Type",
                "type": "checkBoxes",
                "options": "what happened;directed question;undirected questions;point in time;event;extreme;surprise;people, places, things;fictional scenario;other"
            },
            {
                "id": "templates_elicitingQuestions",
                "text": "Or choose a question from this list.",
                "type": "templateList",
                "options": "elicitingQuestions"
            },
            {
                "id": "templates_elicitingQuestions_unfinished",
                "text": "(Unfinished: This will be a list of template questions the user can copy.)",
                "type": "label"
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
                "id": "project_storyQuestionsLabel",
                "text": "On this page you will write your questions to ask people about their stories.",
                "type": "label"
            },
            {
                "id": "project_storyQuestionsList",
                "text": "These are the questions you will be asking about stories.",
                "type": "grid",
                "options": "page_addStoryQuestion"
            },
            {
                "id": "storyQuestionRecommendations",
                "text": "Recommendations for story questions",
                "type": "recommendationTable",
                "options": "storyQuestions"
            },
            {
                "id": "storyQuestionRecommendationsTable_unfinished",
                "text": "(Unfinished: This will be a table of recommendations for story questions\nrelated to the questions answered about participant groups.",
                "type": "label"
            },
            {
                "id": "mockup_recTable_storyQ",
                "text": "It will look something like this.)",
                "type": "image",
                "options": "images/mockups/mockupRecTable.png"
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
                "id": "storyQuestion_text",
                "text": "Enter a question to ask people about their stories.",
                "shortText": "Question",
                "type": "textarea"
            },
            {
                "id": "storyQuestion_type",
                "text": "What type of question is this?\nThe question types are:\n<ul>\n<li>boolean: yes and no choices</li>\n<li>label: not a question, just text</li>\n<li>header: same as a label, only in bold</li>\n<li>checkbox: one check box (enter label in options)</li>\n<li>checkBoxes: a series of checkboxes (enter label in options)</li>\n<li>text: a one-line free text field</li>\n<li>textarea: a multi-line free text field</li>\n<li>select: a drop-down box (enter choices in options)</li>\n<li>radio: a set of mutually-exclusive radio buttons (enter choices in options)</li>\n<li>slider: a range from 0 to 100 (enter end labels in options)</li>\n</ul>",
                "shortText": "Type",
                "type": "select",
                "options": "boolean;label;header;checkbox;checkBoxes;text;textarea;select;radio;slider"
            },
            {
                "id": "storyQuestion_shortName",
                "text": "Enter a short name we can use to refer to the question. (It must be unique within the project.)",
                "shortText": "Short name",
                "type": "text"
            },
            {
                "id": "storyQuestion_options",
                "text": "If your question requires choices, enter them here (one per line).",
                "shortText": "Options",
                "type": "textarea"
            },
            {
                "id": "storyQuestion_help",
                "text": "If you want to provide popup help to people answering the question, enter it here.",
                "shortText": "Help",
                "type": "textarea"
            },
            {
                "id": "templates_storyQuestions",
                "text": "Or choose a question from this list.",
                "type": "templateList",
                "options": "storyQuestions"
            },
            {
                "id": "templates_storyQuestions_unfinished",
                "text": "(Unfinished: This will be a list of template questions the user can copy.)",
                "type": "label"
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
                "id": "project_participantQuestionsLabel",
                "text": "On this page you will write questions to ask people about themselves.",
                "type": "label"
            },
            {
                "id": "project_participantQuestionsList",
                "text": "These are the questions you will be asking people about themselves.",
                "type": "grid",
                "options": "page_addParticipantQuestion"
            },
            {
                "id": "participantQuestionRecommendations",
                "text": "Recommendations for participant questions",
                "type": "recommendationTable",
                "options": "participantQuestions"
            },
            {
                "id": "participantQuestionRecommendations_unfinished",
                "text": "(Unfinished: This will be a table of recommendations for participant questions\nrelated to the questions answered about participant groups.",
                "type": "label"
            },
            {
                "id": "mockup_recTable_partQ",
                "text": "It will look something like this.)",
                "type": "image",
                "options": "images/mockups/mockupRecTable.png"
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
                "id": "participantQuestion_text",
                "text": "Enter a question to ask people about themselves.",
                "shortText": "Question",
                "type": "textarea"
            },
            {
                "id": "participantQuestion_type",
                "text": "What type of question is this?",
                "shortText": "Type",
                "type": "select",
                "options": "boolean;label;header;checkbox;checkBoxes;text;textarea;select;radio;slider"
            },
            {
                "id": "participantQuestion_shortName",
                "text": "Enter a short name we can use to refer to the question. (It must be unique within the project.)",
                "shortText": "Short name",
                "type": "text"
            },
            {
                "id": "participantQuestion_options",
                "text": "If your question has choices, enter them here (one per line).",
                "shortText": "Options",
                "type": "textarea"
            },
            {
                "id": "participantQuestion_help",
                "text": "If you want to provide help to people answering the question, enter it here.",
                "shortText": "Help",
                "type": "textarea"
            },
            {
                "id": "templates_participantQuestions",
                "text": "Or choose a question from this list.",
                "type": "templateList",
                "options": "participantQuestions"
            },
            {
                "id": "templates_participantQuestions_unfinished",
                "text": "(Unfinished: This will be a list of template questions the user can copy.)",
                "type": "label"
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
                "id": "questionFormLabel",
                "text": "On this page you will add any information you want to place on your question form other than the questions on it.",
                "type": "label"
            },
            {
                "id": "questionForm_title",
                "text": "Please enter a title for the question form.",
                "type": "text"
            },
            {
                "id": "questionForm_image",
                "text": "You can link to a logo or other image to show at the top of the form.",
                "type": "text"
            },
            {
                "id": "questionForm_startText",
                "text": "Please enter an introduction to be shown at the start of the form, after the title.",
                "type": "textarea"
            },
            {
                "id": "questionForm_endText",
                "text": "Please enter any text to be shown at the end of the form.",
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
                "id": "collectionSessionsLabel",
                "text": "On this page you will design group sessions in which you will collect stories.\nIf you don't plan to collect stories using group sessions, you can skip this page.",
                "type": "label"
            },
            {
                "id": "collectionSessionRecommendations",
                "text": "Recommendations for story collection sessions",
                "type": "recommendationTable",
                "options": "collectionSessions"
            },
            {
                "id": "collectionRecommendationsTable_unfinished",
                "text": "(Unfinished: This will be a table of recommendations for collection sessions\nrelated to the questions answered about participant groups.",
                "type": "label"
            },
            {
                "id": "mockup_recTable_collection",
                "text": "It will look something like this.)",
                "type": "image",
                "options": "images/mockups/mockupRecTable.png"
            },
            {
                "id": "project_collectionSessionPlansList",
                "text": "Plans for story collection sessions lay out what you will do and how.\nEach plan can be used in multiple sessions.",
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
                "id": "collectionSessionPlan_name",
                "text": "Please give this session plan a name.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "collectionSessionPlan_repetitions",
                "text": "How many repetitions of the session will there be?",
                "shortText": "Repetitions",
                "type": "text"
            },
            {
                "id": "collectionSessionPlan_duration",
                "text": "How long will each session be?",
                "shortText": "Length",
                "type": "text"
            },
            {
                "id": "collectionSessionPlan_times",
                "text": "At what dates and times will these sessions take place?",
                "shortText": "Time",
                "type": "text"
            },
            {
                "id": "collectionSessionPlan_location",
                "text": "Where will these sessions take place?",
                "shortText": "Location",
                "type": "text"
            },
            {
                "id": "collectionSessionPlan_numPeople",
                "text": "How many people will be invited to each repetition of this session?",
                "shortText": "Number of people",
                "type": "text"
            },
            {
                "id": "collectionSessionPlan_groups",
                "text": "From which participant groups will people be invited?",
                "shortText": "Participant groups",
                "type": "text"
            },
            {
                "id": "collectionSessionPlan_materials",
                "text": "What materials will this session require?",
                "shortText": "Materials",
                "type": "textarea"
            },
            {
                "id": "collectionSessionPlan_details",
                "text": "Enter other details about this session.",
                "shortText": "Other",
                "type": "textarea"
            },
            {
                "id": "collectionSessionPlan_activitiesList",
                "text": "Here you can enter some activities you plan for the session.\nActivities within story collection sessions can be simple instructions or complicated exercises (like the creation of timelines).",
                "type": "grid",
                "options": "page_addCollectionSessionActivity"
            },
            {
                "id": "collectionSessionPlan_printCollectionSessionAgendaButton",
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
                "id": "collectionSessionPlan_activity_name",
                "text": "Please give this activity a name.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "collectionSessionPlan_activity_type",
                "text": "What type of activity is this?",
                "shortText": "Type",
                "type": "select",
                "options": "ice-breaker;sharing stories (no task);sharing stories (simple task);discussing stories;twice-told stories exercise;timeline exercise;landscape exercise;my own exercise;other"
            },
            {
                "id": "collectionSessionPlan_activity_plan",
                "text": "Describe the plan for this activity.",
                "shortText": "Plan",
                "type": "textarea"
            },
            {
                "id": "collectionSessionPlan_activity_optionalParts",
                "text": "Describe any optional elaborations you might or might not use in this activity.",
                "shortText": "Optional elaborations",
                "type": "textarea"
            },
            {
                "id": "collectionSessionPlan_activity_duration",
                "text": "How long will this activity take?",
                "shortText": "Length",
                "type": "text"
            },
            {
                "id": "collectionSessionPlan_activity_recording",
                "text": "How will stories be recorded during this activity?",
                "shortText": "Recording",
                "type": "textarea"
            },
            {
                "id": "collectionSessionPlan_activity_materials",
                "text": "What materials will be provided for this activity?",
                "shortText": "Materials",
                "type": "textarea"
            },
            {
                "id": "collectionSessionPlan_activity_spaces",
                "text": "What spaces will be used for this activity?",
                "shortText": "Spaces",
                "type": "textarea"
            },
            {
                "id": "collectionSessionPlan_activity_facilitation",
                "text": "What sort of facilitation will be necessary for this activity?",
                "shortText": "Facilitation",
                "type": "textarea"
            },
            {
                "id": "templates_storyCollectionActivities",
                "text": "Or choose an activity from this list.",
                "type": "templateList",
                "options": "storyCollectionActivities"
            },
            {
                "id": "templates_storyCollectionActivities_unfinished",
                "text": "(Unfinished: This will be a list of template activities the user can copy.)",
                "type": "label"
            }
        ]
    },
    {
        "id": "page_readCollectionDesignReport",
        "name": "Read collection design report",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "project_readCollectionDesignReportIntroductionLabel",
                "text": "This report shows all of the information entered in the pages grouped under \"Collection design.\"",
                "type": "label"
            },
            {
                "id": "collectionDesignReport",
                "text": "Collection design report",
                "type": "report",
                "options": "collectionDesign"
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
                "id": "collectionProcessIntro",
                "text": "In the collection process phase of your PNI project, you will review incoming stories and enter records of story collection sessions.",
                "type": "label"
            },
            {
                "id": "project_generalNotes_collectionProcess",
                "text": "You can enter some general notes on your collection process in this project here.",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "page_finalizeQuestionForms",
        "name": "Print question forms",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "printQuestionsForm_introduction",
                "text": "On this page you can print your story questions form for distribution to participants.",
                "type": "label"
            },
            {
                "id": "printQuestionsForm_printFormButton",
                "text": "Print story form",
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
                "id": "webStoryCollection_startCollectionLabel",
                "text": "If you are doing story collection over the internet, click this button to make the web form \"live\" and able to be used by people other than yourself.",
                "type": "label"
            },
            {
                "id": "webStoryCollection_enableDisableButton",
                "text": "Enable web story collection:",
                "shortText": "Enable web story collection",
                "type": "toggleButton"
            },
            {
                "id": "webStoryCollection_copyStoryFormURLButton",
                "text": "Copy story form web URL link",
                "type": "button"
            }
        ]
    },
    {
        "id": "page_enterStories",
        "name": "Enter stories",
        "description": "",
        "isHeader": false,
        "questions": []
    },
    {
        "id": "page_reviewIncomingStories",
        "name": "Review incoming stories",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "collectedStoriesDuringCollectionLabel",
                "text": "On this page you can see your collected stories as they come in.",
                "type": "label"
            },
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
                "id": "webStoryCollection_stopCollectionLabel",
                "text": "If you are doing story collection over the internet, click this button to make the web form unavailable (to anyone but yourself). You can re-enable story collection later by going back to a previous page.",
                "type": "label"
            },
            {
                "id": "webStoryCollection_disableWebStoryFormAfterStoryCollectionButton",
                "text": "Disable web story collection",
                "shortText": "Disable web story collection",
                "type": "button"
            },
            {
                "id": "webStoryCollection_enabledTracker",
                "text": "Web story collection enabled:",
                "type": "questionAnswer",
                "options": "webStoryCollection_enableDisableButton"
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
                "id": "project_collectionRecordsIntroductionLabel",
                "text": "On this page you can enter records for the group story sessions you held.\nIf you did not hold any group story sessions, you can skip this page.",
                "type": "label"
            },
            {
                "id": "project_collectionSessionRecordsList",
                "text": "Enter here what went on in your story collection sessions.",
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
                "id": "collectionSessionRecord_name",
                "text": "Please give this session record a name.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "collectionSessionRecord_whenWhere",
                "text": "When and where did the session take place?",
                "shortText": "When and where",
                "type": "textarea"
            },
            {
                "id": "collectionSessionRecord_participants",
                "text": "Describe the participants at this session.",
                "shortText": "Who attended",
                "type": "textarea"
            },
            {
                "id": "collectionSessionRecord_plan",
                "text": "Which of your collection session plans did you follow in this session? (And did you stick to the plan?)",
                "shortText": "Plan",
                "type": "textarea"
            },
            {
                "id": "collectionSessionRecord_notes",
                "text": "Enter additional notes on the session here.\nYour notes can include links to images or other documents.",
                "shortText": "Notes",
                "type": "textarea"
            },
            {
                "id": "collectionSessionRecord_constructionsList",
                "text": "People in your story collection sessions might have created constructions\nsuch as timelines or landscapes. You can enter details about those here.",
                "type": "grid",
                "options": "page_newCollectionSessionConstruction"
            },
            {
                "id": "collectionSessionRecord_reflectionsLabel",
                "text": "Use the questions below to reflect on the session.",
                "type": "label"
            },
            {
                "id": "collectionSessionRecord_reflectionsOnChangeHeader",
                "text": "Change",
                "type": "header"
            },
            {
                "id": "collectionSessionRecord_reflections_change_participantPerceptions",
                "text": "How did the perceptions of the participants change from the start to the end of the session?",
                "shortText": "Change in participant perceptions",
                "type": "textarea"
            },
            {
                "id": "collectionSessionRecord_reflections_change_yourPerceptions",
                "text": "How did <i>your</i> perceptions change?",
                "shortText": "Change in facilitator perceptions",
                "type": "textarea"
            },
            {
                "id": "collectionSessionRecord_reflections_change_project",
                "text": "How has the overall project changed as a result of this session?",
                "shortText": "Changes to the project",
                "type": "textarea"
            },
            {
                "id": "collectionSessionRecord_interactionsHeader",
                "text": "Interactions",
                "type": "header"
            },
            {
                "id": "collectionSessionRecord_reflections_interaction_participants",
                "text": "Describe the interactions between participants in this session.",
                "shortText": "Interactions among participants",
                "type": "textarea"
            },
            {
                "id": "collectionSessionRecord_reflections_interaction_participantsAndFacilitator",
                "text": "Describe interactions between participants and facilitators.",
                "shortText": "Interactions between participants and facilitators",
                "type": "textarea"
            },
            {
                "id": "collectionSessionRecord_reflections_interaction_stories",
                "text": "What did you notice about the stories people told, retold, chose, and worked with during the session?",
                "shortText": "Stories",
                "type": "textarea"
            },
            {
                "id": "collectionSessionRecord_learningHeader",
                "text": "Learning",
                "type": "header"
            },
            {
                "id": "collectionSessionRecord_reflections_learning_special",
                "text": "What was special about these people in this place on this day?",
                "shortText": "Unique features",
                "type": "textarea"
            },
            {
                "id": "collectionSessionRecord_reflections_learning_surprise",
                "text": "What surprised you about this session?",
                "shortText": "Surprise",
                "type": "textarea"
            },
            {
                "id": "collectionSessionRecord_reflections_learning_workedWell",
                "text": "Which parts of your plans for this session worked out well? Which parts didn't?",
                "shortText": "Worked and didn't work",
                "type": "textarea"
            },
            {
                "id": "collectionSessionRecord_reflections_learning_newIdeas",
                "text": "What new ideas did you gain from this session? What did you learn from it?",
                "shortText": "New ideas",
                "type": "textarea"
            },
            {
                "id": "collectionSessionRecord_reflections_learning_wantToRemember",
                "text": "What else do you want to remember about this session?",
                "shortText": "Other",
                "type": "textarea"
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
                "id": "collectionSessionRecord_construction_name",
                "text": "Please give this construction a name.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "collectionSessionRecord_construction_type",
                "text": "What type of construction is it?",
                "shortText": "Type",
                "type": "select",
                "options": "timeline;landscape;other"
            },
            {
                "id": "collectionSessionRecord_construction_description",
                "text": "Please describe the construction (or include a description given by participants).\nYour description can include links to images or other documents.",
                "shortText": "Description",
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
                "id": "project_collectionProcessReportLabel",
                "text": "This report shows all of the information entered in the pages grouped under \"Collection process.\"",
                "type": "label"
            },
            {
                "id": "project_collectionProcessReport",
                "text": "Collection process report",
                "type": "report",
                "options": "collectionProcess"
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
                "id": "catalysisIntro",
                "text": "In the catalysis phase of your PNI project, you will look for patterns\nand pepare materials for use in sensemaking.",
                "type": "label"
            },
            {
                "id": "project_generalNotes_catalysis",
                "text": "You can enter some general notes on catalysis in this project here.",
                "type": "textarea"
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
                "id": "collectedStoriesAfterCollectionLabel",
                "text": "On this page you will review your collected stories.\nYou can save stories (or groups of stories) to observations for later use.\nYou can also save excerpts (parts of stories) for later use.",
                "type": "label"
            },
            {
                "id": "collectedStoriesAfterCollection",
                "text": "Collected stories",
                "type": "storyBrowser",
                "options": "addToObservation:\"page_addToObservation\";addToExcerpt:\"page_addToExcerpt\""
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
                "id": "themeStoriesLabel",
                "text": "On this page you will derive emergent themes from the collected stories.\nThe themes will appear in your data as answers to a \"Theme\" question, creating patterns you can use.",
                "type": "label"
            },
            {
                "id": "themeStories",
                "text": "Theme stories",
                "type": "storyThemer"
            },
            {
                "id": "mockupThemingLabel_unfinished",
                "text": "(Unfinished: The user will use this area to theme stories.",
                "type": "label"
            },
            {
                "id": "mockup_theming",
                "text": "It will look something like this.)",
                "type": "image",
                "options": "images/mockups/mockupTheming.png"
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
                "id": "graphBrowserLabel",
                "text": "On this page you can look at patterns in the answers people gave about their stories,\nand save patterns to observations for later use.",
                "type": "label"
            },
            {
                "id": "graphBrowserDisplay",
                "text": "Graph browser",
                "type": "graphBrowser"
            },
            {
                "id": "graphBrowserMockupLabel_unfinished",
                "text": "(Unfinished: This area will show graphs of patterns in the data.",
                "type": "label"
            },
            {
                "id": "mockup_graphBrowser",
                "text": "It will look something like this.)",
                "type": "image",
                "options": "images/mockups/mockupGraphs.png"
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
                "id": "reviewTrendsLabel",
                "text": "On this page you will look over the most significant statistical results\nand save some to observations for later use.",
                "type": "label"
            },
            {
                "id": "reviewTrends_minSubsetSize",
                "text": "How large should subsets of stories be to be considered for comparison?",
                "type": "select",
                "options": "20;30;40;50"
            },
            {
                "id": "reviewTrends_significanceThreshold",
                "text": "What significance threshold do you want reported?",
                "type": "select",
                "options": "0.05;0.01"
            },
            {
                "id": "reviewTrends_display",
                "text": "Trends report",
                "type": "trendsReport"
            },
            {
                "id": "mockupTrendsLabel_unfinished",
                "text": "(Unfinished: This area will show the most significant statistical trends.",
                "type": "label"
            },
            {
                "id": "mockup_trends",
                "text": "It will look something like this.)",
                "type": "image",
                "options": "images/mockups/mockupTrends.png"
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
                "id": "addToObservation_introduction",
                "text": "Note: You should not add any observations that depend on patterns among stories until after\nall stories have been entered.",
                "type": "label"
            },
            {
                "id": "observationsListChoose",
                "text": "Choose an observation from this list to which to add the selected result, or create a new observation.",
                "type": "observationsList"
            },
            {
                "id": "addToObservation_addResultToExistingObservationButton",
                "text": "Add result to selected observation",
                "type": "button"
            },
            {
                "id": "addToObservation_createNewObservationWithResultButton",
                "text": "Create new observation with this result",
                "type": "button",
                "options": "page_createNewObservation"
            }
        ]
    },
    {
        "id": "page_createOrEditObservation",
        "name": "Create new observation",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "observation_name",
                "text": "Please give this observation a name.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "observation_text",
                "text": "Please describe this observation.",
                "shortText": "Observation",
                "type": "textarea"
            },
            {
                "id": "observation__observationResultsList",
                "text": "These are the results you have selected to include in this observation.",
                "shortText": "Results",
                "type": "accumulatedItemsGrid",
                "options": "collectedStoriesAfterCollection"
            },
            {
                "id": "observation_firstInterpretation_text",
                "text": "Enter an interpretation of this observation.\nWhat does it mean?",
                "shortText": "First interpretation",
                "type": "textarea"
            },
            {
                "id": "observation_firstInterpretation_name",
                "text": "Please give this interpretation a short name (so you can refer to it later).",
                "shortText": "First interpretation name",
                "type": "text"
            },
            {
                "id": "observation_firstInterpretation_idea",
                "text": "If you like, you can record an idea that follows from this interpretation.",
                "shortText": "First interpretation idea",
                "type": "textarea"
            },
            {
                "id": "observation_firstInterpretation_excerptsList",
                "text": "You can add excerpts to this interpretation.",
                "shortText": "First interpretation excerpts",
                "type": "grid",
                "options": "page_selectExcerpt"
            },
            {
                "id": "observation_competingInterpretation_text",
                "text": "Now enter an interpretation that competes with the first one.\nWhat <i>else</i> could this pattern mean?",
                "shortText": "Competing interpretation",
                "type": "textarea"
            },
            {
                "id": "observation_competingInterpretation_name",
                "text": "Please give this competing interpretation a short name.",
                "shortText": "Competing interpretation name",
                "type": "text"
            },
            {
                "id": "observation_competingInterpretation_idea",
                "text": "If you like, enter an idea that follows from your competing interpretation.",
                "shortText": "Competing interpretation idea",
                "type": "textarea"
            },
            {
                "id": "observation_competingInterpretation_excerptsList",
                "text": "You can add excerpts to the competing interpretation.",
                "shortText": "Competing interpretation excerpts",
                "type": "grid",
                "options": "page_selectExcerpt"
            },
            {
                "id": "observation_thirdInterpretation_text",
                "text": "If a third interpretation of the pattern comes to mind, enter it here.\nIs there a third thing this pattern could mean?",
                "shortText": "Third interpretation",
                "type": "textarea"
            },
            {
                "id": "observation_thirdInterpretation_name",
                "text": "Please give this third interpretation a short name.",
                "shortText": "Third interpretation name",
                "type": "text"
            },
            {
                "id": "observation_thirdInterpretation_idea",
                "text": "If you like, enter an idea that follows from your third interpretation.",
                "shortText": "Third interpretation idea",
                "type": "textarea"
            },
            {
                "id": "observation_thirdInterpretation_excerptsList",
                "text": "You can add excerpts to the third interpretation.",
                "shortText": "Third interpretation excerpts",
                "type": "grid",
                "options": "page_selectExcerpt"
            }
        ]
    },
    {
        "id": "page_selectExcerpt",
        "name": "Add excerpt to interpretation",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "selectExcerpt_excerptsListDisplay",
                "text": "Collected excerpts",
                "type": "excerptsList"
            },
            {
                "id": "selectExcerpt_addExcerptToInterpretationButton",
                "text": "Add selected excerpt to interpretation",
                "type": "button"
            }
        ]
    },
    {
        "id": "page_addToExcerpt",
        "name": "Add text to excerpt",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "addToExcerpt_excerptsListChoose",
                "text": "Choose an excerpt from this list to which to add the selected text, or create a new excerpt.",
                "type": "excerptsList"
            },
            {
                "id": "addToExcerpt_addTextToExistingExcerptButton",
                "text": "Add text to selected excerpt",
                "type": "button"
            },
            {
                "id": "addToExcerpt_createNewExcerptWithTextButton",
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
                "id": "excerpt_name",
                "text": "Please give this excerpt a name.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "excerpt_text",
                "text": "You can edit the excerpt here.",
                "shortText": "Excerpt",
                "type": "textarea"
            },
            {
                "id": "excerpt_notes",
                "text": "Enter some notes about the excerpt.",
                "shortText": "Notes",
                "type": "textarea"
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
                "id": "project_savedExcerptsList",
                "text": "These are the story excerpts you have saved.",
                "type": "grid",
                "options": "page_createNewExcerpt"
            }
        ]
    },
    {
        "id": "page_interpretObservations",
        "name": "Review and interpret observations",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "project_observationsDisplayList",
                "text": "These are the observations you have collected from the\nbrowse, graph, and trends pages.",
                "type": "grid",
                "options": "page_createOrEditObservation"
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
                "id": "clusterInterpretationsLabel",
                "text": "On this page you will cluster together the interpretations you have collected (based on observations)\nto create perspectives for your catalysis report.\nNote: Do not cluster your interpretations unless you are sure you have finished collecting them.",
                "type": "label"
            },
            {
                "id": "clusterInterpretations_clusterSpace",
                "text": "Cluster interpretations into perspectives",
                "type": "clusterSpace",
                "options": "interpretations"
            },
            {
                "id": "mockupClusteringLabel_unfinished",
                "text": "(Unfinished: This will be a space where perspectives can be clustered\nrelated to the questions answered about participant groups.",
                "type": "label"
            },
            {
                "id": "mockup_clusters",
                "text": "It will look something like this.)",
                "type": "image",
                "options": "images/mockups/mockupClusters.png"
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
                "id": "project_perspectivesLabel",
                "text": "On this page you will describe the perspectives that resulted from clustering\nyour interpretations.",
                "type": "label"
            },
            {
                "id": "project_perspectivesList",
                "text": "These are the perspectives you have created from interpretations.",
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
                "id": "perspective_name",
                "text": "Please give this perspective a name.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "perspective_description",
                "text": "Describe this perspective.",
                "shortText": "Perspective",
                "type": "textarea"
            },
            {
                "id": "perspective_linkedResultsList",
                "text": "Results linked to this perspective",
                "type": "annotationsGrid",
                "options": "page_annotateResultForPerspective"
            },
            {
                "id": "perspective_linkedExcerptsList",
                "text": "Excerpts linked to this perspective",
                "type": "annotationsGrid",
                "options": "page_annotateExcerptForPerspective"
            },
            {
                "id": "perspective_linkedInterpretationsList",
                "text": "Interpretations linked to this perspective",
                "type": "annotationsGrid",
                "options": "page_annotateInterpretationForPerspective"
            }
        ]
    },
    {
        "id": "page_annotateResultForPerspective",
        "name": "Annotate result for perspective",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "perspective_resultLinkageNotes",
                "text": "Enter any notes you want to remember about this result with respect to this perspective.",
                "shortText": "Notes",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "page_annotateExcerptForPerspective",
        "name": "Annotate excerpt for perspective",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "perspective_excerptLinkageNotes",
                "text": "Enter any notes you want to remember about this excerpt with respect to this perspective.",
                "shortText": "Notes",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "page_annotateInterpretationForPerspective",
        "name": "Annotate interpretation for perspective",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "perspective_interpretationLinkageNotes",
                "text": "Enter any notes you want to remember about this interpretation as it is linked to this perspective.",
                "shortText": "Notes",
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
                "id": "catalysisReport_introductionLabel",
                "text": "This report shows all of the information entered in the pages grouped under \"Catalysis.\"",
                "type": "label"
            },
            {
                "id": "catalysisReport",
                "text": "Catalysis report",
                "type": "report",
                "options": "catalysis"
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
                "id": "sensemakingIntroLabel",
                "text": "In the sensemaking phase of your PNI project, you will plan sensemaking sessions and record what happened in them.",
                "type": "label"
            },
            {
                "id": "project_generalNotes_sensemaking",
                "text": "You can enter some general notes on sensemaking in this project here.",
                "type": "textarea"
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
                "id": "project_sensemakingSessionPlansLabel",
                "text": "On this page you create plans for your sensemaking sessions.",
                "type": "label"
            },
            {
                "id": "sensemakingSessionRecommendations",
                "text": "Recommendations for sensemaking sessions",
                "type": "recommendationTable",
                "options": "sensemakingSessions"
            },
            {
                "id": "sensemakingRecommendationsTable_unfinished",
                "text": "(Unfinished: This will be a table of recommendations for sensemaking sessions\nrelated to the questions answered about participant groups.",
                "type": "label"
            },
            {
                "id": "mockup_recTable_sensemaking",
                "text": "It will look something like this.)",
                "type": "image",
                "options": "images/mockups/mockupRecTable.png"
            },
            {
                "id": "project_sensemakingSessionPlansList",
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
                "id": "sensemakingSessionPlan_name",
                "text": "Please give this session plan a name.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "sensemakingSessionPlan_repetitions",
                "text": "How many repetitions of the session will there be?",
                "shortText": "Repetitions",
                "type": "text"
            },
            {
                "id": "sensemakingSessionPlan_duration",
                "text": "How long will this session last?",
                "shortText": "Length",
                "type": "text"
            },
            {
                "id": "sensemakingSessionPlan_times",
                "text": "At what dates and times will the session take place?",
                "shortText": "Time",
                "type": "text"
            },
            {
                "id": "sensemakingSessionPlan_location",
                "text": "Where will these sessions take place?",
                "shortText": "Location",
                "type": "text"
            },
            {
                "id": "sensemakingSessionPlan_numPeople",
                "text": "How many people will be invited to each repetition of this session?",
                "shortText": "Number of people",
                "type": "text"
            },
            {
                "id": "sensemakingSessionPlan_groups",
                "text": "From which participant group(s) will people be invited?",
                "shortText": "Participant groups",
                "type": "text"
            },
            {
                "id": "sensemakingSessionPlan_materials",
                "text": "What materials will this session require?",
                "shortText": "Materials",
                "type": "textarea"
            },
            {
                "id": "sensemakingSessionPlan_details",
                "text": "Enter other details about this session.",
                "shortText": "Other",
                "type": "textarea"
            },
            {
                "id": "sensemakingSessionPlan_activitiesList",
                "text": "Here you can enter some activities you plan for the session.\nActivities within story collection sessions can be simple instructions or complicated exercises (like the creation of timelines).",
                "type": "grid",
                "options": "page_addSensemakingSessionActivity"
            },
            {
                "id": "sensemakingSessionPlan_printSensemakingSessionAgendaButton",
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
                "id": "sensemakingSessionPlan_activity_name",
                "text": "Please give this activity a name.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "sensemakingSessionPlan_activity_type",
                "text": "What type of activity is this?",
                "shortText": "Type",
                "type": "select",
                "options": "ice-breaker;encountering stories (no task);encountering stories (simple task);discussing stories;twice-told stories exercise;timeline exercise;landscape exercise;story elements exercise;composite stories exercise;my own exercise;other"
            },
            {
                "id": "sensemakingSessionPlan_activity_plan",
                "text": "Describe the plan for this activity.",
                "shortText": "Plan",
                "type": "textarea"
            },
            {
                "id": "sensemakingSessionPlan_activity_optionalParts",
                "text": "Describe any optional elaborations you might or might not use in this activity.",
                "shortText": "Optional elaborations",
                "type": "textarea"
            },
            {
                "id": "sensemakingSessionPlan_activity_duration",
                "text": "How long will this activity take?",
                "shortText": "Length",
                "type": "text"
            },
            {
                "id": "sensemakingSessionPlan_activity_recording",
                "text": "Will new stories be recorded during this activity, and if so, how?",
                "shortText": "New stories",
                "type": "textarea"
            },
            {
                "id": "sensemakingSessionPlan_activity_materials",
                "text": "What materials will be provided for this activity?",
                "shortText": "Materials",
                "type": "textarea"
            },
            {
                "id": "sensemakingSessionPlan_activity_spaces",
                "text": "What spaces will be used for this activity?",
                "shortText": "Spaces",
                "type": "textarea"
            },
            {
                "id": "sensemakingSessionPlan_activity_facilitation",
                "text": "What sort of facilitation will be necessary for this activity?",
                "shortText": "Facilitation",
                "type": "textarea"
            },
            {
                "id": "templates_sensemakingActivities",
                "text": "Or choose an activity from this list.",
                "type": "templateList",
                "options": "sensemakingActivities"
            },
            {
                "id": "templates_sensemakingActivities_unfinished",
                "text": "(Unfinished: This will be a list of template activities the user can copy.)",
                "type": "label"
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
                "id": "project_sensemakingSessionRecordsLabel",
                "text": "On this page you will enter records of what happened at your sensemaking sessions.",
                "type": "label"
            },
            {
                "id": "project_sensemakingSessionRecordsList",
                "text": "Enter your sensemaking session records here.",
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
                "id": "sensemakingSessionRecord_name",
                "text": "Please give this session record a name.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "sensemakingSessionRecord_whenWhere",
                "text": "When and where did this session take place?",
                "shortText": "When and where",
                "type": "textarea"
            },
            {
                "id": "sensemakingSessionRecord_participants",
                "text": "Describe the participants at this session.",
                "shortText": "Who attended",
                "type": "textarea"
            },
            {
                "id": "sensemakingSessionRecord_plan",
                "text": "Which of your collection session plans did you follow in this session? (And did you stick to the plan?)",
                "shortText": "Plan",
                "type": "textarea"
            },
            {
                "id": "sensemakingSessionRecord_notes",
                "text": "Enter general notes on the session here.\nYour notes can include links to images or other documents.",
                "shortText": "Notes",
                "type": "textarea"
            },
            {
                "id": "sensemakingSessionRecord_resonantStoriesList",
                "text": "If you discovered any resonant stories (pivot, voice, discovery) in this session,\nenter them here.",
                "type": "grid",
                "options": "page_addResonantStory"
            },
            {
                "id": "sensemakingSessionRecord_outcomesList",
                "text": "If your session ended with creating lists of outcomes (like discoveries and ideas),\nyou can enter them here.",
                "type": "grid",
                "options": "page_newSensemakingSessionOutcome"
            },
            {
                "id": "sensemakingSessionRecord_constructionsList",
                "text": "If your session involve creating any group constructions (like landscapes or timelines),\nyou can describe them here.",
                "type": "grid",
                "options": "page_newSensemakingSessionConstruction"
            },
            {
                "id": "sensemakingSessionRecord_reflectionsLabel",
                "text": "Use the questions below to reflect on the session.",
                "type": "label"
            },
            {
                "id": "sensemakingSessionRecord_reflectionsOnChangeHeader",
                "text": "Change",
                "type": "header"
            },
            {
                "id": "sensemakingSessionRecord_reflections_change_participantPerceptions",
                "text": "How did the perceptions of the participants change from the start to the end of the session?",
                "shortText": "Change in participant perceptions",
                "type": "textarea"
            },
            {
                "id": "sensemakingSessionRecord_reflections_change_yourPerceptions",
                "text": "How did <i>your</i> perceptions change?",
                "shortText": "Change in facilitator perceptions",
                "type": "textarea"
            },
            {
                "id": "sensemakingSessionRecord_reflections_change_project",
                "text": "How has the overall project changed as a result of this session?",
                "shortText": "Changes to the project",
                "type": "textarea"
            },
            {
                "id": "sensemakingSessionRecord_interactionsHeader",
                "text": "Interactions",
                "type": "header"
            },
            {
                "id": "sensemakingSessionRecord_reflections_interaction_participants",
                "text": "Describe the interactions between participants in this session.",
                "shortText": "Interactions among participants",
                "type": "textarea"
            },
            {
                "id": "sensemakingSessionRecord_reflections_interaction_participantsAndFacilitator",
                "text": "Describe interactions between participants and facilitators.",
                "shortText": "Interactions between participants and facilitators",
                "type": "textarea"
            },
            {
                "id": "sensemakingSessionRecord_reflections_interaction_stories",
                "text": "What did you notice about the stories people told, retold, chose, and worked with during the session?",
                "shortText": "Stories",
                "type": "textarea"
            },
            {
                "id": "sensemakingSessionRecord_learningHeader",
                "text": "Learning",
                "type": "header"
            },
            {
                "id": "sensemakingSessionRecord_reflections_learning_special",
                "text": "What was special about these people in this place on this day?",
                "shortText": "Unique features",
                "type": "textarea"
            },
            {
                "id": "sensemakingSessionRecord_reflections_learning_surprise",
                "text": "What surprised you about this session?",
                "shortText": "Surprise",
                "type": "textarea"
            },
            {
                "id": "sensemakingSessionRecord_reflections_learning_workedWell",
                "text": "Which parts of your plans for this session worked out well? Which parts didn't?",
                "shortText": "Worked and didn't work",
                "type": "textarea"
            },
            {
                "id": "sensemakingSessionRecord_reflections_learning_newIdeas",
                "text": "What new ideas did you gain from this session? What did you learn from it?",
                "shortText": "New ideas",
                "type": "textarea"
            },
            {
                "id": "sensemakingSessionRecord_reflections_learning_wantToRemember",
                "text": "What else do you want to remember about this session?",
                "shortText": "Other",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "page_addResonantStory",
        "name": "Add resonant story",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "storiesListChoose",
                "text": "Choose a story to mark as a resonant story for this sensemaking session.",
                "type": "storiesList"
            },
            {
                "id": "sensemakingSessionRecord_resonantStory_type",
                "text": "Which type of resonant story is this?",
                "type": "select",
                "options": "pivot;voice;discovery;other"
            },
            {
                "id": "sensemakingSessionRecord_resonantStory_reason",
                "text": "Why did this story stand out?",
                "type": "textarea"
            },
            {
                "id": "sensemakingSessionRecord_resonantStory_groups",
                "text": "For which participant groups was this story important?",
                "type": "text"
            },
            {
                "id": "sensemakingSessionRecord_resonantStory_notes",
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
                "id": "sensemakingSessionRecord_outcome_type",
                "text": "What type of session outcome is this?",
                "shortText": "Type",
                "type": "select",
                "options": "discovery;opportunity;issue;idea;recommendation;perspective;dilemma;other"
            },
            {
                "id": "sensemakingSessionRecord_outcome_name",
                "text": "Please give this outcome a name.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "sensemakingSessionRecord_outcome_description",
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
                "id": "sensemakingSessionRecord_construction_name",
                "text": "Please give this construction a name.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "sensemakingSessionRecord_construction_type",
                "text": "What type of construction is it?",
                "shortText": "Type",
                "type": "select",
                "options": "timeline;landscape;story elements;composite story;other"
            },
            {
                "id": "sensemakingSessionRecord_construction_description",
                "text": "Please decribe the construction (or include a description given by participants).\nYour description can include links to images or documents.",
                "shortText": "Description",
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
                "id": "sensemakingReportLabel",
                "text": "This report shows all of the information entered in the pages grouped under \"Sensemaking.\"",
                "type": "label"
            },
            {
                "id": "sensemakingReport",
                "text": "Sensemaking report",
                "type": "report",
                "options": "sensemaking"
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
                "id": "interventionIntroLabel",
                "text": "In the intervention phase of your PNI project, you will plan interventions and record information about them.",
                "type": "label"
            },
            {
                "id": "project_generalNotes_intervention",
                "text": "You can enter some general notes on intervention in this project here.",
                "type": "textarea"
            }
        ]
    },
    {
        "id": "page_projectOutcomesForIntervention",
        "name": "Answer questions about project outcomes",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "outcomesTable",
                "text": "In order to choose interventions that will be useful in your project, it will be helpful to think about some\nof the issues (positive and negative) you discovered in your project. Please answer these questions in reference to\nthe participant groups you set up in the project planning phase.",
                "type": "questionsTable",
                "options": "page_outcomesTable;participants_firstGroupName;participants_secondGroupName;participants_thirdGroupName"
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
                "id": "outcomes_hopesHeader",
                "text": "Hopes",
                "type": "header"
            },
            {
                "id": "outcomes_peopleFeltHeard",
                "text": "During your project, did the people in this group say they felt heard for the first time?",
                "type": "select",
                "options": "never;occasionally;sometimes;often;mixed"
            },
            {
                "id": "outcomes_peopleFeltInvolved",
                "text": "Did they say they felt involved for the first time?",
                "type": "select",
                "options": "never;occasionally;sometimes;often;mixed"
            },
            {
                "id": "outcomes_peopleLearnedAboutCommOrg",
                "text": "Did they say they learned a lot about their community or organization?",
                "type": "select",
                "options": "never;occasionally;sometimes;often;mixed"
            },
            {
                "id": "outcomes_voicesHeader",
                "text": "Voices",
                "type": "header"
            },
            {
                "id": "outcomes_peopleWantedToTellMoreStories",
                "text": "During your story collection, did these people seem to want to tell more stories than you collected?",
                "type": "select",
                "options": "never;occasionally;sometimes;often;mixed"
            },
            {
                "id": "outcomes_peopleWantedToShareMoreStoriesWithEachOther",
                "text": "Did you ever feel that they wanted to share more experiences with each other than they did?",
                "type": "select",
                "options": "never;occasionally;sometimes;often;mixed"
            },
            {
                "id": "outcomes_peopleFeltStoriesNeededToBeHeard",
                "text": "Did these people feel that some of the stories you collected \"needed to be heard\" by anyone?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed"
            },
            {
                "id": "outcomes_peopleFeltNobodyCares",
                "text": "Were there any issues that these people thought \"nobody cares\" about?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed"
            },
            {
                "id": "outcomes_needsHeader",
                "text": "Needs",
                "type": "header"
            },
            {
                "id": "outcomes_peopleFeltNobodyCanMeetNeeds",
                "text": "Do the people in this group have needs that <i>nobody</i> can meet?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed"
            },
            {
                "id": "outcomes_peopleFeltTheyNeedNewStories",
                "text": "Do these people need to start telling themselves <i>new</i> stories?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed"
            },
            {
                "id": "outcomes_peopleWantedToKeepExploring",
                "text": "Were there any issues about which the people in this group seemed to want to keep exploring?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed"
            },
            {
                "id": "outcomes_crisisPointsWereFound",
                "text": "Did you discover any \"crisis points\" where people in this group needed help and didn't get it?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed"
            },
            {
                "id": "outcomes_issuesWereBeyondWords",
                "text": "Did you find any issues for this group that were beyond words, that no amount of discussion could resolve?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed"
            },
            {
                "id": "outcomes_learningHeader",
                "text": "Learning",
                "type": "header"
            },
            {
                "id": "outcomes_peopleLarnedAboutTopic",
                "text": "Did these people say that they learned a lot about the topic by participating in the project?",
                "type": "select",
                "options": "never;occasionally;sometimes;often;mixed"
            },
            {
                "id": "outcomes_issuesNewMembersStruggleWith",
                "text": "Did you notice that new members of the community or organization were having a harder time making sense of things?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed"
            },
            {
                "id": "outcomes_foundInfoWithoutUnderstanding",
                "text": "Were there any issues that these people found difficult to understand, even though abundant information was available?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed"
            },
            {
                "id": "outcomes_foundOverConfidence",
                "text": "Did you discover any areas in which these people had more confidence than skill?",
                "type": "select",
                "options": "not at all;somewhat;definitely;mixed"
            },
            {
                "id": "outcomes_peopleCuriousAboutStoryWork",
                "text": "Did any of these participants express an interest in learning more about story work?",
                "type": "select",
                "options": "never;occasionally;sometimes;often;mixed"
            }
        ]
    },
    {
        "id": "page_designInterventions",
        "name": "Design intervention plans",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "project_interventionLabel",
                "text": "On this page you can design interventions that change the stories people tell\nin your community or organization.",
                "type": "label"
            },
            {
                "id": "interventionRecommendations",
                "text": "Recommendations for intervention plans",
                "type": "recommendationTable",
                "options": "interventions"
            },
            {
                "id": "interventionRecommendationsTable_unfinished",
                "text": "(Unfinished: This will be a table of recommendations for this section\nrelated to the questions answered about participant groups.",
                "type": "label"
            },
            {
                "id": "mockup_recTable_intervention",
                "text": "It will look something like this.)",
                "type": "image",
                "options": "images/mockups/mockupRecTable.png"
            },
            {
                "id": "project_interventionPlansList",
                "text": "Enter your intervention plans here.",
                "type": "grid",
                "options": "page_addIntervention"
            }
        ]
    },
    {
        "id": "page_addIntervention",
        "name": "Plan an intervention",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "interventionPlan_name",
                "text": "Please name this intervention plan.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "interventionPlan_type",
                "text": "What type of intervention will this be?",
                "shortText": "Type",
                "type": "select",
                "options": "narrative ombudsman;narrative suggestion box;story sharing space;narrative orientation;narrative learning resource;narrative simulation;narrative presentation;dramatic action;sensemaking space;sensemaking pyramid;narrative mentoring program;narrative therapy;participatory theatre;other"
            },
            {
                "id": "interventionPlan_description",
                "text": "Please describe your plan for this intervention.",
                "shortText": "Description",
                "type": "textarea"
            },
            {
                "id": "interventionPlan_times",
                "text": "When will the intervention start and end?",
                "shortText": "Time",
                "type": "text"
            },
            {
                "id": "interventionPlan_locations",
                "text": "Where will the intervention take place?",
                "shortText": "Location",
                "type": "text"
            },
            {
                "id": "interventionPlan_help",
                "text": "What sort of help will you need to carry out this intervention?",
                "shortText": "Help",
                "type": "textarea"
            },
            {
                "id": "interventionPlan_permission",
                "text": "Describe any permissions you will need to carry out this intervention.",
                "shortText": "Permission",
                "type": "textarea"
            },
            {
                "id": "interventionPlan_participation",
                "text": "How will you get people to participate in this intervention?",
                "shortText": "Participation",
                "type": "textarea"
            },
            {
                "id": "interventionPlan_materials",
                "text": "What physical materials will you need?",
                "shortText": "Materials",
                "type": "textarea"
            },
            {
                "id": "interventionPlan_space",
                "text": "What spaces will you use?",
                "shortText": "Spaces",
                "type": "textarea"
            },
            {
                "id": "interventionPlan_techResources",
                "text": "What technological resources will you need?",
                "shortText": "Technology",
                "type": "textarea"
            },
            {
                "id": "interventionPlan_recording",
                "text": "How will you record the results of this intervention?",
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
                "id": "project_interventionRecordsLabel",
                "text": "On this page you will enter records of your interventions.",
                "type": "label"
            },
            {
                "id": "project_interventionRecordsList",
                "text": "Enter your intervention records here.",
                "type": "grid",
                "options": "page_addInterventionRecord"
            }
        ]
    },
    {
        "id": "page_addInterventionRecord",
        "name": "Add intervention record",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "interventionRecord_name",
                "text": "Please give this intervention record a name.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "interventionRecord_notes",
                "text": "Enter any general notes on the intervention here.",
                "shortText": "Notes",
                "type": "textarea"
            },
            {
                "id": "interventionRecord_reflectLabel",
                "text": "Use the questions below to reflect on the intervention.",
                "type": "label"
            },
            {
                "id": "interventionRecord_reflectionsOnChangeHeader",
                "text": "Change",
                "type": "header"
            },
            {
                "id": "interventionRecord_reflections_change_participantPerceptions",
                "text": "How did the perceptions of the participants change from the start to the end of the intervention?",
                "shortText": "Change in participant perceptions",
                "type": "textarea"
            },
            {
                "id": "interventionRecord_reflections_change_yourPerceptions",
                "text": "How did <i>your</i> perceptions change?",
                "shortText": "Change in facilitator perceptions",
                "type": "textarea"
            },
            {
                "id": "interventionRecord_reflections_change_project",
                "text": "How has the overall project changed as a result of this intervention?",
                "shortText": "Changes to the project",
                "type": "textarea"
            },
            {
                "id": "interventionRecord_interactionsHeader",
                "text": "Interactions",
                "type": "header"
            },
            {
                "id": "interventionRecord_reflections_interaction_participants",
                "text": "Describe the interactions between participants in this intervention.",
                "shortText": "Interactions among participants",
                "type": "textarea"
            },
            {
                "id": "interventionRecord_reflections_interaction_participantsAndFacilitator",
                "text": "Describe interactions between participants and facilitators.",
                "shortText": "Interactions between participants and facilitators",
                "type": "textarea"
            },
            {
                "id": "interventionRecord_reflections_interaction_stories",
                "text": "What did you notice about the stories people told, retold, chose, and worked with during the intervention?",
                "shortText": "Stories",
                "type": "textarea"
            },
            {
                "id": "interventionRecord_learningHeader",
                "text": "Learning",
                "type": "header"
            },
            {
                "id": "interventionRecord_reflections_learning_special",
                "text": "What was special about this intervention?",
                "shortText": "Unique features",
                "type": "textarea"
            },
            {
                "id": "interventionRecord_reflections_learning_surprise",
                "text": "What surprised you about this intervention?",
                "shortText": "Surprise",
                "type": "textarea"
            },
            {
                "id": "interventionRecord_reflections_learning_workedWell",
                "text": "Which parts of your plans for this intervention worked out well? Which parts didn't?",
                "shortText": "Worked and didn't work",
                "type": "textarea"
            },
            {
                "id": "interventionRecord_reflections_learning_newIdeas",
                "text": "What new ideas did you gain from this intervention? What did you learn from it?",
                "shortText": "New ideas",
                "type": "textarea"
            },
            {
                "id": "interventionRecord_reflections_learning_wantToRemember",
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
                "id": "interventionReportLabel",
                "text": "This report shows all of the information entered in the pages grouped under \"Intervention.\"",
                "type": "label"
            },
            {
                "id": "interventionReport",
                "text": "Intervention report",
                "type": "report",
                "options": "intervention"
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
                "id": "returnIntroLabel",
                "text": "In the return phase of your PNI project, you will gather feedback, reflect on the project, possibly present\nthe project to someone, and help people with requests about the project.",
                "type": "label"
            },
            {
                "id": "project_generalNotes_return",
                "text": "You can enter some general notes on the return phase of this project here.",
                "type": "textarea"
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
                "id": "project_feedbackLabel",
                "text": "On this page you will enter any feedback you gather about your project.",
                "type": "label"
            },
            {
                "id": "project_feedbackItemsList",
                "text": "You can enter specific pieces of feedback you have gathered here.",
                "type": "grid",
                "options": "page_enterFeedbackPiece"
            },
            {
                "id": "feedback_generalNotes",
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
                "id": "feedback_text",
                "text": "What did someone say or do?",
                "shortText": "Feedback",
                "type": "textarea"
            },
            {
                "id": "feedback_name",
                "text": "Please give this piece of feedback a name.",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "feedback_type",
                "text": "What type of feedback is this?",
                "shortText": "Type",
                "type": "select",
                "options": "a story;a reference to something that came up in the project;a wish about the future;an opinion;a complaint;an action;other"
            },
            {
                "id": "feedback_who",
                "text": "Who said or did this?",
                "shortText": "Source",
                "type": "text"
            },
            {
                "id": "feedback_prompt",
                "text": "What did you say or do (if anything) that led to this feedback?",
                "shortText": "Prompt",
                "type": "text"
            },
            {
                "id": "feedback_response",
                "text": "What did you say or do (if anything) in response?",
                "shortText": "Responpse",
                "type": "text"
            },
            {
                "id": "feedback_notes",
                "text": "Please enter any other notes you have about this piece of feedback.",
                "shortText": "Notes",
                "type": "textarea"
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
                "id": "project_reflectLabel",
                "text": "On this page you will answer some questions to reflect in general on the entire project.",
                "type": "label"
            },
            {
                "id": "project_reflect_stories",
                "text": "What have you learned from the stories you heard in this project?",
                "type": "textarea"
            },
            {
                "id": "project_reflect_facilitation",
                "text": "What did you learn about your facilitation practice in this project?",
                "type": "textarea"
            },
            {
                "id": "project_reflect_planning",
                "text": "What did you learn about project planning?",
                "type": "textarea"
            },
            {
                "id": "project_reflect_ownPNI",
                "text": "How has this project changed your own version of PNI?",
                "type": "textarea"
            },
            {
                "id": "project_reflect_community",
                "text": "What have you learned about your community or organization because of this project?",
                "type": "textarea"
            },
            {
                "id": "project_reflect_personalStrengths",
                "text": "What did this project teach you about your personal strengths and weaknesses?",
                "type": "textarea"
            },
            {
                "id": "project_reflect_teamStrengths",
                "text": "What did this project teach you about your team?",
                "type": "textarea"
            },
            {
                "id": "project_reflect_newIdeas",
                "text": "Describe any new ideas that came up during this project.",
                "type": "textarea"
            },
            {
                "id": "project_reflect_notes",
                "text": "Enter any additional notes you'd like to remember about the project.",
                "type": "textarea"
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
                "id": "project_presentationLabel",
                "text": "On this page you can build a presentation about your project to show to others.",
                "type": "label"
            },
            {
                "id": "project_presentationElementsList",
                "text": "There are elements (points of discussion) to present about your project.",
                "type": "grid",
                "options": "page_addPresentationElement"
            },
            {
                "id": "projectPresentation_presentationLabel",
                "text": "After you finish adding elements for your presentation, you can export the elements, open them in your word processor, and add material\nfrom any of the stage reports (or the final project report).",
                "type": "label"
            },
            {
                "id": "projectPresentation_exportPresentationOutlineButton",
                "text": "Export these elements",
                "type": "button"
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
                "id": "projectPresentationElement_name",
                "text": "What name would you like to give this element in your presentation?",
                "shortText": "Name",
                "type": "text"
            },
            {
                "id": "projectPresentationElement_statement",
                "text": "How would you like to describe this element in your presentation?",
                "shortText": "Description",
                "type": "textarea"
            },
            {
                "id": "projectPresentationElement_evidence",
                "text": "What evidence does this element present that your project met its goals?",
                "shortText": "Evidence",
                "type": "textarea"
            },
            {
                "id": "projectPresentationElement_QA",
                "text": "What questions do you anticipate about this element, and how would you like to answer them?",
                "shortText": "Q&A",
                "type": "textarea"
            },
            {
                "id": "projectPresentationElement_notes",
                "text": "Enter any other notes you want to remember about this element as you present it.",
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
                "id": "project_returnRequestsLabel",
                "text": "On this page you can keep track of requests for help as your project winds down.",
                "type": "label"
            },
            {
                "id": "project_returnRequestsList",
                "text": "Enter requests for help here.",
                "type": "grid",
                "options": "page_addNewReturnRequest"
            }
        ]
    },
    {
        "id": "page_addNewReturnRequest",
        "name": "Enter project request",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "returnRequest_text",
                "text": "What is the request?",
                "shortText": "Request",
                "type": "textarea"
            },
            {
                "id": "returnRequest_type",
                "text": "What type of request is this?",
                "shortText": "Type",
                "type": "select",
                "options": "help with their own projects;help with sustaining story exchange;help with examining this project's stories and results;help learning about story work;other"
            },
            {
                "id": "returnRequest_isMet",
                "text": "Do you consider this request to have been satisfied?",
                "shortText": "Satisfied",
                "type": "boolean"
            },
            {
                "id": "returnRequest_whatHappened",
                "text": "What has happened in relation to this request?",
                "shortText": "What happened",
                "type": "textarea"
            },
            {
                "id": "returnRequest_notes",
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
                "id": "returnReportLabel",
                "text": "This report shows all of the information entered in the pages grouped under \"Return.\"",
                "type": "label"
            },
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
                "id": "wholeProjectReportLabel",
                "text": "This report shows all of the information entered in all of the pages of this software.",
                "type": "label"
            },
            {
                "id": "projectReport",
                "text": "Project report",
                "type": "report",
                "options": "project"
            }
        ]
    }
]);
