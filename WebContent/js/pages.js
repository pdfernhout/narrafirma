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
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
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
                "text": "//                                                       PLANNING",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_dashboard_4",
                "text": "/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_dashboard_5",
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
                "id": "projectPlanningLabel",
                "text": "In the planning phase you will make decisions about how your project will proceed.\nYou will think about your goals, your topic, your participants, and opportunities and dangers you might encounter during the project.",
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
                "text": "What is a brief name for the project's primary topic?",
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
                "text": "Enter any other information you want to appear at the bottom of project reports (as notes).",
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
                "text": "On this page you will answer some questions about your project's goals, relationships, focus, range, scope, and emphasis.\nIf you don't have good answers for these questions right now, don't worry; you will have a chance to come back and work on these answers again later.",
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
                "text": "Please add participant groups in the list below (typically up to three groups). More details for each group will be added later.",
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
                "text": "Please name this group of participants from whom the project needs to hear (such as \"doctors\", \"students\", or \"staff\").",
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
                "id": "COMMENT_page_addParticipantGroup_1",
                "text": "// ## Consider project aspects [page_projectAspects|repeating|participantGroups]",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_addParticipantGroup_2",
                "text": "// * Please answer these questions about each participant group. [participantGroup_aspectsList|questionsTable|page_aspectsTable;participants_firstGroupName;participants_secondGroupName;participants_thirdGroupName]",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_addParticipantGroup_3",
                "text": "// ## Project aspects [page_aspectsTable|questionsTable]",
                "type": "label",
                "options": null
            }
        ]
    },
    {
        "id": "page_projectAspects",
        "name": "Participant group details for: {{participants_groupName}}",
        "description": "",
        "isHeader": false,
        "type": "repeating",
        "options": "participantGroups",
        "questions": [
            {
                "id": "detailsAboutParticipantGroup",
                "text": "On this page you will add details for the participant group called: \"{{participants_groupName}}\".",
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
            },
            {
                "id": "aspects_youHeader",
                "text": "About you",
                "type": "header"
            },
            {
                "id": "participantGroupAspects_you_experience",
                "text": "How much experience do you have facilitating PNI projects?",
                "type": "select",
                "options": "none;a little;some;a lot"
            },
            {
                "id": "participantGroupAspects_you_help",
                "text": "How much help will you have carrying out this project?",
                "type": "select",
                "options": "none;a little;some;a lot"
            },
            {
                "id": "participantGroupAspects_you_tech",
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
                "text": "Project stories are stories you tell yourself about your project\nin order to think about what might happen in it (so you can plan it better).",
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
        "id": "page_createProjectStoryElements",
        "name": "Create project story elements",
        "description": "",
        "isHeader": false,
        "questions": [
            {
                "id": "storyElementsInstructions",
                "text": "Here are some instructions on how to create story elements from your project stories.\n<ol>\n<li>Choose one or two types of story element (characters, situations, values, themes, relationships, motivations, beliefs, conflicts).</li>\n<li>For each story, come up with as many answers to that element's question as you can. Write the answers on sticky notes.</li>\n<li>The questions are:</li>\n<ul>\n<li>Characters: Who is doing things in this story?</li>\n<li>Situations: What is going on in this story?</li>\n<li>Values: What matters to the characters in this story?</li>\n<li>Themes: What is this story about?</li>\n<li>Relationships: How are the characters related in this story?</li>\n<li>Motivations: Why do the characters do what they do in this story?</li>\n<li>Beliefs: What do people believe in this story?</li>\n<li>Conflicts: Who or what stands in opposition in this story?</li>\n</ul>\n<li>Once you have answered the question(s) you chose for each story, cluster the sticky notes into groups. Place like with like.</li>\n<li>Give each group of sticky notes a name.</li>\n<li>Clear a \"halo\" of space around each group's name.</li>\n<li>In the halo, write 2-5 good and bad attributes (advantages and disadvantages, opportunities and dangers) of each group of sticky notes.</li>\n<li>Copy or move the new good/bad attributes to a new space. Mix them all together.</li>\n<li>Cluster the attributes into groups.</li>\n<li>Name the groups. These are your story elements.</li>\n</ol>",
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
                "text": "You can create story elements from the project stories you have told\nin order to think about what those stories mean about how you should plan your project.",
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
                "text": "You can describe it more fully here.",
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
                "id": "COMMENT_page_assessStorySharing_1",
                "text": "// should have results overall and for each category of question",
                "type": "label",
                "options": null
            },
            {
                "id": "assessment_result",
                "text": "This is your combined test result.",
                "type": "quizScoreResult"
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
                "text": "Please review and improve your draft answers based on your consideration of project aspects and your project stories.",
                "type": "label"
            },
            {
                "id": "project_PNIquestions_copyDrafts",
                "text": "Copy the original draft versions into the answers below",
                "type": "button"
            },
            {
                "id": "project_PNIquestions_goal_final",
                "text": "What is the goal of the project? Why are you doing it?",
                "type": "textarea",
                "options": "planning_goal"
            },
            {
                "id": "project_PNIquestions_relationships_final",
                "text": "What relationships are important to the project?",
                "type": "textarea",
                "options": "planning_relationships"
            },
            {
                "id": "project_PNIquestions_focus_final",
                "text": "What is the focus of the project? What is it about?",
                "type": "textarea",
                "options": "planning_focus"
            },
            {
                "id": "project_PNIquestions_range_final",
                "text": "What range(s) of experience will the project cover?",
                "type": "textarea",
                "options": "planning_range"
            },
            {
                "id": "project_PNIquestions_scope_final",
                "text": "What is the project's scope? (number of people, number of stories, number of questions about stories)",
                "type": "textarea",
                "options": "planning_draft_scope"
            },
            {
                "id": "project_PNIquestions_emphasis_final",
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
                "id": "project_synopsis",
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
                "id": "planningReportLabel",
                "text": "This report shows all of the information entered in the pages grouped under \"Planning.\"",
                "type": "label"
            },
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
                "id": "collectionDesignStartLabel",
                "text": "In the collection design phase, you will decide on story collection venues, create some story eliciting and\nstory interpretation questions, design your story collection form, and plan any story collection sessions you want to hold.",
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
                "id": "project_elicitingQuestionsList",
                "text": "Eliciting questions ask people to tell stories.\nYou need at least one, and preferably three to five questions people can pick from to answer.",
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
                "id": "elicitingQuestion_text",
                "text": "Enter a question with which to ask people to tell stories.",
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
                "id": "project_storyQuestionsList",
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
                "id": "storyQuestion_text",
                "text": "Enter a question to ask people about their stories.",
                "shortText": "Question",
                "type": "textarea"
            },
            {
                "id": "storyQuestion_type",
                "text": "What type of question is this?",
                "shortText": "Type",
                "type": "select",
                "options": "boolean;label;header;checkbox;checkBoxes;text;textarea;select;radio;slider"
            },
            {
                "id": "storyQuestion_shortName",
                "text": "Enter a short name we can use to refer to the question. (This name must be unique to the project.)",
                "shortText": "Short name",
                "type": "text"
            },
            {
                "id": "storyQuestion_help",
                "text": "If you want to provide help to people answering the question, enter it here.",
                "shortText": "Help",
                "type": "textarea"
            },
            {
                "id": "templates_storyQuestions",
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
                "id": "project_participantQuestionsList",
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
                "text": "Enter a short name we can use to refer to the question. (This name must be unique to the project.)",
                "shortText": "Short name",
                "type": "text"
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
                "text": "Please enter an introduction to be shown at the start of the form, after the title",
                "type": "textarea"
            },
            {
                "id": "questionForm_endText",
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
                "id": "willBeUsingStoryCollectionSessions",
                "text": "Do you plan to collect stories in group sessions? (If not, you can skip the rest of this page.)",
                "type": "boolean"
            },
            {
                "id": "collectionSessionRecommendations",
                "text": "Recommendations for story collection sessions",
                "type": "recommendationTable",
                "options": "collectionSessions"
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
                "text": "How long will this session be?",
                "shortText": "Length",
                "type": "text"
            },
            {
                "id": "collectionSessionPlan_times",
                "text": "At what dates and times will the session take place?",
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
                "id": "project_collectionSessionActivitiesList",
                "text": "Activities within story collection sessions can be simple instructions\nor complicated exercises (like the creation of timelines).",
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
                "text": "Describe optional elaborations you might or might not use in this activity.",
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
                "id": "collectionDesignReportLabel",
                "text": "This report shows all of the information entered in the pages grouped under \"Collection design.\"",
                "type": "label"
            },
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
                "id": "collectionProcessIntro",
                "text": "In the collection process phase, you will review incoming stories and enter records of story collection sessions.",
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
                "id": "printStoryFormIntroduction",
                "text": "Here you can print your story form for distribution to participants.",
                "type": "label"
            },
            {
                "id": "printStoryForm",
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
                "id": "startCollectionLabel",
                "text": "If you are doing story collection over the internet, click this button to make the web form \"live\" and able to be used by people other than yourself.",
                "type": "label"
            },
            {
                "id": "webStoryCollectionEnabled",
                "text": "Enable web story collection:",
                "shortText": "Enable web story collection",
                "type": "toggleButton"
            },
            {
                "id": "copyStoryFormURLDuringStart",
                "text": "Copy story form web link",
                "type": "button"
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
                "text": "// the info shown here is what was designed for a story form - how to specify that",
                "type": "label",
                "options": null
            },
            {
                "id": "COMMENT_page_enterStories_2",
                "text": "// User can enter data here for stories received via paper forms",
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
                "text": "If you are doing story collection over the internet, click this button to make the web form unavailable (to anyone but yourself). You can re-enable story collection later by going back to a previous page.",
                "type": "label"
            },
            {
                "id": "disableWebStoryFormAfterStoryCollection",
                "text": "Disable web story collection",
                "shortText": "Disable web story collection",
                "type": "button"
            },
            {
                "id": "webStoryCollectionEnabled_tracker2",
                "text": "Web story collection enabled:",
                "type": "questionAnswer",
                "options": "webStoryCollectionEnabled"
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
                "id": "project_collectionSessionRecordsList",
                "text": "Here you can record what went on in your story collection sessions.",
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
                "text": "When and where did this session take place?",
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
                "text": "Please answer these questions about the session.",
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
                "type": "text"
            },
            {
                "id": "collectionSessionRecord_construction_type",
                "text": "What type of construction is it?",
                "type": "select",
                "options": "timeline;landscape;other"
            },
            {
                "id": "collectionSessionRecord_construction_description",
                "text": "Please describe the construction (or include a description given by participants).\nYour description can include links to images or other documents.",
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
                "id": "collectionProcessReportLabel",
                "text": "This report shows all of the information entered in the pages grouped under \"Collection process.\"",
                "type": "label"
            },
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
                "id": "catalysisIntro",
                "text": "In the catalysis phase you will look for patterns in stories and answer to questions about them,\nand pepare materials for people to use in sensemaking.",
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
                "id": "COMMENT_page_browseGraphs_1",
                "text": "// graph browser has button to add result to observation (existing or new)",
                "type": "label",
                "options": null
            },
            {
                "id": "graphBrowserDisplay",
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
                "id": "reviewTrends_statTests",
                "text": "Which statistical tests do you want to consider?",
                "type": "checkBoxes",
                "options": "chi-squared (differences between counts);t-test (differences between means);correlation"
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
                "id": "reviewTrends_trendResults",
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
                "id": "COMMENT_page_reviewTrends_2",
                "text": "// trends report has button to add result to observation (existing or new)",
                "type": "label",
                "options": null
            },
            {
                "id": "reviewTrends_display",
                "text": "Trends report",
                "type": "trendsReport"
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
                "id": "observationsListChoose",
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
        "id": "page_createOrEditObservation",
        "name": "Create new observation",
        "description": "",
        "isHeader": false,
        "type": "popup",
        "questions": [
            {
                "id": "observation_name",
                "text": "Please give this observation a name.",
                "type": "text"
            },
            {
                "id": "observation_text",
                "text": "Please describe this observation.",
                "shortText": "Observation",
                "type": "textarea"
            },
            {
                "id": "project_observationResultsList",
                "text": "These are the results you have selected to include in this observation.",
                "shortText": "Results",
                "type": "accumulatedItemsGrid",
                "options": "collectedStoriesAfterCollection"
            },
            {
                "id": "firstInterpretation_text",
                "text": "Enter an interpretation of this observation.\nWhat does it mean?",
                "shortText": "First interpretation",
                "type": "textarea"
            },
            {
                "id": "firstInterpretation_name",
                "text": "Please give this interpretation a name (so you can refer to it later).",
                "shortText": "First interpretation name",
                "type": "text"
            },
            {
                "id": "firstInterpretation_idea",
                "text": "If you like, you can record an idea that follows from this interpretation.",
                "shortText": "First interpretation idea",
                "type": "textarea"
            },
            {
                "id": "firstInterpretation_excerptsList",
                "text": "You can add excerpts to this interpretation.",
                "shortText": "First interpretation excerpts",
                "type": "grid",
                "options": "page_selectExcerpt"
            },
            {
                "id": "competingInterpretation_text",
                "text": "Enter an interpretation that competes with the first one.\nWhat else could this pattern mean?",
                "shortText": "Competing interpretation",
                "type": "textarea"
            },
            {
                "id": "competingInterpretation_name",
                "text": "Please give this competing interpretation a name.",
                "shortText": "Competing interpretation name",
                "type": "text"
            },
            {
                "id": "competingInterpretation_idea",
                "text": "Enter an idea that follows from your competing interpretation.",
                "shortText": "Competing interpretation idea",
                "type": "textarea"
            },
            {
                "id": "competingInterpretation_excerptsList",
                "text": "You can add excerpts to the competing interpretation.",
                "shortText": "Competing interpretation excerpts",
                "type": "grid",
                "options": "page_selectExcerpt"
            },
            {
                "id": "thirdInterpretation_text",
                "text": "If a third interpretation of the pattern comes to mind, enter it here.\nIs there anything else this pattern could mean?",
                "shortText": "Third interpretation",
                "type": "textarea"
            },
            {
                "id": "thirdnterpretation_name",
                "text": "Please give this third interpretation a name.",
                "shortText": "Third interpretation name",
                "type": "text"
            },
            {
                "id": "thirdInterpretation_idea",
                "text": "Enter an idea that follows from your third interpretation.",
                "shortText": "Third interpretation idea",
                "type": "textarea"
            },
            {
                "id": "thirdInterpretation_excerptsList",
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
                "id": "excerptsListDisplay",
                "text": "Collected excerpts",
                "type": "excerptsList"
            },
            {
                "id": "addExcerptToInterpretation",
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
                "id": "excerptsListChoose",
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
                "id": "excerpt_name",
                "text": "Please give this excerpt a name.",
                "type": "text"
            },
            {
                "id": "excerpt_text",
                "text": "You can edit the excerpt here.",
                "type": "textarea"
            },
            {
                "id": "excerpt_notes",
                "text": "You can enter some notes about the excerpt here.",
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
                "text": "These are the excerpts you have saved from stories as you looked at them\non the browse, graph, and review pages.",
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
                "text": "Collected observations",
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
                "id": "project_perspectivesList",
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
            },
            {
                "id": "COMMENT_page_addPerspective_1",
                "text": "// all of these popups could go away if there is an editable field on the grid",
                "type": "label",
                "options": null
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
                "id": "catalysisReportLabel",
                "text": "This report shows all of the information entered in the pages grouped under \"Catalysis.\"",
                "type": "label"
            },
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
                "id": "sensemakingIntroLabel",
                "text": "In the sensemaking phase, you will plan sensemaking sessions and record what happened in them.",
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
                "id": "sensemakingSessionRecommendations",
                "text": "Recommendations for sensemaking sessions",
                "type": "recommendationTable",
                "options": "sensemakingSessions"
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
                "text": "How long will this session be?",
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
                "text": "Activities within sensemaking sessions can be simple instructions\nor complicated exercises (like the construction of composite stories).",
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
                "text": "Describe optional elaborations you might or might not use in this activity.",
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
                "id": "project_sensemakingSessionRecordsList",
                "text": "Sensemaking sessions records",
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
                "id": "sensemakingSessionRecord_resonantStoriesList",
                "text": "Resonant stories (pivot, voice, discovery)",
                "type": "grid",
                "options": "page_addResonantStory"
            },
            {
                "id": "sensemakingSessionRecord_outcomesList",
                "text": "Session outcomes (like discoveries and ideas)",
                "type": "grid",
                "options": "page_newSensemakingSessionOutcome"
            },
            {
                "id": "sensemakingSessionRecord_constructionsList",
                "text": "Group constructions",
                "type": "grid",
                "options": "page_newSensemakingSessionConstruction"
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
                "text": "Enter additional notes on the session here.\nYour notes can include links to images or other documents.",
                "shortText": "Notes",
                "type": "textarea"
            },
            {
                "id": "sensemakingSessionRecord_reflectionsLabel",
                "text": "Please answer these questions about the session.",
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
                "id": "COMMENT_page_addResonantStory_1",
                "text": "// this is not a story browser, it is a list of all stories, and the one selected will be copied to the resonant stories list for this session when they click ok on this popup",
                "type": "label",
                "options": null
            },
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
                "id": "interventionIntroLabel",
                "text": "In the intervention phase, you will plan interventions and record information about them.",
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
                "id": "interventionRecommendations",
                "text": "Recommendations for intervention plans",
                "type": "recommendationTable",
                "options": "interventions"
            },
            {
                "id": "project_interventionPlansList",
                "text": "On this page you can design interventions that change the stories people tell\nin your community or organization.",
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
                "type": "text"
            },
            {
                "id": "interventionPlan_duration",
                "text": "Over what span of time will this intervention take place?",
                "shortText": "Length",
                "type": "text"
            },
            {
                "id": "interventionPlan_times",
                "text": "When will the intervention start and stop?",
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
                "text": "What sorts of permission will you need to carry out this intervention?",
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
                "text": "What spaces will you need to use?",
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
                "id": "project_interventionRecordsList",
                "text": "Intervention records",
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
                "text": "Enter your notes here.",
                "shortText": "Notes",
                "type": "textarea"
            },
            {
                "id": "interventionRecord_reflectLabel",
                "text": "Please reflect on this intervention.",
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
                "id": "returnIntroLabel",
                "text": "In the return phase, you will gather feedback, reflect on the project, possibly present\nthe project to someone, and help people with requests about the project.",
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
                "id": "project_feedbackItemsList",
                "text": "You can enter feedback you have gathered on your project here.",
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
                "id": "feedbackWho",
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
                "id": "feedback_notes",
                "text": "Please enter any other notes you have about this feedback.",
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
                "id": "project_presentationElementsList",
                "text": "You can build your presentation about your project from elements\n(or points of discussion) you want to tell people about.",
                "type": "grid",
                "options": "page_addPresentationElement"
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
                "id": "project_returnRequestsList",
                "text": "You can enter requests for information or help as your project winds down here.",
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
                "text": "What was the request?",
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
